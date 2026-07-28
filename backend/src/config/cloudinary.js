/* ==========================================================================
   src/config/cloudinary.js
   Cloudinary SDK initialization.
   Used by upload.service.js for all image operations.
   ========================================================================== */

import { v2 as cloudinary } from 'cloudinary';
import env from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS URLs
});

export default cloudinary;
