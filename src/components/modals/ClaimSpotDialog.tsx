'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { claimWaitlistSpot } from '@/app/actions/waitlist';
import { PartyPopper, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * ClaimSpotDialog Component
 *
 * Modal dialog that opens when user clicks claim link from waitlist notification email.
 * Shows countdown timer, validates claim eligibility, and handles claim action.
 *
 * Usage:
 *   <ClaimSpotDialog
 *     open={showClaimDialog}
 *     onClose={() => setShowClaimDialog(false)}
 *     eventId="event-123"
 *     eventTitle="Saturday Hike"
 *     expiresAt="2026-01-27T18:00:00Z"
 *     onSuccess={() => router.refresh()}
 *   />
 */

export interface ClaimSpotDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  expiresAt?: string | null; // ISO timestamp for 2-hour expiration
  onSuccess?: () => void;
}

export function ClaimSpotDialog({
  open,
  onClose,
  eventId,
  eventTitle,
  expiresAt,
  onSuccess,
}: ClaimSpotDialogProps) {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!expiresAt || !open) {
      setTimeRemaining(0);
      return;
    }

    const expiryTime = new Date(expiresAt).getTime();

    // Update immediately
    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);
        return false;
      }

      setTimeRemaining(remaining);
      setIsExpired(false);
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
  }, [expiresAt, open]);

  // Format time remaining
  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  // Handle claim
  const handleClaim = async () => {
    if (isExpired) {
      setError('Your claim window has expired. Please rejoin the waitlist.');
      return;
    }

    setClaiming(true);
    setError(null);

    try {
      await claimWaitlistSpot(eventId);
      setSuccess(true);

      // Clean up URL query parameter
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('claim');
        window.history.replaceState({}, '', url.toString());
      }

      // Wait a moment to show success state
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim spot';
      setError(errorMessage);
      setClaiming(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setClaiming(false);
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  // Check if time is running low (less than 5 minutes)
  const isUrgent = timeRemaining > 0 && timeRemaining < 300000;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      closeOnBackdropClick={!claiming && !success}
      closeOnEsc={!claiming && !success}
      showCloseButton={!claiming && !success}
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          {success ? (
            <CheckCircle2 size={28} className="text-green-600" />
          ) : isExpired ? (
            <AlertCircle size={28} className="text-[var(--color-danger)]" />
          ) : (
            <PartyPopper size={28} className="text-[var(--color-primary)]" />
          )}
          <ModalTitle>
            {success ? 'Spot Claimed!' : isExpired ? 'Claim Expired' : 'Claim Your Spot'}
          </ModalTitle>
        </div>
      </ModalHeader>

      <ModalBody>
        {success ? (
          // Success state
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-900)] mb-2">
                You're all set!
              </h3>
              <p className="text-[var(--color-gray-600)]">
                You've successfully claimed your spot for <strong>{eventTitle}</strong>
              </p>
            </div>
          </div>
        ) : isExpired ? (
          // Expired state
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="flex-shrink-0 text-red-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">
                    Your claim window has expired
                  </h4>
                  <p className="text-sm text-red-700">
                    Unfortunately, the 2-hour window to claim your spot for{' '}
                    <strong>{eventTitle}</strong> has passed. The spot may have been offered to
                    the next person on the waitlist.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--color-gray-600)]">
              You can rejoin the waitlist if the event is still full, or check back later for
              availability.
            </p>
          </div>
        ) : (
          // Default claim state
          <div className="space-y-4">
            <p className="text-[var(--color-gray-700)]">
              Great news! A spot has opened up for <strong>{eventTitle}</strong>. You have a
              limited time to claim your spot before it's offered to the next person on the
              waitlist.
            </p>

            {/* Countdown timer */}
            {expiresAt && timeRemaining > 0 && (
              <div
                className={cn(
                  'flex items-center justify-between py-3 px-4 rounded-lg',
                  isUrgent
                    ? 'bg-red-50 border-2 border-red-300'
                    : 'bg-[var(--color-gray-50)] border border-[var(--color-gray-200)]'
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock
                    size={20}
                    className={isUrgent ? 'text-red-600' : 'text-[var(--color-gray-600)]'}
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isUrgent ? 'text-red-900' : 'text-[var(--color-gray-700)]'
                    )}
                  >
                    Time remaining:
                  </span>
                </div>
                <span
                  className={cn(
                    'text-lg font-bold tabular-nums',
                    isUrgent ? 'text-red-600' : 'text-[var(--color-gray-900)]'
                  )}
                >
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            )}

            {isUrgent && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="flex-shrink-0 text-yellow-600 mt-0.5" size={18} />
                <p className="text-sm text-yellow-800">
                  <strong>Hurry!</strong> Less than 5 minutes remaining to claim your spot.
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="flex-shrink-0 text-red-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {success ? (
          <Button variant="primary" onClick={onClose} fullWidth>
            View Event
          </Button>
        ) : isExpired ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                // Navigate to event page (remove claim param already removed)
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
            >
              View Event
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose} disabled={claiming}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleClaim}
              loading={claiming}
              disabled={claiming || isExpired}
            >
              Claim Your Spot
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

ClaimSpotDialog.displayName = 'ClaimSpotDialog';
