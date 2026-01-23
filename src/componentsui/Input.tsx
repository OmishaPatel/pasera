'use client';

import React, {forwardRef} from 'react';
import {cn} from '@/lib/utils/cn';

/**
 * Input Component - Form Input Field
 * 
 * A flexible input component supporting various types (text, email, password, number, date, time, url).
 * Includes label, error states, helper text, and icon support.
 * 
 * Usage:
 *   <Input
 *     label="Email Address"
 *     type="email"
 *     placeholder="you@example.com"
 *     error={errors.email}
 *     required
 *   />
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Using forwardRef allows parent components to access the input DOM node
// This is useful for focusing inputs, form libraries, etc.
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      required,
      disabled,
      ...props
    },
    ref // Forwarded ref from parent component
  ) => {
    
    // Generate unique ID for accessibility (label association)
    // If no ID provided, create one from label or use a timestamp
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : `input-${Date.now()}`);
    
    // Helper text or error message ID for aria-describedby
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    // Base input styles
    // - appearance-none: Removes browser default styling
    // - outline-none: Custom focus styles used instead
    const baseInputStyles = cn(
      'w-full px-4 py-2.5 text-base',
      'bg-white border-2 rounded-[var(--radius-md)]',
      'text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-400)]',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:bg-[var(--color-gray-100)] disabled:cursor-not-allowed disabled:opacity-60',
    );

    // Border color based on state (error vs normal vs focused)
    const borderStyles = cn(
      error
        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
        : 'border-[var(--color-gray-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
    );

    // Add padding for icons if present
    const iconPadding = cn(
      leftIcon && 'pl-11', // Extra left padding for left icon
      rightIcon && 'pr-11', // Extra right padding for right icon
    );

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-gray-700)]"
          >
            {label}
            {/* Visual indicator for required fields */}
            {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper - relative positioning for icon placement */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              baseInputStyles,
              borderStyles,
              iconPadding,
              className,
            )}
            aria-invalid={!!error} // Announces error state to screen readers
            aria-describedby={
              // Links input to description/error for screen readers
              error ? errorId : helperText ? descriptionId : undefined
            }
            aria-required={required} // Announces required fields
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {helperText && !error && (
          <p
            id={descriptionId}
            className="text-sm text-[var(--color-gray-500)]"
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="text-sm text-[var(--color-danger)] flex items-center gap-1"
            role="alert" // Announces errors immediately to screen readers
          >
            {/* Error icon */}
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
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
Input.displayName = 'Input';