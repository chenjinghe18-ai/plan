import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-brown-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full max-w-lg bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl',
          'animate-slide-up max-h-[85vh] overflow-hidden flex flex-col',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
            <h3 className="text-lg font-semibold text-brown-800 font-serif">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream-200 transition-colors text-brown-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
