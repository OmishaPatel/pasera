'use client';

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {cn} from '@/lib/utils/cn';

/**
 * Textarea Component - Multi-line Text Input
 * 
 * A textarea component with optional auto-resize, character counter, and error states.
 * Supports all standard textarea functionality with enhanced UX features.
 * 
 * Usage:
 *   <Textarea
 *     label="Event Description"
 *     placeholder="Tell us about your event..."
 *     maxLength={500}
 *     showCharCount
 *     autoResize
 *   />
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      showCharCount = false,
      autoResize = false,
      minRows = 3,
      maxRows,
      fullWidth = false,
      className,
      id,
      required,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    // Local ref for auto-resize functionality (merged with forwarded ref)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    // Track character count locally
    const [charCount, setCharCount] = useState(0);

    // Generate unique ID for accessibility
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : `textarea-${Date.now()}`);
    const descriptionId = `${textareaId}-description`;
    const errorId = `${textareaId}-error`;
    const charCountId = `${textareaId}-charcount`;

    /**
     * Auto-resize function
     * Adjusts textarea height based on content
     * Respects minRows and maxRows constraints
     */
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea || !autoResize) return;

      // Reset height to auto to get accurate scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate line height and constraints
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows ? maxRows * lineHeight : Infinity;
      
      // Set new height within constraints
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    };

    /**
     * Handle value changes
     * Updates character count and triggers auto-resize
     */
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      // Update character count
      setCharCount(newValue.length);
      
      // Trigger auto-resize
      if (autoResize) {
        adjustHeight();
      }
      
      // Call parent onChange handler
      if (onChange) {
        onChange(e);
      }
    };

    /**
     * Initialize character count and height on mount
     */
    useEffect(() => {
      if (value) {
        setCharCount(String(value).length);
      }
      if (autoResize) {
        adjustHeight();
      }
    }, [value, autoResize]);

    /**
     * Merge forwarded ref with local ref
     * This allows both auto-resize and parent ref access
     */
    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Base textarea styles
    const baseStyles = cn(
      'w-full px-4 py-2.5 text-base',
      'bg-white border-2 rounded-[var(--radius-md)]',
      'text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-400)]',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:bg-[var(--color-gray-100)] disabled:cursor-not-allowed disabled:opacity-60',
      'resize-none', // Disable manual resize (auto-resize handles it)
    );

    // Border styles based on state
    const borderStyles = cn(
      error
        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
        : 'border-[var(--color-gray-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
    );

    // Calculate if approaching character limit (for visual warning)
    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--color-gray-700)]"
          >
            {label}
            {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Textarea Element */}
        <textarea
          ref={setRefs}
          id={textareaId}
          disabled={disabled}
          rows={!autoResize ? minRows : undefined}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={cn(
            baseStyles,
            borderStyles,
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            error && errorId,
            helperText && descriptionId,
            showCharCount && charCountId,
          )}
          aria-required={required}
          {...props}
        />

        {/* Helper Text, Error, and Character Count Container */}
        <div className="flex items-center justify-between gap-2">
          {/* Helper Text or Error Message */}
          <div className="flex-1">
            {helperText && !error && (
              <p
                id={descriptionId}
                className="text-sm text-[var(--color-gray-500)]"
              >
                {helperText}
              </p>
            )}

            {error && (
              <p
                id={errorId}
                className="text-sm text-[var(--color-danger)] flex items-center gap-1"
                role="alert"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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

          {/* Character Counter */}
          {showCharCount && maxLength && (
            <p
              id={charCountId}
              className={cn(
                'text-sm font-medium tabular-nums',
                isOverLimit && 'text-[var(--color-danger)]',
                isNearLimit && !isOverLimit && 'text-[var(--color-warning)]',
                !isNearLimit && 'text-[var(--color-gray-500)]',
              )}
              aria-live="polite" // Announces count updates to screen readers
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';