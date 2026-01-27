'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Event } from '@/types/event';
import { formatEventDate, formatEventTime } from '@/lib/utils/date';
import {
  MessageCircle,
  Facebook,
  Mail,
  MessageSquare,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * ShareModal Component
 *
 * Modal for sharing an event via multiple platforms.
 * Includes WhatsApp, Facebook, Email, iMessage, QR code, and copy link.
 *
 * Usage:
 *   <ShareModal
 *     open={isOpen}
 *     onClose={handleClose}
 *     event={event}
 *     shareUrl="https://outdoorpath.com/events/123"
 *   />
 */

export interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  shareUrl: string;
}

export function ShareModal({
  open,
  onClose,
  event,
  shareUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Join me for ${event.title}! ${formatEventDate(event.event_date)} at ${formatEventTime(event.start_time)}`;

  // Share URLs for different platforms
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    sms: `sms:?&body=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`,
  };

  // Web Share API (native mobile share)
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error);
      }
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download QR code
  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${event.title.replace(/[^a-z0-9]/gi, '-')}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Share Event</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Event preview */}
          <div className="p-4 border border-[var(--color-gray-200)] rounded-[var(--radius-md)]">
            <h3 className="font-semibold text-[var(--color-gray-900)]">
              {event.title}
            </h3>
            <p className="text-sm text-[var(--color-gray-600)] mt-1">
              {formatEventDate(event.event_date)} at {formatEventTime(event.start_time)}
            </p>
            <p className="text-sm text-[var(--color-gray-600)]">
              {event.location_name}
            </p>
          </div>

          {/* Share buttons */}
          <div>
            <h4 className="text-sm font-medium text-[var(--color-gray-700)] mb-3">
              Share via
            </h4>

            {/* Check if Web Share API is available */}
            {typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined' ? (
              <Button
                variant="secondary"
                className="w-full mb-3"
                onClick={handleWebShare}
                leftIcon={<MessageCircle size={18} />}
              >
                Share...
              </Button>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={shareUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3',
                  'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                  'hover:bg-[var(--color-gray-50)] transition-colors',
                  'text-sm font-medium text-[var(--color-gray-700)]'
                )}
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>

              {/* Facebook */}
              <a
                href={shareUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3',
                  'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                  'hover:bg-[var(--color-gray-50)] transition-colors',
                  'text-sm font-medium text-[var(--color-gray-700)]'
                )}
              >
                <Facebook size={18} />
                Facebook
              </a>

              {/* Email */}
              <a
                href={shareUrls.email}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3',
                  'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                  'hover:bg-[var(--color-gray-50)] transition-colors',
                  'text-sm font-medium text-[var(--color-gray-700)]'
                )}
              >
                <Mail size={18} />
                Email
              </a>

              {/* iMessage/SMS */}
              <a
                href={shareUrls.sms}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3',
                  'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                  'hover:bg-[var(--color-gray-50)] transition-colors',
                  'text-sm font-medium text-[var(--color-gray-700)]'
                )}
              >
                <MessageSquare size={18} />
                iMessage
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-gray-200)]" />

          {/* QR Code */}
          <div>
            <h4 className="text-sm font-medium text-[var(--color-gray-700)] mb-3">
              QR Code
            </h4>
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)]">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={shareUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadQR}
                leftIcon={<Download size={16} />}
              >
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-gray-200)]" />

          {/* Copy link */}
          <div>
            <h4 className="text-sm font-medium text-[var(--color-gray-700)] mb-3">
              Copy link
            </h4>
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant={copied ? 'secondary' : 'primary'}
                onClick={handleCopy}
                leftIcon={copied ? <Check size={18} /> : <Copy size={18} />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ShareModal.displayName = 'ShareModal';
