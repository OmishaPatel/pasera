'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Event } from '@/types/event';
import { formatEventDate, formatEventTime } from '@/lib/utils/date';
import { Bell, Check, Clock, AlertTriangle, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { isIOSDevice, isPWAInstalled, canReceivePushNotifications } from '@/lib/utils/device';

/**
 * WaitlistModal Component
 *
 * Modal for joining an event's waitlist when it's full.
 * Explains the 2-hour claim window and requests notification permissions.
 *
 * Usage:
 *   <WaitlistModal
 *     open={isOpen}
 *     onClose={handleClose}
 *     event={event}
 *     currentWaitlistCount={10}
 *     onJoin={handleJoinWaitlist}
 *   />
 */

export interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  currentWaitlistCount: number;
  onJoin: () => Promise<void>;
  onShowInstallInstructions?: () => void;
}

export function WaitlistModal({
  open,
  onClose,
  event,
  currentWaitlistCount,
  onJoin,
  onShowInstallInstructions,
}: WaitlistModalProps) {
  const [joining, setJoining] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>();
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [canReceivePush, setCanReceivePush] = useState(false);

  // Check device type and notification capabilities on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIOS(isIOSDevice());
      setIsPWA(isPWAInstalled());
      setCanReceivePush(canReceivePushNotifications());

      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    }
  }, []);

  const handleJoin = async () => {
    setJoining(true);

    try {
      // Request notification permission if not yet determined
      if (notificationPermission === 'default' && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      }

      // Call the onJoin callback
      await onJoin();

      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Failed to join waitlist:', error);
    } finally {
      setJoining(false);
    }
  };

  const futurePosition = currentWaitlistCount + 1;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader>
        <ModalTitle>Join Waitlist</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* Event info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-[var(--color-gray-900)]">
              {event.title}
            </h3>
            <p className="text-sm text-[var(--color-gray-600)]">
              {formatEventDate(event.event_date)} at {formatEventTime(event.start_time)}
            </p>
            <p className="text-sm text-[var(--color-gray-600)]">
              {event.location_name}
            </p>
          </div>

          {/* Status message */}
          <div className="p-3 bg-[var(--color-gray-100)] rounded-[var(--radius-md)]">
            <p className="text-sm text-[var(--color-gray-700)] font-medium">
              Event is currently full
            </p>
            <p className="text-sm text-[var(--color-gray-600)] mt-1">
              You'll be #{futurePosition} on the waitlist
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <h4 className="font-medium text-[var(--color-gray-800)]">
              How it works
            </h4>

            <div className="space-y-3">
              {/* Notification */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Bell size={16} className="text-[var(--color-primary)]" />
                </div>
                <p className="text-sm text-[var(--color-gray-700)] flex-1">
                  You'll be notified if a spot opens
                </p>
              </div>

              {/* Claim window */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <Clock size={16} className="text-[var(--color-accent)]" />
                </div>
                <p className="text-sm text-[var(--color-gray-700)] flex-1">
                  You'll have 2 hours to claim your spot
                </p>
              </div>

              {/* Enable notifications */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                  <Check size={16} className="text-[var(--color-success)]" />
                </div>
                <p className="text-sm text-[var(--color-gray-700)] flex-1">
                  Enable notifications for instant alerts
                </p>
              </div>
            </div>
          </div>

          {/* iOS PWA Installation Required */}
          {isIOS && !isPWA && (
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-[var(--radius-md)]',
              'bg-blue-50 border border-blue-200'
            )}>
              <Smartphone size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Install app for notifications
                </p>
                <p className="text-xs text-blue-800 mt-1 mb-2">
                  On iPhone, you need to install this app to your home screen to receive notifications when spots open.
                </p>
                {onShowInstallInstructions && (
                  <button
                    onClick={onShowInstallInstructions}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    Show me how to install
                  </button>
                )}
              </div>
            </div>
          )}

          {/* iOS PWA Installed - Good to go */}
          {isIOS && isPWA && notificationPermission !== 'denied' && (
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-[var(--radius-md)]',
              'bg-green-50 border border-green-200'
            )}>
              <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  You're all set!
                </p>
                <p className="text-xs text-green-800 mt-1">
                  You'll receive a notification via email and push when a spot opens.
                </p>
              </div>
            </div>
          )}

          {/* Notification permission denied */}
          {notificationPermission === 'denied' && canReceivePush && (
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-[var(--radius-md)]',
              'bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20'
            )}>
              <AlertTriangle size={20} className="text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-warning)]">
                  Notifications blocked
                </p>
                <p className="text-xs text-[var(--color-gray-700)] mt-1">
                  Enable notifications in your browser settings to get instant alerts. Don't worry - we'll still email you when a spot opens!
                </p>
              </div>
            </div>
          )}

          {/* Email backup message */}
          {!canReceivePush && (
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-[var(--radius-md)]',
              'bg-[var(--color-gray-100)] border border-[var(--color-gray-200)]'
            )}>
              <Bell size={20} className="text-[var(--color-gray-600)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-[var(--color-gray-700)]">
                  Push notifications aren't available, but we'll send you an email when a spot opens!
                </p>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={joining}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleJoin}
          loading={joining}
        >
          Join Waitlist
        </Button>
      </ModalFooter>
    </Modal>
  );
}

WaitlistModal.displayName = 'WaitlistModal';
