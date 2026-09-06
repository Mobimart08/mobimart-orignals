import { body } from 'express-validator';

export const createOrderValidator = [
  body('addressId')
    .isMongoId()
    .withMessage('Valid Address ID is required'),
  body('paymentMethod')
    .custom((value) => {
      if (value === 'COD') {
        throw new Error('Cash on Delivery is no longer available. Please use online payment.');
      }
      if (value !== 'Razorpay') {
        throw new Error('Valid payment method is required (Razorpay)');
      }
      return true;
    }),
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
];

export const updateOrderStatusValidator = [
  body('status')
    .isIn(['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'])
    .withMessage('Invalid order status'),
];
