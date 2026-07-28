/* ==========================================================================
   src/middlewares/error.middleware.js
   Global error handler — the last middleware in the Express pipeline.
   Catches ALL errors forwarded via next(err) from any route or middleware.

   Response shape is always consistent with the ApiError class structure:
   {
     success: false,
     statusCode: <number>,
     message: <string>,
     errors: [...],       // only for validation errors
     stack: "..."         // only in development
   }
   ========================================================================== */

import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Global error handling middleware.
 * Must be registered LAST in app.js after all routes.
 */
const errorMiddleware = (err, req, res, next) => {
  // ── Operational errors thrown as ApiError ──────────────────────────────
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: err.data,
      errors: err.errors?.length ? err.errors : undefined,
      // Include stack trace only in development
      ...(env.IS_DEVELOPMENT && { stack: err.stack }),
    });
  }

  // ── Mongoose Validation Error ──────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      statusCode: 422,
      message: 'Validation failed',
      errors,
    });
  }

  // ── Mongoose Duplicate Key Error ───────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: `${field} already exists`,
    });
  }

  // ── Mongoose CastError (invalid ObjectId) ─────────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Invalid value for field: ${err.path}`,
    });
  }

  // ── JWT Errors ─────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid authentication token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Authentication token has expired',
    });
  }

  // ── Unknown / Unexpected Errors (bugs) ────────────────────────────────
  // Do NOT expose internal details in production
  console.error('❌ Unhandled Error:', err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: env.IS_PRODUCTION
      ? 'An internal server error occurred'
      : err.message,
    ...(env.IS_DEVELOPMENT && { stack: err.stack }),
  });
};

export default errorMiddleware;
