import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   CheckoutHeader Component
   - Sticky top header replacing the global Navbar on /checkout
   - Back arrow routes to /cart
   - Lock badge signals secure checkout context
   ========================================================================== */

export const CheckoutHeader = ({ step = 1 }) => {
  const navigate = useNavigate();

  const steps = ['Address', 'Payment', 'Review'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 select-none">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 p-2 -ml-2 rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 transition-all cursor-pointer"
          aria-label="Back to cart"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Back</span>
        </button>

        {/* Centre: Title */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xs sm:text-sm font-black text-neutral-950 leading-none">Checkout</h1>
          <span className="flex items-center gap-1 text-[9px] text-gray-400 font-bold mt-0.5">
            <Lock size={8} className="text-[#C5A880]" strokeWidth={2.5} />
            Secure Checkout
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {steps.map((label, i) => {
            const idx = i + 1;
            const active = idx === step;
            const done = idx < step;
            return (
              <React.Fragment key={label}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-100 text-gray-400'
                }`}>
                  {done ? '✓' : idx}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-4 h-px ${done ? 'bg-green-400' : 'bg-neutral-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </header>
  );
};

export default CheckoutHeader;
