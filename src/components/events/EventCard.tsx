'use client';

// ============================================
// EventCard Component
// Comprehensive event summary card
// ============================================

import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CapacityDisplay } from '@/components/events/CapacityDisplay';
import { EventWithOrganizer } from '@/types/event';
import { Calendar, MapPin } from 'lucide-react';
import { formatEventDateShort } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

export interface EventCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  event: EventWithOrganizer;
  variant?: 'default' | 'compact';
  showOrganizer?: boolean;
  showCapacity?: boolean;
  showImage?: boolean;
  onRSVP?: (eventId: string) => void;
  onClick?: (eventId: string) => void;
}

export function EventCard({
  event,
  variant = 'default',
  showOrganizer = true,
  showCapacity = true,
  showImage = true,
  onRSVP,
  onClick,
  className,
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

  // Handle RSVP click (prevent card click propagation)
  const handleRSVPClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRSVP) {
      onRSVP(event.id);
    }
  };

  // Check if event is full
  const isFull = event.current_capacity >= event.max_capacity;
  const isCancelled = event.status === 'cancelled';

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
            <CapacityDisplay
              current={event.current_capacity}
              max={event.max_capacity}
              variant="compact"
              showPercentage
            />
          </div>
        )}
      </div>

      {/* Footer: RSVP Button */}
      {onRSVP && (
        <CardFooter className="border-t border-[var(--color-gray-200)]">
          <Button
            variant="primary"
            fullWidth
            onClick={handleRSVPClick}
            disabled={isFull || isCancelled}
          >
            {isCancelled ? 'Cancelled' : isFull ? 'Event Full' : 'RSVP'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
