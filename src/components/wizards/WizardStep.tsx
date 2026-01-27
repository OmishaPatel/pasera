'use client';

import { cn } from '@/lib/utils/cn';

/**
 * WizardStep Component
 *
 * Wrapper for individual wizard step content.
 * Provides consistent layout with title, description, and content area.
 *
 * Usage:
 *   <WizardStep
 *     title="Event Details"
 *     description="Tell us about your event"
 *   >
 *     <Input label="Event Name" />
 *     <Textarea label="Description" />
 *   </WizardStep>
 */

export interface WizardStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function WizardStep({
  title,
  description,
  children,
  className,
}: WizardStepProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Step header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--color-gray-900)]">
          {title}
        </h2>
        {description && (
          <p className="text-[var(--color-gray-600)]">
            {description}
          </p>
        )}
      </div>

      {/* Step content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

WizardStep.displayName = 'WizardStep';
