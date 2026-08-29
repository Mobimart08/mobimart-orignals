import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Address from '../models/Address.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Coupon from '../models/Coupon.model.js';
import ApiError from '../utils/ApiError.js';
import { sendOrderConfirmationEmail } from './email.service.js';
import { validateAndApplyCoupon, recordCouponUsage } from './coupon.service.js';
import { createNotification } from './notification.service.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { NOTIFICATION_TYPES } from '../constants/notificationTypes.js';

const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = async ({ userId, addressId, paymentMethod, couponCode, deliveryMethod, notes }) => {
  // 1. Double-submit / idempotency guard
  const recentOrder = await Order.findOne({
    userId,
    orderStatus: ORDER_STATUS.PENDING,
    createdAt: { $gte: new Date(Date.now() - 30000) } // 30 seconds window
  });
  if (recentOrder) {
    return recentOrder; // Idempotent return to prevent duplicate orders
  }

  // 2. Fetch Cart and verify it has items
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  // 2. Fetch Address
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new ApiError(404, 'Shipping address not found or does not belong to user');
  }

  // 2.5 Fetch User for Customer Email Snapshot
  const user = await User.findById(userId).select('email phone');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // 3. Build Order Items and Check Stock
  let subtotal = 0;
  let totalDeliveryCharge = 0;
  const orderItems = [];
  const decrementedItems = [];
  let couponRecorded = false;
  let couponAppliedId = null;
  let discount = 0;

  try {
    for (const cartItem of cart.items) {
      const product = cartItem.productId; // Populated
      if (!product || !product.isActive) {
        throw new ApiError(400, `Product ${product ? product.name : 'Unknown'} is unavailable`);
      }

      // Verify variant selection exists in flat schema options
      if (product.storageOptions && product.storageOptions.length > 0) {
        const hasStorage = product.storageOptions.includes(cartItem.selectedStorage);
        if (!hasStorage) {
          throw new ApiError(400, `Selected storage variant for ${product.name} is unavailable`);
        }
      }

      if (product.colorOptions && product.colorOptions.length > 0) {
        const hasColor = product.colorOptions.some(c => c.name === cartItem.selectedColor);
        if (!hasColor) {
          throw new ApiError(400, `Selected color variant for ${product.name} is unavailable`);
        }
      }

      if (product.ram && product.ram.length > 0) {
        const hasRam = product.ram.includes(cartItem.selectedRam);
        if (!hasRam) {
          throw new ApiError(400, `Selected RAM variant for ${product.name} is unavailable`);
        }
      }

      // Atomically check and decrement stock to prevent race conditions / overselling
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: cartItem.quantity } },
        { $inc: { stock: -cartItem.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      console.log('\n==========================================');
      console.log('STOCK UPDATE');
      console.log('==========================================');
      console.log(`Product ID: ${product._id}`);
      console.log(`Previous Stock: ${product.stock}`);
      console.log(`Updated Stock: ${updatedProduct.stock}`);
      console.log('==========================================\n');

      decrementedItems.push({ productId: product._id, quantity: cartItem.quantity });

      // Snapshot item price and delivery charge
      const priceAtPurchase = product.price;
      const deliveryChargeAtPurchase = product.deliveryCharge || 0;
      subtotal += priceAtPurchase * cartItem.quantity;
      totalDeliveryCharge += deliveryChargeAtPurchase * cartItem.quantity;
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku || null,
        brandName: product.brandName || null,
        categoryName: product.categoryName || null,
        productCondition: product.productCondition || product.conditionType || null,
        selectedStorage: cartItem.selectedStorage,
        selectedColor: cartItem.selectedColor,
        selectedRam: cartItem.selectedRam || null,
        priceAtPurchase,
        deliveryChargeAtPurchase,
        quantity: cartItem.quantity,
      });
    }

    // 4. Calculate Pricing & Apply Coupon atomically
    if (couponCode) {
      const couponResult = await validateAndApplyCoupon(couponCode, subtotal);
      discount = couponResult.discount;
      couponAppliedId = couponResult.couponId;

      // Increment usage count atomically (with usageLimit checks)
      await recordCouponUsage(couponAppliedId);
      couponRecorded = true;
    }

    const tax = 0; // Simplified for now
    const shipping = totalDeliveryCharge;
    const total = Math.max(0, subtotal - discount + tax + shipping);

    // 5. Create Order Document
    const order = new Order({
      orderId: generateOrderId(),
      userId,
      items: orderItems,
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        email: user.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        country: address.country,
        addressType: address.label,
      },
      pricing: {
        subtotal,
        tax,
        shipping,
        discount,
        total,
      },
      couponApplied: couponAppliedId,
      paymentMethod,
      deliveryMethod: deliveryMethod || 'Standard',
      notes,
    });

    await order.save();

    // 6. Clear user cart
    console.log('\n==========================================');
    console.log('CART');
    console.log('==========================================');
    console.log('Clearing cart...');
    cart.items = [];
    await cart.save();
    console.log('Cart cleared successfully.');
    console.log('==========================================\n');

    // 7. Send Notification
    await createNotification({
      userId,
      type: NOTIFICATION_TYPES.ORDER_UPDATE,
      title: 'Order Confirmed!',
      message: `Your order ${order.orderId} has been placed successfully.`,
      link: `/orders/${order.orderId}`,
      metadata: { orderId: order._id }
    });

    // Send order confirmation email for COD orders
    try {
      if (user && order.paymentMethod?.toLowerCase() === 'cod') {
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

    return order;

  } catch (error) {
    // Rollback coupon usage on failure
    if (couponRecorded && couponAppliedId) {
      await Coupon.updateOne({ _id: couponAppliedId }, { $inc: { usageCount: -1 } });
    }
    // Rollback stock updates on failure
    for (const rolled of decrementedItems) {
      await Product.updateOne({ _id: rolled.productId }, { $inc: { stock: rolled.quantity } });
    }
    throw error;
  }
};

