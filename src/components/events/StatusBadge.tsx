'use client';

// ============================================
// StatusBadge Component
// Specialized badge for attendee RSVP status
// ============================================

import { Badge, BadgeProps } from '@/components/ui/Badge';
import { CheckCircle, HelpCircle, Star, Clock } from 'lucide-react';
import { AttendeeStatus } from '@/types/event';

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: AttendeeStatus; // 'going' | 'maybe' | 'interested' | 'waitlist'
  showIcon?: boolean;
  count?: number; // Optional count (e.g., "Going (15)")
}

// Map AttendeeStatus to Badge variants and display text
const statusConfig: Record<
  AttendeeStatus,
  {
    variant: BadgeProps['variant'];
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  going: {
    variant: 'success',
    label: 'Going',
    icon: CheckCircle,
  },
  maybe: {
    variant: 'warning',
    label: 'Maybe',
    icon: HelpCircle,
  },
  interested: {
    variant: 'default',
    label: 'Interested',
    icon: Star,
  },
  waitlist: {
    variant: 'default',
    label: 'Waitlist',
    icon: Clock,
  },
};

export function StatusBadge({
  status,
  showIcon = false,
  count,
  size = 'md',
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  // Build the label with optional count
  const label = count !== undefined ? `${config.label} (${count})` : config.label;

  return (
    <Badge variant={config.variant} size={size} {...props}>
      {showIcon && (
        <Icon
          size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14}
          className="flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {label}
    </Badge>
  );
}
