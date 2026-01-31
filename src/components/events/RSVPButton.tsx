'use client';

// RSVP Button Component
// Handles user RSVP with status dropdown

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { updateRSVP, cancelRSVP } from '@/app/actions/rsvp';
import { Check, X, Loader2 } from 'lucide-react';

interface RSVPButtonProps {
  eventId: string;
  currentStatus?: 'going' | 'maybe' | 'interested' | 'waitlist' | null;
  isAuthenticated: boolean;
  onStatusChange?: (status: 'going' | 'maybe' | 'interested' | null) => void;
  onWaitlistRequired?: () => void;
  onLoginRequired?: () => void;
}

export function RSVPButton({
  eventId,
  currentStatus,
  isAuthenticated,
  onStatusChange,
  onWaitlistRequired,
  onLoginRequired,
}: RSVPButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus && currentStatus !== 'waitlist' ? currentStatus : 'none'
  );

  const handleRSVP = async (status: 'going' | 'maybe' | 'interested') => {
    // Check authentication
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateRSVP(eventId, status);

      if (!result.success && result.action === 'join_waitlist') {
        // Event is full, redirect to waitlist
        onWaitlistRequired?.();
        setLoading(false);
        return;
      }

      setSelectedStatus(status);
      onStatusChange?.(status);
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
      setSelectedStatus('none');
      onStatusChange?.(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel RSVP');
      console.error('Cancel RSVP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    if (newStatus === 'none') {
      await handleCancel();
    } else {
      await handleRSVP(newStatus as 'going' | 'maybe' | 'interested');
    }
  };

  // If on waitlist, show waitlist status
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
  if (!currentStatus || selectedStatus === 'none') {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          fullWidth
          onClick={() => handleRSVP('going')}
          disabled={loading || !isAuthenticated}
          loading={loading}
        >
          <Check size={18} />
          RSVP to Event
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

  // Has RSVP - show status dropdown and cancel button
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select
            value={selectedStatus}
            onChange={handleSelectChange}
            disabled={loading}
          >
            <option value="none">No RSVP</option>
            <option value="going">Going</option>
            <option value="maybe">Maybe</option>
            <option value="interested">Interested</option>
          </Select>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={handleCancel}
          disabled={loading}
          title="Cancel RSVP"
        >
          <X size={18} />
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {loading && (
        <p className="text-xs text-gray-500 text-center">
          Updating RSVP...
        </p>
      )}
    </div>
  );
}
