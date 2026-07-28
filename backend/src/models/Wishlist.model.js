/* ==========================================================================
   src/models/Wishlist.model.js
   Mongoose schema for customer saved/favorited devices.
   ========================================================================== */

import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId is required'],
      unique: true,
    },

    productIds: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 50,
        message: 'Wishlist cannot exceed 50 saved products',
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
// Indexes handled by field definitions

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