export const getUserOrders = async (userId, query = {}) => {
  let { page = 1, limit = 10 } = query;
  limit = Math.min(parseInt(limit) || 10, 100);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments({ userId }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrderById = async (orderId, userId = null) => {
  const filter = { orderId };
  if (userId) {
    filter.userId = userId;
  }

  const order = await Order.findOne(filter).populate('couponApplied', 'code type discountValue');
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return order;
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ orderId, userId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (!['Pending', 'Processing'].includes(order.orderStatus)) {
    throw new ApiError(400, `Cannot cancel order in ${order.orderStatus} status`);
  }

  // Restore stock for flat product schema
  const stockUpdates = order.items.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { 
        $inc: { stock: item.quantity } 
      }
    }
  }));

  if (stockUpdates.length > 0) {
    await Product.bulkWrite(stockUpdates);
  }

  // Restore coupon usage limit if applicable
  if (order.couponApplied) {
    await Coupon.updateOne(
      { _id: order.couponApplied },
      { $inc: { usageCount: -1 } }
    );
  }

  order.orderStatus = ORDER_STATUS.CANCELLED;
  await order.save();

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // If status is transitioning to Cancelled and the order wasn't already Cancelled
  if (status === ORDER_STATUS.CANCELLED && order.orderStatus !== ORDER_STATUS.CANCELLED) {
    // Restore stock for flat product schema
    const stockUpdates = order.items.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { 
          $inc: { stock: item.quantity } 
        }
      }
    }));

    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates);
    }

    // Restore coupon usage limit if applicable
    if (order.couponApplied) {
      await Coupon.updateOne(
        { _id: order.couponApplied },
        { $inc: { usageCount: -1 } }
      );
    }
  }

  order.orderStatus = status;
  await order.save();

  return order;
};

