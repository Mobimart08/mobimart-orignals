import React from 'react';

/* ==========================================================================
   Badge Component
   - Standardizes small pill label styling for certifications/highlights
   - Supports gold, silver, and dark theme variants
   ========================================================================== */

export const Badge = ({ children, variant = 'gold', className = '' }) => {
  const variants = {
    gold: 'bg-gold-bg text-amber-800 border border-[#ebdcd0]/50',
    silver: 'bg-gray-100 text-gray-700 border border-gray-200/60',
    dark: 'bg-[#1F1A13] text-gold-accent border border-amber-950/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
