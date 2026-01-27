'use client';

// ============================================
// AttendeeCard Component
// Grid card displaying attendee profile
// ============================================

import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/events/StatusBadge';
import { AttendeeStatus } from '@/types/event';
import { cn } from '@/lib/utils/cn';

export interface AttendeeCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  userId: string;
  name: string;
  avatarUrl?: string;
  status: AttendeeStatus;
  showStatus?: boolean;
  onClick?: (userId: string) => void;
}

export function AttendeeCard({
  userId,
  name,
  avatarUrl,
  status,
  showStatus = true,
  onClick,
  className,
  ...props
}: AttendeeCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(userId);
    }
  };

  // Determine if card should be clickable
  const isClickable = !!onClick;

  return (
    <Card
      variant="default"
      padding="md"
      hoverable={isClickable}
      clickable={isClickable}
      onClick={isClickable ? handleClick : undefined}
      className={cn(
        'cursor-pointer transition-all duration-200',
        !isClickable && 'cursor-default',
        className
      )}
      {...props}
    >
      <CardBody>
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Avatar with optional status badge */}
          <Avatar
            src={avatarUrl}
            alt={name}
            size="lg"
            statusBadge={
              showStatus ? (
                <StatusBadge status={status} size="sm" className="absolute" />
              ) : undefined
            }
          />

          {/* Name */}
          <div className="min-w-0 w-full">
            <p className="text-sm font-medium text-[var(--color-gray-800)] truncate">
              {name}
            </p>
          </div>

          {/* Status Badge (below avatar) */}
          {showStatus && (
            <StatusBadge status={status} size="sm" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
