/* ==========================================================================
   src/services/wishlist.service.js
   Wishlist core business logic service.
   ========================================================================== */

import Wishlist from '../models/Wishlist.model.js';
import Product from '../models/Product.model.js';
import { BadRequestError, NotFoundError } from '../utils/ApiError.js';

/**
 * Helper to retrieve or lazily create a wishlist for a user.
 */
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [] });
  }
  return wishlist;
};

/**
 * Returns user's wishlist populated with live product listings.
 */
export const getWishlistByUserId = async (userId) => {
  const wishlist = await getOrCreateWishlist(userId);

  const populated = await Wishlist.findById(wishlist._id).populate({
    path: 'productIds',
    select: 'name slug brandName categoryName price originalPrice discount images stock isActive conditionType condition averageRating reviewCount',
  });

  return populated;
};

/**
 * Adds a product to the user's wishlist.
 * Enforces the maximum limit of 50 products.
 */
export const addProductToWishlist = async (userId, productId) => {
  // 1. Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  const wishlist = await getOrCreateWishlist(userId);

  // 2. Check if already favorited
  const exists = wishlist.productIds.some((id) => id.toString() === productId.toString());
  if (exists) {
    return getWishlistByUserId(userId); // Return silently
  }

  // 3. Enforce limit constraint (Max 50 items)
  if (wishlist.productIds.length >= 50) {
    throw new BadRequestError('Wishlist cannot exceed 50 saved products');
  }

  wishlist.productIds.push(productId);
  await wishlist.save();

  return getWishlistByUserId(userId);
};

/**
 * Removes a product from the wishlist.
 */
export const removeProductFromWishlist = async (userId, productId) => {
  const wishlist = await getOrCreateWishlist(userId);

  const initialLength = wishlist.productIds.length;
  wishlist.productIds = wishlist.productIds.filter((id) => id.toString() !== productId.toString());

  if (wishlist.productIds.length === initialLength) {
    throw new NotFoundError('Product not found in your wishlist');
  }

  await wishlist.save();
  return getWishlistByUserId(userId);
};
