/* ==========================================================================
   src/services/upload.service.js
   Image upload service streaming buffers to Cloudinary.
   Auto-transforms and compresses images to modern, fast-loading .webp formats.
   ========================================================================== */

import cloudinary from '../config/cloudinary.js';
import { BadRequestError } from '../utils/ApiError.js';
import sharp from 'sharp';

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream.
 * Pre-processes the image with Sharp to resize and compress locally.
 *
 * @param {Buffer} fileBuffer       - Raw file buffer from Multer
 * @param {string} folder           - Cloudinary folder name (e.g. 'products', 'avatars')
 * @param {Object} customOptions    - Overriding Cloudinary transformation settings
 * @returns {Promise<Object>}       - Resolves to { url, publicId }
 */
export const uploadImageBuffer = async (fileBuffer, folder = 'general', customOptions = {}) => {
  if (!fileBuffer) {
    throw new BadRequestError('No file buffer provided');
  }

  try {
    // 1. Optimize locally with Sharp (Compress, Resize, Convert)
    // Limits max dimension to 1200px, converts to WebP with 80% quality
    const optimizedBuffer = await sharp(fileBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      // 2. Upload to Cloudinary with additional transformations
      const defaultOptions = {
        folder: `mobimart/${folder}`,
        // Cloudinary responsive sizing and optimization
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ],
        resource_type: 'image',
      };

      const uploadOptions = { ...defaultOptions, ...customOptions };

      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error('❌ Cloudinary stream upload error:', error);
          return reject(new BadRequestError(`Image upload failed: ${error.message}`));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      });

      // Write optimized buffer to stream and close
      stream.end(optimizedBuffer);
    });
  } catch (err) {
    console.error('❌ Sharp image optimization error:', err);
    throw new BadRequestError('Failed to process and optimize image');
  }
};

/**
 * Deletes a single image asset from Cloudinary using its public_id.
 *
 * @param {string} publicId - Cloudinary public_id string
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      console.warn(`⚠️ Cloudinary deletion warning for ID ${publicId}:`, result.result);
    }
  } catch (error) {
    console.error(`❌ Cloudinary deletion failed for ID ${publicId}:`, error.message);
    // Silent fail in case asset was already deleted directly on Cloudinary panel
  }
};
