import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit3, Home, Briefcase, Landmark } from 'lucide-react';
import CheckoutAddressDrawer from '../checkout/CheckoutAddressDrawer';

/* ==========================================================================
   SavedAddresses Component
   - Manages user shipping addresses stored in local storage
   - Add Address / Edit Address opens the CheckoutAddressDrawer bottom sheet
   - Supports: Delete Address, Set Default Address
   ========================================================================== */

const TAG_ICONS = {
  Home: Home,
  Work: Briefcase,
  Other: Landmark
};

export const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Load addresses on mount
  useEffect(() => {
    const saved = localStorage.getItem('mobimart_saved_addresses');
    if (saved) {
      setAddresses(JSON.parse(saved));
    } else {
      const defaultList = [
        {
          id: '1',
          tag: 'Home',
          name: 'Hitansh Sharma',
          phone: '+91 98765 43210',
          pin: '201301',
          address: 'B-405, Premium Heights, Sector 62',
          city: 'Noida',
          state: 'Uttar Pradesh',
          isDefault: true,
        },
        {
          id: '2',
          tag: 'Work',
          name: 'Hitansh Sharma',
          phone: '+91 98765 43210',
          pin: '110001',
          address: '9th Floor, Cyber Plaza, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          isDefault: false,
        }
      ];
      setAddresses(defaultList);
      localStorage.setItem('mobimart_saved_addresses', JSON.stringify(defaultList));
    }
  }, []);

  // Save updates to localStorage
  const saveAddresses = (newList) => {
    setAddresses(newList);
    localStorage.setItem('mobimart_saved_addresses', JSON.stringify(newList));
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updated);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = addresses.filter(addr => addr.id !== id);
    // If we deleted the default address, set first remaining as default
    if (addresses.find(a => a.id === id)?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
  };

  const handleEdit = (addr, e) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsDrawerOpen(true);
  };

  const handleDrawerSave = (formData) => {
    if (editingAddress) {
      // Editing existing address
      const updated = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...formData } : addr
      );
      saveAddresses(updated);
    } else {
      // Creating new address
      const newAddr = {
        ...formData,
        id: Date.now().toString(),
        tag: addresses.length === 0 ? 'Home' : 'Other', // default fallback tags
        isDefault: addresses.length === 0, // make default if only address
      };
      saveAddresses([...addresses, newAddr]);
    }
  };

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      
      {/* Title with add button */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={14} className="text-[#C5A880]" strokeWidth={2.4} />
          <span>Saved Addresses</span>
        </h3>
        
        <button
          type="button"
          onClick={handleAddNew}
          className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
        >
          <Plus size={11} strokeWidth={2.5} />
          Add Address
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {addresses.map((addr) => {
          const TagIcon = TAG_ICONS[addr.tag] || Home;
          return (
            <div 
              key={addr.id}
              onClick={() => handleSetDefault(addr.id)}
              className={`p-4 rounded-3xl border text-left shadow-soft-ui flex gap-3 transition-all cursor-pointer relative ${
                addr.isDefault 
                  ? 'border-[#C5A880]/30 bg-[#C5A880]/5 shadow-sm' 
                  : 'bg-white border-neutral-100 hover:border-neutral-300'
              }`}
            >
              {/* Tag circular icon */}
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                <TagIcon size={13} className="text-[#C5A880]" strokeWidth={2.2} />
              </div>

              {/* Address details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-neutral-950">
                    {addr.tag || 'Address'}
                  </span>
                  {addr.isDefault && (
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[8px] font-black rounded border border-green-150/40 tracking-wider">
                      DEFAULT
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-bold text-neutral-850 mt-1 leading-none">
                  {addr.name}
                </p>
                <p className="text-[9.5px] text-gray-400 font-bold mt-0.5">
                  {addr.phone}
                </p>
                <p className="text-[10.5px] text-gray-500 font-semibold leading-relaxed mt-1.5">
                  {addr.address}, {addr.city}, {addr.state} - {addr.pin}
                </p>

                {/* Edit & Delete Action row */}
                <div className="flex items-center gap-3 border-t border-gray-100/50 pt-2.5 mt-2.5 text-[9.5px] font-bold text-gray-400">
                  <button 
                    type="button"
                    onClick={(e) => handleEdit(addr, e)}
                    className="hover:text-[#C5A880] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={10} />
                    Edit
                  </button>
                  <span>|</span>
                  <button 
                    type="button"
                    onClick={(e) => handleDelete(addr, e)}
                    className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={10} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Drawer */}
      <CheckoutAddressDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editAddress={editingAddress}
        onSave={handleDrawerSave}
      />

    </div>
  );
};

export default SavedAddresses;
