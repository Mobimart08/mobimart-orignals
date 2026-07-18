import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home } from 'lucide-react';

/* ==========================================================================
   AddressDrawer Component
   - Slide-up bottom sheet drawer to edit shipping address details
   - Houses form fields with custom icons: Name, Phone, Line 1, Line 2
   - Replaces crude browser prompt boxes with high-fidelity UI inputs
   ========================================================================== */

export const AddressDrawer = ({ isOpen, onClose, address, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [errors, setErrors] = useState({});

  // Sync state with parent address when drawer opens
  useEffect(() => {
    if (address) {
      setName(address.name || '');
      setPhone(address.phone || '');
      setLine1(address.line1 || '');
      setLine2(address.line2 || '');
      setErrors({});
    }
  }, [isOpen, address]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation checks
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!line1.trim()) newErrors.line1 = 'Address Line 1 is required';
    if (!line2.trim()) newErrors.line2 = 'Address Line 2 is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ name, phone, line1, line2 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1.5px] transition-opacity duration-300 animate-fade-in"
        aria-hidden="true"
      ></div>

      {/* Drawer Body Sheet */}
      <div className="bg-white w-full max-w-md rounded-t-[28px] shadow-premium relative z-10 flex flex-col max-h-[85vh] transition-transform duration-300 transform translate-y-0 animate-slide-up pb-safe-bottom border-t border-gray-100">
        
        {/* Drag handle decoration */}
        <div className="w-10 h-1 bg-gray-250 rounded-full mx-auto my-3 shrink-0 cursor-pointer" onClick={onClose}></div>

        {/* Header Title */}
        <div className="flex items-center justify-between px-5 pb-3.5 border-b border-gray-100">
          <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 flex items-center gap-1.5">
            <MapPin size={16} className="text-[#C5A880]" strokeWidth={2.4} />
            <span>Change Shipping Address</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-neutral-800 hover:bg-neutral-100 transition-all cursor-pointer"
            aria-label="Close address drawer"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Form scroll container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar flex flex-col gap-4 text-left">
          
          {/* Recipient Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">
              Recipient Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className={`w-full bg-[#ECEFF2]/40 focus:bg-white text-[11px] sm:text-xs text-neutral-850 placeholder-gray-400 border ${
                  errors.name ? 'border-red-500' : 'border-neutral-200/20'
                } focus:border-gold-accent pl-8.5 pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all`}
              />
              <User className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-3.5 h-3.5" />
            </div>
            {errors.name && <span className="text-[9px] text-red-500 font-extrabold">{errors.name}</span>}
          </div>

          {/* Contact Phone Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">
              Contact Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Phone Number"
                className={`w-full bg-[#ECEFF2]/40 focus:bg-white text-[11px] sm:text-xs text-neutral-850 placeholder-gray-400 border ${
                  errors.phone ? 'border-red-500' : 'border-neutral-200/20'
                } focus:border-gold-accent pl-8.5 pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all`}
              />
              <Phone className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-3.5 h-3.5" />
            </div>
            {errors.phone && <span className="text-[9px] text-red-500 font-extrabold">{errors.phone}</span>}
          </div>

          {/* Address Line 1 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">
              Flat, House No., Building
            </label>
            <div className="relative">
              <input
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Flat / Building details"
                className={`w-full bg-[#ECEFF2]/40 focus:bg-white text-[11px] sm:text-xs text-neutral-855 placeholder-gray-400 border ${
                  errors.line1 ? 'border-red-500' : 'border-neutral-200/20'
                } focus:border-gold-accent pl-8.5 pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all`}
              />
              <Home className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-3.5 h-3.5" />
            </div>
            {errors.line1 && <span className="text-[9px] text-red-500 font-extrabold">{errors.line1}</span>}
          </div>

          {/* Address Line 2 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">
              Road, Area, City, Pin Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="City, State & ZIP code"
                className={`w-full bg-[#ECEFF2]/40 focus:bg-white text-[11px] sm:text-xs text-neutral-855 placeholder-gray-400 border ${
                  errors.line2 ? 'border-red-500' : 'border-neutral-200/20'
                } focus:border-gold-accent pl-8.5 pr-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all`}
              />
              <MapPin className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-3.5 h-3.5" />
            </div>
            {errors.line2 && <span className="text-[9px] text-red-500 font-extrabold">{errors.line2}</span>}
          </div>

          {/* Action Save CTA */}
          <button
            type="submit"
            className="w-full py-3.5 text-xs font-black text-white bg-neutral-950 hover:bg-neutral-850 rounded-full transition-all cursor-pointer shadow-md select-none mt-4.5 text-center active:scale-98"
          >
            Save Address
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddressDrawer;
