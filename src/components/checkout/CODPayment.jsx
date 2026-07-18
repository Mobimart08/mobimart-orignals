import React from 'react';
import { Package, AlertCircle } from 'lucide-react';

/* ==========================================================================
   CODPayment Component
   - Cash on Delivery info card with ₹49 handling fee notice
   ========================================================================== */

export const CODPayment = ({ codFee = 49 }) => (
  <div className="flex flex-col gap-3 pt-1">
    {/* Availability notice */}
    <div className="flex items-start gap-3 p-3.5 bg-green-50 border border-green-100 rounded-2xl">
      <Package size={18} className="text-green-600 shrink-0 mt-0.5" strokeWidth={2.2} />
      <div>
        <p className="text-[11px] font-black text-green-800">COD Available for This Order</p>
        <p className="text-[9.5px] text-green-700 font-semibold mt-0.5">Pay with cash when your package arrives at your doorstep. No prepayment needed.</p>
      </div>
    </div>

    {/* Fee notice */}
    <div className="flex items-start gap-3 p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
      <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" strokeWidth={2.2} />
      <div>
        <p className="text-[10px] font-black text-amber-800">COD Handling Fee: ₹{codFee}</p>
        <p className="text-[9.5px] text-amber-700 font-semibold mt-0.5">A small cash handling charge of ₹{codFee} is added for COD orders. This will be collected along with the product payment at delivery.</p>
      </div>
    </div>
  </div>
);

export default CODPayment;
