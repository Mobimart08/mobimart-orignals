/* ==========================================================================
   src/middlewares/validate.middleware.js
   Express validator validation runner.
   Runs the validation chains on the request and throws ValidationError (422)
   if any constraints are violated.
   ========================================================================== */

import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/ApiError.js';

/**
 * Validates request input fields.
 * If validation fails, returns a formatted 422 JSON response.
 */
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return next(new ValidationError('Input validation failed', formattedErrors));
  }

  next();
};

export default validateMiddleware;
