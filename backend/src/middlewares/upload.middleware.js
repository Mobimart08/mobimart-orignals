/* ==========================================================================
   src/middlewares/upload.middleware.js
   Multer middleware configuration.
   Configures memoryStorage and validates file types/sizes before uploading.
   Streaming directly from memory avoids slow server temp file read/writes.
   ========================================================================== */

import multer from 'multer';
import { BadRequestError } from '../utils/ApiError.js';

// Use memoryStorage instead of diskStorage to avoid disk dependencies on servers
const storage = multer.memoryStorage();

/**
 * Filter files by MIME type.
 * Permits only JPG, JPEG, PNG, and WEBP.
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image files (JPG, JPEG, PNG, WEBP) are allowed'), false);
  }
};

/**
 * Configure Multer upload middleware.
 * Size limit: 5MB per file.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes
  },
});

export default upload;
