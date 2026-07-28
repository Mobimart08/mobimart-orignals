/* ==========================================================================
   src/controllers/user.controller.js
   User request routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { clearRefreshTokenCookie } from '../utils/generateToken.js';
import {
  updateProfile,
  changePassword,
  softDeleteUser,
  getRecentlyViewed,
  addRecentlyViewed,
  clearRecentlyViewed,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
} from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'User profile retrieved successfully',
    req.user
  );
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, smsOptIn } = req.body;
  const updatedUser = await updateProfile(req.user._id, { name, phone, smsOptIn });

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Profile updated successfully',
    updatedUser
  );
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changePassword(req.user._id, currentPassword, newPassword);

  clearRefreshTokenCookie(res);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Password updated successfully. You have been logged out of all devices. Please login again.'
  );
});

export const deleteMe = asyncHandler(async (req, res) => {
  await softDeleteUser(req.user._id);

  clearRefreshTokenCookie(res);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Account deactivated successfully.'
  );
});

export const handleGetRecentlyViewed = asyncHandler(async (req, res) => {
  const recentlyViewed = await getRecentlyViewed(req.user._id);
  ApiResponse.success(res, HTTP_STATUS.OK, 'Recently viewed products fetched', recentlyViewed);
});

export const handleAddRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const recentlyViewed = await addRecentlyViewed(req.user._id, productId);
  ApiResponse.success(res, HTTP_STATUS.OK, 'Product added to recently viewed', recentlyViewed);
});

export const handleClearRecentlyViewed = asyncHandler(async (req, res) => {
  await clearRecentlyViewed(req.user._id);
  ApiResponse.success(res, HTTP_STATUS.OK, 'Recently viewed products cleared');
});

export const handleGetSearchHistory = asyncHandler(async (req, res) => {
  const history = await getSearchHistory(req.user._id);
  ApiResponse.success(res, HTTP_STATUS.OK, 'Search history fetched', history);
});

export const handleAddSearchHistory = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const history = await addSearchHistory(req.user._id, query);
  ApiResponse.success(res, HTTP_STATUS.OK, 'Query added to search history', history);
});

export const handleClearSearchHistory = asyncHandler(async (req, res) => {
  await clearSearchHistory(req.user._id);
  ApiResponse.success(res, HTTP_STATUS.OK, 'Search history cleared');
});
