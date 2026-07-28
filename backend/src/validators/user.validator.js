/* ==========================================================================
   src/validators/user.validator.js
   Validation constraints for user profile modifications.
   ========================================================================== */

import { body } from 'express-validator';
import validateMiddleware from '../middlewares/validate.middleware.js';

export const updateProfileValidator = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),

  body('phone')
    .optional({ nullable: true })
    .customSanitizer((val) => {
      if (!val) return null;
      return val.replace(/\s+/g, '').replace(/^(?:\+91|0)/, '');
    })
    .custom((val) => {
      if (!val) return true;
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(val)) {
        throw new Error('Please enter a valid 10-digit Indian mobile number');
      }
      return true;
    }),

  body('smsOptIn')
    .optional()
    .isBoolean()
    .withMessage('smsOptIn must be a boolean value'),

  validateMiddleware,
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 8, max: 64 })
    .withMessage('New password must be between 8 and 64 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one digit')
    .matches(/[@$!%*?&]/)
    .withMessage('New password must contain at least one special character (@$!%*?&)')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password cannot be the same as your current password');
      }
      return true;
    }),

  validateMiddleware,
];
