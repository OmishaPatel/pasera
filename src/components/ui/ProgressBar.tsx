'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * ProgressBar Component - Capacity Indicator
 * 
 * Visual progress indicator for event capacity and other metrics.
 * Supports auto-variant calculation based on percentage, custom labels,
 * and smooth animations. Fully accessible with ARIA attributes.
 * 
 * Usage:
 *   <ProgressBar value={15} max={20} showLabel showPercentage />
 *   <ProgressBar value={18} max={20} variant="auto" />
 *   <ProgressBar value={75} max={100} label="Capacity" />
 */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;           // Current value (e.g., 15)
  max: number;             // Maximum value (e.g., 20)
  variant?: 'auto' | 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;     // Show "15/20" text
  showPercentage?: boolean; // Show "75%" text
  label?: string;          // Custom label text
}

export function ProgressBar({
  value,
  max,
  variant = 'auto',
  size = 'md',
  showLabel = false,
  showPercentage = false,
  label,
  className,
  ...props
}: ProgressBarProps) {
  
  /**
   * Calculate percentage with edge case handling
   * - Handles max = 0 (returns 0%)
   * - Caps value at max (prevents >100%)
   * - Returns rounded integer
   */
  const calculatePercentage = (): number => {
    if (max === 0) return 0;
    const clampedValue = Math.min(value, max); // Prevent exceeding max
    const percentage = (clampedValue / max) * 100;
    return Math.round(percentage);
  };

  const percentage = calculatePercentage();

  /**
   * Auto-calculate variant based on percentage
   * Used when variant is 'auto' (default)
   * - 0-49%: default (gray) - plenty of space
   * - 50-74%: success (green) - filling up
   * - 75-89%: warning (orange) - almost full
   * - 90-100%: danger (red) - full or nearly full
   */
  const getAutoVariant = (): 'default' | 'success' | 'warning' | 'danger' => {
    if (percentage < 50) return 'default';
    if (percentage < 75) return 'success';
    if (percentage < 90) return 'warning';
    return 'danger';
  };

  // Determine final variant (use auto-calculated if variant is 'auto')
  const finalVariant = variant === 'auto' ? getAutoVariant() : variant;

  // Bar background sizes (height)
  const barSizeStyles = {
    sm: 'h-1.5',  // 6px
    md: 'h-2.5',  // 10px (default)
    lg: 'h-4',    // 16px
  };

  // Label text sizes
  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Variant color styles for the fill bar
  const variantStyles = {
    default: 'bg-[var(--color-gray-500)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger)]',
  };

  // Generate label text
  // Shows "value/max" or "percentage%" or both
  const getLabelText = (): string => {
    const parts: string[] = [];
    
    if (showLabel) {
      parts.push(`${value}/${max}`);
    }
    
    if (showPercentage) {
      parts.push(`${percentage}%`);
    }
    
    return parts.join(' • '); // Separate with bullet if both shown
  };

  const labelText = getLabelText();

  // ARIA label for screen readers
  const ariaLabel = label || `${value} of ${max}`;
  const ariaValueText = showPercentage 
    ? `${percentage} percent` 
    : `${value} of ${max}`;

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Label section (optional) */}
      {(label || labelText) && (
        <div className={cn(
          'flex items-center justify-between gap-2 mb-1.5',
          'text-[var(--color-gray-700)] font-medium',
          labelSizeStyles[size],
        )}>
          {/* Custom label text */}
          {label && <span>{label}</span>}
          
          {/* Value/percentage text */}
          {labelText && (
            <span className="tabular-nums">
              {labelText}
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={cn(
          'w-full bg-[var(--color-gray-200)] rounded-[var(--radius-full)]',
          'overflow-hidden', // Clips fill bar to rounded corners
          barSizeStyles[size],
        )}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={ariaValueText}
      >
        {/* Fill bar */}
        <div
          className={cn(
            'h-full rounded-[var(--radius-full)]',
            'transition-all duration-300 ease-out', // Smooth animation
            'shadow-sm',
            variantStyles[finalVariant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Display name for React DevTools
ProgressBar.displayName = 'ProgressBar';