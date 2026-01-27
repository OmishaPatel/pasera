'use client';
import React from 'react';
import { cn } from '@/lib/utils/cn';


/**
 * Badge Component - Status Indicator
 * 
 * Visual status pills for RSVP states, counts, and labels.
 * Supports multiple variants matching event attendee statuses,
 * optional dot indicators, count displays, and removable badges.
 * 
 * Usage:
 *   <Badge variant="going">Going</Badge>
 *   <Badge variant="full" dot>Event Full</Badge>
 *   <Badge count={5} />
 *   <Badge variant="warning" removable onRemove={handleRemove}>Tag</Badge>
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'going' | 'maybe' | 'interested' | 'waitlist' | 'full' | 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;           // Shows colored dot before text
  count?: number;          // Shows number badge (overrides children)
  removable?: boolean;     // Shows X icon for removal
  onRemove?: () => void;   // Callback when X icon clicked
  children?: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  count,
  removable = false,
  onRemove,
  className,
  children,
  ...props
}: BadgeProps) {
  
  // Base styles for all badges
  // - inline-flex: Allows dot and text to align properly
  // - items-center: Vertically centers all content
  // - rounded-full: Creates pill shape
  // - whitespace-nowrap: Prevents text wrapping
  const baseStyles = cn(
    'inline-flex items-center justify-center',
    'font-medium rounded-[var(--radius-full)]',
    'transition-all duration-200',
    'shadow-[var(--shadow-sm)]',
    'whitespace-nowrap',
    'select-none', // Prevents text selection
  );

  // Variant styles - maps to AttendeeStatus from types/event.ts
  const variantStyles = {
    // AttendeeStatus variants
    going: 'bg-[var(--color-success)] text-white',
    maybe: 'bg-[var(--color-warning)] text-white',
    interested: 'bg-[var(--color-accent)] text-white',
    waitlist: 'bg-[var(--color-secondary)] text-white',
    
    // EventStatus and semantic variants
    full: 'bg-[var(--color-danger)] text-white',
    default: 'bg-[var(--color-gray-500)] text-white',
    success: 'bg-[var(--color-success)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
    danger: 'bg-[var(--color-danger)] text-white',
  };

  // Size styles - affects padding, height, and font size
  // Minimum heights ensure consistent badge sizing
  const sizeStyles = {
    sm: cn('text-xs px-2 py-0.5 min-h-[20px] gap-1'),
    md: cn('text-sm px-2.5 py-1 min-h-[24px] gap-1.5'), // Default
    lg: cn('text-base px-3 py-1.5 min-h-[28px] gap-2'),
  };

  // Interactive styles for removable badges
  const interactiveStyles = removable || onRemove
    ? 'cursor-pointer hover:shadow-[var(--shadow-md)] hover:scale-105'
    : '';

  // Dot indicator sizes based on badge size
  const dotSizes = {
    sm: 'w-1.5 h-1.5',  // 6px
    md: 'w-2 h-2',      // 8px
    lg: 'w-2.5 h-2.5',  // 10px
  };

  // Remove button icon sizes
  const iconSizes = {
    sm: 'w-3 h-3',   // 12px
    md: 'w-3.5 h-3.5', // 14px
    lg: 'w-4 h-4',   // 16px
  };

  /**
   * Handle remove button click
   * Stops event propagation to prevent badge click events
   */
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent badge onClick from firing
    if (onRemove) {
      onRemove();
    }
  };

  /**
   * Keyboard handler for remove button
   * Allows Enter and Space keys to trigger removal
   */
  const handleRemoveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (onRemove) {
        onRemove();
      }
    }
  };

  // Determine badge content
  // Priority: count > children
  const badgeContent = count !== undefined ? count : children;

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        interactiveStyles,
        className,
      )}
      {...props}
    >
      {/* Dot indicator (optional) */}
      {dot && (
        <span
          className={cn(
            'rounded-full',
            dotSizes[size],
            // Dot inherits variant color but uses bg-current for white color
            'bg-white opacity-90',
          )}
          aria-hidden="true" // Decorative element
        />
      )}

      {/* Badge content (count or children) */}
      <span>{badgeContent}</span>

      {/* Remove button (optional) */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          className={cn(
            'ml-1 rounded-full',
            'hover:bg-white/20 active:bg-white/30',
            'transition-colors duration-150',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1',
          )}
          aria-label="Remove badge"
          tabIndex={0}
        >
          {/* X icon SVG */}
          <svg
            className={cn(iconSizes[size])}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

// Display name for React DevTools
Badge.displayName = 'Badge'
