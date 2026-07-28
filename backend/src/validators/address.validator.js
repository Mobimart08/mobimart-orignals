/* ==========================================================================
   src/validators/address.validator.js
   Validation constraints for customer addresses.
   ========================================================================== */

import { body } from 'express-validator';
import validateMiddleware from '../middlewares/validate.middleware.js';

export const addressValidator = [
  body('label')
    .optional()
    .isIn(['Home', 'Office', 'Other'])
    .withMessage('Label must be one of: Home, Office, Other'),

  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Recipient name must be between 2 and 60 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('Name can only contain letters, spaces, and hyphens'),

  body('phone')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Mobile number is mandatory')
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid 10-digit mobile number'),

  body('addressLine1')
    .isString()
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage('Address Line 1 must be between 5 and 150 characters'),

  body('addressLine2')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Address Line 2 cannot exceed 150 characters'),

  body('city')
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('City must be between 2 and 60 characters'),

  body('state')
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('State must be between 2 and 60 characters'),

  body('pinCode')
    .isString()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('Please enter a valid 6-digit PIN code'),

  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value'),

  validateMiddleware,
];
