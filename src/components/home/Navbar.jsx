import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import mobimartLogo from '../../assets/mobimart_logo.png';

/* ==========================================================================
   Global Navbar Component
   - Renders a floating, glassmorphic capsule nav bar used globally across pages
   - Left corner: Brand Logo image
   - Right corner: Cart (ShoppingCart) action trigger
   - No hamburger menu icon
   ========================================================================== */

export const Navbar = ({ cartCount = 2 }) => {
  return (
    <header className="sticky top-4 z-40 w-full px-4 md:px-8 mt-4 select-none">
      <div className="max-w-5xl mx-auto bg-[#F0F4F8]/80 backdrop-blur-md border border-[#D0D6E2]/45 shadow-glass rounded-full px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300">
        
        {/* Left corner: Brand Logo */}
        <div className="flex items-center justify-start">
          <a 
            href="/" 
            className="flex items-center justify-start hover:opacity-80 transition-opacity h-12 sm:h-15"
          >
            <img 
              src={mobimartLogo} 
              alt="MobiMart logo" 
              className="h-full w-auto object-contain mix-blend-multiply" 
            />
          </a>
        </div>

        {/* Right corner: Cart Action */}
        <div className="flex items-center gap-3.5 text-neutral-800 justify-end">
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
