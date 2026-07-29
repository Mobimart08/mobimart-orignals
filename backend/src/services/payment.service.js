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
const keyId = env.RAZORPAY_KEY_ID?.trim();
const keySecret = env.RAZORPAY_KEY_SECRET?.trim();

console.log('--- Razorpay Initialization ---');
console.log(`RAZORPAY_KEY_ID exists: ${!!keyId}`);
console.log(`RAZORPAY_KEY_SECRET exists: ${!!keySecret}`);

if (keyId && keySecret) {
  const isTestKey = keyId.startsWith('rzp_test_');
  const isLiveKey = keyId.startsWith('rzp_live_');
  console.log(`Key type: ${isTestKey ? 'TEST' : isLiveKey ? 'LIVE' : 'UNKNOWN'}`);
  
  // Verify test vs live key consistency (Secrets don't have rzp_test_ prefix, but we can verify we are using correct keys)
  if (!isTestKey && !isLiveKey) {
    console.warn('⚠️ WARNING: RAZORPAY_KEY_ID does not start with rzp_test_ or rzp_live_.');
  }

  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  console.log('Razorpay client successfully initialized.');
} else {
  console.log('Razorpay keys missing. Client NOT initialized.');
}
console.log('-------------------------------');

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
    
    console.log(`Order ID: ${razorpayOrder.id}`);
    console.log(`Amount: ${razorpayOrder.amount}`);
    console.log(`Currency: ${razorpayOrder.currency}`);
    console.log(`Status: ${razorpayOrder.status}`);
    console.log('==========================================\n');
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
    console.log('\n==========================================');
    console.log('PAYMENT FAILED');
    console.log('==========================================');
    console.log('Exact Razorpay SDK error object:', error);
    console.log(`error.statusCode: ${error.statusCode}`);
    console.log('error.error:', error.error);
    console.log('error.response:', error.response);
    console.log(`error.message: ${error.message}`);
    console.log(`error.description: ${error.description}`);
    console.log(`error.stack: ${error.stack}`);
    console.log('==========================================\n');

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

  console.log('\n==========================================');
  console.log('SIGNATURE VERIFICATION');
  console.log('==========================================');
  console.log(`Expected Signature: ${expectedSignature}`);
  console.log(`Received Signature: ${razorpaySignature}`);

  const isAuthentic = expectedBuffer.length === signatureBuffer.length && 
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

  if (!isAuthentic) {
    console.log('Verification Result: ❌ Invalid Signature');
    console.log('==========================================\n');
    order.paymentStatus = PAYMENT_STATUS.FAILED;
    await order.save();
    
    console.log('\n==========================================');
    console.log('PAYMENT FAILED');
    console.log('==========================================');
    console.log('Status Code: 400');
    console.log('Reason: Invalid payment signature');
    console.log('Description: Signature verification failed during verifyPayment');
    console.log('Metadata: {}');
    console.log('==========================================\n');
    
    throw new ApiError(400, 'Invalid payment signature');
  }
  
  console.log('Verification Result: ✅ Signature Verified');
  console.log('==========================================\n');

  console.log('\n==========================================');
  console.log('SAVE ORDER');
  console.log('==========================================');
  console.log('Creating database order...');
  console.log(`Order ID: ${order.orderId}`);
  console.log(`Payment ID: ${razorpayPaymentId}`);
  console.log(`User ID: ${order.userId}`);
  console.log(`Total: ${order.pricing.total}`);
  console.log(`Items: ${order.items.length}`);
  console.log('✅ Order Saved Successfully');
  console.log('==========================================\n');

  order.paymentStatus = PAYMENT_STATUS.PAID;
  order.orderStatus = ORDER_STATUS.PROCESSING;
  order.paymentId = razorpayPaymentId;
  await order.save();
  sendConfirmation(order);

  return order;
};
