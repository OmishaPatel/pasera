'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { shouldShowInstallPrompt, isIOSDevice } from '@/lib/utils/device';

/**
 * InstallPWABanner Component
 *
 * Smart banner that prompts users to install the PWA.
 * Shows only on mobile devices when PWA is not installed.
 * Can be dismissed and won't show again for 7 days.
 *
 * Usage:
 *   <InstallPWABanner onInstallClick={handleShowInstructions} />
 */

export interface InstallPWABannerProps {
  onInstallClick: () => void;
  className?: string;
}

const BANNER_DISMISSED_KEY = 'outdoor-path-pwa-banner-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function InstallPWABanner({ onInstallClick, className }: InstallPWABannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner should be shown
    const shouldShow = shouldShowInstallPrompt();

    if (!shouldShow) {
      setIsVisible(false);
      return;
    }

    // Check if user dismissed the banner recently
    const dismissedAt = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();

      // If dismissed less than 7 days ago, don't show
      if (now - dismissedTime < DISMISS_DURATION) {
        setIsVisible(false);
        return;
      }
    }

    // Show banner after a short delay (better UX)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString());
  };

  if (!isVisible) return null;

  const isIOS = isIOSDevice();

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]',
        'text-white shadow-2xl',
        'animate-slide-up',
        // Add padding for mobile nav (64px)
        'pb-safe mb-16 md:mb-0',
        className
      )}
      role="banner"
      aria-label="Install app prompt"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone size={20} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Install Outdoor Path</p>
            <p className="text-xs text-white/90 truncate">
              {isIOS
                ? 'Get notifications when waitlist spots open'
                : 'Install for quick access and notifications'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={onInstallClick}
              className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-0"
            >
              Install
            </Button>
            <button
              onClick={handleDismiss}
              className={cn(
                'p-2 rounded-md',
                'text-white/80 hover:text-white hover:bg-white/10',
                'transition-colors'
              )}
              aria-label="Dismiss install prompt"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

InstallPWABanner.displayName = 'InstallPWABanner';
