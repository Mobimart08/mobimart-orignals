import React from 'react';
import { MapPin, Plus, CheckCircle2, Edit2 } from 'lucide-react';

/* ==========================================================================
   AddressSection Component
   - Renders the selected delivery address card
   - Change / Add New buttons open the CheckoutAddressDrawer
   ========================================================================== */

export const AddressSection = ({ addresses = [], selectedAddressId, onSelectAddress, onEditAddress, onAddNew }) => {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="checkout-card flex flex-col gap-3">
        <SectionTitle icon={<MapPin size={15} className="text-[#C5A880]" />} title="Delivery Address" />
        <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-xs text-gray-400 font-bold mb-4">No address saved. Add one to continue.</p>
          <button onClick={onAddNew} className="checkout-btn-secondary flex items-center gap-1.5 mx-auto px-4 py-2 bg-white rounded-lg border text-xs font-bold text-gray-700 shadow-sm">
            <Plus size={13} /> Add New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<MapPin size={15} className="text-[#C5A880]" />} title="Select Delivery Address" />
        <button
          onClick={onAddNew}
          className="text-[10px] font-black text-[#C5A880] hover:text-amber-600 flex items-center gap-1 cursor-pointer"
        >
          <Plus size={10} /> Add New
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr._id;
          
          return (
            <div 
              key={addr._id} 
              onClick={() => onSelectAddress(addr)}
              className={`border rounded-2xl p-4 flex gap-3 cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-[#FAF9F6] border-[#C5A880] shadow-sm' 
                  : 'bg-white border-neutral-100 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'bg-[#C5A880]/10' : 'bg-gray-50'}`}>
                <MapPin size={14} className={isSelected ? 'text-[#C5A880]' : 'text-gray-400'} strokeWidth={2.4} />
              </div>

              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-neutral-950">{addr.name}</span>
                  {addr.label && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[8px] font-black rounded-full border border-gray-200">
                      {addr.label.toUpperCase()}
                    </span>
                  )}
                  {addr.isDefault && (
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[8px] font-black rounded-full border border-green-100">
                      DEFAULT
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-semibold">{addr.phone}</span>
                <span className="text-[11px] text-neutral-700 font-semibold mt-1 leading-relaxed">
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                  {addr.landmark && `, Near ${addr.landmark}`}
                  <br/>
                  {addr.city}, {addr.state} - {addr.pinCode}
                </span>
                
                {/* Actions */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditAddress(addr); }}
                    className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                </div>
              </div>

              <div className="shrink-0 mt-0.5">
                {isSelected ? (
                  <CheckCircle2 size={18} className="text-green-500" strokeWidth={2.5} />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200" />
                )}
              </div>
            </div>
          );
        })}
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
