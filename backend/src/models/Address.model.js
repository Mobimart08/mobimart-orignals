/* ==========================================================================
   src/models/Address.model.js
   Mongoose schema for user saved shipping addresses.
   Supports multiple addresses with a default toggle.
   ========================================================================== */

import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId is required'],
    },

    label: {
      type: String,
      enum: {
        values: ['Home', 'Office', 'Other'],
        message: '{VALUE} is not a valid address label',
      },
      default: 'Home',
      trim: true,
    },

    name: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
      minlength: [2, 'Recipient name must be at least 2 characters'],
      maxlength: [60, 'Recipient name cannot exceed 60 characters'],
    },

    phone: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },

    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
      minlength: [5, 'Address line 1 must be at least 5 characters'],
      maxlength: [150, 'Address line 1 cannot exceed 150 characters'],
    },

    addressLine2: {
      type: String,
      default: null,
      trim: true,
      maxlength: [150, 'Address line 2 cannot exceed 150 characters'],
    },

    landmark: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, 'Landmark cannot exceed 100 characters'],
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City name must be at least 2 characters'],
      maxlength: [60, 'City name cannot exceed 60 characters'],
    },

    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      minlength: [2, 'State name must be at least 2 characters'],
      maxlength: [60, 'State name cannot exceed 60 characters'],
    },

    pinCode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true,
    },

    country: {
      type: String,
      default: 'India',
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* --------------------------------------------------------------------------
   Indexes
   - user_addresses: Fetch user list sorted by newest first
   - user_default: Quick check/reset default state
   -------------------------------------------------------------------------- */
addressSchema.index({ userId: 1, createdAt: -1 });
addressSchema.index({ userId: 1, isDefault: 1 });

const Address = mongoose.model('Address', addressSchema);

export default Address;
