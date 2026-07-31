/* ==========================================================================
   src/routes/auth.routes.js
   Authentication router mapping endpoint paths to validators and controllers.
   ========================================================================== */
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
} from '../middlewares/rateLimiter.middleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from '../validators/auth.validator.js';
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getMe,
} from '../controllers/auth.controller.js';
import env from '../config/env.js';
import { ForbiddenError } from '../utils/ApiError.js';

const router = Router();

const originValidationMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  if (!env.IS_PRODUCTION) {
    return next();
  }

  const allowedOrigins = env.ALLOWED_ORIGINS;

  const isAllowed = origin && allowedOrigins.includes(origin);

  if (!isAllowed) {
    return next(new ForbiddenError('Invalid origin. CSRF check failed.'));
  }
  next();
};

router.post('/register', originValidationMiddleware, registerLimiter, registerValidator, register);
router.post('/login', originValidationMiddleware, loginLimiter, loginValidator, login);
router.post('/logout', originValidationMiddleware, logout);
router.post('/refresh', originValidationMiddleware, refresh);
router.post('/forgot-password', originValidationMiddleware, forgotPasswordLimiter, forgotPasswordValidator, forgotPassword);
router.post('/reset-password', originValidationMiddleware, resetPasswordValidator, resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', originValidationMiddleware, forgotPasswordLimiter, resendVerification);

router.get('/me', authMiddleware, getMe);

export default router;
