/* ==========================================================================
   src/routes/upload.routes.js
   File uploading routes mapping endpoints to multer middleware and controllers.
   Protected by authentication & admin guards for security.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import {
  uploadSingleImage,
  uploadMultipleImages,
  removeImage,
} from '../controllers/upload.controller.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Require admin privilege for all upload/delete endpoints
router.use(authMiddleware);
router.use(roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]));

router.post('/image', upload.single('image'), uploadSingleImage);
router.post('/images', upload.array('images', 5), uploadMultipleImages);
router.delete('/image', removeImage);

export default router;
