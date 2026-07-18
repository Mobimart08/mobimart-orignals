import React from 'react';
import { Info } from 'lucide-react';

/* ==========================================================================
   BatteryHealthCard Component
   - Renders a clean circular progress component for battery health percentage (Slice 1)
   - Left: SVG circular gauge tracking battery health
   - Right: Description based on health range (Excellent / Good / Needs Service)
   ========================================================================== */

export const BatteryHealthCard = ({ health = 96 }) => {
  // Determine rating text and color scheme based on battery health percentage
  const getHealthRating = (val) => {
    if (val >= 90) {
      return {
        label: 'Excellent',
        desc: 'Optimal battery performance. Expect normal usage without any issues.',
        color: 'text-amber-600',
        strokeColor: '#C5A880'
      };
    } else if (val >= 80) {
      return {
        label: 'Good',
        desc: 'Healthy battery capacity. Minor normal degradation, fully functional.',
        color: 'text-gray-700',
        strokeColor: '#79797A'
      };
    } else {
      return {
        label: 'Needs Service',
        desc: 'Battery capacity is degraded. Device works but may deplete quickly.',
        color: 'text-red-600',
        strokeColor: '#EF4444'
      };
    }
  };

  const rating = getHealthRating(health);
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health / 100) * circumference;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-3.5">
      {/* Title with Info icon */}
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 flex items-center gap-1">
        <span>Battery Health</span>
        <button type="button" className="text-gray-400 hover:text-neutral-700 p-0.5 cursor-pointer">
          <Info size={13} strokeWidth={2.4} />
        </button>
      </h3>

      {/* Main progress row */}
      <div className="flex items-center gap-4.5 bg-[#FAF9F6] p-3.5 rounded-2xl border border-neutral-100">
        
        {/* Left: SVG Circular Progress */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle track */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#ECEFF2"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active gold progress circle */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke={rating.strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Inner percentage label text */}
          <span className="absolute text-[10.5px] font-black text-neutral-900 tracking-tighter">
            {health}%
          </span>
        </div>

        {/* Right: Description status */}
        <div className="flex-1 text-left min-w-0">
          <h4 className="text-[11.5px] font-extrabold text-neutral-950 leading-none mb-1">
            {rating.label}
          </h4>
          <p className="text-[9px] sm:text-[10px] text-gray-450 font-bold leading-normal">
            {rating.desc}
          </p>
        </div>

      </div>
    </div>
  );
};

export default BatteryHealthCard;
