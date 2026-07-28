import * as adminService from '../services/admin.service.js';

export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardOverview();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const data = await adminService.getOrderStats(days);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const data = await adminService.getTopProducts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProductsList = async (req, res, next) => {
  try {
    const data = await adminService.getAdminProducts(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBrandsList = async (req, res, next) => {
  try {
    const data = await adminService.getAdminBrands();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesList = async (req, res, next) => {
  try {
    const data = await adminService.getAdminCategories();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getOrdersList = async (req, res, next) => {
  try {
    const data = await adminService.getAllOrders(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUsersList = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const data = await adminService.getUserById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const toggleBanUser = async (req, res, next) => {
  try {
    const data = await adminService.toggleUserBan(req.params.id);
    res.status(200).json({
      success: true,
      message: `User ${data.isActive ? 'unbanned' : 'banned'} successfully`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await adminService.getAllSettings();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'Key and value are required' });
    }

    const data = await adminService.updateSetting(key, value, description || key, adminId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
