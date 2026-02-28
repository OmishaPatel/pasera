'use client';

// ============================================
// EventCard Component
// Comprehensive event summary card
// ============================================

import { Card, CardFooter } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RSVPButton } from '@/components/events/RSVPButton';
import { EventWithOrganizer, AttendeeStatus } from '@/types/event';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { formatEventDateShort } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import { useState, useEffect } from 'react';

export interface EventCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  event: EventWithOrganizer;
  variant?: 'default' | 'compact';
  showOrganizer?: boolean;
  showCapacity?: boolean;
  showImage?: boolean;
  rsvpStatus?: AttendeeStatus | null;
  isAuthenticated?: boolean;
  onRSVP?: (eventId: string, newStatus: 'going' | null) => void;
  onClick?: (eventId: string) => void;

  // Waitlist props
  waitlistPosition?: number | null;
  waitlistCount?: number;
  onJoinWaitlist?: (eventId: string) => void;
  isCancelling?: boolean;
}

export function EventCard({
  event,
  variant = 'default',
  showOrganizer = true,
  showCapacity = true,
  showImage = true,
  rsvpStatus,
  isAuthenticated = false,
  onRSVP,
  onClick,
  className,
  waitlistPosition,
  waitlistCount = 0,
  onJoinWaitlist,
  isCancelling = false,
  ...props
}: EventCardProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  // Format date
  const displayDate = formatEventDateShort(event.event_date);

  // Determine if card should be clickable
  const isClickable = !!onClick;

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(event.id);
    }
  };

  // Check if event is full
  const isFull = event.current_capacity >= event.max_capacity;
  const isCancelled = event.status === 'cancelled';

  // Render appropriate action buttons based on event and user state
  const renderActionButtons = () => {
    // Show loading state during cancellation
    if (isCancelling) {
      return (
        <Button
          variant="secondary"
          fullWidth
          disabled
          className="cursor-not-allowed"
        >
          <Loader2 size={18} className="animate-spin mr-2" />
          Cancelling...
        </Button>
      );
    }

    // Case 1: User on waitlist
    if (rsvpStatus === 'waitlist') {
      return (
        <div className="w-full">
          <Badge variant="default" size="md" className="w-full justify-center bg-yellow-100 text-yellow-800 border-yellow-300">
            On Waitlist (#{waitlistPosition})
          </Badge>
        </div>
      );
    }

    // Case 3: Event full, user not on waitlist
    if (isFull && !rsvpStatus) {
      // Only show Join Waitlist button if there's an actual waitlist
      if (waitlistCount > 0) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="full" size="sm">Full</Badge>
            <Button
              variant="secondary"
              fullWidth
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  onClick?.(event.id); // Navigate to detail page for login
                } else {
                  onJoinWaitlist?.(event.id);
                }
              }}
            >
              Join Waitlist
            </Button>
          </div>
        );
      } else {
        // Event is full but no waitlist exists - just show Full badge
        return (
          <Badge variant="full" size="md" className="w-full justify-center">
            Full
          </Badge>
        );
      }
    }

    // Case 4: Default - show RSVPButton
    return (
      <RSVPButton
        eventId={event.id}
        currentStatus={rsvpStatus}
        isAuthenticated={isAuthenticated}
        isFull={isFull}
        isCancelled={isCancelled}
        variant="compact"
        onStatusChange={(status) => onRSVP?.(event.id, status)}
        onLoginRequired={() => onClick?.(event.id)}
      />
    );
  };

  return (
    <Card
      variant="default"
      padding="none"
      hoverable={isClickable}
      className={cn(variant === 'compact' && 'max-w-sm', className)}
      {...props}
    >
      {/* Image Thumbnail */}
      {showImage && event.hero_image_url && (
        <div
          className={cn(
            "relative h-48 bg-[var(--color-gray-200)] overflow-hidden",
            isClickable && "cursor-pointer"
          )}
          onClick={isClickable ? handleCardClick : undefined}
        >
          {/* Loading skeleton */}
          {imageState === 'loading' && (
            <div className="absolute inset-0 bg-[var(--color-gray-200)] animate-pulse" />
          )}

          {/* Image */}
          <img
            src={event.hero_image_url}
            alt={event.title}
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
            loading="lazy"
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Status Badge Overlay */}
          {(isFull || isCancelled) && (
            <div className="absolute top-2 right-2">
              <Badge variant={isCancelled ? 'danger' : 'full'} size="sm">
                {isCancelled ? 'Cancelled' : 'Full'}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "p-4 space-y-3",
          isClickable && "cursor-pointer"
        )}
        onClick={isClickable ? handleCardClick : undefined}
      >
        {/* Title + Category */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-semibold text-[var(--color-gray-900)] line-clamp-2',
                variant === 'compact' ? 'text-base' : 'text-lg'
              )}
            >
              {event.title}
            </h3>
          </div>
          <Badge variant="default" size="sm">
            {event.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        </div>

        {/* Date + Location */}
        <div className="space-y-2 text-sm text-[var(--color-gray-600)]">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="truncate">{displayDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="truncate">{event.location_name}</span>
          </div>
        </div>

        {/* Organizer Info */}
        {showOrganizer && event.organizer && (
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-gray-200)]">
            <Avatar
              src={event.organizer.avatar_url}
              alt={event.organizer.full_name}
              initials={event.organizer.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
              size="xs"
            />
            <span className="text-xs text-[var(--color-gray-600)] truncate">
              By {event.organizer.full_name}
            </span>
          </div>
        )}

        {/* Capacity Display */}
        {showCapacity && (
          <div className="pt-2 border-t border-[var(--color-gray-200)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-gray-600)]">
                Capacity: <span className="font-semibold text-[var(--color-gray-900)] tabular-nums">
                  {event.current_capacity}/{event.max_capacity}
                </span>
              </span>
              {isFull && waitlistCount > 0 && (
                <span className="text-xs text-[var(--color-gray-500)]">
                  {waitlistCount} on waitlist
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Dynamic Waitlist/RSVP Actions */}
      {onRSVP && (
        <CardFooter className="border-t border-[var(--color-gray-200)]">
          {renderActionButtons()}
        </CardFooter>
      )}
    </Card>
  );
}
