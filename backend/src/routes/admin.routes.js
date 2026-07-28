import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'super_admin']));

router.get('/analytics/overview', adminController.getAnalyticsOverview);
router.get('/analytics/orders', adminController.getOrderStats);
router.get('/analytics/products', adminController.getTopProducts);

router.get('/products', adminController.getProductsList);
router.get('/brands', adminController.getBrandsList);
router.get('/categories', adminController.getCategoriesList);
router.get('/orders', adminController.getOrdersList);

router.get('/users', adminController.getUsersList);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/ban', adminController.toggleBanUser);

router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSetting);

export default router;
