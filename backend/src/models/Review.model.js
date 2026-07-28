/* ==========================================================================
   src/models/Review.model.js
   Mongoose schema for Product Reviews.
   ========================================================================== */

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    isApproved: {
      type: Boolean,
      default: true, // Defaulting to true for now, can be false if strict moderation is needed
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
// Ensure a user can only review a product once
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
// Optimize fetching reviews for a product
reviewSchema.index({ productId: 1, createdAt: -1 });
// Optimize admin fetching all reviews
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
