/* ==========================================================================
   src/models/Order.model.js
   Mongoose schema for Customer Orders.
   Snapshots product details and addresses to preserve history even if items change.
   ========================================================================== */

import mongoose from 'mongoose';
import { ORDER_STATUS_VALUES, ORDER_STATUS } from '../constants/orderStatus.js';
import { PAYMENT_STATUS_VALUES, PAYMENT_STATUS } from '../constants/paymentStatus.js';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String, default: null },
  brandName: { type: String, default: null },
  categoryName: { type: String, default: null },
  productCondition: { type: String, default: null },
  selectedStorage: { type: String, required: true },
  selectedColor: { type: String, required: true },
  selectedRam: { type: String, default: null },
  priceAtPurchase: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: null },
  landmark: { type: String, default: null },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  addressType: { type: String, default: 'Home' },
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, default: 0, min: 0 },
  shipping: { type: Number, required: true, default: 0, min: 0 },
  discount: { type: Number, required: true, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    shippingAddress: {
      type: orderAddressSchema,
      required: true,
    },

    pricing: {
      type: pricingSchema,
      required: true,
    },

    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: {
        values: ['Razorpay', 'COD'],
        message: '{VALUE} is not a supported payment method',
      },
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: { values: PAYMENT_STATUS_VALUES },
      default: PAYMENT_STATUS.PENDING,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    paymentId: {
      type: String,
      default: null,
    },

    orderStatus: {
      type: String,
      enum: { values: ORDER_STATUS_VALUES },
      default: ORDER_STATUS.PENDING,
    },

    trackingNumber: {
      type: String,
      default: null,
    },

    deliveryMethod: {
      type: String,
      enum: ['Standard', 'Express'],
      default: 'Standard',
    },

    notes: {
      type: String,
      default: null,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 }); // Admin: filter by status + sort by date
orderSchema.index({ paymentStatus: 1, createdAt: -1 }); // Admin: filter by payment status
orderSchema.index({ createdAt: -1 }); // Admin: latest orders list
orderSchema.index({ createdAt: 1, 'pricing.total': 1 }); // Admin: Revenue aggregation

const Order = mongoose.model('Order', orderSchema);

export default Order;
