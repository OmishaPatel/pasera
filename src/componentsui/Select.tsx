'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Select Component - Native HTML Select Dropdown
 *
 * A native select dropdown with consistent form styling, label, error states,
 * and helper text. Follows the same structure as the Input component.
 *
 * Usage:
 *   <Select
 *     label="Event Type"
 *     placeholder="Select an event type"
 *     error={errors.eventType}
 *     required
 *   >
 *     <option value="hiking">Hiking</option>
 *     <option value="camping">Camping</option>
 *     <optgroup label="Water Activities">
 *       <option value="kayaking">Kayaking</option>
 *     </optgroup>
 *   </Select>
 */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;      // Renders as disabled first option
  fullWidth?: boolean;
  children: React.ReactNode; // <option> or <optgroup> elements
}

// Using forwardRef allows parent components to access the select DOM node
// This is useful for form libraries like React Hook Form
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      placeholder,
      fullWidth = false,
      className,
      id,
      required,
      disabled,
      children,
      ...props
    },
    ref // Forwarded ref from parent component
  ) => {
    // Generate unique ID for accessibility (label association)
    // If no ID provided, create one from label or use a timestamp
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : `select-${Date.now()}`);

    // Helper text or error message ID for aria-describedby
    const descriptionId = `${selectId}-description`;
    const errorId = `${selectId}-error`;

    // Base select styles
    // appearance-none removes the default browser dropdown arrow
    const baseSelectStyles = cn(
      'w-full px-4 py-2.5 text-base',
      'bg-white border-2 rounded-[var(--radius-md)]',
      'text-[var(--color-gray-800)]',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:bg-[var(--color-gray-100)] disabled:cursor-not-allowed disabled:opacity-60',
      'appearance-none', // Remove default browser arrow
      'cursor-pointer',
    );

    // Border color based on state (error vs normal vs focused)
    const borderStyles = cn(
      error
        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
        : 'border-[var(--color-gray-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
    );

    // Padding adjustments
    // Right padding for chevron icon (always present)
    // Left padding for optional left icon
    const iconPadding = cn(
      'pr-10', // Always reserve space for chevron
      leftIcon && 'pl-11', // Extra left padding for left icon
    );

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--color-gray-700)]"
          >
            {label}
            {/* Visual indicator for required fields */}
            {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Select wrapper - relative positioning for icon placement */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none z-10">
              {leftIcon}
            </div>
          )}

          {/* Select Element */}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              baseSelectStyles,
              borderStyles,
              iconPadding,
              className,
            )}
            aria-invalid={!!error} // Announces error state to screen readers
            aria-describedby={
              // Links select to description/error for screen readers
              error ? errorId : helperText ? descriptionId : undefined
            }
            aria-required={required} // Announces required fields
            {...props}
          >
            {/* Placeholder as disabled first option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          {/* Chevron Icon - Always present on right side */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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
Select.displayName = 'Select';
