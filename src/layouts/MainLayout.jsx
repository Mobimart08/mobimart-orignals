import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import BottomNavigation from '../components/store/BottomNavigation';
import Footer from '../components/home/Footer';
import { useCart } from '../context/CartContext';

/* ==========================================================================
   MainLayout Layout Shell
   - Page wrapper ensuring clean background, full-height structure, and scroll behavior
   - Global elements: Header Navbar, Bottom navigation tabs, and Footer
   ========================================================================== */

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const { cartCount } = useCart();

  const isHideBottomNav = 
    location.pathname.startsWith('/product/') || 
    location.pathname === '/checkout' ||
    location.pathname === '/order-success';

  const isCheckoutFlow = 
    location.pathname === '/checkout' || 
    location.pathname === '/order-success' ||
    location.pathname === '/dashboard';

  // Helper to dynamically highlight active tab based on active pathname
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/store')) return 'Store';
    if (path === '/cart') return 'Cart';
    if (path === '/dashboard') return 'Profile';
    return 'Store';
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#FAF9F6] text-neutral-950 font-sans antialiased selection:bg-[#EBDCD0] selection:text-gold-dark relative">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-gold-accent text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-lg"
      >
        Skip to main content
      </a>

      {/* Global Header Navbar — hidden on checkout flow which has its own header */}
      {!isCheckoutFlow && <Navbar cartCount={cartCount} />}

      {/* Main page content body with padding bottom to prevent sticky bar overlap */}
      <main id="main-content" className={`flex-grow w-full ${isHideBottomNav ? 'pb-28' : 'pb-20 sm:pb-24'}`}>
        <div key={location.pathname} className="animate-page-in w-full h-full">
          {children}
        </div>
      </main>

      {/* Global Footer — hidden on checkout flow */}
      {!isCheckoutFlow && <Footer />}

      {/* Global Sticky Bottom Navigation bar - Hidden on Product/Cart Pages to give space to sticky CTAs */}
      {!isHideBottomNav && (
        <BottomNavigation activeTab={getActiveTab()} cartCount={cartCount} />
      )}
    </div>
  );
};

export default MainLayout;
