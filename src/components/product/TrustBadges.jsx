import React from 'react';
import { Award, ShieldAlert, ShieldCheck } from 'lucide-react';

/* ==========================================================================
   TrustBadges Component
   - Renders secondary quality credentials at the bottom of dynamic listings (Slice 3)
   - Badge A: "100% Original" authenticity certificate
   - Badge B: "Secure Packaging" guarantee details
   ========================================================================== */

export const TrustBadges = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 select-none z-10 relative">
      
      {/* Badge A: 100% Original */}
      <div className="bg-white border border-gray-150/40 rounded-3xl p-5 shadow-soft-ui flex items-center gap-4 text-left hover:shadow-premium transition-all duration-300">
        <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-250/20 flex items-center justify-center text-[#C5A880] shadow-sm shrink-0">
          <Award size={20} className="text-amber-600" strokeWidth={2.2} />
        </div>
        <div>
          <h4 className="text-[11.5px] sm:text-xs font-extrabold text-neutral-950 leading-tight">
            100% Original
          </h4>
          <p className="text-[9.5px] sm:text-[10px] text-gray-400 font-bold leading-normal mt-0.5 max-w-[180px]">
            All devices are 100% original and verified.
          </p>
        </div>
      </div>

      {/* Badge B: Secure Packaging */}
      <div className="bg-white border border-gray-150/40 rounded-3xl p-5 shadow-soft-ui flex items-center gap-4 text-left hover:shadow-premium transition-all duration-300">
        <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-250/20 flex items-center justify-center text-[#C5A880] shadow-sm shrink-0">
          <ShieldCheck size={20} className="text-amber-600" strokeWidth={2.2} />
        </div>
        <div>
          <h4 className="text-[11.5px] sm:text-xs font-extrabold text-neutral-950 leading-tight">
            Secure Packaging
          </h4>
          <p className="text-[9.5px] sm:text-[10px] text-gray-400 font-bold leading-normal mt-0.5 max-w-[180px]">
            Your device will be carefully packed and delivered safely.
          </p>
        </div>
      </div>

    </div>
  );
};

export default TrustBadges;
