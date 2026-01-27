'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * FormLabel Component - Standalone Form Label
 *
 * A reusable label component with required and optional indicators.
 * Uses the same styling as labels in Input/Textarea components.
 *
 * @example
 * <FormLabel htmlFor="email" required>Email Address</FormLabel>
 * <FormLabel htmlFor="phone" optional>Phone Number</FormLabel>
 * <FormLabel htmlFor="name">Full Name</FormLabel>
 */

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;       // Show red asterisk
  optional?: boolean;       // Show "(optional)" text
  children: React.ReactNode;
}

export function FormLabel({
  required,
  optional,
  children,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium text-[var(--color-gray-700)]',
        className
      )}
      {...props}
    >
      {children}
      {/* Visual indicator for required fields - takes precedence over optional */}
      {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
      {/* Visual indicator for optional fields - only shows if not required */}
      {!required && optional && (
        <span className="text-[var(--color-gray-500)] ml-1 font-normal">(optional)</span>
      )}
    </label>
  );
}
