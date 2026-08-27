import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let bgStyle = 'bg-neutral-950 text-white border-neutral-800';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'warning') {
          Icon = AlertCircle;
          bgStyle = 'bg-amber-950 text-amber-100 border-amber-800';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          bgStyle = 'bg-red-950 text-red-100 border-red-800';
          iconColor = 'text-red-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgStyle = 'bg-neutral-900 text-white border-neutral-700';
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl animate-in slide-in-from-bottom-2 duration-200 ${bgStyle}`}
          >
            <div className="flex items-center space-x-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="text-xs font-semibold leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors shrink-0 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
