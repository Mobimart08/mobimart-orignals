import React from 'react';

/* ==========================================================================
   Divider Component
   - Provides horizontal or vertical line separators with standardized borders
   ========================================================================== */

export const Divider = ({ vertical = false, className = '' }) => {
  return (
    <div
      className={`${
        vertical ? 'w-[1px] self-stretch bg-gray-200' : 'h-[1px] w-full bg-gray-200'
      } ${className}`}
    />
  );
};

export default Divider;
