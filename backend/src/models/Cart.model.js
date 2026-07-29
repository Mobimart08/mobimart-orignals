/* ==========================================================================
   src/models/Cart.model.js
   Mongoose schema for server-side persistent shopping cart.
   Allows cross-device cart sync and guest-to-user merging.
   ========================================================================== */

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'ProductId is required'],
  },

  selectedStorage: {
    type: String,
    required: [true, 'Storage option selection is required'],
    trim: true,
  },

  selectedColor: {
    type: String,
    required: [true, 'Color option selection is required'],
    trim: true,
  },

  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 1,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Maximum quantity limit per variant is 10'],
  },

  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true }); // Keep _id for cart item lookup during updates/deletion

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId is required'],
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: 'Cart cannot exceed 20 unique items',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* --------------------------------------------------------------------------
   Indexes
   -------------------------------------------------------------------------- */
// userId is automatically indexed via unique: true
cartSchema.index({ 'items.productId': 1 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
