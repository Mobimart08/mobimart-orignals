/* ==========================================================================
   src/validators/auth.validator.js
   Validation constraints for all authentication requests.
   Enforces phone numbers, passwords, emails, and names parameters logic.
   ========================================================================== */

import { body } from 'express-validator';
import validateMiddleware from '../middlewares/validate.middleware.js';

/* --------------------------------------------------------------------------
   Password rule chain (reused across registration, reset, change)
   -------------------------------------------------------------------------- */
const passwordRules = (fieldName = 'password') =>
  body(fieldName)
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one digit')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain at least one special character (@$!%*?&)');

/* --------------------------------------------------------------------------
   Phone number rule validator (validates Indian mobile format)
   -------------------------------------------------------------------------- */
const phoneRules = () =>
  body('phone')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Mobile number is mandatory')
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid 10-digit mobile number');

/* --------------------------------------------------------------------------
   Exposed Validation chains
   -------------------------------------------------------------------------- */

export const registerValidator = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('Name can only contain letters, spaces, and hyphens'),

  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail({ gmail_remove_dots: false })
    .trim(),

  passwordRules('password'),

  phoneRules(),

  validateMiddleware,
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail({ gmail_remove_dots: false })
    .trim(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validateMiddleware,
];

export const forgotPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail({ gmail_remove_dots: false })
    .trim(),

  validateMiddleware,
];

export const resetPasswordValidator = [
  body('token')
    .isHexadecimal()
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid reset token format'),

  passwordRules('newPassword'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  validateMiddleware,
];

export const verifyEmailValidator = [
  body('token')
    .isHexadecimal()
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid verification token format'),

  validateMiddleware,
];
