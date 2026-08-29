import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Toast({ message, isOpen, onClose }: ToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-edge-strong bg-fg px-4 py-2.5 text-[13px] font-medium text-bg shadow-xl animate-reveal"
    >
      <Check className="h-4 w-4 text-brand" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
