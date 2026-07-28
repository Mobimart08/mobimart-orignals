/* ==========================================================================
   src/models/Category.model.js
   Mongoose schema for Product Categories.
   Supports parentCategory hierarchy for future nested structure expansions.
   ========================================================================== */

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [60, 'Category name cannot exceed 60 characters'],
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

    // Self-reference to support nested subcategories
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    imagePublicId: {
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
categorySchema.index({ parentCategory: 1, isActive: 1 }, { sparse: true });
categorySchema.index({ sortOrder: 1, isActive: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
