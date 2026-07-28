import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { RecentlyViewedProvider } from '../context/RecentlyViewedContext';
import { OrdersProvider } from '../context/OrdersContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import ScrollToTop from '../components/ui/ScrollToTop';
import AuthModal from '../components/ui/AuthModal';
import { ProtectedRoute, AdminRoute } from '../components/ui/ProtectedRoutes';

// Lazy load Pages
const Home = lazy(() => import('../pages/Home'));
const Store = lazy(() => import('../pages/Store'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage'));

// Lazy load Admin Pages
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminAddProduct = lazy(() => import('../pages/admin/AdminAddProduct'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminReviews = lazy(() => import('../pages/admin/AdminReviews'));

// Minimal Loader for Suspense Fallback
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-white">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600"></div>
  </div>
);

/* ==========================================================================
   AppRoutes Component
   - Sets up application-wide routing
   - Wraps router with global state Context providers & ToastProvider
   ========================================================================== */

export const AppRoutes = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <RecentlyViewedProvider>
        <WishlistProvider>
          <CartProvider>
            <OrdersProvider>
              <Router>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/new" element={<AdminAddProduct />} />
                      <Route path="products/:id/edit" element={<AdminAddProduct />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="reviews" element={<AdminReviews />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
                <AuthModal />
              </Router>
            </OrdersProvider>
          </CartProvider>
        </WishlistProvider>
      </RecentlyViewedProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
