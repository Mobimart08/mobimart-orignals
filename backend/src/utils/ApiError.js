/* ==========================================================================
   src/utils/ApiError.js
   Custom error class hierarchy for the MobiMart API.

   WHY a custom error class?
   - Carries statusCode alongside the message — error middleware can read it
   - Distinguishes between "operational" errors (expected, like 404) and
     programming bugs (unexpected, like TypeError) for logging purposes
   - Allows throwing errors anywhere in the service layer without building
     full HTTP response objects — the error middleware handles the response

   USAGE (in any service or controller):
     throw new ApiError(404, 'Product not found');
     throw new ApiError(422, 'Validation failed', validationErrors);
   ========================================================================== */

class ApiError extends Error {
  /**
   * @param {number}   statusCode  - HTTP status code to return
   * @param {string}   message     - Human-readable error message
   * @param {Array}    errors      - Validation error details (optional)
   * @param {boolean}  isOperational - true = expected; false = programming bug
   */
  constructor(
    statusCode,
    message = 'Something went wrong',
    errors = [],
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;       // Array of field-level validation errors
    this.isOperational = isOperational;
    this.success = false;

    // Capture proper stack trace (V8 only — Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}

/* --------------------------------------------------------------------------
   Convenience subclasses — use these throughout the codebase for clarity.
   The error.middleware reads statusCode from whichever class is thrown.
   -------------------------------------------------------------------------- */

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', errors = []) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'You do not have permission to perform this action') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors = []) {
    super(422, message, errors);
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests. Please slow down.') {
    super(429, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'An internal server error occurred') {
    super(500, message, [], false); // isOperational: false — this is a bug
  }
}

export default ApiError;
