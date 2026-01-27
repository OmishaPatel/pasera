'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { User } from 'lucide-react'; // Fallback icon

/**
 * Avatar Component - User Profile Image
 * 
 * Displays user avatars with automatic fallback to initials or icon.
 * Supports multiple sizes, shapes, status indicators, and badge overlays.
 * Includes loading states with skeleton shimmer animation.
 * 
 * Usage:
 *   <Avatar src="/user.jpg" alt="John Doe" size="md" />
 *   <Avatar alt="John Doe" initials="JD" status="online" />
 *   <Avatar src="/user.jpg" alt="Jane Smith" statusBadge={<Badge count={5} />} />
 *   <Avatar alt="Loading..." loading />
 */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;                    // Image URL
  alt: string;                     // Required for accessibility
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;               // Fallback initials (e.g., "JD")
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy'; // Status indicator
  statusBadge?: React.ReactNode;   // Custom badge overlay
  loading?: boolean;               // Shows skeleton loading state
}

export function Avatar({
  src,
  alt,
  size = 'md',
  initials,
  shape = 'circle',
  status,
  statusBadge,
  loading = false,
  className,
  ...props
}: AvatarProps) {
  
  // Track image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Extract initials from alt text
   * Takes first letter of first and last word
   * Example: "John Doe" → "JD"
   * Example: "Jane" → "J"
   */
  const getInitialsFromAlt = (): string => {
    if (initials) return initials.toUpperCase().slice(0, 2);
    
    const words = alt.trim().split(/\s+/);
    if (words.length === 0) return '';
    
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    // First letter of first and last word
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  };

  const displayInitials = getInitialsFromAlt();

  // Base styles for avatar container
  const baseStyles = cn(
    'relative inline-flex items-center justify-center',
    'bg-[var(--color-gray-200)] text-[var(--color-gray-700)]',
    'border-2 border-[var(--color-gray-300)]',
    'font-semibold overflow-hidden',
    'transition-all duration-200',
    'select-none', // Prevent text selection
  );

  // Size styles
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',      // 24px
    sm: 'w-8 h-8 text-sm',      // 32px
    md: 'w-10 h-10 text-base',  // 40px (default)
    lg: 'w-14 h-14 text-lg',    // 56px
    xl: 'w-20 h-20 text-2xl',   // 80px
  };

  // Shape styles
  const shapeStyles = {
    circle: 'rounded-[var(--radius-full)]',
    square: 'rounded-[var(--radius-md)]',
  };

  // Status indicator colors
  const statusColors = {
    online: 'bg-[var(--color-success)]',
    offline: 'bg-[var(--color-gray-400)]',
    away: 'bg-[var(--color-warning)]',
    busy: 'bg-[var(--color-danger)]',
  };

  // Status indicator sizes (25% of avatar size)
  const statusSizes = {
    xs: 'w-1.5 h-1.5',  // 6px
    sm: 'w-2 h-2',      // 8px
    md: 'w-2.5 h-2.5',  // 10px
    lg: 'w-3.5 h-3.5',  // 14px
    xl: 'w-5 h-5',      // 20px
  };

  // Fallback icon sizes (60% of avatar size)
  const iconSizes = {
    xs: 14,  // 60% of 24px
    sm: 19,  // 60% of 32px
    md: 24,  // 60% of 40px
    lg: 34,  // 60% of 56px
    xl: 48,  // 60% of 80px
  };

  // Loading shimmer animation
  const loadingStyles = loading ? 'animate-pulse' : '';

  /**
   * Determine what to display:
   * 1. Loading state → gray shimmer
   * 2. Image (if src provided and loaded successfully)
   * 3. Initials (if image failed or no src)
   * 4. User icon (if no initials available)
   */
  const shouldShowImage = src && imageLoaded && !imageError && !loading;
  const shouldShowInitials = !shouldShowImage && displayInitials && !loading;
  const shouldShowIcon = !shouldShowImage && !shouldShowInitials && !loading;

  return (
    <div
      className={cn(
        baseStyles,
        sizeStyles[size],
        shapeStyles[shape],
        loadingStyles,
        className,
      )}
      role="img"
      aria-label={alt}
      {...props}
    >
      {/* Image */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            shouldShowImage ? 'block' : 'hidden',
          )}
          onLoad={() => {
            setImageLoaded(true);
            setImageError(false);
          }}
          onError={() => {
            setImageLoaded(false);
            setImageError(true);
          }}
        />
      )}

      {/* Initials fallback */}
      {shouldShowInitials && (
        <span className="font-semibold">
          {displayInitials}
        </span>
      )}

      {/* Icon fallback */}
      {shouldShowIcon && (
        <User
          size={iconSizes[size]}
          className="text-[var(--color-gray-500)]"
          aria-hidden="true"
        />
      )}

      {/* Status indicator dot */}
      {status && !loading && (
        <span
          className={cn(
            'absolute bottom-0 right-0',
            'rounded-full',
            'border-2 border-white',
            statusSizes[size],
            statusColors[status],
          )}
          aria-label={`Status: ${status}`}
        />
      )}

      {/* Custom badge overlay (e.g., notification count) */}
      {statusBadge && !loading && (
        <div
          className="absolute -top-1 -right-1"
          style={{ transform: 'translate(25%, -25%)' }}
        >
          {statusBadge}
        </div>
      )}
    </div>
  );
}

// Display name for React DevTools
Avatar.displayName = 'Avatar';