import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Toast Component
 * Displays a slide-in alert from the bottom-right of the screen.
 * Automatically dismisses after 3 seconds or on user click.
 */
export function Toast() {
  const { toast, setToast } = useApp();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md animate-slide-up">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10 ${
          isWarning
            ? 'bg-amber-950/90 text-amber-200 border-l-4 border-l-amber-500'
            : isInfo
            ? 'bg-sky-950/90 text-sky-200 border-l-4 border-l-sky-500'
            : 'bg-spotify-dark/95 text-white border-l-4 border-l-spotify-green shadow-spotify-green/10'
        }`}
        role="alert"
      >
        <div className="flex-shrink-0 mt-0.5">
          {isWarning ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-sky-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-spotify-green animate-bounce" />
          )}
        </div>

        <div className="flex-1 text-sm font-medium pr-2 leading-relaxed">
          {toast.message}
        </div>

        <button
          onClick={() => setToast(null)}
          className="flex-shrink-0 text-spotify-gray hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-white/10"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
