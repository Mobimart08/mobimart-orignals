import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Store from '../pages/Store';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import DashboardPage from '../pages/DashboardPage';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { RecentlyViewedProvider } from '../context/RecentlyViewedContext';
import { OrdersProvider } from '../context/OrdersContext';

/* ==========================================================================
   AppRoutes Component
   - Sets up application-wide routing
   - Wraps the entire router with global state Context providers
   ========================================================================== */

export const AppRoutes = () => {
  return (
    <RecentlyViewedProvider>
      <WishlistProvider>
        <CartProvider>
          <OrdersProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/store" element={<Store />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </Router>
          </OrdersProvider>
        </CartProvider>
      </WishlistProvider>
    </RecentlyViewedProvider>
  );
};

export default AppRoutes;
