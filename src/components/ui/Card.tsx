'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Card Component - Compound Container Component
 * 
 * A flexible card component using compound component pattern.
 * Composed of Card (container), CardHeader, CardBody, and CardFooter.
 * 
 * Usage:
 *   <Card variant="default" hoverable>
 *     <CardHeader title="Event Title" subtitle="June 15, 2026" />
 *     <CardBody>
 *       <p>Event description goes here...</p>
 *     </CardBody>
 *     <CardFooter>
 *       <Button>RSVP</Button>
 *     </CardFooter>
 *   </Card>
 */

// ============================================================================
// Card Container Component
// ============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean; // Makes entire card clickable
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className,
  children,
  onClick,
  ...props
}: CardProps) {
  
  // Base card styles
  // - overflow-hidden: Ensures rounded corners clip child content
  // - bg-white: Clean white background
  const baseStyles = cn(
    'bg-white rounded-[var(--radius-lg)] overflow-hidden',
    'transition-all duration-200',
  );

  // Variant styles - different elevation/border treatments
  const variantStyles = {
    // Default: Subtle shadow for depth
    default: 'shadow-[var(--shadow-md)] border border-[var(--color-gray-200)]',
    
    // Outlined: Border only, no shadow
    outlined: 'border-2 border-[var(--color-gray-300)]',
    
    // Flat: No border or shadow (blends with background)
    flat: 'border border-[var(--color-gray-100)]',
  };

  // Padding styles for card content
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Hover effect (optional)
  const hoverStyles = hoverable
    ? 'hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 hover:border-[var(--color-primary)]'
    : '';

  // Clickable styling
  const clickableStyles = clickable || onClick
    ? 'cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2'
    : '';
  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    hoverStyles,
    clickableStyles,
    className,
  );
  // Determine element type based on clickability
  // Use <button> for clickable cards for better accessibility
  const Component = clickable || onClick ? 'button' : 'div';
  // For button element, filter out div-specific attributes
  if (Component === 'button') {
    return (
      <button
        className={combinedClassName}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
  return (
    <div
      className={combinedClassName}
      onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
      role={clickable && !onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}

// ============================================================================
// CardHeader Component
// ============================================================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode; // Action button/icon in top-right
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        'pb-4 border-b border-[var(--color-gray-200)]',
        className,
      )}
      {...props}
    >
      {/* Title and subtitle section */}
      <div className="flex-1 min-w-0"> {/* min-w-0 allows text truncation */}
        {title && (
          <h3 className="text-lg font-semibold text-[var(--color-gray-900)] truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-[var(--color-gray-500)] mt-1">
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {/* Action button/icon */}
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CardBody Component
// ============================================================================

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardBody({
  className,
  children,
  ...props
}: CardBodyProps) {
  return (
    <div
      className={cn(
        'py-4 text-[var(--color-gray-700)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// CardFooter Component
// ============================================================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export function CardFooter({
  align = 'right',
  className,
  children,
  ...props
}: CardFooterProps) {
  
  // Alignment styles
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        'pt-4 border-t border-[var(--color-gray-200)]',
        alignmentStyles[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}