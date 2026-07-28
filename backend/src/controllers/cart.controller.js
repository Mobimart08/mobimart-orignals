/* ==========================================================================
   src/controllers/cart.controller.js
   Cart request routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  getCartByUserId,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  emptyCart,
  mergeGuestCart,
} from '../services/cart.service.js';

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getCartByUserId(req.user._id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Cart retrieved successfully',
    cart
  );
});

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, selectedStorage, selectedColor, quantity } = req.body;
  const cart = await addItemToCart(req.user._id, {
    productId,
    selectedStorage,
    selectedColor,
    quantity,
  });

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Item added to cart successfully',
    cart
  );
});

export const editCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await updateItemQuantity(req.user._id, itemId, quantity);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Cart item updated successfully',
    cart
  );
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await removeItemFromCart(req.user._id, itemId);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Item removed from cart successfully',
    cart
  );
});

export const clearMyCart = asyncHandler(async (req, res) => {
  await emptyCart(req.user._id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Cart cleared successfully'
  );
});

export const mergeCart = asyncHandler(async (req, res) => {
  const { guestItems } = req.body;
  const result = await mergeGuestCart(req.user._id, guestItems);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Guest cart merged successfully',
    result
  );
});
