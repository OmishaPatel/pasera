'use client';

// ============================================
// EventHero Component
// Hero section with event image and overlay
// ============================================

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EventStatus } from '@/types/event';
import { Share2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface EventHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  status: EventStatus; // 'active' | 'full' | 'cancelled' | 'completed'
  category: string;
  onShare?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export function EventHero({
  title,
  imageUrl,
  fallbackImageUrl = '/images/default-event-hero.jpg',
  status,
  category,
  onShare,
  onFavorite,
  isFavorited = false,
  height = 'md',
  className,
  ...props
}: EventHeroProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  // Determine which image to display
  const displayImage =
    imageState === 'error' || !imageUrl ? fallbackImageUrl : imageUrl;

  // Height variants
  const heightStyles = {
    sm: 'h-[40vh] md:h-[45vh]',
    md: 'h-[50vh] md:h-[55vh] lg:h-[60vh]',
    lg: 'h-[60vh] md:h-[65vh] lg:h-[70vh]',
  };

  // Status badge variants
  const statusBadgeConfig: Partial<Record<EventStatus, { variant: 'full' | 'danger' | 'default'; label: string }>> = {
    full: { variant: 'full', label: 'Full' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    completed: { variant: 'default', label: 'Completed' },
  };

  const statusBadge = statusBadgeConfig[status];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)]',
        heightStyles[height],
        className
      )}
      {...props}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Loading skeleton */}
        {imageState === 'loading' && (
          <div className="absolute inset-0 bg-[var(--color-gray-200)] animate-pulse" />
        )}

        {/* Image */}
        <img
          src={displayImage}
          alt={title}
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('error')}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Gradient Overlay (for text readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col">
        {/* Top Bar: Category + Actions */}
        <div className="flex items-start justify-between p-4 md:p-6">
          <Badge variant="default" size="md" className="bg-white/90 backdrop-blur-sm">
            {category}
          </Badge>

          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            {onFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFavorite}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <Heart
                  size={20}
                  className={cn(
                    'transition-all duration-200',
                    isFavorited && 'fill-red-500 text-red-500 scale-110'
                  )}
                />
              </Button>
            )}

            {/* Share Button */}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                aria-label="Share event"
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <Share2 size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Bottom: Title + Status Badge */}
        <div className="mt-auto p-4 md:p-6 space-y-3">
          {/* Status Badge (if applicable) */}
          {statusBadge && (
            <div>
              <Badge variant={statusBadge.variant} size="md">
                {statusBadge.label}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
