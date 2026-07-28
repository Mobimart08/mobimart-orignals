/* ==========================================================================
   src/controllers/category.controller.js
   Category CRUD routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js';

export const listCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.user && ['admin', 'super_admin'].includes(req.user.role);
  const categories = await getCategories(includeInactive);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Categories retrieved successfully',
    categories
  );
});

export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryById(id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Category details retrieved successfully',
    category
  );
});

export const addCategory = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.CREATED,
    'Category created successfully',
    category
  );
});

export const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await updateCategory(id, req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Category updated successfully',
    category
  );
});

export const removeCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCategory(id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Category deleted successfully'
  );
});
