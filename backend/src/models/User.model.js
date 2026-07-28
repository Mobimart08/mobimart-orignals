/* ==========================================================================
   src/models/User.model.js
   Unified user model for customers and admins.
   Role field controls access — no separate admin collection.
   ========================================================================== */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE_VALUES, ROLES } from '../constants/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Optional — unique only when provided (sparse unique index defined below)
    phone: {
      type: String,
      trim: true,
    },

    // bcrypt hash — NEVER returned in queries by default
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Must explicitly .select('+passwordHash') to read
    },

    role: {
      type: String,
      enum: { values: ROLE_VALUES, message: '{VALUE} is not a valid role' },
      default: ROLES.CUSTOMER,
    },

    // Controls checkout access — must be verified before placing orders
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    
    // Email verification fields
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // Cloudinary image URL
    avatar: {
      type: String,
      default: null,
    },

    // Cloudinary public_id — required for deletion when avatar changes
    avatarPublicId: {
      type: String,
      default: null,
    },

    // false = banned/suspended — rejected at login
    isActive: {
      type: Boolean,
      default: true,
    },

    // Updated on every successful login — for security audit
    lastLogin: {
      type: Date,
      default: null,
    },

    // Opt-in for future SMS notifications (Twilio/MSG91)
    smsOptIn: {
      type: Boolean,
      default: false,
    },

    // FCM device tokens for future push notifications (max 5)
    fcmTokens: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Maximum 5 FCM tokens allowed per user',
      },
    },

    recentlyViewed: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },

    searchHistory: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,   // Adds createdAt and updatedAt automatically
    versionKey: false,  // Removes __v field
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* --------------------------------------------------------------------------
   Indexes
   - email: unique (defined in schema above)
   - phone: sparse unique (only indexes docs where phone is not null)
   - role + isActive: compound for admin user-list queries
   - createdAt: for admin newest-first sorting
   -------------------------------------------------------------------------- */
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

/* --------------------------------------------------------------------------
   Instance Methods
   -------------------------------------------------------------------------- */

/**
 * Compares a plain-text candidate password against the stored bcrypt hash.
 * Must be called on a user document fetched with .select('+passwordHash').
 *
 * @param {string} candidatePassword - Plain-text password from the request
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Returns a safe public profile — strips sensitive fields.
 * Use this when returning user data in API responses.
 */
userSchema.methods.toPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    avatar: this.avatar,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    recentlyViewed: this.recentlyViewed,
    searchHistory: this.searchHistory,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
