'use client';

import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Share, Plus, Home, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { isIOSDevice, isAndroidDevice } from '@/lib/utils/device';

/**
 * InstallPWAModal Component
 *
 * Shows step-by-step instructions for installing the PWA on iOS or Android.
 * Includes visual guides and platform-specific instructions.
 *
 * Usage:
 *   <InstallPWAModal
 *     open={isOpen}
 *     onClose={handleClose}
 *   />
 */

export interface InstallPWAModalProps {
  open: boolean;
  onClose: () => void;
}

export function InstallPWAModal({ open, onClose }: InstallPWAModalProps) {
  const isIOS = isIOSDevice();
  const isAndroid = isAndroidDevice();

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Install Outdoor Path</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Why install section */}
          <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)] p-4">
            <h3 className="font-semibold text-[var(--color-primary)] mb-2 flex items-center gap-2">
              <Smartphone size={20} />
              Why Install?
            </h3>
            <ul className="text-sm text-[var(--color-gray-700)] space-y-1">
              <li>• Receive instant notifications when waitlist spots open</li>
              <li>• Quick access from your home screen</li>
              <li>• Works offline for viewing saved events</li>
              <li>• No app store required!</li>
            </ul>
          </div>

          {/* iOS Instructions */}
          {isIOS && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--color-gray-900)]">
                How to Install on iPhone/iPad:
              </h3>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Tap the Share button
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-gray-600)]">
                      <Share size={16} className="text-[var(--color-primary)]" />
                      <span>Look for the share icon at the bottom of Safari</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Scroll and tap "Add to Home Screen"
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-gray-600)]">
                      <Plus size={16} className="text-[var(--color-primary)]" />
                      <span>You may need to scroll down in the share menu</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Tap "Add" to confirm
                    </p>
                    <p className="text-xs text-[var(--color-gray-600)]">
                      The app will appear on your home screen
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center font-semibold text-sm">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Open from your home screen
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-gray-600)]">
                      <Home size={16} className="text-[var(--color-success)]" />
                      <span>Now you can enable notifications!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* iOS Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-xs text-blue-900">
                <strong>Note:</strong> Notifications only work when you open the app from your
                home screen, not from Safari.
              </div>
            </div>
          )}

          {/* Android Instructions */}
          {isAndroid && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--color-gray-900)]">
                How to Install on Android:
              </h3>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Tap the menu (⋮) button
                    </p>
                    <p className="text-xs text-[var(--color-gray-600)]">
                      Usually in the top-right corner of Chrome
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Tap "Add to Home screen" or "Install app"
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-gray-600)]">
                      <Plus size={16} className="text-[var(--color-primary)]" />
                      <span>Look for this option in the menu</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center font-semibold text-sm">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-gray-900)] mb-1">
                      Tap "Install" to confirm
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-gray-600)]">
                      <Home size={16} className="text-[var(--color-success)]" />
                      <span>The app will be added to your home screen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Android Note */}
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-xs text-green-900">
                <strong>Good news:</strong> On Android, you can enable notifications from either
                the browser or the installed app!
              </div>
            </div>
          )}

          {/* Desktop/Other */}
          {!isIOS && !isAndroid && (
            <div className="text-center py-6">
              <Smartphone size={48} className="mx-auto text-[var(--color-gray-400)] mb-4" />
              <p className="text-sm text-[var(--color-gray-600)] mb-2">
                This feature is designed for mobile devices
              </p>
              <p className="text-xs text-[var(--color-gray-500)]">
                Open this page on your iPhone or Android phone to install the app
              </p>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="primary" onClick={onClose} fullWidth>
          Got it!
        </Button>
      </ModalFooter>
    </Modal>
  );
}

InstallPWAModal.displayName = 'InstallPWAModal';
