import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, MapPin, User, Phone, Home, Building, Map, Loader2, Check } from 'lucide-react';
import { useAddressAutocomplete } from '../../hooks/useAddressAutocomplete';

/* ==========================================================================
   CheckoutAddressModal Component
   - Center modal with backdrop blur for address entry
   - Includes Smart Autocomplete (Nominatim) and PIN code auto-fill
   - Keyboard accessible and premium design
   ========================================================================== */

export const CheckoutAddressModal = ({ isOpen, onClose, editAddress = null, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    altPhone: '',
    house: '',
    street: '',
    landmark: '',
    pin: '',
    city: '',
    state: '',
    country: 'India',
    addressType: 'Home',
    isDefault: false
  });
  
  const [errors, setErrors] = useState({});
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);
  const dropdownRef = useRef(null);
  const firstInputRef = useRef(null);

  const {
    query,
    setQuery,
    suggestions,
    loading,
    showDropdown,
    setShowDropdown,
    fetchSuggestions,
    fetchPincodeDetails,
    clearSuggestions,
  } = useAddressAutocomplete();

  useEffect(() => {
    if (isOpen) {
      if (editAddress) {
        // Parse backend schema format into frontend form state
        const addrParts = (editAddress.addressLine1 || '').split(',').map(s => s.trim());
        const house = addrParts[0] || '';
        const street = addrParts.slice(1).join(', ') || '';

        setForm({
          _id: editAddress._id,
          name: editAddress.name || '',
          phone: editAddress.phone || '',
          altPhone: '', 
          house: house,
          street: street,
          landmark: editAddress.addressLine2 || '',
          pin: editAddress.pinCode || '',
          city: editAddress.city || '',
          state: editAddress.state || '',
          country: 'India',
          addressType: editAddress.label || 'Home',
          isDefault: !!editAddress.isDefault
        });
      } else {
        setForm({
          name: '', phone: '', altPhone: '', house: '', street: '',
          landmark: '', pin: '', city: '', state: '', country: 'India',
          addressType: 'Home', isDefault: false
        });
      }
      setErrors({});
      clearSuggestions();
      setQuery('');
      setIsDirty(false);
      
      // Auto-focus first input
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
      
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editAddress]);

  const handleCloseRequest = useCallback(() => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setIsDirty(false);
        onClose();
      }
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleCloseRequest();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCloseRequest]);

  // Auto-fill city/state when PIN is typed
  useEffect(() => {
    if (form.pin && form.pin.length === 6) {
      const getDetails = async () => {
        const details = await fetchPincodeDetails(form.pin);
        if (details) {
          setForm((prev) => {
            if (prev.city === (details.city || prev.city) && prev.state === (details.state || prev.state)) {
              return prev; // Avoid unnecessary re-render if data is the same
            }
            return {
              ...prev,
              city: details.city || prev.city,
              state: details.state || prev.state,
              country: details.country || prev.country
            };
          });
        }
      };
      getDetails();
    }
  }, [form.pin, fetchPincodeDetails]);

  if (!isOpen) return null;

  const setField = (key) => (e) => {
    let val = e.target.value;
    
    if (key === 'phone' || key === 'altPhone' || key === 'pin') {
      val = val.replace(/\D/g, ''); // Digits only
      if (key === 'pin') val = val.slice(0, 6);
      else val = val.slice(0, 10);
    }
    
    if (key === 'name') {
      val = val.replace(/[^a-zA-Z\s-]/g, ''); // Letters, spaces, hyphens only
    }

    setForm((f) => ({ ...f, [key]: val }));
    setIsDirty(true);
    if (errors[key]) setErrors((errs) => ({ ...errs, [key]: null }));
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
    setActiveSuggestionIndex(-1);
  };

  const selectSuggestion = (suggestion) => {
    setForm((f) => ({
      ...f,
      city: suggestion.city || f.city,
      state: suggestion.state || f.state,
      country: suggestion.country || f.country,
      pin: suggestion.postalCode || f.pin,
    }));
    setIsDirty(true);
    setQuery(suggestion.label);
    clearSuggestions();
  };

  const handleSearchKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestionIndex]);
    } else if (e.key === 'Escape') {
      clearSuggestions();
    }
  };

  const validate = () => {
    const e = {};
    if (!String(form.name || '').trim()) e.name = 'Name is required';
    if (!/^\d{10}$/.test(String(form.phone || ''))) e.phone = 'Please enter a valid 10-digit mobile number';
    if (form.altPhone && !/^\d{10}$/.test(String(form.altPhone || ''))) e.altPhone = 'Please enter a valid 10-digit mobile number';
    if (!String(form.house || '').trim()) e.house = 'House/Flat is required';
    if (!String(form.street || '').trim()) e.street = 'Street is required';
    if (!/^\d{6}$/.test(String(form.pin || ''))) e.pin = 'Valid 6-digit PIN required';
    if (!String(form.city || '').trim()) e.city = 'City is required';
    if (!String(form.state || '').trim()) e.state = 'State is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    
    // Map frontend form state strictly to backend schema requirements
    onSave({
      _id: form._id,
      label: form.addressType,
      name: form.name,
      phone: form.phone,
      addressLine1: `${form.house}, ${form.street}`,
      addressLine2: form.landmark || undefined,
      city: form.city,
      state: form.state,
      pinCode: String(form.pin || '').replace(/\s/g, ''),
      isDefault: form.isDefault,
    });
    setIsDirty(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div 
        onClick={handleCloseRequest} 
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="bg-white w-[calc(100vw-24px)] sm:w-[90%] md:w-full md:max-w-[700px] mt-4 sm:mt-6 md:mt-12 rounded-[20px] shadow-2xl relative z-10 flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 border-b border-gray-100 bg-white shrink-0">
          <h2 className="text-base font-extrabold text-neutral-950 flex items-center gap-2">
            <MapPin size={18} className="text-[#C5A880]" strokeWidth={2.4} />
            {editAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button 
            onClick={handleCloseRequest} 
            className="p-2 rounded-full text-gray-400 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto px-5 md:px-8 py-5 md:py-6 flex flex-col gap-5 md:gap-6 no-scrollbar bg-neutral-50/30">
          
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={firstInputRef}
                  type="text"
                  value={form.name}
                  onChange={setField('name')}
                  placeholder="Hitansh Sharma"
                  className={`w-full pl-10 pr-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder="10-digit number"
                  className={`w-full pl-10 pr-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">Alt Phone (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  maxLength={10}
                  value={form.altPhone}
                  onChange={setField('altPhone')}
                  placeholder="Alternative number"
                  className={`w-full pl-10 pr-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.altPhone ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
                />
              </div>
              {errors.altPhone && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.altPhone}</p>}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Smart Autocomplete */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Smart Search (Area, City, State)</span>
              {loading && <Loader2 className="w-3 h-3 animate-spin text-[#C5A880]" />}
            </label>
            <div className="relative">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                placeholder="Start typing to auto-fill..."
                className="w-full pl-10 pr-4 py-3 text-sm text-neutral-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/20 transition-all"
              />
            </div>
            
            {/* Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className={`w-full text-left px-4 py-3 text-sm flex flex-col transition-colors border-b border-gray-50 last:border-0 ${idx === activeSuggestionIndex ? 'bg-neutral-50' : 'hover:bg-neutral-50'}`}
                  >
                    <span className="font-semibold text-neutral-900 truncate">{s.label}</span>
                    <span className="text-[10px] text-gray-400 truncate">{s.city ? `${s.city}, ` : ''}{s.state} {s.postalCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">House / Flat No.</label>
              <input
                type="text"
                value={form.house}
                onChange={setField('house')}
                placeholder="House, Flat, Block, Building"
                className={`w-full px-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.house ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
              />
              {errors.house && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.house}</p>}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">Street / Area</label>
              <input
                type="text"
                value={form.street}
                onChange={setField('street')}
                placeholder="Street, Sector, Area"
                className={`w-full px-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.street ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
              />
              {errors.street && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.street}</p>}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">Landmark (Optional)</label>
              <input
                type="text"
                value={form.landmark}
                onChange={setField('landmark')}
                placeholder="e.g. Near Apollo Hospital"
                className="w-full px-4 py-3 text-sm text-neutral-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A880] transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">PIN Code</label>
              <input
                type="text"
                value={form.pin}
                onChange={setField('pin')}
                maxLength={6}
                placeholder="6-digit PIN"
                className={`w-full px-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.pin ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
              />
              {errors.pin && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.pin}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">City</label>
              <input
                type="text"
                value={form.city}
                onChange={setField('city')}
                placeholder="City"
                className={`w-full px-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.city ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
              />
              {errors.city && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">State</label>
              <input
                type="text"
                value={form.state}
                onChange={setField('state')}
                placeholder="State"
                className={`w-full px-4 py-3 text-sm text-neutral-900 bg-white border rounded-xl focus:outline-none transition-all ${errors.state ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#C5A880]'}`}
              />
              {errors.state && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-1 block">Country</label>
              <input
                type="text"
                value={form.country}
                disabled
                className="w-full px-4 py-3 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Type & Default */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-2 block">Address Type</label>
              <div className="flex items-center gap-3">
                {['Home', 'Office', 'Other'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, addressType: type })); setIsDirty(true); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      form.addressType === type 
                        ? 'bg-neutral-900 text-white border-neutral-900' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type === 'Home' && <Home size={14} />}
                    {type === 'Office' && <Building size={14} />}
                    {type === 'Other' && <MapPin size={14} />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                form.isDefault ? 'bg-[#C5A880] border-[#C5A880]' : 'bg-white border-gray-300 group-hover:border-gray-400'
              }`}>
                {form.isDefault && <Check size={12} className="text-white" strokeWidth={4} />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={form.isDefault}
                onChange={(e) => { setForm(f => ({ ...f, isDefault: e.target.checked })); setIsDirty(true); }}
              />
              <span className="text-sm font-bold text-neutral-800">Make this my default address</span>
            </label>
          </div>

        </form>

        {/* Footer */}
        <div 
          className="px-5 md:px-8 pt-4 md:pt-5 border-t border-gray-100 bg-white flex gap-3 shrink-0"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={handleCloseRequest}
            className="w-1/3 py-3.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 text-sm font-black text-white bg-neutral-950 hover:bg-neutral-900 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check size={16} strokeWidth={3} />
            Save Address
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutAddressModal;
