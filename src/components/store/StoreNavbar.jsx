import React from 'react';
import { Menu, Heart, ShoppingCart } from 'lucide-react';

/* ==========================================================================
   StoreNavbar Component
   - Renders the header for the MobiMart Store page
   - Left: Hamburger Menu trigger
   - Center: Centered "MobiMart" brand logo link
   - Right: Wishlist (Heart) and Cart (ShoppingCart) utility icons with indicator badges
   ========================================================================== */

export const StoreNavbar = ({ onMenuClick, onWishlistClick, onCartClick, cartCount = 2 }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-gray-200/40 px-4 py-3 flex items-center justify-between transition-all duration-300">
      {/* Left: Menu Icon */}
      <div className="flex items-center w-24">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-1.5 -ml-1 text-neutral-800 hover:text-gold-accent hover:bg-neutral-100/50 rounded-full transition-all cursor-pointer"
          aria-label="Open side menu"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* Center: Brand Branding */}
      <div className="flex-1 text-center">
        <a
          href="/store"
          className="text-lg font-bold tracking-tight text-neutral-950 select-none hover:opacity-85 transition-opacity"
        >
          MobiMart
        </a>
      </div>

      {/* Right: Actions (Wishlist & Cart) */}
      <div className="flex items-center gap-3.5 text-neutral-800 w-24 justify-end">
        {/* Wishlist */}
        <button
          type="button"
          onClick={onWishlistClick}
          className="p-1.5 text-neutral-800 hover:text-gold-accent hover:bg-neutral-100/50 rounded-full transition-all cursor-pointer"
          aria-label="View wishlist"
        >
          <Heart size={20} strokeWidth={2.2} />
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={onCartClick}
          className="p-1.5 text-neutral-800 hover:text-gold-accent hover:bg-neutral-100/50 rounded-full transition-all cursor-pointer relative"
          aria-label="View shopping cart"
        >
          <ShoppingCart size={20} strokeWidth={2.2} />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-0.5 bg-gold-accent text-white text-[8px] font-bold rounded-full border border-[#FAF9F6] flex items-center justify-center select-none shadow-sm animate-pulse-subtle">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default StoreNavbar;
