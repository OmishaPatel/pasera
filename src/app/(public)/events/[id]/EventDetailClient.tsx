'use client';

// Event Detail Client Component
// Handles modal state and interactive elements

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
// ClaimSpotDialog removed - automatic promotion implemented
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { RSVPButton } from '@/components/events/RSVPButton';
import { joinWaitlist } from '@/app/actions/waitlist';
import { EventWithOrganizer, EventAttendee } from '@/types/event';
import { Profile } from '@/types/user';
import { MapPin, Users, Share2, Calendar, AlertCircle } from 'lucide-react';

interface AttendeeWithUser {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'waitlist';
  responded_at: string;
  created_at: string;
  user: Profile;
}

interface EventDetailClientProps {
  event: EventWithOrganizer;
  attendees: AttendeeWithUser[];
  attendeeCounts: {
    going: number;
    waitlist: number;
  };
  userRSVP?: EventAttendee | null;
}

export function EventDetailClient({
  event,
  attendees,
  attendeeCounts,
  userRSVP
}: EventDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [cancelConfirmEvent, setCancelConfirmEvent] = useState<{
    id: string;
    title: string;
    waitlistCount: number;
  } | null>(null);
  const [leaveWaitlistConfirm, setLeaveWaitlistConfirm] = useState(false);
  const [cancellingRSVP, setCancellingRSVP] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  // Filter attendees by status (for preview)
  const goingAttendees = attendees.filter(a => a.status === 'going');
  const previewAttendees = goingAttendees.slice(0, 5);

  // Check event states - use actual attendee count instead of stored capacity
  const isFull = event.status === 'full' || attendeeCounts.going >= event.max_capacity;
  const isCancelled = event.status === 'cancelled';
  const isActive = event.status === 'active' && !isFull;

  // Get share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${event.id}`
    : '';

  // Claim dialog removed - users are now automatically promoted

  // Handle RSVP cancellation
  const handleRSVPChange = async (newStatus: 'going' | null) => {
    if (!user) return;

    // If cancelling, check current status
    if (newStatus === null) {
      // If user is currently on waitlist, show leave waitlist confirmation
      if (userRSVP?.status === 'waitlist') {
        setLeaveWaitlistConfirm(true);
        return;
      }

      // If user is going and there's a waitlist, show cancel confirmation
      if (userRSVP?.status === 'going' && attendeeCounts.waitlist > 0) {
        setCancelConfirmEvent({
          id: event.id,
          title: event.title,
          waitlistCount: attendeeCounts.waitlist,
        });
        return;
      }

      // No waitlist - cancel directly
      await performCancel();
    } else {
      // Just refresh for other status changes
      router.refresh();
    }
  };

  // Perform the actual cancellation
  const performCancel = async () => {
    if (!user) return;

    setCancellingRSVP(true);
    try {
      const { cancelRSVP } = await import('@/app/actions/rsvp');
      const result = await cancelRSVP(event.id);

      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to cancel RSVP:', error);
    } finally {
      setCancellingRSVP(false);
    }
  };

  // Handle joining waitlist
  const handleJoinWaitlist = () => {
    if (!user) {
      router.push(`/login?next=/events/${event.id}`);
      return;
    }
    setShowWaitlistModal(true);
  };

  // Perform the actual waitlist join
  const handleConfirmJoinWaitlist = async () => {
    try {
      const result = await joinWaitlist(event.id);

      if (result.success) {
        setShowWaitlistModal(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
    }
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
          {isFull && !isCancelled && userRSVP?.status !== 'going' && (
            <Card className="mb-6 bg-[var(--color-warning)]/10 border-[var(--color-warning)]">
              <CardBody>
                <div className="flex items-start gap-3">
                  <AlertCircle className="flex-shrink-0 text-[var(--color-warning)] mt-0.5" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-gray-900)] mb-1">
                      This event is full
                    </h3>
                    <p className="text-sm text-[var(--color-gray-700)] mb-3">
                      {userRSVP?.status === 'waitlist'
                        ? `You're on the waitlist (position #${userRSVP.waitlist_position}). Check out other events or view the waitlist.`
                        : 'All spots have been filled. You can join the waitlist or check out other events.'}
                    </p>
                    {userRSVP?.status === 'waitlist' ? (
                      <Link href={`/events/${event.id}/full`}>
                        <Button variant="secondary" size="sm">
                          View Waitlist
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleJoinWaitlist}
                      >
                        Join Waitlist
                      </Button>
                    )}
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
                    current={attendeeCounts.going}
                    max={event.max_capacity}
                    variant="default"
                    showPercentage
                  />

                  {/* Waitlist Count */}
                  {attendeeCounts.waitlist > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--color-gray-200)] space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-gray-600)]">Waitlist</span>
                        <span className="font-medium text-[var(--color-gray-900)]">
                          {attendeeCounts.waitlist}
                        </span>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <RSVPButton
                  eventId={event.id}
                  currentStatus={userRSVP?.status || null}
                  isAuthenticated={!!user}
                  isFull={isFull}
                  isCancelled={isCancelled}
                  variant="full"
                  waitlistPosition={userRSVP?.waitlist_position}
                  onLoginRequired={() => router.push(`/login?next=/events/${event.id}`)}
                  onStatusChange={handleRSVPChange}
                  onWaitlistRequired={handleJoinWaitlist}
                />

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
        isOrganizer={user?.id === event.organizer_id}
        maxCapacity={event.max_capacity}
        currentCapacity={event.current_capacity}
        attendees={attendees}
      />

      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        event={event}
        shareUrl={shareUrl}
      />

      {/* Cancel Confirmation Modal */}
      {cancelConfirmEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancel Your RSVP?
            </h3>
            <p className="text-gray-600 mb-1">
              You're currently confirmed for <strong>{cancelConfirmEvent.title}</strong>.
            </p>
            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm">
              ⚠️ If you cancel, you'll lose your spot. The next person on the waitlist will be automatically promoted
              (currently <strong>{cancelConfirmEvent.waitlistCount} {cancelConfirmEvent.waitlistCount === 1 ? 'person' : 'people'}</strong> waiting).
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                fullWidth
                onClick={async () => {
                  await performCancel();
                  setCancelConfirmEvent(null);
                }}
                disabled={cancellingRSVP}
                loading={cancellingRSVP}
              >
                Cancel RSVP
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setCancelConfirmEvent(null)}
                disabled={cancellingRSVP}
              >
                Keep RSVP
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Waitlist Confirmation Modal */}
      {leaveWaitlistConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Leave the Waitlist?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to leave the waitlist for <strong>{event.title}</strong>?
              {userRSVP?.waitlist_position && (
                <span className="block mt-2 text-sm">
                  You're currently at position <strong>#{userRSVP.waitlist_position}</strong>.
                </span>
              )}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              If you leave, you'll lose your spot and will need to rejoin at the end of the waitlist if you change your mind.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                fullWidth
                onClick={async () => {
                  await performCancel();
                  setLeaveWaitlistConfirm(false);
                }}
                disabled={cancellingRSVP}
                loading={cancellingRSVP}
              >
                Leave Waitlist
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setLeaveWaitlistConfirm(false)}
                disabled={cancellingRSVP}
              >
                Stay on Waitlist
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        open={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        event={event}
        currentWaitlistCount={attendeeCounts.waitlist}
        onJoin={handleConfirmJoinWaitlist}
      />
    </>
  );
}
