import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import mobimartLogo from '../../assets/mobimart_logo.png';

/* ==========================================================================
   Global Navbar Component
   - Renders a floating, glassmorphic capsule nav bar used globally across pages
   - Left corner: Brand Logo image linking to Home
   - Right corner: Global Search action trigger & Cart action trigger
   ========================================================================== */

export const Navbar = ({ cartCount = 0, onSearchClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full select-none bg-[#F0F4F8]/90 backdrop-blur-md border-b border-[#D0D6E2]/45 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300">
        
        {/* Left corner: Brand Logo */}
        <div className="flex items-center justify-start">
          <Link 
            to="/" 
            className="flex items-center justify-start hover:opacity-80 transition-opacity h-12 sm:h-15"
            aria-label="Navigate to homepage"
          >
            <img 
              src={mobimartLogo} 
              alt="MobiMart logo" 
              className="h-full w-auto object-contain mix-blend-multiply" 
            />
          </Link>
        </div>

        {/* Right corner: Actions (Search & Cart) */}
        <div className="flex items-center gap-3.5 text-neutral-800 justify-end">
          {/* Global Search Drawer Trigger */}
          <button
            type="button"
            onClick={onSearchClick}
            className="p-1.5 hover:text-gold-accent hover:bg-neutral-100/50 rounded-full transition-colors cursor-pointer"
            aria-label="Open global search"
          >
            <Search size={19} strokeWidth={2.2} />
          </button>

          {/* Cart */}
          <Link 
            to="/cart" 
            className="p-1.5 hover:text-gold-accent hover:bg-neutral-100/50 rounded-full transition-colors cursor-pointer relative"
            aria-label="View shopping cart"
          >
            <ShoppingCart size={19} strokeWidth={2.2} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-0.5 bg-gold-accent text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center shadow-sm select-none">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
