import React from 'react';
import { MapPin, Calendar, Phone } from 'lucide-react';

/* ==========================================================================
   DeliveryCard Component
   - Renders default mock delivery shipping addresses (Slice 2/Delivery)
   - Left: Address markers, name info, street maps
   - Right: "Change Address" trigger button
   - Bottom: Estimated delivery courier schedules
   ========================================================================== */

export const DeliveryCard = ({ address, onOpenAddressChange }) => {
  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4">
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider flex items-center gap-1">
          <MapPin size={14} className="text-[#C5A880]" strokeWidth={2.4} />
          <span>Delivery Details</span>
        </h3>
        
        {/* Change Address button */}
        <button
          type="button"
          onClick={onOpenAddressChange}
          className="text-[10px] sm:text-[11px] font-black text-amber-600 hover:text-amber-700 cursor-pointer"
        >
          Change Address
        </button>
      </div>

      {/* Recipient info & details grid */}
      <div className="flex flex-col gap-2 p-3.5 bg-[#FAF9F6] border border-neutral-100 rounded-2xl">
        <h4 className="text-[12.5px] font-extrabold text-neutral-950 flex items-center gap-2">
          <span>{address.name}</span>
          <span className="text-[9.5px] px-1.5 py-0.5 bg-neutral-200 text-neutral-800 rounded font-bold uppercase tracking-wider">Default</span>
        </h4>

        {/* Address Lines */}
        <p className="text-[11px] sm:text-xs text-gray-500 font-semibold leading-relaxed">
          {address.line1}, {address.line2}
        </p>

        {/* Phone details */}
        <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs text-gray-400 font-semibold mt-0.5">
          <Phone size={11} />
          <span>{address.phone}</span>
        </div>
      </div>

      {/* Estimated Courier calendar delivery */}
      <div className="flex items-center gap-2.5 text-green-600 font-extrabold text-[10.5px] sm:text-xs mt-0.5">
        <Calendar size={14} strokeWidth={2.4} />
        <span>Estimated Delivery: Tomorrow, 18 May</span>
      </div>

    </div>
  );
};

export default DeliveryCard;
