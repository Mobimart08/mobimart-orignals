/* ==========================================================================
   src/middlewares/auth.middleware.js
   Authentication guard middleware.
   Verifies the JWT access token in the Authorization header and mounts
   the authenticated user on the request object (req.user).
   ========================================================================== */

import { verifyAccessToken } from '../utils/generateToken.js';
import User from '../models/User.model.js';
import { UnauthorizedError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { safeRedisGet, safeRedisSetEx, safeRedisDel } from '../utils/authState.js';

/**
 * Checks for a valid Bearer token in the request header.
 * Attaches the database user object (minus password) to req.user.
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Authentication token required');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token has expired');
    }
    throw new UnauthorizedError('Invalid authentication token');
  }

  const cacheKey = `user:${decoded.userId}`;
  let user;

  const cachedUser = await safeRedisGet(cacheKey);
  if (cachedUser) {
    try {
      user = JSON.parse(cachedUser);
    } catch (_) {
      await safeRedisDel(cacheKey);
    }
  }

  if (!user) {
    user = await User.findById(decoded.userId).lean();
    if (!user) {
      throw new UnauthorizedError('User session no longer exists');
    }

    await safeRedisSetEx(cacheKey, 900, JSON.stringify(user));
  }

  if (!user.isActive) {
    await safeRedisDel(cacheKey);
    throw new UnauthorizedError('Your account has been deactivated');
  }

  req.user = user;
  next();
});

export default authMiddleware;
