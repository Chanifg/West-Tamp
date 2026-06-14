import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message) => showToast(message, 'error'), [showToast]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-in
              ${toast.type === 'success' 
                ? 'bg-white/90 border-emerald-200/60 text-emerald-950' 
                : 'bg-white/90 border-red-200/60 text-red-950'
              }`}
            style={{
              boxShadow: toast.type === 'success' 
                ? '0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)' 
                : '0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined shrink-0 text-[22px]
                ${toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {toast.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="text-sm font-semibold tracking-wide leading-relaxed">{toast.message}</p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
