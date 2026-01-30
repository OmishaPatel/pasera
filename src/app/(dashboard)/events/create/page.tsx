'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateEventWizard } from '@/components/wizards/CreateEventWizard';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/event';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    // TODO: Phase 5 - Replace with Supabase insert
    console.log('Creating event:', eventData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock: Generate event ID
    const mockEventId = `event-${Date.now()}`;

    // Redirect to event detail or dashboard
    router.push(`/events/${mockEventId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] py-8">
      <Container size="md">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-2">
            Create New Event
          </h1>
          <p className="text-[var(--color-gray-600)]">
            Share your outdoor adventure with the community.
          </p>
        </div>

        {/* Getting Started Section */}
        <Card className="mb-6">
          <CardHeader
            title="Getting Started"
            subtitle="What you'll need to create an event"
          />
          <CardBody>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                  <Calendar className="text-[var(--color-primary)]" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)] mb-1">
                    Date & Time
                  </h3>
                  <p className="text-sm text-[var(--color-gray-600)]">
                    Choose when your event will take place. Make sure to pick a date in the future.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-accent-light)] rounded-lg flex items-center justify-center">
                  <MapPin className="text-[var(--color-accent)]" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)] mb-1">
                    Location
                  </h3>
                  <p className="text-sm text-[var(--color-gray-600)]">
                    Provide the meeting location and address so attendees know where to go.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)] mb-1">
                    Capacity
                  </h3>
                  <p className="text-sm text-[var(--color-gray-600)]">
                    Set the maximum number of attendees to keep your event manageable.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Tips */}
        <Card className="mb-8">
          <CardHeader
            title="Tips for a Successful Event"
          />
          <CardBody>
            <ul className="space-y-3 text-sm text-[var(--color-gray-700)]">
              <li className="flex gap-3">
                <span className="text-[var(--color-primary)] font-bold">1.</span>
                <span>
                  <strong>Be descriptive:</strong> Include details about the trail difficulty, what to bring, and what participants can expect.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-primary)] font-bold">2.</span>
                <span>
                  <strong>Add a great photo:</strong> Events with images get 3x more RSVPs. Use a photo that represents your adventure.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-primary)] font-bold">3.</span>
                <span>
                  <strong>Choose the right category:</strong> Help people find your event by selecting the most appropriate category.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-primary)] font-bold">4.</span>
                <span>
                  <strong>Set clear expectations:</strong> Be upfront about difficulty level and any requirements (gear, fitness level, etc.).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-primary)] font-bold">5.</span>
                <span>
                  <strong>Plan for safety:</strong> Consider weather conditions, emergency contacts, and first aid availability.
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* Create Event Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setWizardOpen(true)}
            className="w-full md:w-auto"
          >
            <Calendar size={20} />
            Start Creating Event
          </Button>
        </div>

        {/* Event Examples */}
        <div className="mt-12 pt-8 border-t border-[var(--color-gray-200)]">
          <h2 className="text-xl font-bold text-[var(--color-gray-900)] mb-6">
            Event Ideas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                  Group Hikes
                </h3>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Organize morning or sunset hikes on local trails. Great for beginners and experienced hikers alike.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                  Camping Trips
                </h3>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Plan weekend camping adventures. Include itinerary, required gear, and meal planning.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                  Rock Climbing Sessions
                </h3>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Organize indoor or outdoor climbing sessions for different skill levels.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                  Kayaking Adventures
                </h3>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Plan water-based activities like kayaking, paddleboarding, or canoeing trips.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                  Trail Running Groups
                </h3>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Create regular running meetups on scenic trails for fitness enthusiasts.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                  Photography Walks
                </h3>
                <p className="text-sm text-[var(--color-gray-600)]">
                  Combine outdoor exploration with photography. Great for nature photographers.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </Container>

      {/* Create Event Wizard Modal */}
      <CreateEventWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleCreateEvent}
      />
    </div>
  );
}
