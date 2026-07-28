import React from 'react';
import { BadgeCheck, Truck } from 'lucide-react';

/* ==========================================================================
   PriceSummary Component
   - Renders order pricing breakdowns (Subtotal, Coupon cuts, Shipping, GST, Totals)
   - Displays the dynamic Free Shipping Progress Bar (₹1,00,000 threshold)
   - Displays the premium gold Savings Card if discounts apply
   ========================================================================== */

export const PriceSummary = ({ 
  subtotal = 0, 
  originalSubtotal = 0, 
  couponDiscount = 0, 
  shippingCharge = 99, 
  totalSavings = 0,
  total = 0,
  appliedCouponName = ''
}) => {
  // Free shipping parameters
  const threshold = 100000;
  const isFreeShipping = subtotal >= threshold;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const diffToFree = Math.max(0, threshold - subtotal);

  // Format currency helpers
  const formatVal = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4.5">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider pb-2 border-b border-gray-100">
        Order Summary
      </h3>

      {/* 1. Free Shipping Progress Section */}
      <div className="flex flex-col gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-100 shadow-sm relative overflow-hidden">
        {/* Glow effect if free shipping unlocked */}
        {isFreeShipping && <div className="absolute inset-0 bg-green-50/30"></div>}
        
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-extrabold text-neutral-900 relative z-10">
          <span className="flex items-center gap-1.5">
            <Truck size={15} className={isFreeShipping ? "text-green-600" : "text-[#C5A880]"} strokeWidth={2.4} />
            <span>Free Shipping</span>
          </span>
          <span className={isFreeShipping ? "text-green-600" : "text-gray-400"}>
            {isFreeShipping ? 'Unlocked' : `${progressPercent}%`}
          </span>
        </div>

        {/* Premium Progress track */}
        <div className="w-full h-2.5 bg-neutral-200/50 rounded-full overflow-hidden relative z-10 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
              isFreeShipping 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : 'bg-gradient-to-r from-[#C5A880] to-[#E3CBA8]'
            }`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 inset-x-0 h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>

        {/* Dynamic tagline */}
        <p className={`text-[10px] sm:text-[11px] font-black mt-1 flex items-center gap-1.5 relative z-10 ${
          isFreeShipping ? 'text-green-700' : 'text-neutral-600'
        }`}>
          {isFreeShipping ? (
            <span>✓ Congratulations! You have unlocked Free Shipping.</span>
          ) : (
            <span>Add <span className="text-amber-600">{formatVal(diffToFree)}</span> more to unlock Free Shipping.</span>
          )}
        </p>
      </div>

      {/* 2. Total Savings Highlight Card */}
      {totalSavings > 0 && (
        <div className="bg-amber-50/65 border border-amber-250/20 rounded-2xl p-3.5 flex items-start gap-2.5">
          <BadgeCheck size={18} className="text-amber-600 shrink-0 mt-0.5" strokeWidth={2.4} />
          <div>
            <h4 className="text-[11.5px] font-extrabold text-amber-900 leading-none">
              You Saved {formatVal(totalSavings)}
            </h4>
            <p className="text-[9.5px] sm:text-[10px] text-amber-700/80 font-bold leading-normal mt-0.5">
              Awesome! You saved on this order through premium device catalog discounts and active coupon codes.
            </p>
          </div>
        </div>
      )}

      {/* 3. Detailed Prices list */}
      <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-semibold border-b border-gray-100 pb-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span>Bag Subtotal</span>
          <span className="text-neutral-900 font-extrabold">{formatVal(subtotal)}</span>
        </div>

        {/* Catalog Discount */}
        {originalSubtotal - subtotal > 0 && (
          <div className="flex items-center justify-between text-amber-600">
            <span>Device Discounts</span>
            <span>-{formatVal(originalSubtotal - subtotal)}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-amber-600">
            <span>Coupon Promo ({appliedCouponName})</span>
            <span>-{formatVal(couponDiscount)}</span>
          </div>
        )}

        {/* Delivery Charge */}
        <div className="flex items-center justify-between">
          <span>Delivery Charge</span>
          <span className={shippingCharge === 0 ? 'text-green-600 font-bold' : 'text-neutral-900 font-extrabold'}>
            {shippingCharge === 0 ? 'FREE' : formatVal(shippingCharge)}
          </span>
        </div>

        {/* Estimated Tax (GST at 18% included in prices) */}
        <div className="flex items-center justify-between text-gray-400">
          <span>Estimated GST (18% Incl.)</span>
          <span>{formatVal(Math.round((total * 18) / 118))}</span>
        </div>
      </div>

      {/* 4. Final Total Row */}
      <div className="flex items-center justify-between text-sm sm:text-base font-black text-neutral-950">
        <span>Order Total</span>
        <span>{formatVal(total)}</span>
      </div>

    </div>
  );
};

export default PriceSummary;
