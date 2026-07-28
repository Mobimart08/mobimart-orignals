/* ==========================================================================
   src/models/Brand.model.js
   Mongoose schema for Smartphone Brands.
   Registers manufacturer metadata for filters.
   ========================================================================== */

import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
      minlength: [1, 'Brand name must be at least 1 character'],
      maxlength: [60, 'Brand name cannot exceed 60 characters'],
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    logo: {
      type: String,
      default: null,
    },

    logoPublicId: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      default: null,
      maxlength: 60,
    },

    website: {
      type: String,
      default: null,
    },

    sortOrder: {
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
brandSchema.index({ sortOrder: 1, isActive: 1 });

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
