'use client';

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/Input';

/**
 * DatePicker Component - Enhanced Native Date Input Wrapper
 *
 * A wrapper around the Input component with type="date" and a default calendar icon.
 * Provides a consistent interface for date selection using the browser's native date picker.
 *
 * Usage:
 *   <DatePicker
 *     label="Event Date"
 *     minDate="2026-01-25"
 *     maxDate="2026-12-31"
 *     error={errors.eventDate}
 *     required
 *   />
 */

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  minDate?: string;          // ISO date string (YYYY-MM-DD)
  maxDate?: string;          // ISO date string (YYYY-MM-DD)
}

// Calendar icon component
const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// Using forwardRef allows parent components to access the input DOM node
// This is useful for form libraries like React Hook Form
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      fullWidth,
      minDate,
      maxDate,
      ...props
    },
    ref // Forwarded ref from parent component
  ) => {
    // Default to calendar icon if no custom icon provided
    const icon = leftIcon !== undefined ? leftIcon : <CalendarIcon />;

    return (
      <Input
        ref={ref}
        type="date"
        label={label}
        error={error}
        helperText={helperText}
        leftIcon={icon}
        fullWidth={fullWidth}
        min={minDate}
        max={maxDate}
        {...props}
      />
    );
  }
);

// Display name for React DevTools
DatePicker.displayName = 'DatePicker';
