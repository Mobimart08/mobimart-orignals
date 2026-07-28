import React, { useState } from 'react';
import { Truck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const DeliveryChecker = () => {
  const [pinCode, setPinCode] = useState('');
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (pinCode.length === 6) {
      setIsChecking(true);
      setTimeout(() => {
        setIsChecking(false);
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 2);
        const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });

        setStatus({
          success: true,
          message: `Express Delivery available to ${pinCode} by ${formattedDate}`
        });
      }, 500);
    } else {
      setStatus({
        success: false,
        message: 'Please enter a valid 6-digit PIN code'
      });
    }
  };

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-3.5">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950">
        Check Delivery & Express Availability
      </h3>

      <form onSubmit={handleCheck} className="flex items-center gap-2">
        <input
          type="text"
          maxLength={6}
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit PIN Code"
          className="flex-grow bg-[#ECEFF2]/50 focus:bg-white text-[11px] sm:text-xs text-neutral-800 placeholder-gray-400 border border-neutral-200/20 focus:border-gold-accent px-4 py-2 sm:py-2.5 rounded-xl focus:outline-none transition-all"
          aria-label="Enter postal zip code"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="px-5 py-2 sm:py-2.5 text-[10.5px] sm:text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
        >
          {isChecking ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Checking</span>
            </>
          ) : (
            <span>Check</span>
          )}
        </button>
      </form>

      {status ? (
        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] sm:text-[10.5px] font-extrabold select-none">
          {status.success ? (
            <CheckCircle2 size={14} className="text-amber-600 shrink-0" strokeWidth={2.4} />
          ) : (
            <AlertCircle size={14} className="text-red-500 shrink-0" strokeWidth={2.4} />
          )}
          <span className={status.success ? 'text-amber-600' : 'text-red-500'}>
            {status.message}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] sm:text-[10.5px] font-extrabold text-gray-400 select-none">
          <Truck size={14} className="text-gray-400" strokeWidth={2.2} />
          <span>Enter PIN code to check estimated delivery times.</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryChecker;
