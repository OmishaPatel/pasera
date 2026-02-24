'use client';

// RSVP Button Component
// Handles user RSVP with status dropdown

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { updateRSVP, cancelRSVP } from '@/app/actions/rsvp';
import { claimWaitlistSpot } from '@/app/actions/waitlist';
import { Check, X, Loader2, Clock, PartyPopper } from 'lucide-react';

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
  waitlistNotifiedAt?: string | null;
  waitlistExpiresAt?: string | null;
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
  waitlistNotifiedAt,
  waitlistExpiresAt,
}: RSVPButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

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

    setLoading(true);
    setError(null);

    try {
      await cancelRSVP(eventId);
      onStatusChange?.(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel RSVP');
      console.error('Cancel RSVP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSpot = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      await claimWaitlistSpot(eventId);
      onStatusChange?.('going');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim spot');
      console.error('Claim spot error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Timer logic for claim window
  useEffect(() => {
    if (!waitlistExpiresAt || currentStatus !== 'waitlist' || !waitlistNotifiedAt) {
      setTimeRemaining(0);
      return;
    }

    const expiryTime = new Date(waitlistExpiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        return false;
      }

      setTimeRemaining(remaining);
      return true;
    };

    if (!updateTimer()) return;

    const interval = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [waitlistExpiresAt, currentStatus, waitlistNotifiedAt]);

  // Format time remaining
  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return '<1m';
  };

  // If on waitlist and notified, show claim button
  if (currentStatus === 'waitlist' && waitlistNotifiedAt && timeRemaining > 0) {
    const isUrgent = timeRemaining < 300000; // Less than 5 minutes

    return (
      <div className="flex flex-col gap-2">
        <div className={`p-3 rounded-lg border-2 ${
          isUrgent
            ? 'bg-red-50 border-red-300'
            : 'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <PartyPopper className={`w-5 h-5 ${
              isUrgent ? 'text-red-600' : 'text-green-600'
            }`} />
            <span className={`text-sm font-semibold ${
              isUrgent ? 'text-red-900' : 'text-green-900'
            }`}>
              Spot Available!
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className={`w-4 h-4 ${
              isUrgent ? 'text-red-600' : 'text-green-700'
            }`} />
            <span className={isUrgent ? 'text-red-800' : 'text-green-800'}>
              {formatTimeRemaining(timeRemaining)} remaining
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          fullWidth={variant === 'full'}
          onClick={handleClaimSpot}
          disabled={loading}
          loading={loading}
        >
          <Check size={18} />
          Claim Your Spot
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={loading}
        >
          Leave Waitlist
        </Button>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // If on waitlist but not notified yet, show regular waitlist status
  if (currentStatus === 'waitlist') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
          <span className="text-sm font-medium text-yellow-800">
            You're on the waitlist
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
