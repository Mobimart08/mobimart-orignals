import React from 'react';
import { Eye } from 'lucide-react';

/* ==========================================================================
   FloatingEyeButton Component
   - Renders the floating, gold circular eye action button on the bottom-right
   - Displays a dynamic badge count reflecting items in Recently Viewed list
   - Triggered on click to open the Recently Viewed bottom sheet drawer
   ========================================================================== */

export const FloatingEyeButton = ({ count = 0, onClick }) => {
  return (
    <div className="fixed bottom-20 right-4 z-30 select-none">
      <button
        type="button"
        onClick={onClick}
        className="w-12 h-12 rounded-full bg-gold-accent hover:bg-[#B59972] text-white flex items-center justify-center shadow-lg active:opacity-90 border border-white/60 transition-all duration-200 cursor-pointer relative group"
        aria-label="Open recently viewed drawer"
      >
        {/* Eye Icon */}
        <Eye size={22} />

        {/* Subtle glow highlight */}
        <span className="absolute inset-0 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
      </button>
    </div>
  );
};

export default FloatingEyeButton;
