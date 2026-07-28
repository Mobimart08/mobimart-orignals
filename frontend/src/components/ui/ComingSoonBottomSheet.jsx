import React, { useState } from 'react';
import { X, Sparkles, Bell, Check } from 'lucide-react';

export const ComingSoonBottomSheet = ({ isOpen, onClose, title = "Feature Coming Soon", featureName = "This service" }) => {
  const [notified, setNotified] = useState(false);

  if (!isOpen) return null;

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => {
      setNotified(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content Container */}
      <div className="relative w-full max-w-lg bg-[#FAF9F6] border-t border-gray-200/80 rounded-t-[32px] p-6 sm:p-8 shadow-2xl z-10 animate-slide-up select-none">
        
        {/* Top Handle pill */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-6" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 bg-white border border-gray-200/60 rounded-full shadow-sm transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Content Icon & Text */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gold-bg border border-[#EBDCD0] flex items-center justify-center mb-4 shadow-sm">
            <Sparkles className="w-8 h-8 text-[#C5A880]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-neutral-950 mb-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-xs mb-6">
            <strong className="text-neutral-900 font-bold">{featureName}</strong> is currently under active development for our next major release. Stay tuned!
          </p>

          <button
            type="button"
            onClick={handleNotify}
            disabled={notified}
            className={`w-full py-3.5 px-6 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] ${
              notified
                ? 'bg-green-600 text-white'
                : 'bg-neutral-950 hover:bg-neutral-800 text-white'
            }`}
          >
            {notified ? (
              <>
                <Check size={16} />
                <span>You'll be notified!</span>
              </>
            ) : (
              <>
                <Bell size={16} />
                <span>Notify Me When Ready</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComingSoonBottomSheet;
