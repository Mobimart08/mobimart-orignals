/* ==========================================================================
   src/middlewares/rateLimiter.middleware.js
   Rate limiting configurations for different route groups.
   Prevents brute-force attacks, credential stuffing, and API abuse.
   ========================================================================== */

import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

/* --------------------------------------------------------------------------
   Response format when rate limit is exceeded.
   Consistent with the global ApiError response shape.
   -------------------------------------------------------------------------- */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    statusCode: 429,
    message: 'Too many requests. Please slow down and try again later.',
  });
};

/* --------------------------------------------------------------------------
   GLOBAL — Applied to ALL API routes.
   200 requests per minute per IP.
   -------------------------------------------------------------------------- */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,  // 60,000ms = 1 minute
  max: env.RATE_LIMIT_MAX,             // 200 requests per window
  standardHeaders: true,               // Return rate limit info in headers
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/* --------------------------------------------------------------------------
   AUTH — Login endpoint.
   5 attempts per 15 minutes per IP.
   Prevents credential stuffing without requiring CAPTCHA.
   -------------------------------------------------------------------------- */
const _loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many login attempts. Please wait 15 minutes before trying again.',
    });
  },
});

export const loginLimiter = (req, res, next) => {
  if (!env.AUTH_RATE_LIMIT_ENABLED) {
    return next();
  }
  return _loginLimiter(req, res, next);
};

/* --------------------------------------------------------------------------
   AUTH — Registration endpoint.
   10 registrations per hour per IP.
   -------------------------------------------------------------------------- */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/* --------------------------------------------------------------------------
   AUTH — Forgot password endpoint.
   3 requests per hour per IP.
   Prevents email spam and user enumeration timing attacks.
   -------------------------------------------------------------------------- */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/* --------------------------------------------------------------------------
   COUPONS — Coupon validation endpoint.
   10 validation attempts per minute per IP.
   Prevents automated coupon code enumeration.
   -------------------------------------------------------------------------- */
export const couponLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
