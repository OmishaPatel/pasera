'use client';

// ============================================
// AttendeeListItem Component
// List row displaying attendee profile
// ============================================

import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/events/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AttendeeStatus } from '@/types/event';
import { formatRelativeTime } from '@/lib/utils/date';
import { Mail, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AttendeeListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  status: AttendeeStatus;
  respondedAt: string; // ISO timestamp
  isOrganizer?: boolean;
  showActions?: boolean;
  onMessage?: (userId: string) => void;
  onEmail?: (email: string) => void;
}

export function AttendeeListItem({
  userId,
  name,
  email,
  avatarUrl,
  status,
  respondedAt,
  isOrganizer = false,
  showActions = false,
  onMessage,
  onEmail,
  className,
  ...props
}: AttendeeListItemProps) {
  // Format the relative time
  const joinedTime = formatRelativeTime(respondedAt, 'Joined');

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4',
        'border border-[var(--color-gray-200)] rounded-[var(--radius-md)]',
        'hover:bg-[var(--color-gray-50)] transition-colors',
        'min-h-[60px]', // Touch target requirement
        className
      )}
      {...props}
    >
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={avatarUrl}
          alt={name}
          initials={name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-[var(--color-gray-800)] truncate">
              {name}
            </p>
            {isOrganizer && (
              <Badge variant="default" size="sm">
                Organizer
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--color-gray-500)] mt-0.5">
            {joinedTime}
          </p>
        </div>
      </div>

      {/* Center: Status Badge */}
      <div className="flex-shrink-0 hidden sm:block">
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Right: Action Buttons */}
      {showActions && (onMessage || (onEmail && email)) && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {onEmail && email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEmail(email);
              }}
              aria-label={`Send email to ${name}`}
            >
              <Mail size={16} />
            </Button>
          )}
          {onMessage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMessage(userId);
              }}
              aria-label={`Send message to ${name}`}
            >
              <MessageCircle size={16} />
            </Button>
          )}
        </div>
      )}

      {/* Mobile: Status Badge (shown on mobile) */}
      <div className="flex-shrink-0 sm:hidden">
        <StatusBadge status={status} size="sm" />
      </div>
    </div>
  );
}
