import React, { useState } from 'react';
import { Tag, X, Check, Sparkles } from 'lucide-react';
import ComingSoonBottomSheet from '../ui/ComingSoonBottomSheet';

/* ==========================================================================
   CouponCard Component
   - Triggers Coming Soon Bottom Sheet on coupon apply / offers interaction
   ========================================================================== */

export const CouponCard = ({ appliedCoupon, onApply, onRemove, error = '' }) => {
  const [inputText, setInputText] = useState('');
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const activeOffers = [
    { code: 'WELCOME10', desc: '10% OFF on all items', value: 10, type: 'percent' },
    { code: 'SAVE500', desc: 'Save flat ₹500', value: 500, type: 'flat' },
    { code: 'FIRSTBUY', desc: '15% OFF on first buy', value: 15, type: 'percent' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsComingSoonOpen(true);
  };

  const handleSuggestClick = () => {
    setIsComingSoonOpen(true);
  };

  return (
    <>
      <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
            Coupons & Promos
          </h3>
          <span className="text-[9.5px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 flex items-center gap-1">
            <Sparkles size={10} />
            <span>Coming Soon</span>
          </span>
        </div>

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

        {/* Coming Soon Empty State */}
        <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center bg-[#FAF9F6] border border-gray-150/60 rounded-xl p-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2.5 border border-amber-100">
            <Sparkles size={18} className="text-amber-500" />
          </div>
          <span className="text-[11px] font-black text-neutral-900 uppercase tracking-wide">
            Coupons Coming Soon
          </span>
          <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-bold leading-relaxed mt-1.5 max-w-[200px]">
            We are working on bringing you exclusive deals and promo codes. Stay tuned!
          </p>
        </div>

      </div>

      <ComingSoonBottomSheet 
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        title="Coupons & Offers Coming Soon"
        featureName="Promo coupon code system"
      />
    </>
  );
};

export default CouponCard;
