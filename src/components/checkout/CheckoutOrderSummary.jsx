import React from 'react';
import { BadgeCheck, Truck, Tag } from 'lucide-react';

/* ==========================================================================
   CheckoutOrderSummary Component
   - Full price breakdown card for the checkout right column
   - Subtotal / Catalog Discount / Coupon / Delivery / COD Fee / GST / Grand Total
   - Free shipping status indicator
   ========================================================================== */

export const CheckoutOrderSummary = ({
  subtotal = 0,
  originalSubtotal = 0,
  couponDiscount = 0,
  deliveryCharge = 0,
  codFee = 0,
  totalSavings = 0,
  total = 0,
  appliedCouponName = '',
  isFreeShipping = false,
}) => {
  const fmt = (val) => `₹${Number(val).toLocaleString('en-IN')}`;
  const catalogDiscount = originalSubtotal - subtotal;
  const gst = Math.round((total * 18) / 118);

  const rows = [
    { label: 'Bag Subtotal',              value: fmt(subtotal),           color: 'text-neutral-700' },
    catalogDiscount > 0 && { label: 'Device Discounts',         value: `-${fmt(catalogDiscount)}`,  color: 'text-amber-600' },
    couponDiscount > 0  && { label: `Coupon (${appliedCouponName})`, value: `-${fmt(couponDiscount)}`, color: 'text-amber-600',  icon: Tag },
    {
      label: 'Delivery',
      value: deliveryCharge === 0 ? 'FREE' : fmt(deliveryCharge),
      color: deliveryCharge === 0 ? 'text-green-600' : 'text-neutral-700',
    },
    codFee > 0 && { label: 'COD Handling Fee',          value: fmt(codFee),             color: 'text-neutral-700' },
    { label: 'GST (18% Incl.)',           value: fmt(gst),                color: 'text-gray-400',    note: true },
  ].filter(Boolean);

  return (
    <div className="checkout-card flex flex-col gap-4">
      <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3">
        <BadgeCheck size={15} className="text-[#C5A880]" />
        <h2 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">Order Summary</h2>
      </div>

      {/* Free Shipping badge */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9.5px] font-black border ${
        isFreeShipping
          ? 'bg-green-50 border-green-100 text-green-700'
          : 'bg-amber-50 border-amber-100 text-amber-700'
      }`}>
        <Truck size={12} strokeWidth={2.5} />
        {isFreeShipping
          ? '✓ Free Shipping Unlocked on This Order'
          : `Add more items to unlock Free Shipping`}
      </div>

      {/* Price rows */}
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center justify-between text-[11px] font-semibold ${row.color}`}>
            <span className="flex items-center gap-1">
              {row.icon && <row.icon size={10} />}
              {row.label}
              {row.note && <span className="text-[8px] text-gray-400 font-normal">(estimated)</span>}
            </span>
            <span className="font-bold">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-sm font-black text-neutral-950">Grand Total</span>
        <span className="text-sm font-black text-neutral-950">{fmt(total)}</span>
      </div>

      {/* Savings highlight */}
      {totalSavings > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-[10px] font-black text-amber-700 flex items-center gap-1.5">
          <BadgeCheck size={12} strokeWidth={2.5} />
          You save {fmt(totalSavings)} on this order 🎉
        </div>
      )}
    </div>
  );
};

export default CheckoutOrderSummary;
