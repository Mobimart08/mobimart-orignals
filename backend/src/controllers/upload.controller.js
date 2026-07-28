/* ==========================================================================
   src/controllers/upload.controller.js
   Image uploading and asset management controller.
   ========================================================================== */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { BadRequestError } from '../utils/ApiError.js';
import { uploadImageBuffer, deleteImage } from '../services/upload.service.js';

export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Please provide an image file to upload');
  }

  const { folder = 'general' } = req.body;
  const result = await uploadImageBuffer(req.file.buffer, folder);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Image uploaded successfully',
    result
  );
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new BadRequestError('Please provide at least one image file to upload');
  }

  const { folder = 'products' } = req.body;

  // Stream all buffers concurrently
  const uploadPromises = req.files.map((file) =>
    uploadImageBuffer(file.buffer, folder)
  );

  const results = await Promise.all(uploadPromises);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Images uploaded successfully',
    results
  );
});

export const removeImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new BadRequestError('publicId is required to delete an image');
  }

  await deleteImage(publicId);

  ApiResponse.success(
    res,
    HTTP_STATUS.OK,
    'Image deleted successfully from Cloudinary'
  );
});
