/* ==========================================================================
   src/controllers/address.controller.js
   Address CRUD routing controller handlers.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import {
  getAddressesByUserId,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/address.service.js';

export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await getAddressesByUserId(req.user._id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Addresses retrieved successfully',
    addresses
  );
});

export const addAddress = asyncHandler(async (req, res) => {
  const address = await createAddress(req.user._id, req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.CREATED,
    'Address created successfully',
    address
  );
});

export const editAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await updateAddress(req.user._id, id, req.body);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Address updated successfully',
    address
  );
});

export const removeAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteAddress(req.user._id, id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Address deleted successfully'
  );
});

export const makeDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const address = await setDefaultAddress(req.user._id, id);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Default address updated successfully',
    address
  );
});
