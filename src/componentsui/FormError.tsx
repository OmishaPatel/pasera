'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * FormError Component - Reusable Error Message Display
 *
 * A standalone error message component with consistent styling and icon.
 * Used for displaying validation errors in forms.
 *
 * @example
 * <FormError error="This field is required" />
 * <FormError error="Invalid email format" errorId="email-error" />
 * <FormError error="Password too short" showIcon={false} />
 */

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;           // Error message text
  errorId?: string;         // Custom ID for aria-describedby
  showIcon?: boolean;       // Show error icon (default: true)
}

export function FormError({
  error,
  errorId,
  showIcon = true,
  className,
  ...props
}: FormErrorProps) {
  // Don't render anything if there's no error
  if (!error) return null;

  return (
    <p
      id={errorId}
      className={cn(
        'text-sm text-[var(--color-danger)] flex items-center gap-1',
        className
      )}
      role="alert" // Announces errors immediately to screen readers
      {...props}
    >
      {/* Error icon - same as Input component */}
      {showIcon && (
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{error}</span>
    </p>
  );
}
