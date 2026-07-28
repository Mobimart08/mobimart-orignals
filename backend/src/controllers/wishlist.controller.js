/* ==========================================================================
   src/controllers/wishlist.controller.js
   Wishlist request routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  getWishlistByUserId,
  addProductToWishlist,
  removeProductFromWishlist,
} from '../services/wishlist.service.js';

export const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistByUserId(req.user._id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Wishlist retrieved successfully',
    wishlist
  );
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await addProductToWishlist(req.user._id, productId);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Product added to wishlist successfully',
    wishlist
  );
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await removeProductFromWishlist(req.user._id, productId);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Product removed from wishlist successfully',
    wishlist
  );
});
