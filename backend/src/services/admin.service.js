import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Brand from '../models/Brand.model.js';
import Category from '../models/Category.model.js';
import Settings from '../models/Settings.model.js';
import ApiError from '../utils/ApiError.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { queryAdminProducts } from './product.service.js';

export const getDashboardOverview = async () => {
  const [totalUsers, totalProducts, totalOrders] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenueAggregation = await Order.aggregate([
    { $match: { orderStatus: { $ne: ORDER_STATUS.CANCELLED } } },
    { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
  ]);

  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  };
};

export const getOrderStats = async (days = 30) => {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const stats = await Order.aggregate([
    { $match: { createdAt: { $gte: dateLimit } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        revenue: { $sum: '$pricing.total' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return stats;
};

export const getTopProducts = async () => {
  const products = await Product.find({ isActive: true })
    .sort({ averageRating: -1, reviewCount: -1 })
    .limit(10)
    .select('name brand averageRating reviewCount stock images price');

  return products;
};

export const getAdminProducts = async (query = {}) => {
  return queryAdminProducts(query);
};

export const getAdminBrands = async () => {
  return Brand.find({}).sort({ sortOrder: 1, name: 1 }).lean();
};

export const getAdminCategories = async () => {
  return Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
};

export const getAllOrders = async (query = {}) => {
  let { page = 1, limit = 20, status } = query;
  limit = Math.min(parseInt(limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.orderStatus = status;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  return {
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllUsers = async (query = {}) => {
  let { page = 1, limit = 20, role } = query;
  limit = Math.min(parseInt(limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select('-passwordHash -__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const toggleUserBan = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'super_admin') {
    throw new ApiError(403, 'Cannot ban a super admin');
  }

  user.isActive = !user.isActive;
  await user.save();
  return user;
};

export const getAllSettings = async () => {
  return await Settings.find();
};

export const updateSetting = async (key, value, description, adminId) => {
  const setting = await Settings.findOneAndUpdate(
    { key },
    { value, description, updatedBy: adminId },
    { new: true, upsert: true }
  );
  return setting;
};
