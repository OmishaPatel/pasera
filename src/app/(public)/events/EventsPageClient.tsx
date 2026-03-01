'use client';

// Browse Events - Client Component
// Handles interactive search and filtering

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/events/EventCard';
import { Badge } from '@/components/ui/Badge';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { Toast } from '@/components/ui/Toast';
import { joinWaitlist } from '@/app/actions/waitlist';
import { Search, Filter, Calendar } from 'lucide-react';
import type { EventWithOrganizer, AttendeeStatus } from '@/types/event';

interface EventsPageClientProps {
  events: EventWithOrganizer[];
  userRSVPs: Record<string, AttendeeStatus>;
  isAuthenticated: boolean;
  waitlistData: Record<string, {
    position: number | null;
    count: number;
  }>;
}

export function EventsPageClient({ events, userRSVPs, isAuthenticated, waitlistData }: EventsPageClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [selectedEventForWaitlist, setSelectedEventForWaitlist] = useState<EventWithOrganizer | null>(null);

  // Cancel confirmation modal state
  const [cancelConfirmEvent, setCancelConfirmEvent] = useState<{
    id: string;
    title: string;
    waitlistCount: number;
  } | null>(null);

  // Loading states for immediate user feedback
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Derived filtered events using useMemo for performance
  const filteredEvents = useMemo(() => {
    let results = [...events];

    // Search filter (title, description, location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query) ||
          e.location_name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      results = results.filter((e) => e.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      results = results.filter((e) => e.difficulty === difficultyFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      results = results.filter((e) => e.status === statusFilter);
    }

    // Sort by event date (upcoming first)
    results.sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

    return results;
  }, [events, searchQuery, categoryFilter, difficultyFilter, statusFilter]);

  // Navigate to event detail page
  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  // Handle RSVP - rely on server state
  const handleRSVP = async (eventId: string, newStatus: 'going' | null) => {
    if (!user) {
      router.push(`/login?next=/events`);
      return;
    }

    // If cancelling, show loading state during operation
    if (newStatus === null) {
      setCancellingEventId(eventId);
      await handleCancel(eventId);
      setCancellingEventId(null);
      return;
    }

    // Refresh to fetch updated event data from server
    router.refresh();
  };

  // Handle join waitlist
  const handleJoinWaitlist = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEventForWaitlist(event);
      setShowWaitlistModal(true);
    }
  };

  // Perform join waitlist action
  const handleConfirmJoinWaitlist = async () => {
    if (!selectedEventForWaitlist) return;

    try {
      const result = await joinWaitlist(selectedEventForWaitlist.id);

      if (result.success) {
        showToast(`You're #${result.position} on the waitlist!`, 'success');
        router.refresh();
      } else {
        showToast(result.message || 'Failed to join waitlist', 'error');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to join waitlist', 'error');
    } finally {
      setShowWaitlistModal(false);
      setSelectedEventForWaitlist(null);
    }
  };

  // Claim spot handler removed - users are now automatically promoted

  // Handle cancel with waitlist check
  const handleCancel = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const waitlistCount = waitlistData[eventId]?.count || 0;

    // Show confirmation if waitlist exists
    if (waitlistCount > 0) {
      setCancelConfirmEvent({
        id: eventId,
        title: event?.title || '',
        waitlistCount,
      });
      return;
    }

    // No waitlist - cancel directly
    await performCancel(eventId);
  };

  // Perform the actual cancellation
  const performCancel = async (eventId: string) => {
    if (!user) return;

    try {
      const { cancelRSVP } = await import('@/app/actions/rsvp');
      const result = await cancelRSVP(eventId);

      if (result.success) {
        showToast('RSVP cancelled successfully', 'success');
        router.refresh();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel RSVP';
      if (!errorMessage.includes('No RSVP found')) {
        showToast(errorMessage, 'error');
      }
    }
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== 'all' ||
    difficultyFilter !== 'all' ||
    statusFilter !== 'all';

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setDifficultyFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] py-8">
      <Container size="lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-gray-900)] mb-2">
            Browse Events
          </h1>
          <p className="text-lg text-[var(--color-gray-600)]">
            Discover outdoor adventures in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 md:p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search events by title, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={20} />}
              className="w-full"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-[var(--color-gray-700)] mb-1"
              >
                Category
              </label>
              <Select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                icon={<Filter size={18} />}
              >
                <option value="all">All Categories</option>
                <option value="hiking">Hiking</option>
                <option value="biking">Biking</option>
                <option value="climbing">Climbing</option>
                <option value="camping">Camping</option>
                <option value="kayaking">Kayaking</option>
                <option value="outdoor_adventure">Outdoor Adventure</option>
                <option value="other">Other</option>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label
                htmlFor="difficulty-filter"
                className="block text-sm font-medium text-[var(--color-gray-700)] mb-1"
              >
                Difficulty
              </label>
              <Select
                id="difficulty-filter"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-[var(--color-gray-700)] mb-1"
              >
                Status
              </label>
              <Select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="active">Active</option>
                <option value="full">Full</option>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--color-gray-600)]">
            {filteredEvents.length}{' '}
            {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {searchQuery && (
                <Badge variant="default" size="sm">
                  Search: &quot;{searchQuery}&quot;
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="default" size="sm">
                  {categoryFilter.replace('_', ' ')}
                </Badge>
              )}
              {difficultyFilter !== 'all' && (
                <Badge variant="default" size="sm">
                  {difficultyFilter}
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="default" size="sm">
                  {statusFilter}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                rsvpStatus={userRSVPs[event.id] || null}
                isAuthenticated={isAuthenticated}
                showOrganizer
                showCapacity
                showImage
                onClick={handleEventClick}
                onRSVP={handleRSVP}
                waitlistPosition={waitlistData[event.id]?.position}
                waitlistCount={waitlistData[event.id]?.count || 0}
                onJoinWaitlist={handleJoinWaitlist}
                isCancelling={cancellingEventId === event.id}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[var(--color-gray-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={40} className="text-[var(--color-gray-400)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-gray-900)] mb-2">
              No events found
            </h3>
            <p className="text-[var(--color-gray-600)] mb-6">
              {hasActiveFilters
                ? 'Try adjusting your search or filters to find more events.'
                : 'There are no events available at the moment. Check back soon!'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Waitlist Modal */}
        {showWaitlistModal && selectedEventForWaitlist && (
          <WaitlistModal
            open={showWaitlistModal}
            onClose={() => {
              setShowWaitlistModal(false);
              setSelectedEventForWaitlist(null);
            }}
            event={selectedEventForWaitlist}
            currentWaitlistCount={waitlistData[selectedEventForWaitlist.id]?.count || 0}
            onJoin={handleConfirmJoinWaitlist}
          />
        )}

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
                ⚠️ If you cancel, you'll lose your spot and the next person on the waitlist will be automatically promoted. You'll need to join the waitlist to attend
                (currently <strong>{cancelConfirmEvent.waitlistCount} {cancelConfirmEvent.waitlistCount === 1 ? 'person' : 'people'}</strong> waiting).
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    performCancel(cancelConfirmEvent.id);
                    setCancelConfirmEvent(null);
                  }}
                >
                  Cancel RSVP
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setCancelConfirmEvent(null)}
                >
                  Keep My Spot
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast?.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </Container>
    </div>
  );
}
