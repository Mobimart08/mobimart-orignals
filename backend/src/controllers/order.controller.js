import * as orderService from '../services/order.service.js';

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderData = { ...req.body, userId };
    
    const order = await orderService.createOrder(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await orderService.getUserOrders(userId, req.query);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.orderId;
    
    // Admins might need a different route or bypass userId check.
    // Assuming this is for the user viewing their own order:
    const order = await orderService.getOrderById(orderId, userId);
    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMyOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.orderId;
    
    const order = await orderService.cancelOrder(orderId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    
    const order = await orderService.updateOrderStatus(orderId, status);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const placeBuyNowOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, selectedStorage, selectedColor, selectedRam, quantity, addressId, paymentMethod, couponCode, deliveryMethod, notes } = req.body;

    const order = await orderService.createBuyNowOrder({
      userId,
      productId,
      selectedStorage,
      selectedColor,
      selectedRam,
      quantity,
      addressId,
      paymentMethod,
      couponCode,
      deliveryMethod,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Buy Now order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
