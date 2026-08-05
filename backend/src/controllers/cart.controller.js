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
  const start = performance.now();
  const cart = await getCartByUserId(req.user._id);
  const duration = performance.now() - start;
  console.log(`[Perf] GET /cart API executed in ${duration.toFixed(2)}ms`);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Cart retrieved successfully',
    cart
  );
});

export const addCartItem = asyncHandler(async (req, res) => {
  const start = performance.now();
  const { productId, selectedStorage, selectedColor, selectedRam, quantity } = req.body;
  const cart = await addItemToCart(req.user._id, {
    productId,
    selectedStorage,
    selectedColor,
    selectedRam,
    quantity,
  });
  const duration = performance.now() - start;
  console.log(`[Perf] POST /cart API executed in ${duration.toFixed(2)}ms`);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Item added to cart successfully',
    cart
  );
});

export const editCartItem = asyncHandler(async (req, res) => {
  const start = performance.now();
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await updateItemQuantity(req.user._id, itemId, quantity);
  const duration = performance.now() - start;
  console.log(`[Perf] PUT /cart API executed in ${duration.toFixed(2)}ms`);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Cart item updated successfully',
    cart
  );
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const start = performance.now();
  const { itemId } = req.params;
  const cart = await removeItemFromCart(req.user._id, itemId);
  const duration = performance.now() - start;
  console.log(`[Perf] DELETE /cart API executed in ${duration.toFixed(2)}ms`);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Item removed from cart successfully',
    cart
  );
});

export const clearMyCart = asyncHandler(async (req, res) => {
  const start = performance.now();
  await emptyCart(req.user._id);
  const duration = performance.now() - start;
  console.log(`[Perf] DELETE /cart (clear) API executed in ${duration.toFixed(2)}ms`);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Cart cleared successfully'
  );
});

export const mergeCart = asyncHandler(async (req, res) => {
  const start = performance.now();
  const { guestItems } = req.body;
  const result = await mergeGuestCart(req.user._id, guestItems);
  const duration = performance.now() - start;
  console.log(`[Perf] POST /cart/merge API executed in ${duration.toFixed(2)}ms`);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Guest cart merged successfully',
    result
  );
});
