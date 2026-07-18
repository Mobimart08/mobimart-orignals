import React from 'react';
import { MapPin, Plus, CheckCircle2, Edit2 } from 'lucide-react';

/* ==========================================================================
   AddressSection Component
   - Renders the selected delivery address card
   - Change / Add New buttons open the CheckoutAddressDrawer
   ========================================================================== */

export const AddressSection = ({ address, onChangeAddress, onAddNew }) => {
  if (!address) {
    return (
      <div className="checkout-card flex flex-col gap-3">
        <SectionTitle icon={<MapPin size={15} className="text-[#C5A880]" />} title="Delivery Address" />
        <div className="text-center py-6">
          <p className="text-xs text-gray-400 font-bold mb-4">No address saved. Add one to continue.</p>
          <button onClick={onAddNew} className="checkout-btn-secondary flex items-center gap-1.5 mx-auto">
            <Plus size={13} /> Add New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<MapPin size={15} className="text-[#C5A880]" />} title="Delivery Address" />
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onChangeAddress}
            className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <Edit2 size={10} /> Change
          </button>
          <span className="text-gray-200 text-xs">|</span>
          <button
            onClick={onAddNew}
            className="text-[10px] font-black text-[#C5A880] hover:text-amber-600 flex items-center gap-1 cursor-pointer"
          >
            <Plus size={10} /> Add New
          </button>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-[#FAF9F6] border border-neutral-100 rounded-2xl p-4 flex gap-3">
        {/* Pin icon circle */}
        <div className="w-8 h-8 rounded-full bg-[#C5A880]/10 flex items-center justify-center shrink-0 mt-0.5">
          <MapPin size={14} className="text-[#C5A880]" strokeWidth={2.4} />
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          {/* Name + Default badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-neutral-950">{address.name}</span>
            <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[8px] font-black rounded-full border border-green-100">
              DEFAULT
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-semibold">{address.phone}</span>
          <span className="text-[11px] text-neutral-700 font-semibold mt-1 leading-relaxed">
            {address.address && `${address.address}, `}
            {address.city && `${address.city}, `}
            {address.state && `${address.state}`}
            {address.pin && ` - ${address.pin}`}
            {/* Fallback for cart-style address */}
            {!address.address && address.line1 && `${address.line1}, ${address.line2}`}
          </span>
        </div>

        {/* Selected check */}
        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" strokeWidth={2.5} />
      </div>
    </div>
  );
};

/* Small helper for consistent section labels */
const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <h2 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">{title}</h2>
  </div>
);

export default AddressSection;
