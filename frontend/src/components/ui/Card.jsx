import React from 'react';

/* ==========================================================================
   Card Component
   - Supports variants (light, dark, outlined, interactive)
   - Follows luxury minimal aesthetic with soft shadows
   - Provides consistent rounded-2xl or rounded-xl spacing
   ========================================================================== */

export const Card = ({
  children,
  variant = 'light',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'transition-all duration-300 overflow-hidden';

  const variants = {
    light: 'bg-white border border-gray-100 shadow-soft-ui rounded-2xl',
    dark: 'bg-neutral-950 text-white border border-neutral-900 shadow-premium rounded-2xl',
    outlined: 'border border-gray-200 bg-transparent rounded-xl',
    interactive: 'bg-white border border-gray-100 shadow-soft-ui rounded-xl hover:shadow-premium hover:-translate-y-0.5 cursor-pointer',
    custom: 'shadow-soft-ui rounded-2xl', // Lets caller fully define colors and borders
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${interactive ? 'hover:-translate-y-1 hover:shadow-premium cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
