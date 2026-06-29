import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';
import { useAppStore } from '../store';

const iconMap = {
  success: { icon: <CheckCircle size={16} />, bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400' },
  error: { icon: <AlertCircle size={16} />, bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20', text: 'text-rose-700 dark:text-rose-400' },
  info: { icon: <Info size={16} />, bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20', text: 'text-blue-700 dark:text-blue-400' },
  warning: { icon: <AlertTriangle size={16} />, bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', text: 'text-amber-700 dark:text-amber-400' },
};

function ToastItem({ id, title, message, type }: { id: string; title: string; message?: string; type: 'success' | 'error' | 'info' | 'warning' }) {
  const removeToast = useAppStore((s) => s.removeToast);
  const cfg = iconMap[type];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in-right min-w-[300px] max-w-[420px]', cfg.bg)}>
      <span className={cn('flex-shrink-0 mt-0.5', cfg.text)}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', cfg.text)}>{title}</p>
        {message && <p className={cn('text-xs mt-0.5 opacity-80', cfg.text)}>{message}</p>}
      </div>
      <button onClick={() => removeToast(id)} className={cn('flex-shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors', cfg.text)}>
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} />
        </div>
      ))}
    </div>
  );
}
