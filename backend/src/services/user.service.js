/* ==========================================================================
   src/services/user.service.js
   User core logic service.
   Handles updates, profile details, password updates, and account deletions.
   ========================================================================== */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Token from '../models/Token.model.js';
import Cart from '../models/Cart.model.js';
import Wishlist from '../models/Wishlist.model.js';
import Address from '../models/Address.model.js';
import { clearUserAuthState } from '../utils/authState.js';
import { ConflictError, BadRequestError } from '../utils/ApiError.js';

/**
 * Updates a user's profile fields. Enforces phone number uniqueness constraints.
 */
export const updateProfile = async (userId, { name, phone, smsOptIn }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError('User not found');
  }

  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new ConflictError('Phone number is already registered to another account');
    }
    user.phone = phone;
  } else if (phone === null) {
    user.phone = null;
  }

  if (name !== undefined) user.name = name;
  if (smsOptIn !== undefined) user.smsOptIn = smsOptIn;

  await user.save();
  await clearUserAuthState(user._id);
  return user.toPublicProfile();
};

/**
 * Updates user password. Validates current password, hashes new password,
 * and invalidates all session tokens for the user (forces logout everywhere).
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new BadRequestError('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new BadRequestError('Current password is incorrect');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  await Token.deleteMany({ userId });
  await clearUserAuthState(userId);
};

/**
 * Permanently deletes the user account and all user-owned auth/session data.
 */
export const softDeleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError('User not found');
  }

  await Promise.all([
    Token.deleteMany({ userId }),
    Cart.deleteMany({ userId }),
    Wishlist.deleteMany({ userId }),
    Address.deleteMany({ userId }),
    User.deleteOne({ _id: userId }),
  ]);

  await clearUserAuthState(userId);
};

export const getRecentlyViewed = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'recentlyViewed',
    select: 'name slug price originalPrice discount images brand rating reviewsCount inStock',
  });
  if (!user) throw new BadRequestError('User not found');
  return user.recentlyViewed;
};

export const addRecentlyViewed = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');

  user.recentlyViewed = user.recentlyViewed.filter(
    (id) => id.toString() !== productId.toString()
  );

  user.recentlyViewed.unshift(productId);

  if (user.recentlyViewed.length > 10) {
    user.recentlyViewed.pop();
  }

  await user.save();
  return user.recentlyViewed;
};

export const clearRecentlyViewed = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');
  user.recentlyViewed = [];
  await user.save();
  await clearUserAuthState(user._id);
};

export const getSearchHistory = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');
  return user.searchHistory;
};

export const addSearchHistory = async (userId, query) => {
  if (!query || query.trim() === '') throw new BadRequestError('Query is required');
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');

  const trimmedQuery = query.trim();
  user.searchHistory = user.searchHistory.filter(
    (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
  );
  user.searchHistory.unshift(trimmedQuery);

  if (user.searchHistory.length > 10) {
    user.searchHistory.pop();
  }

  await user.save();
  return user.searchHistory;
};

export const clearSearchHistory = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');
  user.searchHistory = [];
  await user.save();
  await clearUserAuthState(user._id);
};
