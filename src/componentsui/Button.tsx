'use client';

import React from 'react';
import {cn} from '@/lib/utils/cn';

/**
 * Button Component - Foundation UI Element
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading states, icons, and full accessibility compliance.
 * 
 * Usage:
 *   <Button variant="primary" size="md" onClick={handleClick}>
 *     Click Me
 *   </Button>
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props // Spreads all remaining HTML button attributes (onClick, type, etc.)
}: ButtonProps) {
 // Base styles applied to all buttons
  // - inline-flex: Allows icons and text to align properly
  // - items-center: Vertically centers content
  // - justify-center: Horizontally centers content
  // - font-medium: Slightly bolder text for readability
  // - transition: Smooth color/shadow changes on hover
  // - focus-visible:outline: Accessibility - keyboard navigation indicator
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-[var(--radius-md)] transition-all duration-200',
    'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  );


    // Variant styles - different visual treatments for different purposes
  const variantStyles = {
    // Primary: Main call-to-action (RSVP, Submit, etc.)
    primary: cn(
      'bg-[var(--color-primary)] text-white',
      'hover:bg-[var(--color-primary-hover)]',
      'active:bg-[var(--color-primary-hover)] active:shadow-[var(--shadow-primary)]',
      'shadow-[var(--shadow-md)]',
    ),
    // Secondary: Alternative actions (Cancel, View Details, etc.)
    secondary: cn(
      'bg-transparent border-2 border-[var(--color-secondary)] text-[var(--color-secondary)]',
      'hover:bg-[var(--color-secondary)] hover:text-white',
      'active:bg-[var(--color-secondary)]',
    ),
    // Ghost: Subtle actions (Close, Dismiss, etc.)
    ghost: cn(
      'bg-transparent text-[var(--color-gray-700)]',
      'hover:bg-[var(--color-gray-100)]',
      'active:bg-[var(--color-gray-200)]',
    ),
    // Danger: Destructive actions (Delete, Remove, etc.)
    danger: cn(
      'bg-[var(--color-danger)] text-white',
      'hover:bg-red-600',
      'active:bg-red-700 active:shadow-lg',
      'shadow-[var(--shadow-md)]',
    ),
  };

  // Size styles - different dimensions for different contexts
  // - py/px: Padding vertical/horizontal for comfortable touch targets
  // - text-sm/base/lg: Font sizes for hierarchy
  // - min-h: Ensures touch targets meet accessibility standards (44px minimum)
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px]', // Default - meets WCAG AA touch target
    lg: 'px-6 py-3 text-lg min-h-[52px]',
  };

   // Full width style - button stretches to container width
  const widthStyles = fullWidth ? 'w-full' : '';

  // Loading spinner SVG component
  // Animates infinitely to indicate processing state
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true" // Hides from screen readers (text alternative provided)
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  return (
    <button
        className={cn(baseStyles, variantStyles[variant],
            sizeStyles[size], widthStyles, className,
        )}
        disabled={disabled || loading} // disable button during loading
        aria-busy={loading} // announce loading state to screen reader
        {...props}// spread remaining props (onClick, type.id)
        >
            {loading && <LoadingSpinner/>}
            {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>
                {loading ? 'Loading...' : children}
            </span>
            {/* Right icon (only shown when not loading) */}
            {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}

    </button>
  )
}