'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

const STYLES = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error:   'border-red-500/40   bg-red-500/10   text-red-300',
  info:    'border-blue-500/40  bg-blue-500/10  text-blue-300',
};

function ToastItem({ id, message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 3500);
    return () => clearTimeout(t);
  }, [id, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md
        shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${STYLES[type] || STYLES.info}`}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
        aria-label="Fechar"
      >×</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onClose={closeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
