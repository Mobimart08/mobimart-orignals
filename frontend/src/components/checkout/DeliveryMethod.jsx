import React from 'react';
import { Truck, Zap, Clock } from 'lucide-react';

/* ==========================================================================
   DeliveryMethod Component
   - Three radio option cards: Standard, Express, Same Day
   - Each card shows icon, label, ETA, and delivery charge
   - Updates parent state on selection; Same Day can be conditionally disabled
   ========================================================================== */

export const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    icon: Truck,
    label: 'Standard Delivery',
    sublabel: 'Delivered in 3–5 business days',
    chargeLabel: 'Product-based',
    accentColor: 'text-green-600',
  },
  {
    id: 'express',
    icon: Zap,
    label: 'Express Delivery',
    sublabel: 'Delivered in 1–2 business days',
    chargeLabel: 'Product-based',
    accentColor: 'text-blue-600',
  },
  {
    id: 'sameday',
    icon: Clock,
    label: 'Same Day Delivery',
    sublabel: 'Order before 12 PM · Available in select cities',
    chargeLabel: 'Product-based',
    accentColor: 'text-orange-500',
    disabled: false,
  },
];

export const DeliveryMethod = ({ selected, onChange }) => {
  return (
    <div className="checkout-card flex flex-col gap-3">
      <SectionTitle title="Delivery Method" />
      <div className="flex flex-col gap-2.5">
        {DELIVERY_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          const isDisabled = !!opt.disabled;

          return (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all select-none ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed border-neutral-100 bg-neutral-50'
                  : isSelected
                  ? 'border-neutral-950 bg-neutral-950/[0.03] shadow-sm'
                  : 'border-neutral-150 bg-white hover:border-neutral-300'
              }`}
            >
              {/* Radio input (visually hidden, uses label click) */}
              <input
                type="radio"
                name="delivery_method"
                value={opt.id}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => !isDisabled && onChange(opt.id)}
                className="sr-only"
              />

              {/* Custom radio dot */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isSelected ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300 bg-white'
              }`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              {/* Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-neutral-950' : 'bg-neutral-100'
              }`}>
                <Icon size={15} className={isSelected ? 'text-white' : 'text-neutral-500'} strokeWidth={2.2} />
              </div>

              {/* Label + sublabel */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] font-black text-neutral-950 leading-tight">{opt.label}</span>
                <span className="text-[9px] text-gray-400 font-semibold mt-0.5">{opt.sublabel}</span>
              </div>

              {/* Charge */}
              <span className={`text-[11px] font-black shrink-0 ${
                isSelected ? 'text-neutral-950' : 'text-gray-500'
              }`}>
                {isDisabled ? 'N/A' : opt.chargeLabel}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-1.5">
    <Truck size={15} className="text-[#C5A880]" />
    <h2 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">{title}</h2>
  </div>
);

export default DeliveryMethod;
