import React from 'react';

/* ==========================================================================
   Button Component
   - Supports different style variants (primary, secondary, outline, outlineLuxe, ghost)
   - Supports sizes (sm, md, lg)
   - Follows luxury minimal capsule-shape (rounded-full)
   ========================================================================== */

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold tracking-wide transition-all duration-200 focus:outline-none cursor-pointer select-none';

  const variants = {
    primary: 'bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm border border-transparent',
    secondary: 'bg-gold-bg text-gold-dark hover:bg-[#EBDCD0] shadow-sm border border-transparent',
    outline: 'border border-neutral-200 text-neutral-800 hover:bg-neutral-50 bg-transparent',
    outlineLuxe: 'border border-white/20 text-white hover:bg-white/10 bg-transparent',
    ghost: 'text-neutral-700 hover:bg-neutral-100 bg-transparent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] uppercase tracking-wider',
    md: 'px-6 py-2.5 text-xs tracking-wider',
    lg: 'px-8 py-3 text-sm tracking-wider',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
