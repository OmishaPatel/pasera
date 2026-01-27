'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

/**
 * Modal Component - Dialog Overlay
 * 
 * Accessible modal dialog with focus trap, portal rendering, and animations.
 * Supports multiple sizes, backdrop click, ESC key handling, and body scroll lock.
 * Uses compound component pattern for flexible content layout.
 * 
 * Usage:
 *   <Modal open={isOpen} onClose={handleClose}>
 *     <ModalHeader>
 *       <ModalTitle>Confirm Action</ModalTitle>
 *     </ModalHeader>
 *     <ModalBody>
 *       Are you sure you want to continue?
 *     </ModalBody>
 *     <ModalFooter>
 *       <Button variant="secondary" onClick={handleClose}>Cancel</Button>
 *       <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
 *     </ModalFooter>
 *   </Modal>
 */


// ============================================================================
// Modal Container Component
// ============================================================================

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  className,
}: ModalProps) {
  
  // Refs for focus management and backdrop detection
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Track animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);

  /**
   * Handle ESC key press to close modal
   */
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [open, closeOnEsc, onClose]);

  /**
   * Body scroll lock
   * Prevents page scrolling when modal is open
   */
  useEffect(() => {
    if (!open) return;

    // Save current overflow style
    const originalOverflow = document.body.style.overflow;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Restore on cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  /**
   * Focus management
   * 1. Save current focus when modal opens
   * 2. Move focus to modal
   * 3. Restore focus when modal closes
   */
  useEffect(() => {
    if (!open) return;

    // Save currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Restore focus on cleanup
    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  /**
   * Focus trap implementation
   * Cycles Tab navigation within modal
   */
  useEffect(() => {
    if (!open) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      // Get all focusable elements inside modal
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Cycle focus within modal
      if (e.shiftKey) {
        // Shift + Tab (backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [open]);

  /**
   * Animation state management
   * Delays unmounting until exit animation completes
   */
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to trigger enter animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for exit animation before unmounting
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  /**
   * Handle backdrop click
   * Only closes if click is on backdrop (not modal content)
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',    // 384px
    md: 'max-w-md',    // 448px (default)
    lg: 'max-w-lg',    // 512px
    xl: 'max-w-2xl',   // 672px
    full: 'max-w-full', // 90vw (from backdrop padding)
  };

  // Don't render if modal is closed and animation is complete
  if (!shouldRender) return null;

  // Generate unique ID for title association
  const titleId = 'modal-title';

  // Portal to render modal outside parent DOM
  return createPortal(
    <div
      className={cn(
        // Backdrop styles
        'fixed inset-0 z-50',
        'bg-black/50 backdrop-blur-sm',
        'flex items-center justify-center p-4',
        // Animation
        'transition-opacity duration-200',
        isAnimating ? 'opacity-100' : 'opacity-0',
      )}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal content */}
      <div
        ref={modalRef}
        tabIndex={-1} // Allows programmatic focus
        className={cn(
          // Base styles
          'relative bg-white rounded-[var(--radius-xl)]',
          'shadow-[var(--shadow-xl)]',
          'w-full max-h-[90vh] overflow-y-auto',
          'flex flex-col',
          // Animation
          'transition-all duration-200',
          isAnimating 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-4 opacity-0',
          // Size
          sizeStyles[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking content
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 z-10',
              'p-2 rounded-[var(--radius-md)]',
              'text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]',
              'hover:bg-[var(--color-gray-100)]',
              'transition-all duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
            )}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        )}

        {/* Modal children (Header, Body, Footer) */}
        {children}
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// ModalHeader Component
// ============================================================================

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ModalHeader({
  className,
  children,
  ...props
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        'px-6 py-4',
        'border-b border-[var(--color-gray-200)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// ModalTitle Component
// ============================================================================

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function ModalTitle({
  className,
  children,
  ...props
}: ModalTitleProps) {
  return (
    <h2
      id="modal-title"
      className={cn(
        'text-xl font-semibold text-[var(--color-gray-900)]',
        'pr-8', // Space for close button
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

// ============================================================================
// ModalBody Component
// ============================================================================

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ModalBody({
  className,
  children,
  ...props
}: ModalBodyProps) {
  return (
    <div
      className={cn(
        'px-6 py-4',
        'text-[var(--color-gray-700)]',
        'overflow-y-auto', // Scrollable content
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// ModalFooter Component
// ============================================================================

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export function ModalFooter({
  align = 'right',
  className,
  children,
  ...props
}: ModalFooterProps) {
  
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        'px-6 py-4',
        'border-t border-[var(--color-gray-200)]',
        alignmentStyles[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Display names for React DevTools
Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalTitle.displayName = 'ModalTitle';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';