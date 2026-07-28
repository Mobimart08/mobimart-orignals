import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-full shadow-premium backdrop-blur-md transition-all duration-300 animate-slide-down border text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-neutral-950/95 text-white border-green-500/40'
                : toast.type === 'error'
                ? 'bg-red-950/95 text-white border-red-500/40'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 text-white border-amber-500/40'
                : 'bg-neutral-900/95 text-white border-gold-accent/40'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <AlertCircle size={13} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              {toast.type === 'warning' && (
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={13} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-5 h-5 rounded-full bg-[#C5A880] flex items-center justify-center shrink-0">
                  <Info size={13} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
