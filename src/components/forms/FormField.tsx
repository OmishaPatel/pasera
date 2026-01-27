'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

/**
 * FormField Component - Composition Wrapper for Form Fields
 *
 * A composition wrapper that provides consistent layout and accessibility
 * for custom form fields that don't have built-in label/error support.
 *
 * NOTE: Do NOT use with Input, Textarea, Select, DatePicker, or TimePicker
 * as they already have built-in label/error/helper text support.
 *
 * @example
 * // Good - for custom components
 * <FormField label="Custom Field" error={errors.custom} required>
 *   <CustomInput {...props} />
 * </FormField>
 *
 * @example
 * // Bad - Input already has label support
 * <FormField label="Email">
 *   <Input label="Email" /> // Double labels!
 * </FormField>
 *
 * @example
 * // Correct way with Input
 * <Input label="Email" error={errors.email} />
 */

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode; // Any form field component
}

export function FormField({
  label,
  error,
  helperText,
  required,
  optional,
  children,
  className,
  ...props
}: FormFieldProps) {
  // Generate unique IDs for accessibility using React's useId hook
  // This ensures stable IDs across server and client renders (no hydration mismatch)
  const id = React.useId();
  const fieldId = `field-${id}`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  // Clone children and inject aria attributes for accessibility
  // This ensures proper screen reader announcements
  const enhancedChildren = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        id: fieldId,
        'aria-invalid': !!error,
        'aria-describedby': error ? errorId : helperText ? descriptionId : undefined,
        'aria-required': required,
      })
    : children;

  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {/* Label with required/optional indicators */}
      {label && (
        <FormLabel
          htmlFor={fieldId}
          required={required}
          optional={optional}
        >
          {label}
        </FormLabel>
      )}

      {/* Enhanced children with aria attributes */}
      {enhancedChildren}

      {/* Helper text (only shown when no error) */}
      {helperText && !error && (
        <p
          id={descriptionId}
          className="text-sm text-[var(--color-gray-500)]"
        >
          {helperText}
        </p>
      )}

      {/* Error message */}
      {error && <FormError error={error} errorId={errorId} />}
    </div>
  );
}
