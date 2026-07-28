import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ==========================================================================
   BottomNavigation Component
   - Renders a sticky mobile bottom tab navigation bar
   - Highlights the "Store" tab as active
   - Displays a dynamic cart count badge over the "Cart" tab
   ========================================================================== */

export const BottomNavigation = ({ activeTab = 'Store', cartCount = 2 }) => {
  const navItems = [
    { id: 'Home', label: 'Home', icon: <HomeIcon size={18} strokeWidth={2.2} />, to: '/' },
    { id: 'Store', label: 'Store', icon: <ShoppingBag size={18} strokeWidth={2.2} />, to: '/store' },
    { id: 'Cart', label: 'Cart', icon: <ShoppingCart size={18} strokeWidth={2.2} />, to: '/cart', badgeCount: cartCount },
    { id: 'Profile', label: 'Profile', icon: <User size={18} strokeWidth={2.2} />, to: '/dashboard' },
  ];
  const { user, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const handleTabClick = (e, item) => {
    if (item.id === 'Profile' && !user) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-md border-t border-gray-200/40 py-2 pb-safe-bottom select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={(e) => handleTabClick(e, item)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3.5 relative transition-colors cursor-pointer ${
                isActive 
                  ? 'text-neutral-900 font-bold' 
                  : 'text-gray-400 font-semibold hover:text-neutral-600'
              }`}
              aria-label={`Go to ${item.label} tab`}
            >
              {/* Icon Container with Badge */}
              <div className="relative">
                {item.icon}
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 bg-gold-accent text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center select-none shadow-sm animate-pulse-subtle">
                    {item.badgeCount}
                  </span>
                ) : null}
              </div>
              
              {/* Tab Label */}
              <span className="text-[9px] sm:text-[10px] tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
