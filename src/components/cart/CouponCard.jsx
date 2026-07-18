import React, { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';

/* ==========================================================================
   CouponCard Component
   - Input bar to enter coupon promo codes
   - Validates codes: WELCOME10, SAVE500, FIRSTBUY
   - Renders available coupons for click-to-apply speed
   - Displays active applied coupon tags
   ========================================================================== */

export const CouponCard = ({ appliedCoupon, onApply, onRemove, error = '' }) => {
  const [inputText, setInputText] = useState('');

  // Available promotions to suggest
  const activeOffers = [
    { code: 'WELCOME10', desc: '10% OFF on all items', value: 10, type: 'percent' },
    { code: 'SAVE500', desc: 'Save flat ₹500', value: 500, type: 'flat' },
    { code: 'FIRSTBUY', desc: '15% OFF on first buy', value: 15, type: 'percent' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Run validation checks
    const matched = activeOffers.find(off => off.code.toUpperCase() === inputText.trim().toUpperCase());
    
    if (matched) {
      onApply(matched);
      setInputText('');
    } else {
      onApply(null, 'Invalid coupon code. Try WELCOME10, SAVE500, or FIRSTBUY.');
    }
  };

  const handleSuggestClick = (offer) => {
    onApply(offer);
  };

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider pb-2 border-b border-gray-100">
        Coupons & Promos
      </h3>

      {/* Form submit input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value.toUpperCase())}
            placeholder="Enter Coupon Code"
            className="w-full bg-[#ECEFF2]/50 focus:bg-white text-[11px] sm:text-xs text-neutral-800 placeholder-gray-400 border border-neutral-200/20 focus:border-gold-accent pl-8.5 pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all"
            aria-label="Enter coupon promo code"
          />
          <Tag className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-3.5 h-3.5" />
        </div>
        <button
          type="submit"
          className="px-5 py-2 sm:py-2.5 text-[10.5px] sm:text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
        >
          Apply
        </button>
      </form>

      {/* Applied Coupon label tag */}
      {appliedCoupon && (
        <div className="flex items-center justify-between bg-green-50 border border-green-150/45 rounded-xl p-3.5 animate-fade-in">
          <div className="flex items-center gap-2 text-[11.5px] font-extrabold text-green-700">
            <Check size={14} strokeWidth={2.4} />
            <span>Code Applied: {appliedCoupon.code}</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-full hover:bg-green-100 text-green-700 cursor-pointer"
            aria-label="Remove applied coupon"
          >
            <X size={14} strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* Error alert label */}
      {error && (
        <p className="text-[10px] text-red-500 font-extrabold -mt-1 leading-normal">
          {error}
        </p>
      )}

      {/* Suggested promotions grid */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="text-[10px] sm:text-[11px] font-black text-neutral-900 uppercase tracking-wide">
          Available Offers
        </span>
        <div className="flex flex-col gap-2">
          {activeOffers.map((off) => {
            const isApplied = appliedCoupon?.code === off.code;
            
            return (
              <button
                key={off.code}
                type="button"
                onClick={() => handleSuggestClick(off)}
                className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isApplied
                    ? 'border-green-300 bg-green-50/20'
                    : 'border-gray-150/60 bg-[#FAF9F6]/30 hover:bg-white hover:border-neutral-400'
                }`}
                aria-label={`Apply code ${off.code}`}
              >
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-black text-neutral-950">{off.code}</span>
                  <span className="text-[9.5px] sm:text-[10px] text-gray-400 font-bold leading-none mt-0.5">{off.desc}</span>
                </div>
                <span className="text-[9.5px] font-extrabold text-amber-600 uppercase">
                  {isApplied ? 'Applied' : 'Apply'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CouponCard;
