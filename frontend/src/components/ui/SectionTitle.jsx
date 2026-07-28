import React from 'react';

/* ==========================================================================
   SectionTitle Component
   - Standardizes section heading styles (typography, margin-bottom)
   - Supports alignments (left, center, right)
   - Supports optional subtitle
   ========================================================================== */

export const SectionTitle = ({
  title,
  subtitle = '',
  align = 'center',
  className = '',
}) => {
  const alignmentStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-8 md:mb-12 ${alignmentStyles[align]} ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-xs md:text-sm font-medium text-gray-500 max-w-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
