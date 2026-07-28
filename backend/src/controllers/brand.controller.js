/* ==========================================================================
   src/controllers/brand.controller.js
   Brand CRUD routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../services/brand.service.js';

export const listBrands = asyncHandler(async (req, res) => {
  // Admins can see inactive brands, customers only active ones
  const includeInactive = req.user && ['admin', 'super_admin'].includes(req.user.role);
  const brands = await getBrands(includeInactive);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Brands retrieved successfully',
    brands
  );
});

export const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await getBrandById(id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Brand details retrieved successfully',
    brand
  );
});

export const addBrand = asyncHandler(async (req, res) => {
  const brand = await createBrand(req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.CREATED,
    'Brand created successfully',
    brand
  );
});

export const editBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await updateBrand(id, req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Brand updated successfully',
    brand
  );
});

export const removeBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteBrand(id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Brand deleted successfully'
  );
});
