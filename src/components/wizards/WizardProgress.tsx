'use client';

import { cn } from '@/lib/utils/cn';
import { ProgressBar } from '@/components/ui/ProgressBar';

/**
 * WizardProgress Component
 *
 * Visual progress indicator for multi-step flows.
 * Shows current step, progress bar, and optional step labels.
 *
 * Usage:
 *   <WizardProgress
 *     currentStep={2}
 *     totalSteps={5}
 *     stepLabels={['Details', 'Settings', 'Image', 'Category', 'Review']}
 *   />
 */

export interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  stepLabels,
  className
}: WizardProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress bar */}
      <ProgressBar
        value={currentStep}
        max={totalSteps}
        variant="success"
        showLabel={false}
      />

      {/* Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div
              key={step}
              className={cn(
                'flex items-center gap-2',
                isCurrent && 'text-[var(--color-primary)] font-medium',
                isCompleted && 'text-[var(--color-success)]',
                isUpcoming && 'text-[var(--color-gray-400)]',
              )}
            >
              {/* Step circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  isCurrent && 'bg-[var(--color-primary)] text-white',
                  isCompleted && 'bg-[var(--color-success)] text-white',
                  isUpcoming && 'bg-[var(--color-gray-200)] text-[var(--color-gray-500)]',
                )}
                aria-label={`Step ${step}${stepLabels?.[step - 1] ? `: ${stepLabels[step - 1]}` : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? '✓' : step}
              </div>

              {/* Step label (hidden on mobile) */}
              {stepLabels?.[step - 1] && (
                <span className="hidden sm:inline text-sm">
                  {stepLabels[step - 1]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

WizardProgress.displayName = 'WizardProgress';
