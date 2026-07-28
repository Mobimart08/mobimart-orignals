import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

/* ==========================================================================
   UPIPayment Component
   - UPI ID input with basic format validation
   - Quick-tap app shortcuts: GPay, PhonePe, Paytm, BHIM
   ========================================================================== */

const UPI_APPS = [
  { id: 'gpay',    label: 'Google Pay', color: '#34A853', abbr: 'G' },
  { id: 'phonepe', label: 'PhonePe',   color: '#5F259F', abbr: 'Ph' },
  { id: 'paytm',   label: 'Paytm',     color: '#002970', abbr: 'Pa' },
  { id: 'bhim',    label: 'BHIM',      color: '#007CC3', abbr: 'B' },
];

export const UPIPayment = ({ value, onChange, error }) => {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleAppSelect = (app) => {
    setSelectedApp(app.id);
    onChange(`yourname@${app.id}`);
  };

  return (
    <div className="flex flex-col gap-4 pt-1">
      {/* Quick UPI App chips */}
      <div className="flex gap-2 flex-wrap">
        {UPI_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => handleAppSelect(app)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
              selectedApp === app.id
                ? 'border-neutral-950 bg-neutral-950 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
            }`}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-black shrink-0"
              style={{ backgroundColor: app.color }}
            >
              {app.abbr}
            </span>
            {app.label}
          </button>
        ))}
      </div>

      {/* UPI ID input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">UPI ID</label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={value}
            onChange={(e) => { onChange(e.target.value); setSelectedApp(null); }}
            placeholder="yourname@upi"
            className={`w-full pl-9 pr-4 py-2.5 text-xs text-neutral-850 bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-all ${
              error ? 'border-red-400' : 'border-neutral-200 focus:border-[#C5A880]'
            }`}
          />
        </div>
        {error && <span className="text-[9px] text-red-500 font-bold">{error}</span>}
        <p className="text-[9px] text-gray-400 font-semibold">Enter your UPI ID (e.g. name@oksbi, number@paytm)</p>
      </div>
    </div>
  );
};

export default UPIPayment;
