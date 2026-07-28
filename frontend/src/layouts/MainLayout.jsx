import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import BottomNavigation from '../components/store/BottomNavigation';
import Footer from '../components/home/Footer';
import GlobalSearchDrawer from '../components/ui/GlobalSearchDrawer';
import { CertificationModal, WarrantyModal, ShippingPolicyModal } from '../components/ui/InfoModals';
import ComingSoonBottomSheet from '../components/ui/ComingSoonBottomSheet';
import { useCart } from '../context/CartContext';

/* ==========================================================================
   MainLayout Layout Shell
   - Global Navbar with Search Drawer integration
   - Global Footer & Bottom Navigation
   ========================================================================== */

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const { cartCount } = useCart();

  // Modal / Drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('Feature Coming Soon');

  const isHideBottomNav = 
    location.pathname.startsWith('/product/') || 
    location.pathname === '/checkout' ||
    location.pathname === '/order-success';

  const isCheckoutFlow = 
    location.pathname === '/cart' ||
    location.pathname === '/checkout' || 
    location.pathname === '/order-success' ||
    location.pathname === '/dashboard';

  const isStorePage = location.pathname.startsWith('/store');
  const isHideFooter = isCheckoutFlow || isStorePage;

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/store')) return 'Store';
    if (path === '/cart') return 'Cart';
    if (path === '/dashboard') return 'Profile';
    return 'Store';
  };

  const handleOpenComingSoon = (title = 'Feature Coming Soon') => {
    setComingSoonTitle(title);
    setIsComingSoonOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#FAF9F6] text-neutral-950 font-sans antialiased selection:bg-[#EBDCD0] selection:text-gold-dark relative">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-gold-accent text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-lg"
      >
        Skip to main content
      </a>

      {/* Global Header Navbar */}
      {!isCheckoutFlow && (
        <Navbar 
          cartCount={cartCount} 
          onSearchClick={() => setIsSearchOpen(true)}
        />
      )}

      {/* Main page content body */}
      <main id="main-content" className={`flex-grow w-full ${isHideBottomNav ? 'pb-28' : 'pb-20 sm:pb-24'}`}>
        <div key={location.pathname} className="animate-page-in w-full h-full">
          {children}
        </div>
      </main>

      {/* Global Footer */}
      {!isHideFooter && (
        <Footer 
          onCertificationClick={() => setIsCertModalOpen(true)}
          onWarrantyClick={() => setIsWarrantyModalOpen(true)}
          onShippingClick={() => setIsShippingModalOpen(true)}
          onComingSoonClick={() => handleOpenComingSoon()}
        />
      )}

      {/* Global Sticky Bottom Navigation */}
      {!isHideBottomNav && (
        <BottomNavigation activeTab={getActiveTab()} cartCount={cartCount} />
      )}

      {/* Global Search Drawer */}
      <GlobalSearchDrawer 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Info Modals */}
      <CertificationModal 
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
      <WarrantyModal 
        isOpen={isWarrantyModalOpen}
        onClose={() => setIsWarrantyModalOpen(false)}
      />
      <ShippingPolicyModal 
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
      />

      {/* Coming Soon Bottom Sheet */}
      <ComingSoonBottomSheet 
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        title={comingSoonTitle}
      />
    </div>
  );
};

export default MainLayout;
