import React from 'react';

/* ==========================================================================
   RamSelector Component
   - Renders interactive RAM capacity chips (6GB, 8GB, 12GB, 16GB, etc.)
   - Visually identical to StorageSelector for consistent design language.
   - Hidden automatically when options array is empty (caller guards).
   ========================================================================== */

export const RamSelector = ({ options = [], selected, onChange }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-2.5">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950">
        RAM
      </h3>

      {/* RAM chips */}
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const isSelected = option === selected;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange && onChange(option)}
              className={`px-4.5 py-2 text-[10px] sm:text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-gold-accent bg-gold-bg/40 text-neutral-900 shadow-sm font-black'
                  : 'border-gray-200 text-neutral-800 hover:border-neutral-450 hover:bg-neutral-55'
              }`}
              aria-label={`Select RAM size ${option}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RamSelector;
