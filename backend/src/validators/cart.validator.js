/* ==========================================================================
   src/validators/cart.validator.js
   Validation constraints for Cart operations.
   ========================================================================== */

import { body, param } from 'express-validator';
import validateMiddleware from '../middlewares/validate.middleware.js';

export const addCartItemValidator = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  body('selectedStorage')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Storage selection is required'),

  body('selectedColor')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Color selection is required'),

  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be an integer between 1 and 10'),

  validateMiddleware,
];

export const editCartItemValidator = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid cart item ID format'),

  body('quantity')
    .isInt({ min: 0, max: 10 })
    .withMessage('Quantity must be an integer between 0 and 10'),

  validateMiddleware,
];

export const mergeCartValidator = [
  body('guestItems')
    .isArray()
    .withMessage('guestItems must be an array of cart items'),

  body('guestItems.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID inside guest cart items'),

  body('guestItems.*.selectedStorage')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Storage variant is required for guest items'),

  body('guestItems.*.selectedColor')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Color variant is required for guest items'),

  body('guestItems.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be an integer between 1 and 10 for guest items'),

  validateMiddleware,
];
