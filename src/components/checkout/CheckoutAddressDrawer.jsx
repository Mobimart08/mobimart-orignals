import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home } from 'lucide-react';

/* ==========================================================================
   CheckoutAddressDrawer Component
   - Slide-up bottom sheet for adding / editing a delivery address
   - Reuses the same design language as AddressDrawer in the cart flow
   - Saves to local storage under 'mobimart_addresses'
   ========================================================================== */

export const CheckoutAddressDrawer = ({ isOpen, onClose, editAddress = null, onSave }) => {
  const [form, setForm] = useState({ name: '', phone: '', pin: '', address: '', city: '', state: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(editAddress || { name: '', phone: '', pin: '', address: '', city: '', state: '' });
      setErrors({});
    }
  }, [isOpen, editAddress]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter valid 10-digit phone';
    if (!/^\d{6}$/.test(form.pin.trim())) e.pin = 'Enter valid 6-digit PIN code';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
    onClose();
  };

  const fields = [
    { key: 'name',    label: 'Full Name',           icon: User,   placeholder: 'Hitansh Sharma',       type: 'text' },
    { key: 'phone',   label: 'Phone Number',         icon: Phone,  placeholder: '+91 98765 43210',      type: 'tel' },
    { key: 'address', label: 'Flat / Building / Road',icon: Home,  placeholder: 'B-405, Premium Heights', type: 'text' },
    { key: 'pin',     label: 'PIN Code',             icon: MapPin, placeholder: '201301',               type: 'text' },
    { key: 'city',    label: 'City',                 icon: MapPin, placeholder: 'Noida',                type: 'text' },
    { key: 'state',   label: 'State',                icon: MapPin, placeholder: 'Uttar Pradesh',        type: 'text' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1.5px]" />

      {/* Sheet */}
      <div className="bg-white w-full max-w-md rounded-t-[28px] shadow-premium relative z-10 flex flex-col max-h-[90vh] border-t border-gray-100">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1 cursor-pointer shrink-0" onClick={onClose} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-sm font-extrabold text-neutral-950 flex items-center gap-1.5">
            <MapPin size={15} className="text-[#C5A880]" strokeWidth={2.4} />
            {editAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 no-scrollbar">
          {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type={type}
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className={`w-full pl-9 pr-4 py-2.5 text-xs text-neutral-850 bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-all ${
                    errors[key] ? 'border-red-400 bg-red-50' : 'border-neutral-200 focus:border-[#C5A880]'
                  }`}
                />
              </div>
              {errors[key] && <span className="text-[9px] text-red-500 font-bold">{errors[key]}</span>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3.5 mt-2 text-xs font-black text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all cursor-pointer shadow-md active:scale-[0.98]"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutAddressDrawer;
