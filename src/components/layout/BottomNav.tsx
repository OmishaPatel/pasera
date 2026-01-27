'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';

/**
 * BottomNav Component - Mobile Bottom Navigation
 *
 * Fixed bottom navigation bar for mobile devices (< 768px).
 * Provides quick access to main app sections with active state indication
 * and optional notification badges.
 *
 * Features:
 * - Shows only on mobile (< 768px) by default
 * - Active state based on current pathname
 * - Badge support for notifications
 * - Smooth transitions
 * - iOS safe area inset support
 *
 * @example
 * import { Home, Search, Plus, User } from 'lucide-react';
 *
 * const bottomNavItems = [
 *   { label: 'Home', href: '/', icon: <Home size={24} /> },
 *   { label: 'Browse', href: '/events', icon: <Search size={24} /> },
 *   { label: 'Create', href: '/events/create', icon: <Plus size={24} /> },
 *   { label: 'Profile', href: '/profile', icon: <User size={24} />, badge: 3 },
 * ];
 *
 * <BottomNav items={bottomNavItems} />
 */

// Single navigation item
export interface BottomNavItem {
  /** Display label (shown below icon) */
  label: string;

  /** Navigation href */
  href: string;

  /** Icon component (from lucide-react) */
  icon: React.ReactNode;

  /** Optional notification badge count */
  badge?: number;
}

export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items (typically 3-5 items for best UX) */
  items: BottomNavItem[];

  /**
   * Hide navigation on desktop (>= 768px)
   * @default true
   */
  hideOnDesktop?: boolean;
}

export function BottomNav({
  items,
  hideOnDesktop = true,
  className,
  ...props
}: BottomNavProps) {

  // Get current pathname to determine active item
  // usePathname is a Next.js hook that returns the current URL pathname
  const pathname = usePathname();

  /**
   * Check if a navigation item is active based on current pathname
   * - For home ('/'), only exact match
   * - For other routes, matches if pathname starts with href
   */
  const isActive = (href: string) => {
    // Home route requires exact match
    if (href === '/') {
      return pathname === '/';
    }
    // Other routes match if pathname starts with href
    // e.g., '/events/123' matches '/events'
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        // Fixed positioning at bottom of viewport
        'fixed bottom-0 left-0 right-0 z-50',
        // Styling - white background with top border and shadow
        'bg-white border-t border-[var(--color-gray-200)]',
        // Upward shadow (negative y-offset)
        'shadow-[0_-2px_8px_rgba(0,0,0,0.08)]',
        // Hide on desktop if enabled (show only on mobile)
        hideOnDesktop && 'md:hidden',
        className,
      )}
      role="navigation"
      aria-label="Mobile navigation"
      {...props}
    >
      {/* Navigation items container */}
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // Layout - vertical stack (icon on top, label below)
                'relative flex flex-col items-center justify-center',
                // Sizing - minimum width for touch targets, full height
                'min-w-[64px] h-full px-2',
                // Smooth transitions for all properties
                'transition-all duration-200',
                // Focus state (keyboard navigation)
                'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                'rounded-[var(--radius-md)]',
                // Active state - primary color
                active
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon container */}
              <div className="relative">
                {/* Icon with scale effect on active */}
                <div className={cn(
                  'transition-transform duration-200',
                  active && 'scale-110', // Slightly larger when active
                )}>
                  {item.icon}
                </div>

                {/* Notification badge (if count > 0) */}
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Badge
                      count={item.badge}
                      variant="danger"
                      className="text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Label text */}
              <span className={cn(
                'text-xs mt-1',
                'transition-all duration-200',
                // Bold when active, medium otherwise
                active ? 'font-semibold' : 'font-medium',
              )}>
                {item.label}
              </span>

              {/* Active indicator - bottom line */}
              {active && (
                <div
                  className={cn(
                    // Positioning - centered at bottom
                    'absolute bottom-0 left-1/2 -translate-x-1/2',
                    // Styling - small primary-colored line with rounded top
                    'w-12 h-0.5 bg-[var(--color-primary)]',
                    'rounded-t-full',
                  )}
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* iOS safe area inset for devices with home indicator */}
      {/* This adds extra padding at the bottom on iPhone X and newer */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  );
}

// Display name for React DevTools
BottomNav.displayName = 'BottomNav';
