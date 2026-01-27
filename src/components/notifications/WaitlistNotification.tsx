'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * WaitlistNotification Component
 *
 * Toast notification displayed when a waitlist spot opens.
 * Shows countdown timer and claim/dismiss actions.
 *
 * Usage:
 *   <WaitlistNotification
 *     eventId="123"
 *     eventTitle="Saturday Hike"
 *     expiresAt="2026-01-27T18:00:00Z"
 *     onClaim={handleClaim}
 *     onDismiss={handleDismiss}
 *     position="top-right"
 *   />
 */

export interface WaitlistNotificationProps {
  eventId: string;
  eventTitle: string;
  expiresAt: string; // ISO timestamp (2 hours from notification)
  onClaim: () => Promise<void>;
  onDismiss: () => void;
  position?: 'top-right' | 'top-center' | 'bottom-right';
  className?: string;
}

export function WaitlistNotification({
  eventId,
  eventTitle,
  expiresAt,
  onClaim,
  onDismiss,
  position = 'top-right',
  className,
}: WaitlistNotificationProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [claiming, setClaiming] = useState(false);

  // Timer logic
  useEffect(() => {
    const expiryTime = new Date(expiresAt).getTime();

    // Update immediately
    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        onDismiss(); // Auto-dismiss when expired
        return false;
      }

      setTimeRemaining(remaining);
      return true;
    };

    // Initial update
    if (!updateTimer()) return;

    // Update every second
    const interval = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onDismiss]);

  // Format time remaining
  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  // Handle claim
  const handleClaim = async () => {
    setClaiming(true);

    try {
      await onClaim();
      onDismiss();
    } catch (error) {
      console.error('Failed to claim spot:', error);
      setClaiming(false);
    }
  };

  // Position styles
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={cn(
        'fixed z-50',
        'w-full max-w-sm mx-4 sm:mx-0',
        'bg-white rounded-lg shadow-2xl',
        'border-l-4 border-[var(--color-primary)]',
        'p-4 space-y-3',
        'animate-slide-in-right',
        positionStyles[position],
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-shrink-0">
            <PartyPopper size={24} className="text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-gray-900)]">
              Spot Available!
            </h3>
            <p className="text-sm text-[var(--color-gray-600)] truncate">
              {eventTitle}
            </p>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-md',
            'text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]',
            'hover:bg-[var(--color-gray-100)]',
            'transition-colors'
          )}
          aria-label="Dismiss notification"
        >
          <X size={20} />
        </button>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between py-2 px-3 bg-[var(--color-gray-50)] rounded-[var(--radius-md)]">
        <span className="text-sm text-[var(--color-gray-600)]">
          Time remaining:
        </span>
        <span className={cn(
          'text-sm font-semibold',
          timeRemaining < 300000 // Less than 5 minutes
            ? 'text-[var(--color-danger)]'
            : 'text-[var(--color-gray-900)]'
        )}>
          {formatTimeRemaining(timeRemaining)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleClaim}
          loading={claiming}
          disabled={claiming}
          className="flex-1"
        >
          Claim Spot
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          disabled={claiming}
        >
          Later
        </Button>
      </div>
    </div>
  );
}

WaitlistNotification.displayName = 'WaitlistNotification';
