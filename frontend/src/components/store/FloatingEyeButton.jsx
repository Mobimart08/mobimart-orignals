import React from 'react';
import { createPortal } from 'react-dom';
import { Eye } from 'lucide-react';

/* ==========================================================================
   FloatingEyeButton Component
   - Renders the floating, gold circular eye action button on the bottom-right
   - Displays a dynamic badge count reflecting items in Recently Viewed list
   - Triggered on click to open the Recently Viewed bottom sheet drawer
   ========================================================================== */

export const FloatingEyeButton = ({ count = 0, onClick }) => {
  const content = (
    <>
      {/* MOBILE / TABLET BUTTON (Centered Bottom) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 select-none lg:hidden">
        <button
          type="button"
          onClick={onClick}
          className="w-12 h-12 rounded-full bg-gold-accent hover:bg-[#B59972] text-white flex items-center justify-center shadow-lg active:opacity-90 border border-white/60 transition-all duration-200 cursor-pointer relative group"
          aria-label="Open recently viewed drawer"
        >
          <Eye size={22} />
          <span className="absolute inset-0 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
        </button>
      </div>

      {/* DESKTOP BUTTON (Right Center, Premium Glassmorphism) */}
      <div className="hidden lg:flex fixed top-1/2 -translate-y-1/2 right-6 md:right-8 z-[9999] select-none group/eye">
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-bold rounded-lg opacity-0 translate-x-2 pointer-events-none group-hover/eye:opacity-100 group-hover/eye:translate-x-0 transition-all duration-300 whitespace-nowrap shadow-md">
          Recently Viewed
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-neutral-900 rotate-45"></div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="w-[56px] h-[56px] rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(197,168,128,0.25)] border border-gray-200/60 hover:border-gold-accent/50 hover:text-gold-accent transition-all duration-300 hover:scale-105 cursor-pointer relative group backdrop-blur-md"
          aria-label="Open recently viewed drawer"
        >
          <Eye size={24} className="transition-colors duration-300" />
          <span className="absolute inset-0 rounded-full border border-gold-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
        </button>
      </div>
    </>
  );

  // Use createPortal to break out of any parent CSS transforms/animations 
  // ensuring true fixed positioning relative to the viewport.
  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export default FloatingEyeButton;
