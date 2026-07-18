import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';

/* ==========================================================================
   CheckoutBar Component
   - Sticky bottom bar rendering checkout triggers (always visible near bottom)
   - Left: Displays final order totals
   - Right: "Proceed to Checkout" action button
   - Bottom: Core trust badges (Secure Payment, Certified Devices, Fast Delivery, Easy Returns)
   ========================================================================== */

export const CheckoutBar = ({ total = 0, onCheckout }) => {
  const formatVal = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/50 py-3.5 sm:py-4 px-4 sm:px-6 shadow-premium select-none">
      <div className="max-w-5xl mx-auto flex flex-col gap-2.5">
        
        {/* Core Checkout trigger row */}
        <div className="flex items-center justify-between gap-4">
          {/* Price totals */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">
              Grand Total
            </span>
            <span className="text-base sm:text-lg font-black text-neutral-950 leading-none">
              {formatVal(total)}
            </span>
          </div>

          {/* Checkout CTA */}
          <button
            type="button"
            onClick={onCheckout}
            className="px-6 sm:px-8 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none group active:scale-[0.98]"
            aria-label="Proceed to Checkout page"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Secure Checkout Badges grid row */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 border-t border-gray-100/50 pt-2.5 mt-0.5 text-[8.5px] sm:text-[9px] text-gray-400 font-bold">
          <span className="flex items-center gap-1">
            <Lock size={10} className="text-[#C5A880]" />
            <span>Secure Payment</span>
          </span>
          <span className="text-neutral-200">|</span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={10} className="text-[#C5A880]" />
            <span>Certified Devices</span>
          </span>
          <span className="text-neutral-200">|</span>
          <span className="flex items-center gap-1">
            <Truck size={10} className="text-[#C5A880]" />
            <span>Fast Delivery</span>
          </span>
          <span className="text-neutral-200">|</span>
          <span className="flex items-center gap-1">
            <RefreshCw size={10} className="text-[#C5A880]" />
            <span>Easy Returns</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default CheckoutBar;
