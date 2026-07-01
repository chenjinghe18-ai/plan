import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-paper',
        hoverable && 'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-5 pt-5 pb-3', className)}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

Card.Content = function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-5 py-4', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-5 pb-5 pt-3', className)}>
      {children}
    </div>
  );
};