export const createBuyNowOrder = async ({ userId, addressId, paymentMethod, couponCode, deliveryMethod, notes, productId, selectedStorage, selectedColor, selectedRam, quantity }) => {
  // Apply defaults for variant fields
  const storage = selectedStorage || 'Default';
  const color = selectedColor || 'Default';
  const ram = selectedRam || null;

  // 1. Buy Now-scoped idempotency guard — matches exact product + variant
  const recentOrder = await Order.findOne({
    userId,
    orderStatus: ORDER_STATUS.PENDING,
    createdAt: { $gte: new Date(Date.now() - 30000) },
    'items.0.productId': productId,
    'items.0.selectedStorage': storage,
    'items.0.selectedColor': color,
    'items.0.selectedRam': ram,
  });
  if (recentOrder) {
    return recentOrder;
  }

  // 2. Fetch product from database — never trust frontend price
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(400, `Product ${product ? product.name : 'Unknown'} is unavailable`);
  }

  // 3. Validate variants against product options
  if (product.storageOptions && product.storageOptions.length > 0) {
    if (!selectedStorage || !product.storageOptions.includes(selectedStorage)) {
      throw new ApiError(400, `Selected storage variant for ${product.name} is unavailable`);
    }
  }

  if (product.colorOptions && product.colorOptions.length > 0) {
    if (!selectedColor || !product.colorOptions.some(c => c.name === selectedColor)) {
      throw new ApiError(400, `Selected color variant for ${product.name} is unavailable`);
    }
  }

  if (product.ram && product.ram.length > 0) {
    if (!selectedRam || !product.ram.includes(selectedRam)) {
      throw new ApiError(400, `Selected RAM variant for ${product.name} is unavailable`);
    }
  }

  // 4. Fetch and verify address
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new ApiError(404, 'Shipping address not found or does not belong to user');
  }

  // 5. Fetch user for order snapshot
  const user = await User.findById(userId).select('email phone name');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let couponRecorded = false;
  let couponAppliedId = null;
  let discount = 0;
  let stockDecremented = false;

  try {
    // 6. Atomic stock decrement — same pattern as cart checkout
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!updatedProduct) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    stockDecremented = true;

    // 7. Calculate pricing from database price
    const priceAtPurchase = product.price;
    const deliveryChargeAtPurchase = product.deliveryCharge || 0;
    const subtotal = priceAtPurchase * quantity;
    const totalDeliveryCharge = deliveryChargeAtPurchase * quantity;

    // 8. Apply coupon if provided — reuses existing coupon service
    if (couponCode) {
      const couponResult = await validateAndApplyCoupon(couponCode, subtotal);
      discount = couponResult.discount;
      couponAppliedId = couponResult.couponId;
      await recordCouponUsage(couponAppliedId);
      couponRecorded = true;
    }

    // 9. Same pricing formula as cart checkout
    const tax = 0;
    const shipping = totalDeliveryCharge;
    const total = Math.max(0, subtotal - discount + tax + shipping);

    // 10. Build order item snapshot
    const orderItems = [{
      productId: product._id,
      name: product.name,
      sku: product.sku || null,
      brandName: product.brandName || null,
      categoryName: product.categoryName || null,
      productCondition: product.productCondition || product.conditionType || null,
      selectedStorage: storage,
      selectedColor: color,
      selectedRam: ram,
      priceAtPurchase,
      deliveryChargeAtPurchase,
      quantity,
    }];

    // 11. Create Order — same schema as cart checkout, Cart is never touched
    const order = new Order({
      orderId: generateOrderId(),
      userId,
      items: orderItems,
      shippingAddress: {
        name: address.name,
        phone: address.phone,
        email: user.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        country: address.country,
        addressType: address.label,
      },
      pricing: {
        subtotal,
        tax,
        shipping,
        discount,
        total,
      },
      couponApplied: couponAppliedId,
      paymentMethod,
      deliveryMethod: deliveryMethod || 'Standard',
      notes,
    });

    await order.save();

    // 12. Send notification — reuses existing notification service
    await createNotification({
      userId,
      type: NOTIFICATION_TYPES.ORDER_UPDATE,
      title: 'Order Confirmed!',
      message: `Your order ${order.orderId} has been placed successfully.`,
      link: `/orders/${order.orderId}`,
      metadata: { orderId: order._id }
    });

    // 13. Send confirmation email for COD — reuses existing email service
    try {
      if (user && order.paymentMethod?.toLowerCase() === 'cod') {
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

    return order;

  } catch (error) {
    // Rollback coupon usage on failure
    if (couponRecorded && couponAppliedId) {
      await Coupon.updateOne({ _id: couponAppliedId }, { $inc: { usageCount: -1 } });
    }
    // Rollback stock on failure
    if (stockDecremented) {
      await Product.updateOne({ _id: product._id }, { $inc: { stock: quantity } });
    }
    throw error;
  }
};
