/* ==========================================================================
   src/models/Product.model.js
   Mongoose schema for products.
   ========================================================================== */

import mongoose from 'mongoose';
import { PRODUCT_CONDITIONS } from '../constants/productCatalog.js';
import {
  deriveConditionType,
  deriveLegacyConditionLabel,
  deriveProductCondition,
} from '../utils/productMetadata.js';



const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product display name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      maxlength: [40, 'SKU cannot exceed 40 characters'],
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand reference is required'],
    },

    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    productCondition: {
      type: String,
      required: [true, 'Product condition is required'],
      enum: {
        values: PRODUCT_CONDITIONS,
        message: 'Invalid product condition value',
      },
      default: function defaultProductCondition() {
        return deriveProductCondition(this);
      },
    },

    conditionType: {
      type: String,
      required: [true, 'Condition type is required'],
      enum: {
        values: ['New', 'Used'],
        message: 'Condition type must be either New or Used',
      },
      default: function defaultConditionType() {
        return deriveConditionType(deriveProductCondition(this));
      },
    },

    condition: {
      type: String,
      required: [true, 'Condition label is required'],
      trim: true,
      default: function defaultConditionLabel() {
        return deriveLegacyConditionLabel(deriveProductCondition(this));
      },
    },

    certified: {
      type: Boolean,
      default: false,
    },

    batteryHealth: {
      type: Number,
      default: null,
      min: [0, 'Battery health cannot be below 0%'],
      max: [100, 'Battery health cannot exceed 100%'],
    },

    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price cannot be negative'],
    },

    images: {
      type: [imageSchema],
      required: [true, 'At least one product image must be provided'],
      validate: {
        validator: (arr) => arr && arr.length > 0,
        message: 'At least one product image is required',
      },
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    specifications: {
      type: Object,
      default: {},
    },

    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived', 'Hidden'],
      default: 'Draft',
    },

    availabilityStatus: {
      type: String,
      enum: ['Active', 'Draft', 'Out Of Stock', 'Upcoming'],
      default: 'Active',
    },

    visibility: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ brand: 1, category: 1, isActive: 1 });
productSchema.index({ productCondition: 1, price: 1, isActive: 1 });
productSchema.index({ conditionType: 1, price: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ stock: 1, isActive: 1 });
productSchema.index({ averageRating: -1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, price: 1, _id: 1 });
productSchema.index({ isActive: 1, createdAt: -1, _id: 1 });

productSchema.index(
  {
    name: 'text',
    brandName: 'text',
    sku: 'text',
    description: 'text',
  },
  {
    name: 'text_search',
    weights: {
      name: 10,
      brandName: 8,
      sku: 7,
      description: 1,
    },
  }
);

productSchema.pre('save', function (next) {
  const resolvedProductCondition = deriveProductCondition(this);
  this.productCondition = resolvedProductCondition;
  this.conditionType = deriveConditionType(resolvedProductCondition);
  this.condition = deriveLegacyConditionLabel(resolvedProductCondition, this.condition);

  // Keep legacy isActive synchronized with the new status field
  if (this.isModified('status') || this.isNew) {
    if (this.status === 'Published') {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  if (this.productCondition === 'New') {
    this.batteryHealth = null;
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;



