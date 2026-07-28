import crypto from 'crypto';
import Razorpay from 'razorpay';
import env from '../config/env.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { PAYMENT_STATUS } from '../constants/paymentStatus.js';
import { sendOrderConfirmationEmail } from './email.service.js';

// Initialize Razorpay client only if keys are present
let razorpay;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export const createPaymentIntent = async (orderId, userId) => {
  const order = await Order.findOne({ orderId, userId });
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.paymentMethod?.toLowerCase() === 'cod') {
    throw new ApiError(400, 'Cannot initiate payment for Cash on Delivery orders');
  }

  if (order.orderStatus === ORDER_STATUS.CANCELLED) {
    throw new ApiError(400, 'Order is cancelled');
  }

  const amountInPaise = Math.round(order.pricing.total * 100); // Razorpay requires amount in subunits (paise)

  // If we don't have Razorpay keys, return a mock response for testing
  if (!razorpay) {
    if (env.NODE_ENV === 'production') {
      throw new ApiError(500, 'Payment gateway configuration is missing');
    }
    console.warn('⚠️ No Razorpay keys found. Returning mock payment intent.');
    return {
      orderId: order.orderId,
      razorpayOrderId: `mock_rp_order_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      mock: true,
      key: 'mock_key_id'
    };
  }

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: order.orderId,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Update order with the intent reference
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return {
      orderId: order.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    throw new ApiError(500, `Failed to create Razorpay order: ${error.message}`);
  }
};

const sendConfirmation = async (order) => {
  try {
    const user = await User.findById(order.userId);
    if (user) {
      sendOrderConfirmationEmail(user.email, user.name, {
        orderId: order.orderId,
        items: order.items,
        total: order.pricing.total,
        shippingAddress: order.shippingAddress,
        deliveryMethod: order.deliveryMethod,
      }).catch(err => console.error('Order confirmation email error:', err));
    }
  } catch (emailErr) {
    console.error('Failed to dispatch order confirmation email:', emailErr);
  }
};

export const verifyPayment = async (orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, userId) => {
  const order = await Order.findOne({ orderId, userId });
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Idempotency guard - if already paid, return early to prevent double confirmation
  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    return order;
  }

  // If we are in mock mode
  if (!razorpay) {
    if (env.NODE_ENV === 'production') {
      throw new ApiError(500, 'Payment gateway configuration is missing');
    }
    console.warn('⚠️ No Razorpay keys found. Mocking successful payment verification.');
    order.paymentStatus = PAYMENT_STATUS.PAID;
    order.orderStatus = ORDER_STATUS.PROCESSING;
    order.paymentId = razorpayPaymentId || `mock_txn_${Date.now()}`;
    await order.save();
    sendConfirmation(order);
    return order;
  }

  // Actual signature verification
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
  const signatureBuffer = Buffer.from(razorpaySignature, 'utf-8');

  const isAuthentic = expectedBuffer.length === signatureBuffer.length && 
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

  if (!isAuthentic) {
    order.paymentStatus = PAYMENT_STATUS.FAILED;
    await order.save();
    throw new ApiError(400, 'Invalid payment signature');
  }

  order.paymentStatus = PAYMENT_STATUS.PAID;
  order.orderStatus = ORDER_STATUS.PROCESSING;
  order.paymentId = razorpayPaymentId;
  await order.save();
  sendConfirmation(order);

  return order;
};
