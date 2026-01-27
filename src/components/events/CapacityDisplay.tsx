'use client';

// ============================================
// CapacityDisplay Component
// Display event capacity with progress bar
// ============================================

import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface CapacityDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number; // Current attendee count
  max: number; // Max capacity
  variant?: 'default' | 'compact';
  showPercentage?: boolean;
  showLabel?: boolean;
  hideProgressBar?: boolean;
}

export function CapacityDisplay({
  current,
  max,
  variant = 'default',
  showPercentage = false,
  showLabel = false,
  hideProgressBar = false,
  className,
  ...props
}: CapacityDisplayProps) {
  // Calculate percentage
  const percentage = max > 0 ? Math.round((current / max) * 100) : 0;
  const isFull = current >= max;

  // Determine color variant based on capacity
  const getVariant = (): 'default' | 'success' | 'warning' | 'danger' => {
    if (percentage < 75) return 'success'; // Green - plenty of space
    if (percentage < 90) return 'warning'; // Orange - filling up
    return 'danger'; // Red - almost full or full
  };

  const colorVariant = getVariant();

  // Build the fraction display
  const fractionText = `${current}/${max}`;
  const percentageText = showPercentage ? ` • ${percentage}%` : '';

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        variant === 'compact' && 'gap-1',
        className
      )}
      {...props}
    >
      {/* Top row: Label and/or fraction */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
          {showLabel && <span>Capacity:</span>}
          <span className="tabular-nums">
            {fractionText}
            {percentageText}
          </span>
        </div>

        {/* Full badge */}
        {isFull && (
          <Badge variant="danger" size="sm">
            FULL
          </Badge>
        )}

        {/* Limited spots warning */}
        {!isFull && percentage >= 90 && (
          <Badge variant="warning" size="sm">
            LIMITED SPOTS
          </Badge>
        )}
      </div>

      {/* Progress bar */}
      {!hideProgressBar && (
        <ProgressBar
          value={current}
          max={max}
          variant={colorVariant}
          size={variant === 'compact' ? 'sm' : 'md'}
          aria-label={`${current} of ${max} spots taken`}
        />
      )}
    </div>
  );
}
