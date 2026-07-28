/* ==========================================================================
   src/controllers/product.controller.js
   Product catalog routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  queryProducts,
} from '../services/product.service.js';

export const listProducts = asyncHandler(async (req, res) => {
  const result = await queryProducts(req.query);

  if (result.type === 'offset') {
    ApiResponse.paginated(
      res,
      'Products list retrieved successfully (offset pagination)',
      result.data,
      result.pagination
    );
  } else {
    ApiResponse.paginated(
      res,
      'Products list retrieved successfully (cursor pagination)',
      result.data,
      result.pagination
    );
  }
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;

  let product;
  // If the parameter is a valid 24-character hexadecimal MongoDB ID, look up by ID
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  if (mongoIdRegex.test(slugOrId)) {
    product = await getProductById(slugOrId);
  } else {
    product = await getProductBySlug(slugOrId);
  }

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Product details retrieved successfully',
    product
  );
});

export const getRelated = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { limit } = req.query;

  const parsedLimit = limit ? parseInt(limit, 10) : 4;
  const products = await getRelatedProducts(slug, parsedLimit);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Related products retrieved successfully',
    products
  );
});

export const addProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.CREATED,
    'Product created successfully',
    product
  );
});

export const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await updateProduct(id, req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Product updated successfully',
    product
  );
});

export const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteProduct(id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Product soft-deleted successfully'
  );
});
