import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  color?: string;
  bgColor?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  color = 'bg-amber-400',
  bgColor = 'bg-cream-200',
  height = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full overflow-hidden', bgColor, heights[height])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs text-brown-700/70">
          {clampedProgress}%
        </div>
      )}
    </div>
  );
}
