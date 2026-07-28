import * as paymentService from '../services/payment.service.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const data = await paymentService.createPaymentIntent(orderId, userId);
    
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
