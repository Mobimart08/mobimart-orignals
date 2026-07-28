import React from 'react';
import { Building2 } from 'lucide-react';

/* ==========================================================================
   NetBankingPayment Component
   - Styled bank selector dropdown
   ========================================================================== */

const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India (SBI)', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank (PNB)', 'Bank of Baroda', 'Yes Bank'];

export const NetBankingPayment = ({ value, onChange, error }) => (
  <div className="flex flex-col gap-3 pt-1">
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Select Your Bank</label>
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-9 pr-8 py-2.5 text-xs text-neutral-850 bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer ${
            error ? 'border-red-400' : 'border-neutral-200 focus:border-[#C5A880]'
          }`}
        >
          <option value="">— Select Bank —</option>
          {BANKS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</div>
      </div>
      {error && <span className="text-[9px] text-red-500 font-bold">{error}</span>}
    </div>
    <p className="text-[9px] text-gray-400 font-semibold">You will be redirected to your bank's secure payment page.</p>
  </div>
);

export default NetBankingPayment;
