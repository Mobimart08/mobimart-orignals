/* ==========================================================================
   src/models/Coupon.model.js
   Mongoose schema for discount codes and promotions.
   ========================================================================== */

import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'Coupon code must be at least 3 characters'],
      maxlength: [20, 'Coupon code cannot exceed 20 characters'],
    },

    type: {
      type: String,
      enum: {
        values: ['percentage', 'fixed'],
        message: '{VALUE} is not a valid coupon type',
      },
      required: true,
    },

    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [1, 'Discount value must be at least 1'],
    },

    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase amount cannot be negative'],
    },

    maxDiscountAmount: {
      type: Number,
      default: null, // Applicable primarily for percentage coupons (e.g. "20% off up to ₹1500")
      min: 0,
    },

    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },

    usageLimit: {
      type: Number,
      default: null, // Null means unlimited uses
      min: 1,
    },

    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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
couponSchema.index({ isActive: 1, endDate: 1 });

/* --------------------------------------------------------------------------
   Validation Hooks
   -------------------------------------------------------------------------- */
couponSchema.pre('save', function (next) {
  if (this.startDate > this.endDate) {
    return next(new Error('Start date cannot be after end date'));
  }
  
  if (this.type === 'percentage' && this.discountValue > 100) {
    return next(new Error('Percentage discount cannot exceed 100%'));
  }

  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
