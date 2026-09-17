
import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) {
    return null;
  }

  const getSafeText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (value && typeof value === 'object') {
      const objectValue = value as {
        message?: unknown;
        title?: unknown;
        description?: unknown;
      };

      if (typeof objectValue.message === 'string') {
        return objectValue.message;
      }

      if (typeof objectValue.title === 'string') {
        return objectValue.title;
      }

      if (typeof objectValue.description === 'string') {
        return objectValue.description;
      }

      return fallback;
    }

    return fallback;
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex w-full max-w-md flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        const title = getSafeText(toast.title, 'Notification');
        const description = getSafeText(toast.description);

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'border-emerald-500/40 bg-slate-900/95 text-white shadow-emerald-950/20'
                : isWarning
                ? 'border-amber-500/40 bg-slate-900/95 text-white shadow-amber-950/20'
                : isError
                ? 'border-rose-500/40 bg-slate-900/95 text-white shadow-rose-950/20'
                : 'border-indigo-500/40 bg-slate-900/95 text-white shadow-indigo-950/20'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}

              {isWarning && (
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              )}

              {isError && (
                <XCircle className="h-5 w-5 text-rose-400" />
              )}

              {!isSuccess && !isWarning && !isError && (
                <Info className="h-5 w-5 text-indigo-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h5 className="font-semibold text-xs leading-tight text-white">
                {title}
              </h5>

              {description && (
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-0.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
