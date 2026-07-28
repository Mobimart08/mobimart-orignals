import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

/* ==========================================================================
   EmptyCart Component
   - Renders the luxury minimal empty state for the Cart Page
   - Renders a clean icon placeholder with radial gold backing glow
   - Details descriptions and shopping page redirect buttons
   ========================================================================== */

export const EmptyCart = () => {
  return (
    <div className="w-full max-w-md mx-auto py-16 px-6 bg-white border border-gray-150/40 rounded-3xl shadow-soft-ui text-center select-none animate-fade-in my-8">
      
      {/* Centered Shopping Bag with Radial Glow backing */}
      <div className="w-20 h-20 rounded-full bg-gold-bg/40 border border-gold-accent/20 flex items-center justify-center text-amber-600 mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-[#C5A880]/5 blur-md rounded-full"></div>
        <ShoppingBag size={32} className="text-[#C5A880] relative z-10" strokeWidth={1.8} />
      </div>

      {/* Empty Header Description */}
      <h3 className="text-lg font-black text-neutral-900 mb-2.5 tracking-tight">
        Your Cart is Empty
      </h3>
      
      <p className="text-xs text-gray-400 font-bold leading-relaxed max-w-xs mx-auto mb-8">
        Explore our curated collection of certified premium smartphones and upgrade your device today.
      </p>

      {/* Redirect Button */}
      <Link
        to="/store"
        className="inline-block px-10 py-3 text-xs font-black text-white bg-neutral-950 hover:bg-neutral-855 rounded-full transition-all shadow-md active:scale-98 cursor-pointer select-none"
      >
        Continue Shopping
      </Link>

    </div>
  );
};

export default EmptyCart;
