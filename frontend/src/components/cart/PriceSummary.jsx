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
