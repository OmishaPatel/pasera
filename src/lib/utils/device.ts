/**
 * Device Detection Utilities
 *
 * Utilities for detecting device type, OS, and PWA installation status.
 * Useful for conditional features like push notifications on iOS.
 */

/**
 * Detects if the user is on an iOS device (iPhone, iPad, iPod)
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Detects if the user is on an Android device
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
}

/**
 * Detects if the app is running as a PWA (installed to home screen)
 * Works for both iOS and Android
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check display mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS-specific check
  const isIOSStandalone = (navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Detects if Web Push is supported in the current browser/device
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Check if the user can receive push notifications
 * Takes into account iOS PWA installation requirement
 */
export function canReceivePushNotifications(): boolean {
  if (!isPushNotificationSupported()) return false;

  // On iOS, PWA must be installed for push to work
  if (isIOSDevice()) {
    return isPWAInstalled();
  }

  // Android and desktop can receive push from browser
  return true;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  return Notification.permission;
}

/**
 * Detects if user is on Safari browser
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
}

/**
 * Get a user-friendly device type string
 */
export function getDeviceType(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (isIOSDevice()) return 'ios';
  if (isAndroidDevice()) return 'android';
  if (typeof window !== 'undefined' && !('ontouchstart' in window)) return 'desktop';
  return 'unknown';
}

/**
 * Check if the device should show PWA install prompt
 * Returns true if:
 * - User is on iOS/Android
 * - PWA is not yet installed
 */
export function shouldShowInstallPrompt(): boolean {
  const deviceType = getDeviceType();
  const isInstalled = isPWAInstalled();

  return (deviceType === 'ios' || deviceType === 'android') && !isInstalled;
}
