import React, { useState } from 'react';
import { Truck } from 'lucide-react';

/* ==========================================================================
   DeliveryChecker Component
   - Renders a zip code / PIN code input form to check mock delivery dates (Slice 1)
   - Left: TextInput for PIN code
   - Right: "Check" submit button
   - Bottom: Dynamic status line showing delivery schedule in gold text
   ========================================================================== */

export const DeliveryChecker = () => {
  const [pinCode, setPinCode] = useState('');
  const [status, setStatus] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (pinCode.length >= 5) {
      setStatus({
        success: true,
        message: 'Delivery by Tomorrow, 18 May'
      });
    } else {
      setStatus({
        success: false,
        message: 'Please enter a valid zip code'
      });
    }
  };

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-3.5">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950">
        Check Delivery
      </h3>

      {/* Zip code search row */}
      <form onSubmit={handleCheck} className="flex items-center gap-2">
        <input
          type="text"
          maxLength={6}
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter PIN Code"
          className="flex-grow bg-[#ECEFF2]/50 focus:bg-white text-[11px] sm:text-xs text-neutral-800 placeholder-gray-400 border border-neutral-200/20 focus:border-gold-accent px-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all"
          aria-label="Enter postal zip code"
        />
        <button
          type="submit"
          className="px-5 py-2 sm:py-2.5 text-[10.5px] sm:text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer shadow-sm select-none shrink-0"
        >
          Check
        </button>
      </form>

      {/* Dynamic schedules status sub-label */}
      {status ? (
        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] sm:text-[10.5px] font-extrabold select-none">
          <Truck size={14} className={status.success ? 'text-amber-600' : 'text-red-500'} strokeWidth={2.4} />
          <span className={status.success ? 'text-amber-600' : 'text-red-500'}>
            {status.message}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] sm:text-[10.5px] font-extrabold text-gray-450 select-none">
          <Truck size={14} className="text-gray-400" strokeWidth={2.2} />
          <span>Enter code to check estimated delivery times.</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryChecker;
