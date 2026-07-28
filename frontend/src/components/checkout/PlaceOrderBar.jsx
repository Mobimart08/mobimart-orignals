import React from 'react';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';

/* ==========================================================================
   PlaceOrderBar Component
   - Sticky bottom CTA bar on checkout page
   - Shows Grand Total on the left
   - "Place Order" button on the right with loading spinner state
   - Trust micro-text row underneath
   ========================================================================== */

export const PlaceOrderBar = ({ total = 0, onPlaceOrder, isLoading = false, isDisabled = false }) => {
  const fmt = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 py-3.5 px-4 sm:px-6 shadow-premium select-none">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">

        {/* Main action row */}
        <div className="flex items-center justify-between gap-4">
          {/* Grand Total */}
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Grand Total</span>
            <span className="text-base sm:text-lg font-black text-neutral-950 leading-none">{fmt(total)}</span>
          </div>

          {/* Place Order CTA */}
          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={isLoading || isDisabled}
            className={`flex items-center justify-center gap-2 px-7 sm:px-9 py-3 text-white text-xs font-black rounded-full transition-all shadow-md active:scale-[0.98] ${isLoading || isDisabled ? 'bg-neutral-400 cursor-not-allowed opacity-70' : 'bg-neutral-950 hover:bg-neutral-800 cursor-pointer'}`}
            aria-label="Place your order"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processing…</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>

        {/* Trust micro-row */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 text-[8px] text-gray-400 font-bold border-t border-gray-100/70 pt-2">
          <span className="flex items-center gap-1"><Lock size={8} className="text-[#C5A880]" /> Secure Payment</span>
          <span className="text-gray-200">|</span>
          <span>🛡️ Certified Devices</span>
          <span className="text-gray-200">|</span>
          <span>↩️ Easy Returns</span>
          <span className="text-gray-200">|</span>
          <span>🚚 Fast Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderBar;
