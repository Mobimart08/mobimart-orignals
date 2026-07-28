import * as paymentService from '../services/payment.service.js';
import crypto from 'crypto';
import env from '../config/env.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    console.log('\n==========================================');
    console.log('CREATE ORDER REQUEST');
    console.log('==========================================');
    console.log(`User ID: ${userId}`);
    console.log(`Receipt: ${orderId}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('==========================================\n');

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const data = await paymentService.createPaymentIntent(orderId, userId);
    
    console.log('\n==========================================');
    console.log('OPEN CHECKOUT');
    console.log('==========================================\n');

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const userId = req.user._id;

    console.log('\n==========================================');
    console.log('PAYMENT SUCCESS');
    console.log('==========================================');
    console.log(`razorpay_payment_id: ${razorpayPaymentId}`);
    console.log(`razorpay_order_id: ${razorpayOrderId}`);
    console.log(`razorpay_signature: ${razorpaySignature}`);
    console.log('==========================================\n');

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await paymentService.verifyPayment(
      orderId, 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      userId
    );
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const razorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const event = req.body.event;
    const payload = req.body.payload;
    const payment = payload?.payment?.entity;
    const orderId = payload?.order?.entity?.id || payment?.order_id || 'N/A';
    const paymentId = payment?.id || 'N/A';

    console.log('\n==========================================');
    console.log('WEBHOOK');
    console.log('==========================================');
    console.log(`Event Name: ${event}`);
    console.log(`Payment ID: ${paymentId}`);
    console.log(`Order ID: ${orderId}`);

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(JSON.stringify(req.body))
      .digest('hex');

    const isValid = expectedSignature === signature;
    console.log(`Signature Valid?: ${isValid ? 'Yes' : 'No'}`);
    
    if (isValid) {
      console.log('Processing Result: Webhook verified and acknowledged.');
      // Normally business logic to update order would go here, but this is a placeholder
      // since the original codebase didn't implement a webhook handler logic.
    } else {
      console.log('Processing Result: Invalid signature. Ignoring webhook.');
    }
    console.log('==========================================\n');

    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
