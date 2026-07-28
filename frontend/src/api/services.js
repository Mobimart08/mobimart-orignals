import apiClient from './client';
import axios from 'axios';

let API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || '') 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

if (API_URL && !API_URL.includes('/api/v1')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api/v1';
}

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  verifyEmail: (token) => apiClient.get('/auth/verify-email', { params: { token } }),
  resendVerification: (email) => apiClient.post('/auth/resend-verification', { email }),
  // Use raw axios for refresh — must NOT include the Authorization header
  // (which would carry a stale/expired access token). Refresh is auth'd by cookie only.
  refresh: () => axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true }),
};

export const userService = {
  getProfile: (config = {}) => apiClient.get('/users/me', config),
  updateProfile: (data) => apiClient.put('/users/me', data),
  updatePassword: (data) => apiClient.put('/users/me/password', data),
  deleteProfile: () => apiClient.delete('/users/me'),
  getRecentlyViewed: () => apiClient.get('/users/recently-viewed'),
  addRecentlyViewed: (productId) => apiClient.post('/users/recently-viewed', { productId }),
  clearRecentlyViewed: () => apiClient.delete('/users/recently-viewed'),
  getSearchHistory: () => apiClient.get('/users/search-history'),
  addSearchHistory: (query) => apiClient.post('/users/search-history', { query }),
  clearSearchHistory: () => apiClient.delete('/users/search-history'),
};

export const notificationService = {
  getNotifications: () => apiClient.get('/notifications'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
};

export const productsService = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  getRelated: (slug, limit = 4) => apiClient.get(`/products/${slug}/related`, { params: { limit } }),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export const cartService = {
  getCart: () => apiClient.get('/cart'),
  addItem: (data) => apiClient.post('/cart/items', data), // { productId, quantity }
  updateItem: (itemId, quantity) => apiClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => apiClient.delete(`/cart/items/${itemId}`),
  clearCart: () => apiClient.delete('/cart'),
  mergeCart: (guestItems) => apiClient.post('/cart/merge', { guestItems }),
};

export const wishlistService = {
  getWishlist: () => apiClient.get('/wishlist'),
  addItem: (productId) => apiClient.post('/wishlist', { productId }),
  removeItem: (productId) => apiClient.delete(`/wishlist/${productId}`),
  clearWishlist: () => apiClient.delete('/wishlist'),
};

export const ordersService = {
  getOrders: (params) => apiClient.get('/orders', { params }),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  createOrder: (data) => apiClient.post('/orders', data),
  cancelOrder: (id) => apiClient.post(`/orders/${id}/cancel`),
  updateOrderStatus: (id, data) => apiClient.patch(`/orders/${id}/status`, data),
};

export const paymentService = {
  initiatePayment: (orderId) => apiClient.post('/payments/initiate', { orderId }),
  verifyPayment: (data) => apiClient.post('/payments/verify', data),
};

export const addressService = {
  getAddresses: () => apiClient.get('/addresses'),
  addAddress: (data) => apiClient.post('/addresses', data),
  updateAddress: (id, data) => apiClient.put(`/addresses/${id}`, data),
  deleteAddress: (id) => apiClient.delete(`/addresses/${id}`),
  setDefault: (id) => apiClient.put(`/addresses/${id}/default`),
};

export const couponService = {
  validateCoupon: (code) => apiClient.post('/coupons/apply', { code }),
};

export const brandService = {
  getAll: (params) => apiClient.get('/brands', { params }),
  getById: (id) => apiClient.get(`/brands/${id}`),
  create: (data) => apiClient.post('/brands', data),
  update: (id, data) => apiClient.put(`/brands/${id}`, data),
  delete: (id) => apiClient.delete(`/brands/${id}`),
};

export const categoryService = {
  getAll: (params) => apiClient.get('/categories', { params }),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

export const reviewService = {
  getProductReviews: (productId) => apiClient.get(`/reviews/product/${productId}`),
  addReview: (data) => apiClient.post('/reviews', data),
  updateReview: (id, data) => apiClient.put(`/reviews/${id}`, data),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
  markHelpful: (id) => apiClient.put(`/reviews/${id}/helpful`),
  getAllAdminReviews: () => apiClient.get('/reviews/admin/all'),
  approveReview: (id, data) => apiClient.put(`/reviews/admin/${id}/approve`, data),
  deleteReviewAdmin: (id) => apiClient.delete(`/reviews/admin/${id}`),
};

export const adminService = {
  getOverview: () => apiClient.get('/admin/analytics/overview'),
  getOrderStats: () => apiClient.get('/admin/analytics/orders'),
  getTopProducts: () => apiClient.get('/admin/analytics/products'),
  getProducts: (params) => apiClient.get('/admin/products', { params }),
  getBrands: () => apiClient.get('/admin/brands'),
  getCategories: () => apiClient.get('/admin/categories'),
  getOrders: (params) => apiClient.get('/admin/orders', { params }),
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  getUserDetails: (id) => apiClient.get(`/admin/users/${id}`),
  toggleBanUser: (id) => apiClient.put(`/admin/users/${id}/ban`),
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.put('/admin/settings', data),
};

export const searchService = {
  searchProducts: (params) => apiClient.get('/search', { params }),
  getSuggestions: (params) => apiClient.get('/search/suggestions', { params }),
};

export const uploadService = {
  uploadImage: (formData, onUploadProgress) => apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  }),
  uploadImages: (formData, onUploadProgress) => apiClient.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  }),
  deleteImage: (publicId) => apiClient.delete('/upload/image', { data: { publicId } }),
};

