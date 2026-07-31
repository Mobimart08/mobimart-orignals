import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, ShoppingCart, ArrowLeft } from 'lucide-react';
import mobimartLogo from '../../assets/mobimart_logo.webp';

/* ==========================================================================
   DashboardHeader Component
   - Sticky top navigation for the Customer Dashboard page
   - Left: Brand Logo & Back to Store trigger
   - Right: Quick Search, Notification Bell, and Cart icons
   ========================================================================== */

export const DashboardHeader = ({ unreadNotificationsCount = 2, onNotificationClick, cartCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/60 select-none py-3.5 px-4 sm:px-6 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo and back arrow */}
        <div className="flex items-center gap-3">
          <Link 
            to="/store"
            className="p-1.5 -ml-1 rounded-full text-gray-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Back to Store"
          >
            <ArrowLeft size={16} strokeWidth={2.4} />
          </Link>
          <Link to="/" className="h-9 sm:h-11 flex items-center">
            <img 
              src={mobimartLogo} 
              alt="MobiMart logo" 
              className="h-full w-auto object-contain mix-blend-multiply" 
            />
          </Link>
        </div>

        {/* Right Side: Account Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-neutral-800">
          {/* Quick Search */}
          <button 
            type="button"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-neutral-950"
            aria-label="Search Catalog"
          >
            <Search size={17} strokeWidth={2.4} />
          </button>

          {/* Notification Bell with Badge */}
          <button 
            type="button"
            onClick={onNotificationClick}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-neutral-950 relative"
            aria-label="View notifications"
          >
            <Bell size={17} strokeWidth={2.4} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[13px] h-[13px] px-0.5 bg-amber-500 text-white text-[8px] font-black rounded-full border border-white flex items-center justify-center shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <Link 
            to="/cart" 
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-neutral-950 relative"
            aria-label="View shopping cart"
          >
            <ShoppingCart size={17} strokeWidth={2.4} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[13px] h-[13px] px-0.5 bg-gold-accent text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;
