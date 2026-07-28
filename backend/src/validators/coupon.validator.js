import { body, query } from 'express-validator';

export const createCouponValidator = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Code can only contain uppercase letters and numbers'),
  body('type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be either "percentage" or "fixed"'),
  body('discountValue')
    .isNumeric()
    .withMessage('Discount value must be a number')
    .custom((value, { req }) => {
      if (value < 1) throw new Error('Discount value must be at least 1');
      if (req.body.type === 'percentage' && value > 100) {
        throw new Error('Percentage discount cannot exceed 100');
      }
      return true;
    }),
  body('minPurchaseAmount')
    .optional()
    .isNumeric()
    .withMessage('Minimum purchase amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Minimum purchase cannot be negative'),
  body('maxDiscountAmount')
    .optional()
    .isNumeric()
    .withMessage('Maximum discount amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Maximum discount cannot be negative'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date string'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date string')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('usageLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const applyCouponValidator = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('cartTotal')
    .isNumeric()
    .withMessage('Cart total must be a number')
    .isFloat({ min: 0 })
    .withMessage('Cart total cannot be negative'),
];
