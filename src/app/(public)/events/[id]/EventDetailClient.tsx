'use client';

// Event Detail Client Component
// Handles modal state and interactive elements

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { EventHero } from '@/components/events/EventHero';
import { EventInfoCard } from '@/components/events/EventInfoCard';
import { CapacityDisplay } from '@/components/events/CapacityDisplay';
import { AttendeeCard } from '@/components/events/AttendeeCard';
import { AttendeesModal } from '@/components/modals/AttendeesModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { EventWithOrganizer } from '@/types/event';
import { Profile } from '@/types/user';
import { MapPin, Users, Share2, Calendar, AlertCircle } from 'lucide-react';

interface AttendeeWithUser {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'maybe' | 'interested' | 'waitlist';
  responded_at: string;
  created_at: string;
  user: Profile;
}

interface EventDetailClientProps {
  event: EventWithOrganizer;
  attendees: AttendeeWithUser[];
  attendeeCounts: {
    going: number;
    maybe: number;
    interested: number;
    waitlist: number;
  };
}

export function EventDetailClient({
  event,
  attendees,
  attendeeCounts
}: EventDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Filter attendees by status (for preview)
  const goingAttendees = attendees.filter(a => a.status === 'going');
  const previewAttendees = goingAttendees.slice(0, 5);

  // Check event states
  const isFull = event.status === 'full' || event.current_capacity >= event.max_capacity;
  const isCancelled = event.status === 'cancelled';
  const isActive = event.status === 'active' && !isFull;

  // Get share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${event.id}`
    : '';

  // Handle RSVP click
  const handleRSVP = () => {
    if (!user) {
      // User not authenticated - redirect to login with return URL
      router.push(`/login?next=/events/${event.id}`);
      return;
    }

    // TODO: Phase 5 - Show RSVP modal or process RSVP for authenticated users
    // For now, just log that the user is authenticated
    console.log('RSVP clicked for event:', event.id, 'by user:', user.id);
    // Future: Show RSVP modal with status selection (going/maybe/interested)
  };

  return (
    <>
      {/* Event Hero */}
      <EventHero
        title={event.title}
        imageUrl={event.hero_image_url}
        status={event.status}
        category={event.category}
        onShare={() => setShowShareModal(true)}
        height="md"
      />

      {/* Main Content */}
      <div className="bg-[var(--color-gray-50)] py-8">
        <Container size="lg">
          {/* Event Full Banner */}
          {isFull && !isCancelled && (
            <Card className="mb-6 bg-[var(--color-warning)]/10 border-[var(--color-warning)]">
              <CardBody>
                <div className="flex items-start gap-3">
                  <AlertCircle className="flex-shrink-0 text-[var(--color-warning)] mt-0.5" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-gray-900)] mb-1">
                      This event is full
                    </h3>
                    <p className="text-sm text-[var(--color-gray-700)] mb-3">
                      All spots have been filled. You can join the waitlist or check out other events.
                    </p>
                    <Link href={`/events/${event.id}/full`}>
                      <Button variant="secondary" size="sm">
                        View Waitlist
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader title="About This Event" />
                <CardBody>
                  <p className="text-[var(--color-gray-700)] whitespace-pre-wrap">
                    {event.description}
                  </p>

                  {/* Difficulty Badge */}
                  {event.difficulty && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-gray-200)]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--color-gray-600)]">Difficulty:</span>
                        <Badge variant="default" size="sm">
                          {event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Packing List */}
                  {event.packing_list_notes && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-gray-200)]">
                      <h4 className="font-semibold text-[var(--color-gray-900)] mb-2">
                        What to Bring
                      </h4>
                      <p className="text-sm text-[var(--color-gray-700)]">
                        {event.packing_list_notes}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Attendees Section */}
              <Card>
                <CardHeader
                  title="Who's Going"
                  action={
                    goingAttendees.length > 5 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAttendeesModal(true)}
                      >
                        View All ({attendeeCounts.going})
                      </Button>
                    ) : null
                  }
                />
                <CardBody>
                  {goingAttendees.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {previewAttendees.map(attendee => (
                          <AttendeeCard
                            key={attendee.id}
                            userId={attendee.user_id}
                            name={attendee.user.full_name}
                            avatarUrl={attendee.user.avatar_url}
                            status={attendee.status}
                            showStatus={false}
                          />
                        ))}
                      </div>

                      {goingAttendees.length > 5 && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => setShowAttendeesModal(true)}
                            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium"
                          >
                            + {goingAttendees.length - 5} more {goingAttendees.length - 5 === 1 ? 'person' : 'people'} going
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Users size={40} className="mx-auto text-[var(--color-gray-300)] mb-3" />
                      <p className="text-sm text-[var(--color-gray-500)]">
                        Be the first to RSVP to this event
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Organizer Section */}
              <Card>
                <CardHeader title="Organizer" />
                <CardBody>
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={event.organizer.avatar_url}
                      alt={event.organizer.full_name}
                      initials={event.organizer.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-gray-900)]">
                        {event.organizer.full_name}
                      </h3>
                      <p className="text-sm text-[var(--color-gray-600)] mt-1">
                        Event Organizer
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Event Info Card */}
              <EventInfoCard
                eventDate={event.event_date}
                startTime={event.start_time}
                endTime={event.end_time}
                locationName={event.location_name}
                locationAddress={event.location_address}
                showMapLink
              />

              {/* Capacity Display */}
              <Card>
                <CardBody>
                  <CapacityDisplay
                    current={event.current_capacity}
                    max={event.max_capacity}
                    variant="default"
                    showPercentage
                  />

                  {/* Attendee Counts */}
                  {(attendeeCounts.maybe > 0 || attendeeCounts.interested > 0) && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-gray-200)] space-y-2">
                      {attendeeCounts.maybe > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--color-gray-600)]">Maybe</span>
                          <span className="font-medium text-[var(--color-gray-900)]">
                            {attendeeCounts.maybe}
                          </span>
                        </div>
                      )}
                      {attendeeCounts.interested > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--color-gray-600)]">Interested</span>
                          <span className="font-medium text-[var(--color-gray-900)]">
                            {attendeeCounts.interested}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleRSVP}
                  disabled={isFull || isCancelled}
                >
                  {isCancelled ? 'Event Cancelled' : isFull ? 'Event Full' : 'RSVP to Event'}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowAttendeesModal(true)}
                  leftIcon={<Users size={20} />}
                >
                  View Attendees ({attendeeCounts.going})
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setShowShareModal(true)}
                  leftIcon={<Share2 size={20} />}
                >
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Modals */}
      <AttendeesModal
        open={showAttendeesModal}
        onClose={() => setShowAttendeesModal(false)}
        eventId={event.id}
        eventTitle={event.title}
        isOrganizer={false}
        maxCapacity={event.max_capacity}
        currentCapacity={event.current_capacity}
      />

      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        event={event}
        shareUrl={shareUrl}
      />
    </>
  );
}
