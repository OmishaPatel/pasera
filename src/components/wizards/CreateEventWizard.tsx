'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/forms/Select';
import { WizardProgress } from './WizardProgress';
import { WizardStep } from './WizardStep';
import { Event, EventCategory, Difficulty } from '@/types/event';
import { cn } from '@/lib/utils/cn';

/**
 * CreateEventWizard Component
 *
 * Multi-step wizard for creating events with validation.
 * Steps: Date & Time, Capacity & Settings, Image & Description, Category, Review
 *
 * Usage:
 *   <CreateEventWizard
 *     open={isOpen}
 *     onClose={handleClose}
 *     onComplete={handleCreate}
 *     initialData={existingEvent} // optional for edit mode
 *   />
 */

export interface CreateEventWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (event: Partial<Event>) => Promise<void>;
  initialData?: Partial<Event>;
}

interface WizardState {
  currentStep: number;
  data: Partial<Event>;
  errors: Record<string, string>;
  hasUnsavedChanges: boolean;
  submitting: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function CreateEventWizard({
  open,
  onClose,
  onComplete,
  initialData = {},
}: CreateEventWizardProps) {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    data: {
      visibility: 'public',
      pricing_type: 'free',
      ...initialData,
    },
    errors: {},
    hasUnsavedChanges: false,
    submitting: false,
  });

  const [showExitWarning, setShowExitWarning] = useState(false);

  const totalSteps = 5;
  const stepLabels = ['Details', 'Settings', 'Image', 'Category', 'Review'];

  // Update field value
  const updateField = (field: string, value: any) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[field]; // Clear error for this field
      return {
        ...prev,
        data: { ...prev.data, [field]: value },
        hasUnsavedChanges: true,
        errors: newErrors,
      };
    });
  };

  // Step validation functions
  const validateStep = (step: number): ValidationResult => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1: // Date & Time + Location
        if (!state.data.title) errors.title = 'Event title is required';
        if (!state.data.event_date) errors.event_date = 'Date is required';
        if (!state.data.start_time) errors.start_time = 'Start time is required';
        if (!state.data.location_name) errors.location_name = 'Location name is required';
        if (!state.data.location_address) errors.location_address = 'Location address is required';

        // Validate date is in the future
        if (state.data.event_date) {
          const eventDate = new Date(state.data.event_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (eventDate < today) {
            errors.event_date = 'Event date must be in the future';
          }
        }

        // Validate end time is after start time
        if (state.data.start_time && state.data.end_time) {
          if (state.data.end_time <= state.data.start_time) {
            errors.end_time = 'End time must be after start time';
          }
        }
        break;

      case 2: // Capacity & Settings
        if (!state.data.max_capacity || state.data.max_capacity < 1) {
          errors.max_capacity = 'Capacity must be at least 1';
        }
        break;

      case 3: // Image & Description (all optional)
        break;

      case 4: // Category & Difficulty
        if (!state.data.category) errors.category = 'Category is required';
        break;

      case 5: // Review (no validation)
        break;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // Navigate to step
  const goToStep = (step: number) => {
    // Validate current step before moving forward
    if (step > state.currentStep) {
      const validation = validateStep(state.currentStep);
      if (!validation.isValid) {
        setState((prev) => ({ ...prev, errors: validation.errors }));
        return;
      }
    }

    setState((prev) => ({ ...prev, currentStep: step, errors: {} }));
  };

  const handleNext = () => goToStep(state.currentStep + 1);
  const handleBack = () => goToStep(state.currentStep - 1);

  // Handle close with unsaved changes warning
  const handleClose = () => {
    if (state.hasUnsavedChanges && !state.submitting) {
      setShowExitWarning(true);
    } else {
      onClose();
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validate all steps
    for (let step = 1; step <= 4; step++) {
      const validation = validateStep(step);
      if (!validation.isValid) {
        setState((prev) => ({ ...prev, currentStep: step, errors: validation.errors }));
        return;
      }
    }

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      await onComplete(state.data);
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        size="xl"
        className="sm:max-w-2xl"
      >
        <ModalHeader>
          <div className="space-y-3 w-full pr-8">
            <ModalTitle>
              {initialData?.id ? 'Edit Event' : 'Create New Event'}
            </ModalTitle>
            <WizardProgress
              currentStep={state.currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Step 1: Date & Time + Location */}
          {state.currentStep === 1 && (
            <WizardStep
              title="Event Details"
              description="When and where is your event?"
            >
              <Input
                type="text"
                label="Event Title"
                value={state.data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                error={state.errors.title}
                placeholder="e.g., Saturday Morning Hike"
                required
              />

              <Input
                type="date"
                label="Event Date"
                value={state.data.event_date || ''}
                onChange={(e) => updateField('event_date', e.target.value)}
                error={state.errors.event_date}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label="Start Time"
                  value={state.data.start_time || ''}
                  onChange={(e) => updateField('start_time', e.target.value)}
                  error={state.errors.start_time}
                  required
                />
                <Input
                  type="time"
                  label="End Time"
                  value={state.data.end_time || ''}
                  onChange={(e) => updateField('end_time', e.target.value)}
                  error={state.errors.end_time}
                  helperText="Optional"
                />
              </div>

              <Input
                type="text"
                label="Location Name"
                value={state.data.location_name || ''}
                onChange={(e) => updateField('location_name', e.target.value)}
                error={state.errors.location_name}
                placeholder="e.g., Griffith Observatory"
                required
              />

              <Input
                type="text"
                label="Location Address"
                value={state.data.location_address || ''}
                onChange={(e) => updateField('location_address', e.target.value)}
                error={state.errors.location_address}
                placeholder="2800 E Observatory Rd, Los Angeles, CA"
                required
              />
            </WizardStep>
          )}

          {/* Step 2: Capacity & Settings */}
          {state.currentStep === 2 && (
            <WizardStep
              title="Event Settings"
              description="Set capacity and event preferences"
            >
              <Input
                type="number"
                label="Maximum Capacity"
                value={state.data.max_capacity || ''}
                onChange={(e) => updateField('max_capacity', parseInt(e.target.value))}
                error={state.errors.max_capacity}
                min="1"
                placeholder="20"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-gray-700)]">
                  Event Visibility
                  <span className="text-[var(--color-danger)]"> *</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={state.data.visibility === 'public'}
                      onChange={(e) => updateField('visibility', e.target.value)}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={state.data.visibility === 'private'}
                      onChange={(e) => updateField('visibility', e.target.value)}
                      className="w-4 h-4 text-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">Private</span>
                  </label>
                </div>
              </div>

              <Textarea
                label="Packing List"
                value={state.data.packing_list_notes || ''}
                onChange={(e) => updateField('packing_list_notes', e.target.value)}
                placeholder="Water bottles, Hiking boots, Sunscreen, Trail snacks..."
                helperText="Optional - Suggest items attendees should bring"
                maxLength={500}
                showCharCount
                autoResize
              />
            </WizardStep>
          )}

          {/* Step 3: Image & Description */}
          {state.currentStep === 3 && (
            <WizardStep
              title="Add Details"
              description="Make your event stand out with an image and description"
            >
              <Input
                type="url"
                label="Hero Image URL"
                value={state.data.hero_image_url || ''}
                onChange={(e) => updateField('hero_image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                helperText="Optional - Add a featured image for your event"
              />

              <Textarea
                label="Event Description"
                value={state.data.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Tell attendees about your event..."
                helperText="Optional - Provide details about what to expect"
                maxLength={2000}
                showCharCount
                autoResize
                minRows={5}
              />
            </WizardStep>
          )}

          {/* Step 4: Category & Difficulty */}
          {state.currentStep === 4 && (
            <WizardStep
              title="Activity Details"
              description="Categorize your event to help people find it"
            >
              <Select
                label="Event Category"
                value={state.data.category || ''}
                onChange={(e) => updateField('category', e.target.value as EventCategory)}
                error={state.errors.category}
                required
              >
                <option value="">Select a category...</option>
                <option value="hiking">Hiking</option>
                <option value="camping">Camping</option>
                <option value="climbing">Climbing</option>
                <option value="biking">Biking</option>
                <option value="kayaking">Kayaking</option>
                <option value="skiing">Skiing</option>
                <option value="outdoor_adventure">Outdoor Adventure</option>
                <option value="other">Other</option>
              </Select>

              <Select
                label="Difficulty Level"
                value={state.data.difficulty || ''}
                onChange={(e) => updateField('difficulty', e.target.value as Difficulty)}
                helperText="Optional - Help attendees gauge if the event is right for them"
              >
                <option value="">Select difficulty...</option>
                <option value="easy">Easy - Suitable for beginners</option>
                <option value="moderate">Moderate - Some experience required</option>
                <option value="hard">Hard - Experienced adventurers only</option>
              </Select>
            </WizardStep>
          )}

          {/* Step 5: Review */}
          {state.currentStep === 5 && (
            <WizardStep
              title="Review Your Event"
              description="Check everything looks good before creating"
            >
              <div className="space-y-4">
                {/* Event summary */}
                <div className="p-4 border border-[var(--color-gray-200)] rounded-[var(--radius-lg)] space-y-3">
                  <h3 className="font-semibold text-lg text-[var(--color-gray-900)]">
                    {state.data.title || 'Untitled Event'}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-[var(--color-gray-600)]">Date:</span>
                      <span className="ml-2 text-[var(--color-gray-900)]">
                        {state.data.event_date || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-gray-600)]">Time:</span>
                      <span className="ml-2 text-[var(--color-gray-900)]">
                        {state.data.start_time || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-gray-600)]">Location:</span>
                      <span className="ml-2 text-[var(--color-gray-900)]">
                        {state.data.location_name || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-gray-600)]">Capacity:</span>
                      <span className="ml-2 text-[var(--color-gray-900)]">
                        {state.data.max_capacity || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-gray-600)]">Category:</span>
                      <span className="ml-2 text-[var(--color-gray-900)]">
                        {state.data.category || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--color-gray-600)]">Visibility:</span>
                      <span className="ml-2 text-[var(--color-gray-900)]">
                        {state.data.visibility || 'Not set'}
                      </span>
                    </div>
                  </div>

                  {state.data.description && (
                    <div>
                      <span className="text-sm text-[var(--color-gray-600)]">Description:</span>
                      <p className="mt-1 text-sm text-[var(--color-gray-700)]">
                        {state.data.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Edit sections */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--color-gray-700)]">
                    Need to make changes?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { step: 1, label: 'Edit Details' },
                      { step: 2, label: 'Edit Settings' },
                      { step: 3, label: 'Edit Description' },
                      { step: 4, label: 'Edit Category' },
                    ].map((item) => (
                      <button
                        key={item.step}
                        onClick={() => goToStep(item.step)}
                        className={cn(
                          'px-4 py-2 text-sm font-medium',
                          'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                          'hover:bg-[var(--color-gray-50)] transition-colors',
                          'text-[var(--color-gray-700)]'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </WizardStep>
          )}
        </ModalBody>

        <ModalFooter>
          {state.currentStep > 1 && (
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={state.submitting}
            >
              Back
            </Button>
          )}

          {state.currentStep < totalSteps ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={state.submitting}
            >
              {initialData?.id ? 'Update Event' : 'Create Event'}
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Exit warning modal */}
      {showExitWarning && (
        <Modal open={showExitWarning} onClose={() => setShowExitWarning(false)} size="sm">
          <ModalHeader>
            <ModalTitle>Discard changes?</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-[var(--color-gray-700)]">
              You have unsaved changes. Are you sure you want to exit?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowExitWarning(false)}>
              Keep Editing
            </Button>
            <Button variant="danger" onClick={() => {
              setShowExitWarning(false);
              onClose();
            }}>
              Discard Changes
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}

CreateEventWizard.displayName = 'CreateEventWizard';
