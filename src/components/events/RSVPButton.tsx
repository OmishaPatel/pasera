'use client';

// RSVP Button Component
// Handles user RSVP with status dropdown

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { updateRSVP } from '@/app/actions/rsvp';
import { Check, X, Loader2, Clock } from 'lucide-react';

interface RSVPButtonProps {
  eventId: string;
  currentStatus?: 'going' | 'waitlist' | null;
  isAuthenticated: boolean;
  variant?: 'full' | 'compact';
  isFull?: boolean;
  isCancelled?: boolean;
  onStatusChange?: (status: 'going' | null) => void;
  onWaitlistRequired?: () => void;
  onLoginRequired?: () => void;
  waitlistPosition?: number | null;
}

export function RSVPButton({
  eventId,
  currentStatus,
  isAuthenticated,
  variant = 'full',
  isFull = false,
  isCancelled = false,
  onStatusChange,
  onWaitlistRequired,
  onLoginRequired,
  waitlistPosition,
}: RSVPButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRSVP = async () => {
    // Check authentication
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateRSVP(eventId, 'going');

      if (!result.success && result.action === 'join_waitlist') {
        // Event is full, redirect to waitlist
        onWaitlistRequired?.();
        setLoading(false);
        return;
      }

      onStatusChange?.('going');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update RSVP');
      console.error('RSVP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!isAuthenticated) return;

    // Delegate to parent component which handles modal confirmation
    onStatusChange?.(null);
  };

  // If on waitlist, show waitlist status
  if (currentStatus === 'waitlist') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
            {waitlistPosition ? `You're on the waitlist (#${waitlistPosition})` : "You're on the waitlist"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={loading}
        >
          Leave Waitlist
        </Button>
      </div>
    );
  }

  // No RSVP yet - show primary RSVP button
  if (!currentStatus) {
    const isDisabled = loading || !isAuthenticated || isFull || isCancelled;
    const buttonText = isCancelled ? 'Event Cancelled' : isFull ? 'Event Full' : 'RSVP to Event';

    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          fullWidth={variant === 'full'}
          onClick={handleRSVP}
          disabled={isDisabled}
          loading={loading}
        >
          {!isCancelled && !isFull && <Check size={18} />}
          {buttonText}
        </Button>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {!isAuthenticated && (
          <p className="text-xs text-gray-500 text-center">
            Sign in to RSVP
          </p>
        )}
      </div>
    );
  }

  // Has RSVP - show "Going" status and cancel button
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          fullWidth={variant === 'full'}
          disabled
          className="flex-1 bg-green-600 hover:bg-green-600"
        >
          <Check size={18} />
          Going
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={loading}
          title="Cancel RSVP"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
