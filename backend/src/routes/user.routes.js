/* ==========================================================================
   src/routes/user.routes.js
   User routes mapping endpoints to validators, middlewares, and controllers.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  updateProfileValidator,
  changePasswordValidator,
} from '../validators/user.validator.js';
import {
  getProfile,
  updateMe,
  updatePassword,
  deleteMe,
  handleGetRecentlyViewed,
  handleAddRecentlyViewed,
  handleClearRecentlyViewed,
  handleGetSearchHistory,
  handleAddSearchHistory,
  handleClearSearchHistory,
} from '../controllers/user.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfileValidator, updateMe);
router.put('/me/password', changePasswordValidator, updatePassword);
router.delete('/me', deleteMe);

// Recently Viewed
router.get('/recently-viewed', handleGetRecentlyViewed);
router.post('/recently-viewed', handleAddRecentlyViewed);
router.delete('/recently-viewed', handleClearRecentlyViewed);

// Search History
router.get('/search-history', handleGetSearchHistory);
router.post('/search-history', handleAddSearchHistory);
router.delete('/search-history', handleClearSearchHistory);

export default router;
