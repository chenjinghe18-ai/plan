import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brown-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50',
          'text-brown-900 placeholder-brown-700/30',
          'focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const inputId = id || props.name;
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brown-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 resize-none',
          'text-brown-900 placeholder-brown-700/30',
          'focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    </div>
  );
}
