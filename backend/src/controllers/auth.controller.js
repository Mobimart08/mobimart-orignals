/* ==========================================================================
   src/controllers/auth.controller.js
   Authentication route controller handlers.
   Maps requests to service functions, sets cookies, and formats success JSON.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/generateToken.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestForgotPassword,
  resetUserPassword,
  verifyUserEmail,
  resendVerificationEmail,
} from '../services/auth.service.js';
import env from '../config/env.js';

/**
 * Helper to extract IP and User-Agent from Request context.
 */
const getClientMeta = (req) => ({
  ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  userAgent: req.headers['user-agent'] || null,
});

/* --------------------------------------------------------------------------
   Controller Handlers
   -------------------------------------------------------------------------- */

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const { ipAddress, userAgent } = getClientMeta(req);

  const result = await registerUser({
    name,
    email,
    password,
    phone,
    ipAddress,
    userAgent,
  });

  // Set the refresh token in HttpOnly cookie
  setRefreshTokenCookie(res, result.refreshToken);

  ApiResponse.success(
    res,
    HTTP_STATUS.CREATED,
    'Account registered successfully. Please check your email to verify your address.',
    {
      user: result.user,
      accessToken: result.accessToken,
    }
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const { ipAddress, userAgent } = getClientMeta(req);

  const result = await loginUser({
    email,
    password,
    ipAddress,
    userAgent,
    rememberMe,
  });

  setRefreshTokenCookie(res, result.refreshToken);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Login successful',
    {
      user: result.user,
      accessToken: result.accessToken,
    }
  );
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  await logoutUser(refreshToken);
  clearRefreshTokenCookie(res);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Logout successful'
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies;
  const { ipAddress, userAgent } = getClientMeta(req);

  const result = await refreshSession(oldRefreshToken, ipAddress, userAgent);

  setRefreshTokenCookie(res, result.refreshToken);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Session refreshed successfully',
    {
      accessToken: result.accessToken,
    }
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await requestForgotPassword(email);

  // Generic success message to protect against user enumeration
  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'If the email address exists in our database, a password reset link has been sent.'
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  await resetUserPassword(token, newPassword);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Password has been reset successfully. You can now login with your new password.'
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    await verifyUserEmail(token);
    // Redirect to frontend login with success query parameter
    res.redirect(`${env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    // Redirect to frontend login with error query parameter
    res.redirect(`${env.FRONTEND_URL}/login?verified=false&error=${encodeURIComponent(error.message)}`);
  }
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  await resendVerificationEmail(email);
  
  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Verification email sent successfully'
  );
});

export const getMe = asyncHandler(async (req, res) => {
  // req.user attached by authMiddleware
  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Profile retrieved successfully',
    req.user
  );
});
