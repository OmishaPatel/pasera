'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number; // ms
  onClose: () => void;
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Animation duration
  };

  const baseStyles = cn(
    'fixed bottom-6 right-6 z-50',
    'max-w-md px-4 py-3 rounded-lg shadow-lg',
    'flex items-start gap-3',
    'transition-all duration-300',
    isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
  );

  const variantStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const Icon = type === 'success' ? CheckCircle2 : XCircle;

  return (
    <div className={cn(baseStyles, variantStyles[type])}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:bg-white/20 rounded p-0.5 transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

Toast.displayName = 'Toast';
