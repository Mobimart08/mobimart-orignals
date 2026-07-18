import React from 'react';
import { Wallet } from 'lucide-react';

/* ==========================================================================
   WalletPayment Component
   - Selectable wallet chip buttons
   ========================================================================== */

const WALLETS = [
  { id: 'amazonpay', label: 'Amazon Pay',  color: '#FF9900' },
  { id: 'mobikwik',  label: 'MobiKwik',   color: '#003CB1' },
  { id: 'freecharge',label: 'Freecharge', color: '#EE3024' },
];

export const WalletPayment = ({ value, onChange }) => (
  <div className="flex flex-col gap-3 pt-1">
    <p className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Select Wallet</p>
    <div className="flex flex-col gap-2">
      {WALLETS.map((w) => {
        const selected = value === w.id;
        return (
          <label
            key={w.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
              selected ? 'border-neutral-950 bg-neutral-950/[0.03]' : 'border-neutral-150 bg-white hover:border-neutral-300'
            }`}
          >
            <input type="radio" name="wallet" value={w.id} checked={selected} onChange={() => onChange(w.id)} className="sr-only" />
            {/* Custom radio */}
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300'}`}>
              {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            {/* Wallet icon circle */}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: w.color + '20' }}>
              <Wallet size={13} style={{ color: w.color }} strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-black text-neutral-900">{w.label}</span>
          </label>
        );
      })}
    </div>
    <p className="text-[9px] text-gray-400 font-semibold">Ensure your wallet has sufficient balance before placing the order.</p>
  </div>
);

export default WalletPayment;
