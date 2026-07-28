import { Router } from 'express';
import * as searchController from '../controllers/search.controller.js';

const router = Router();

// Public routes for searching
router.get('/', searchController.searchProducts);
router.get('/suggestions', searchController.getSuggestions);

export default router;
