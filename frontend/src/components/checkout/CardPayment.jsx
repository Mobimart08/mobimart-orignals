import React, { useState } from 'react';
import { CreditCard, User, Calendar, Lock } from 'lucide-react';

/* ==========================================================================
   CardPayment Component
   - 4-field card form: Number, Holder, Expiry, CVV
   - Auto-formats card number as XXXX XXXX XXXX XXXX
   - Mock brand detection: Visa / Mastercard / RuPay
   - Inline field validation errors
   ========================================================================== */

const detectBrand = (number) => {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return { label: 'Visa', color: '#1A1F71' };
  if (/^5[1-5]/.test(n)) return { label: 'Mastercard', color: '#EB001B' };
  if (/^6/.test(n)) return { label: 'RuPay', color: '#0f8040' };
  return null;
};

const formatCardNumber = (val) =>
  val.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, '').substring(0, 4);
  if (digits.length >= 3) return `${digits.substring(0, 2)}/${digits.substring(2)}`;
  return digits;
};

export const CardPayment = ({ cardData, onChange, errors }) => {
  const brand = detectBrand(cardData.number || '');

  const set = (key) => (e) => {
    let val = e.target.value;
    if (key === 'number') val = formatCardNumber(val);
    if (key === 'expiry') val = formatExpiry(val);
    if (key === 'cvv') val = val.replace(/\D/g, '').substring(0, 4);
    onChange({ ...cardData, [key]: val });
  };

  const fields = [
    {
      key: 'number',
      label: 'Card Number',
      icon: CreditCard,
      placeholder: '0000 0000 0000 0000',
      type: 'text',
      inputMode: 'numeric',
      extra: brand ? (
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: brand.color, border: `1px solid ${brand.color}22` }}>
          {brand.label}
        </span>
      ) : null,
    },
    { key: 'holder', label: 'Card Holder Name', icon: User, placeholder: 'As printed on card', type: 'text' },
  ];

  return (
    <div className="flex flex-col gap-4 pt-1">
      {fields.map(({ key, label, icon: Icon, placeholder, type, inputMode, extra }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">{label}</label>
            {extra}
          </div>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type={type}
              inputMode={inputMode}
              value={cardData[key] || ''}
              onChange={set(key)}
              placeholder={placeholder}
              className={`w-full pl-9 pr-4 py-2.5 text-xs text-neutral-850 bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-all font-mono ${
                errors?.[key] ? 'border-red-400' : 'border-neutral-200 focus:border-[#C5A880]'
              }`}
            />
          </div>
          {errors?.[key] && <span className="text-[9px] text-red-500 font-bold">{errors[key]}</span>}
        </div>
      ))}

      {/* Expiry + CVV side by side */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'expiry', label: 'Expiry', icon: Calendar, placeholder: 'MM/YY' },
          { key: 'cvv',    label: 'CVV',    icon: Lock,     placeholder: '•••' },
        ].map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type={key === 'cvv' ? 'password' : 'text'}
                inputMode="numeric"
                value={cardData[key] || ''}
                onChange={set(key)}
                placeholder={placeholder}
                className={`w-full pl-9 pr-4 py-2.5 text-xs text-neutral-850 bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-all font-mono ${
                  errors?.[key] ? 'border-red-400' : 'border-neutral-200 focus:border-[#C5A880]'
                }`}
              />
            </div>
            {errors?.[key] && <span className="text-[9px] text-red-500 font-bold">{errors[key]}</span>}
          </div>
        ))}
      </div>

      <p className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
        <Lock size={9} className="text-[#C5A880]" /> Your card details are encrypted and never stored.
      </p>
    </div>
  );
};

export default CardPayment;
