import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useOrders } from '../context/OrdersContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useCart } from '../context/CartContext';
import { Check, ShieldCheck, Award, Truck, HelpCircle } from 'lucide-react';
import { SkeletonDashboard } from '../components/ui/Skeletons';
import SEO from '../components/ui/SEO';

// Import dashboard components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import QuickActions from '../components/dashboard/QuickActions';
import RecentOrders from '../components/dashboard/RecentOrders';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import SavedAddresses from '../components/dashboard/SavedAddresses';
import DashboardRecentlyViewed from '../components/dashboard/DashboardRecentlyViewed';
import SupportGrid from '../components/dashboard/SupportGrid';
import SettingsAccordion from '../components/dashboard/SettingsAccordion';

/* ==========================================================================
   DashboardPage Component
   - Assembles the customer profile dashboard
   - Hooks anchors for QuickActions navigation scroll tabs
   - Coordinates unread notifications count, local storage profiles
   ========================================================================== */

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { recentlyViewed } = useRecentlyViewed();
  const { cartCount } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  // Scroll section refs
  const sections = {
    orders: useRef(null),
    addresses: useRef(null),
    notifications: useRef(null),
    support: useRef(null),
    profile: useRef(null),
    security: useRef(null)
  };

  // Toast confirmation feedback
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // User profile state
  const [profile, setProfile] = useState({
    name: 'Hitansh Sharma',
    phone: '+91 98765 43210',
    email: 'hitansh@gmail.com',
  });

  // Sync profile on mount
  useEffect(() => {
    const stored = localStorage.getItem('mobimart_user_profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      localStorage.setItem('mobimart_user_profile', JSON.stringify(profile));
    }
  }, []);

  // Simulating initial data loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProfile = (updatedFields) => {
    const updated = { ...profile, ...updatedFields };
    setProfile(updated);
    localStorage.setItem('mobimart_user_profile', JSON.stringify(updated));
    showToast('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('mobimart_user_profile');
    localStorage.removeItem('mobimart_saved_addresses');
    localStorage.removeItem('mobimart_orders');
    navigate('/store');
    window.location.reload();
  };

  // Dynamic notification count badge
  const [unreadCount, setUnreadCount] = useState(2);

  const handleScrollToSection = (sectionId) => {
    let target = sections[sectionId]?.current;
    if (sectionId === 'security' || sectionId === 'profile') {
      target = sections.profile?.current; // share settings accordion ref
    }
    
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <MainLayout>
      <SEO 
        title="Customer Dashboard" 
        description="Manage your MobiMart account settings, order history, and addresses." 
        path="/dashboard" 
      />
      {/* Dynamic Sticky Dashboard Header (replaces standard Navbar) */}
      <DashboardHeader 
        unreadNotificationsCount={unreadCount}
        cartCount={cartCount}
        onNotificationClick={() => handleScrollToSection('notifications')}
      />

      {/* Toast Alert popup */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {toast && (
          <div className="flex items-center gap-2.5 bg-neutral-950 text-white text-[11px] font-bold px-4.5 py-3 rounded-full shadow-premium whitespace-nowrap">
            <div className="w-4.5 h-4.5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Check size={11} className="text-white" strokeWidth={3} />
            </div>
            <span>{toast}</span>
          </div>
        )}
      </div>

      <div className="w-full bg-[#FAF9F6] pb-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto pt-6 flex flex-col gap-8">
          
          {isLoading ? (
            <SkeletonDashboard />
          ) : (
            <>
              {/* Welcome Banner */}
              <WelcomeHero 
                userName={profile.name}
                ordersCount={orders.length}
                wishlistCount={0} // Mock count or read if wishlist items are visible
                totalSavings={12500}
              />

              {/* Quick Actions Grid Selector */}
              <QuickActions onSelect={handleScrollToSection} />

              {/* Collapsible Orders list */}
              <div ref={sections.orders} className="scroll-mt-20">
                <RecentOrders orders={orders} onAddToast={showToast} />
              </div>

              {/* Notifications feed */}
              <div ref={sections.notifications} className="scroll-mt-20">
                <NotificationsPanel onUnreadCountChange={setUnreadCount} />
              </div>

              {/* Saved Addresses cards drawer */}
              <div ref={sections.addresses} className="scroll-mt-20">
                <SavedAddresses />
              </div>

              {/* Swipeable Previously Viewed Devices deck */}
              <DashboardRecentlyViewed />

              {/* Support action cards */}
              <div ref={sections.support} className="scroll-mt-20">
                <SupportGrid />
              </div>

              {/* Editable account settings sections */}
              <div ref={sections.profile} className="scroll-mt-20">
                <SettingsAccordion 
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  onLogout={handleLogout}
                />
              </div>
            </>
          )}

          {/* Bottom Trust Credentials Strip */}
          <div className="w-full border-t border-gray-200/50 pt-8 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left select-none">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-neutral-900 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-[#C5A880]" />
                Certified Devices
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-normal pl-5">100% Quality checked devices</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-neutral-900 uppercase tracking-widest">
                <Award size={12} className="text-[#C5A880]" />
                1 Year Warranty
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-normal pl-5">Complimentary brand cover</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-neutral-900 uppercase tracking-widest">
                <Truck size={12} className="text-[#C5A880]" />
                Fast Delivery
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-normal pl-5">Secure courier dispatches</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-neutral-900 uppercase tracking-widest">
                <HelpCircle size={12} className="text-[#C5A880]" />
                Toll-Free Support
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-normal pl-5">24/7 dedicated help desks</span>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
