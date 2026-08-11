import { body } from 'express-validator';
import validateMiddleware from '../middlewares/validate.middleware.js';

export const buyNowOrderValidator = [
  body('productId')
    .isMongoId()
    .withMessage('Valid Product ID is required'),

  body('selectedStorage')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Storage selection must be a string'),

  body('selectedColor')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('Color selection must be a string'),

  body('selectedRam')
    .optional({ nullable: true })
    .isString()
    .trim()
    .withMessage('RAM selection must be a string'),

  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be an integer between 1 and 10'),

  body('addressId')
    .isMongoId()
    .withMessage('Valid Address ID is required'),

  body('paymentMethod')
    .isIn(['Razorpay', 'COD'])
    .withMessage('Valid payment method is required (Razorpay or COD)'),

  body('couponCode')
    .optional({ nullable: true })
    .isString()
    .withMessage('Coupon code must be a string'),

  body('deliveryMethod')
    .optional()
    .isIn(['Standard', 'Express'])
    .withMessage('Delivery method must be Standard or Express'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  validateMiddleware,
];
