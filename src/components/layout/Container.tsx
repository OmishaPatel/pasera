'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Container Component - Responsive Page Wrapper
 *
 * Provides consistent max-width and padding for page content across the application.
 * Supports multiple width variants and responsive padding patterns.
 *
 * @example
 * // Default usage (lg width, md padding, centered)
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 *
 * @example
 * // Custom size and padding
 * <Container size="sm" padding="lg">
 *   <article>Blog post content</article>
 * </Container>
 *
 * @example
 * // Full-width hero section
 * <Container size="full" padding="none">
 *   <HeroSection />
 * </Container>
 */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width variant
   * - sm: 768px (narrow content like blog posts)
   * - md: 896px (medium content like forms)
   * - lg: 1152px (wide content like event listings) - default
   * - xl: 1280px (extra wide like dashboards)
   * - full: 100% width (full-width sections like heroes)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Responsive padding variant (mobile → desktop)
   * - none: No padding
   * - sm: 16px → 24px
   * - md: 16px → 32px - default
   * - lg: 24px → 48px
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Center content horizontally using margin auto
   * @default true
   */
  centered?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Child elements to render inside container */
  children: React.ReactNode;
}

export function Container({
  size = 'lg',
  padding = 'md',
  centered = true,
  className,
  children,
  ...props
}: ContainerProps) {

  // Max-width variants based on Tailwind breakpoints
  // These prevent content from becoming too wide on large screens
  const sizeStyles = {
    sm: 'max-w-3xl',    // 768px - Narrow content (blog posts, articles)
    md: 'max-w-4xl',    // 896px - Medium content (forms, modals)
    lg: 'max-w-6xl',    // 1152px - Wide content (event listings, grids)
    xl: 'max-w-7xl',    // 1280px - Extra wide (dashboards, complex layouts)
    full: 'max-w-full', // 100% - Full width (hero sections, banners)
  };

  // Responsive padding using mobile-first approach
  // Format: mobile (default) → tablet (md:) → desktop
  // px = horizontal padding, py = vertical padding
  const paddingStyles = {
    none: 'px-0 py-0',
    sm: 'px-4 py-3 md:px-6 md:py-4',           // 16px/12px → 24px/16px
    md: 'px-4 py-4 md:px-8 md:py-6',           // 16px/16px → 32px/24px (default)
    lg: 'px-6 py-6 md:px-12 md:py-8',          // 24px/24px → 48px/32px
  };

  // Horizontal centering - aligns container in the middle of its parent
  const centerStyles = centered ? 'mx-auto' : '';

  return (
    <div
      className={cn(
        // Base styles - full width of parent
        'w-full',
        // Apply size variant (max-width)
        sizeStyles[size],
        // Apply padding variant (responsive)
        paddingStyles[padding],
        // Apply centering if enabled
        centerStyles,
        // User-provided className overrides
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Display name for React DevTools
Container.displayName = 'Container';
