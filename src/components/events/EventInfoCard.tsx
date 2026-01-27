'use client';

// ============================================
// EventInfoCard Component
// Display event date, time, and location
// ============================================

import { Card, CardBody } from '@/components/ui/Card';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { formatEventDate, formatTimeRange } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';

export interface EventInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  eventDate: string; // ISO date "2026-06-15"
  startTime: string; // "09:00:00"
  endTime?: string; // "14:00:00"
  locationName: string;
  locationAddress: string;
  variant?: 'default' | 'compact';
  showMapLink?: boolean;
}

export function EventInfoCard({
  eventDate,
  startTime,
  endTime,
  locationName,
  locationAddress,
  variant = 'default',
  showMapLink = false,
  className,
  ...props
}: EventInfoCardProps) {
  // Format date and time
  const displayDate = formatEventDate(eventDate);
  const displayTime = formatTimeRange(startTime, endTime);

  // Create Google Maps URL
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationAddress
  )}`;

  return (
    <Card
      variant="default"
      padding={variant === 'compact' ? 'sm' : 'md'}
      className={className}
      {...props}
    >
      <CardBody>
        <dl className="space-y-3">
          {/* Date */}
          <div className="flex items-start gap-3">
            <Calendar
              size={20}
              className="flex-shrink-0 text-[var(--color-primary)] mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <dt className="sr-only">Date</dt>
              <dd className="text-sm font-medium text-[var(--color-gray-800)]">
                {displayDate}
              </dd>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock
              size={20}
              className="flex-shrink-0 text-[var(--color-primary)] mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <dt className="sr-only">Time</dt>
              <dd className="text-sm font-medium text-[var(--color-gray-800)]">
                {displayTime}
              </dd>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin
              size={20}
              className="flex-shrink-0 text-[var(--color-primary)] mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <dt className="sr-only">Location</dt>
              <dd className="text-sm space-y-1">
                <div className="font-medium text-[var(--color-gray-800)]">
                  {locationName}
                </div>
                <div className="text-[var(--color-gray-600)] break-words">
                  {locationAddress}
                </div>
                {showMapLink && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-1.5 text-[var(--color-primary)]',
                      'hover:text-[var(--color-primary-hover)] transition-colors',
                      'text-sm font-medium mt-1'
                    )}
                  >
                    View on Map
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </dd>
            </div>
          </div>
        </dl>
      </CardBody>
    </Card>
  );
}
