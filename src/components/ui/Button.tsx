import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95';
  
  const variants = {
    primary: 'bg-amber-400 text-white hover:bg-amber-500 shadow-soft hover:shadow-soft-lg',
    secondary: 'bg-cream-200 text-brown-800 hover:bg-cream-300',
    ghost: 'bg-transparent text-brown-700 hover:bg-cream-200',
    outline: 'border-2 border-cream-300 text-brown-800 hover:bg-cream-100',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
