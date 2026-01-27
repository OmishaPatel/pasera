'use client';

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/Input';

/**
 * TimePicker Component - Enhanced Native Time Input Wrapper
 *
 * A wrapper around the Input component with type="time" and a default clock icon.
 * Provides a consistent interface for time selection using the browser's native time picker.
 *
 * Usage:
 *   <TimePicker
 *     label="Start Time"
 *     minTime="08:00"
 *     maxTime="18:00"
 *     use24Hour
 *     error={errors.startTime}
 *     required
 *   />
 */

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  minTime?: string;          // Time string (HH:mm)
  maxTime?: string;          // Time string (HH:mm)
  use24Hour?: boolean;       // 24-hour format (default: false) - browser-dependent
}

// Clock icon component
const ClockIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Using forwardRef allows parent components to access the input DOM node
// This is useful for form libraries like React Hook Form
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      fullWidth,
      minTime,
      maxTime,
      use24Hour,
      ...props
    },
    ref // Forwarded ref from parent component
  ) => {
    // Default to clock icon if no custom icon provided
    const icon = leftIcon !== undefined ? leftIcon : <ClockIcon />;

    return (
      <Input
        ref={ref}
        type="time"
        label={label}
        error={error}
        helperText={helperText}
        leftIcon={icon}
        fullWidth={fullWidth}
        min={minTime}
        max={maxTime}
        step={use24Hour ? '60' : undefined}
        {...props}
      />
    );
  }
);

// Display name for React DevTools
TimePicker.displayName = 'TimePicker';
