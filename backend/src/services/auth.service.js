/* ==========================================================================
   src/services/auth.service.js
   Authentication core business logic service.
   Handles database queries, crypto operations, token rotation, and email triggers.
   ========================================================================== */

import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import User from '../models/User.model.js';
import Token from '../models/Token.model.js';
import {
  hashToken,
  generateRandomToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/generateToken.js';
import { logger } from '../utils/logger.js';
import {
  safeRedisGet,
  safeRedisIncr,
  safeRedisExpire,
  safeRedisDel,
  clearUserAuthState,
} from '../utils/authState.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
} from './email.service.js';
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../utils/ApiError.js';

/**
 * Creates a new customer account, hashes password, saves user, generates verification token,
 * registers token in DB, sends verification email, and generates access+refresh tokens.
 */
export const registerUser = async ({ name, email, password, phone, ipAddress, userAgent }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('Email address is already registered');
  }

  if (phone) {
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new ConflictError('Phone number is already registered');
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const rawVerificationToken = generateRandomToken(32);
  const tokenHash = hashToken(rawVerificationToken);
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    ...(phone ? { phone } : {}),
    passwordHash,
    isEmailVerified: false,
    role: 'customer',
    emailVerificationToken: tokenHash,
    emailVerificationExpires: expiry,
  });

  await sendVerificationEmail(user.email, user.name, rawVerificationToken);

  const rememberMe = false;
  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id, rememberMe);

  const hashedRefreshToken = hashToken(refreshToken);
  await Token.create({
    userId: user._id,
    tokenHash: hashedRefreshToken,
    type: 'refresh',
    expiresAt: getRefreshTokenExpiry(rememberMe),
    userAgent,
    ipAddress,
  });

  return {
    user: user.toPublicProfile(),
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticates user, verifies password, generates new session tokens,
 * rotates refresh tokens, updates lastLogin, and returns profile.
 */
export const loginUser = async ({ email, password, ipAddress, userAgent, rememberMe = false }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const lockKey = `loginLock:${user._id}`;
  if (env.AUTH_RATE_LIMIT_ENABLED) {
    const isLocked = await safeRedisGet(lockKey);
    if (isLocked) {
      throw new UnauthorizedError('Account locked due to multiple failed login attempts. Try again later');
    }
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated. Contact support.');
  }

  if (!user.isEmailVerified) {
    throw new UnauthorizedError('Please verify your email before logging in.', {
      requiresVerification: true,
      email: user.email
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    if (env.AUTH_RATE_LIMIT_ENABLED) {
      const attemptsKey = `loginAttempts:${user._id}`;
      const attempts = await safeRedisIncr(attemptsKey);

      if (attempts === 1) {
        await safeRedisExpire(attemptsKey, 900);
      }

      if (attempts !== null && attempts >= 5) {
        await safeRedisIncr(lockKey);
        await safeRedisExpire(lockKey, 900);
        await safeRedisDel(attemptsKey);
      }
    }

    throw new UnauthorizedError('Invalid email or password');
  }

  await clearUserAuthState(user._id);

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id, rememberMe);

  const userTokens = await Token.find({ userId: user._id, type: 'refresh' }).sort({ createdAt: 1 });
  if (userTokens.length >= 5) {
    const tokensToDelete = userTokens.slice(0, userTokens.length - 4);
    await Token.deleteMany({ _id: { $in: tokensToDelete.map(t => t._id) } });
  }

  const hashedRefreshToken = hashToken(refreshToken);
  await Token.create({
    userId: user._id,
    tokenHash: hashedRefreshToken,
    type: 'refresh',
    expiresAt: getRefreshTokenExpiry(rememberMe),
    userAgent,
    ipAddress,
  });

  user.lastLogin = new Date();
  await user.save();

  return {
    user: user.toPublicProfile(),
    accessToken,
    refreshToken,
  };
};

/**
 * Revokes refresh token by deleting it from database.
 */
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  const hashedToken = hashToken(refreshToken);
  await Token.findOneAndDelete({ tokenHash: hashedToken, type: 'refresh' });
};

/**
 * Rotates sessions. Verifies old refresh token, deletes it atomically, generates new access+refresh,
 * saves new refresh in DB, and returns both to controller.
 */
export const refreshSession = async (oldRefreshToken, ipAddress, userAgent) => {
  if (!oldRefreshToken) {
    throw new UnauthorizedError('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch (error) {
    try {
      const hashed = hashToken(oldRefreshToken);
      await Token.findOneAndDelete({ tokenHash: hashed, type: 'refresh' });
    } catch (_) {
      // ignore cleanup failure
    }
    throw new UnauthorizedError('Invalid or expired session');
  }

  const hashedOldToken = hashToken(oldRefreshToken);
  const storedToken = await Token.findOneAndDelete({ tokenHash: hashedOldToken, type: 'refresh' });
  if (!storedToken) {
    throw new UnauthorizedError('Session has expired or been revoked');
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    await clearUserAuthState(decoded.userId);
    throw new UnauthorizedError('Session no longer valid');
  }

  const rememberMe = decoded.rememberMe === true;
  const accessToken = signAccessToken(user._id, user.role);
  const newRefreshToken = signRefreshToken(user._id, rememberMe);

  const userTokens = await Token.find({ userId: user._id, type: 'refresh' }).sort({ createdAt: 1 });
  if (userTokens.length >= 5) {
    const tokensToDelete = userTokens.slice(0, userTokens.length - 4);
    await Token.deleteMany({ _id: { $in: tokensToDelete.map(t => t._id) } });
  }

  const hashedNewToken = hashToken(newRefreshToken);
  await Token.create({
    userId: user._id,
    tokenHash: hashedNewToken,
    type: 'refresh',
    expiresAt: getRefreshTokenExpiry(rememberMe),
    userAgent,
    ipAddress,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Requests forgot password link. Always returns generic success status to prevent timing attacks.
 */
export const requestForgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    return;
  }

  await Token.deleteMany({ userId: user._id, type: 'password_reset' });

  const rawResetToken = generateRandomToken(32);
  const hashedResetToken = hashToken(rawResetToken);
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await Token.create({
    userId: user._id,
    tokenHash: hashedResetToken,
    type: 'password_reset',
    expiresAt: expiry,
  });

  await sendForgotPasswordEmail(user.email, user.name, rawResetToken);
};

/**
 * Resets user password. Validates reset token hash, checks expiry, updates password hash,
 * invalidates all active sessions (force logouts other devices), and sends confirmation email.
 */
export const resetUserPassword = async (rawToken, newPassword) => {
  const hashedToken = hashToken(rawToken);

  const storedToken = await Token.findOne({ tokenHash: hashedToken, type: 'password_reset' });
  if (!storedToken) {
    throw new BadRequestError('Invalid or expired password reset link');
  }

  const user = await User.findById(storedToken.userId);
  if (!user || !user.isActive) {
    throw new BadRequestError('User account associated with this token is invalid');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  await Token.deleteMany({ userId: user._id });
  await clearUserAuthState(user._id);

  await sendPasswordChangedEmail(user.email, user.name);
};

/**
 * Verifies customer email address using verification token.
 */
export const verifyUserEmail = async (rawToken) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({ 
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired email verification link');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  
  await user.save();
  await clearUserAuthState(user._id);

  await sendWelcomeEmail(user.email, user.name);
};

/**
 * Resends the verification email. Generates a new token, invalidates the old one,
 * updates expiry, and dispatches the email.
 */
export const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.isEmailVerified) {
    throw new BadRequestError('Email is already verified');
  }

  const rawVerificationToken = generateRandomToken(32);
  const tokenHash = hashToken(rawVerificationToken);
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationToken = tokenHash;
  user.emailVerificationExpires = expiry;
  await user.save();

  await sendVerificationEmail(user.email, user.name, rawVerificationToken);
};
