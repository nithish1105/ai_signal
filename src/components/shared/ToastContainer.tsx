'use client';

import React from 'react';
import { useToastStore, Toast } from '@/store/toastStore';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
          border: 'border-emerald-500/20 bg-slate-900/90 text-emerald-100',
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />,
          border: 'border-rose-500/20 bg-slate-900/90 text-rose-100',
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-5 w-5 text-indigo-400 shrink-0" />,
          border: 'border-indigo-500/20 bg-slate-900/90 text-indigo-100',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${styles.border}`}
    >
      <div className="flex gap-2.5">
        {styles.icon}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
