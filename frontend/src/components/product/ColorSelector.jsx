import React from 'react';

/* ==========================================================================
   ColorSelector Component
   - Renders colored circles to toggle product variants
   - Displays current active color name label next to section header
   - Applies elegant double border ring to active circle
   ========================================================================== */

export const ColorSelector = ({ options = [], selected, onChange }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-2.5">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950">
        Color
      </h3>

      {/* Color chips grid list */}
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const isSelected = option.name === selected?.name;
          const hex = option.hexValue || option.value || '#808080';

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => onChange && onChange(option)}
              className={`flex items-center gap-2 px-4.5 py-2 text-[10px] sm:text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-gold-accent bg-gold-bg/40 text-neutral-900 shadow-sm font-black'
                  : 'border-gray-200 text-neutral-800 hover:border-neutral-450 hover:bg-neutral-55'
              }`}
              aria-label={`Select color ${option.name}`}
            >
              <span 
                className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" 
                style={{ backgroundColor: hex }}
              ></span>
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
