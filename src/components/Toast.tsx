import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />
  };

  const colors = {
    success: 'from-green-500 to-emerald-600 text-white',
    error: 'from-red-500 to-rose-600 text-white',
    info: 'from-blue-500 to-indigo-600 text-white',
    warning: 'from-yellow-500 to-orange-600 text-white'
  };

  return (
    <div
      className={`fixed top-24 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`bg-gradient-to-r ${colors[type]} px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md backdrop-blur-sm border border-white/20`}
      >
        {icons[type]}
        <p className="font-medium text-sm flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${6 + index * 5}rem` }} className="absolute right-4">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </>
  );
}

