import React from 'react';

/* ==========================================================================
   Container Component
   - Sets a consistent page max-width
   - Centers content and applies responsive padding
   ========================================================================== */

export const Container = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
