'use client';

import { useEffect } from 'react';

/**
 * Component that automatically registers the service worker on mount
 * This ensures the service worker is active even before push notifications are set up
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only run in browser and if service workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
        })
        .then((registration) => {
          console.log('[SW] Service worker registered successfully:', registration);

          // Log service worker state
          if (registration.installing) {
            console.log('[SW] Service worker installing');
          } else if (registration.waiting) {
            console.log('[SW] Service worker installed and waiting');
          } else if (registration.active) {
            console.log('[SW] Service worker active');
          }
        })
        .catch((error) => {
          console.error('[SW] Service worker registration failed:', error);
        });

      // Optional: Listen for service worker updates
      navigator.serviceWorker.ready.then((registration) => {
        console.log('[SW] Service worker ready');

        // Check for updates periodically (every hour)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      });
    } else {
      console.warn('[SW] Service workers not supported in this browser');
    }
  }, []);

  // This component doesn't render anything
  return null;
}
