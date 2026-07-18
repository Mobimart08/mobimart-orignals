import React from 'react';
import { CheckCircle, Calendar, ArrowRight, Truck } from 'lucide-react';

/* ==========================================================================
   CheckoutSuccessModal Component
   - Renders a luxury order success overlay modal
   - Replaces crude browser alert boxes when checking out
   - Left: Checked circles
   - Bottom: Core order recap (grand totals, courier estimates)
   - CTA Action: Clicking clears the cart and returns users to store
   ========================================================================== */

export const CheckoutSuccessModal = ({ isOpen, onClose, total = 0, address }) => {
  if (!isOpen) return null;

  const formatVal = (val) => `₹${Number(val).toLocaleString('en-IN')}`;
  const mockTrackingNumber = `MM-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] transition-opacity duration-300 animate-fade-in"
        aria-hidden="true"
      ></div>

      {/* Modal card box */}
      <div className="bg-white w-full max-w-sm rounded-[32px] p-6 sm:p-7 shadow-premium relative z-10 flex flex-col items-center text-center transition-all duration-300 animate-scale-up border border-gray-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Checked Circle Badge */}
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 mb-5 relative shrink-0">
          <CheckCircle size={32} className="text-green-600" strokeWidth={2.4} />
        </div>

        {/* Text descriptions */}
        <h3 className="text-lg font-black text-neutral-950 mb-1.5 leading-tight">
          Order Placed Successfully!
        </h3>
        
        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-5">
          Tracking ID: {mockTrackingNumber}
        </p>

        {/* Order recap box */}
        <div className="w-full bg-[#FAF9F6] border border-neutral-100 rounded-2xl p-4 text-left flex flex-col gap-3 mb-6">
          <h4 className="text-[10px] font-black text-neutral-950 uppercase tracking-widest border-b border-gray-200/50 pb-1.5 mb-0.5">
            Order Receipt Recap
          </h4>
          
          {/* Recipient info */}
          <div className="flex flex-col text-[11px] font-semibold text-gray-500">
            <span className="text-neutral-950 font-black mb-0.5">{address.name}</span>
            <span>{address.line1}</span>
            <span>{address.line2}</span>
          </div>

          {/* Delivery estimate */}
          <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 border-t border-gray-200/40 pt-2.5">
            <Truck size={12} strokeWidth={2.4} />
            <span>Delivery: Tomorrow, 18 May</span>
          </div>

          {/* Pricing totals */}
          <div className="flex items-center justify-between border-t border-gray-200/40 pt-2.5 mt-0.5 text-xs font-black text-neutral-950">
            <span>Amount Paid</span>
            <span>{formatVal(total)}</span>
          </div>
        </div>

        {/* Actions return to store button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 text-xs font-black text-white bg-neutral-950 hover:bg-neutral-850 rounded-full transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5 active:scale-98"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={13} />
        </button>

      </div>
    </div>
  );
};

export default CheckoutSuccessModal;
