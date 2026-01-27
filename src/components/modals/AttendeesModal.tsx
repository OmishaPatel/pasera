'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AttendeeListItem } from '@/components/events/AttendeeListItem';
import { CapacityDisplay } from '@/components/events/CapacityDisplay';
import { AttendeeStatus, EventAttendee } from '@/types/event';
import { Profile } from '@/types/user';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * AttendeesModal Component
 *
 * Modal displaying all event attendees with search and filtering.
 * Organized by status (Going, Maybe, Interested, Waitlist) with organizer actions.
 *
 * Usage:
 *   <AttendeesModal
 *     open={isOpen}
 *     onClose={handleClose}
 *     eventId="123"
 *     eventTitle="Saturday Hike"
 *     isOrganizer={true}
 *     onMessage={handleMessage}
 *     onEmail={handleEmail}
 *   />
 */

export interface AttendeeWithUser extends EventAttendee {
  user: Profile;
}

export interface AttendeesModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  isOrganizer: boolean;
  maxCapacity: number;
  currentCapacity: number;
  onMessage?: (userId: string) => void;
  onEmail?: (email: string) => void;
}

export function AttendeesModal({
  open,
  onClose,
  eventId,
  eventTitle,
  isOrganizer,
  maxCapacity,
  currentCapacity,
  onMessage,
  onEmail,
}: AttendeesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AttendeeStatus | 'all'>('all');
  const [attendees, setAttendees] = useState<AttendeeWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendees (placeholder - replace with actual Supabase query)
  useEffect(() => {
    if (!open) return;

    const fetchAttendees = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('event_attendees')
        //   .select(`
        //     *,
        //     user:profiles!user_id(id, full_name, email, avatar_url)
        //   `)
        //   .eq('event_id', eventId)
        //   .order('responded_at', { ascending: false })

        // Placeholder data for now
        setAttendees([]);
      } catch (err) {
        setError('Failed to load attendees');
        console.error('Error fetching attendees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [open, eventId]);

  // Filter attendees by search query and active tab
  const filteredAttendees = attendees.filter((attendee) => {
    // Filter by status tab
    if (activeTab !== 'all' && attendee.status !== activeTab) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = attendee.user.full_name?.toLowerCase() || '';
      const email = attendee.user.email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    }

    return true;
  });

  // Count attendees by status
  const statusCounts = {
    all: attendees.length,
    going: attendees.filter((a) => a.status === 'going').length,
    maybe: attendees.filter((a) => a.status === 'maybe').length,
    interested: attendees.filter((a) => a.status === 'interested').length,
    waitlist: attendees.filter((a) => a.status === 'waitlist').length,
  };

  const tabs: Array<{ value: AttendeeStatus | 'all'; label: string }> = [
    { value: 'all', label: `All (${statusCounts.all})` },
    { value: 'going', label: `Going (${statusCounts.going})` },
    { value: 'maybe', label: `Maybe (${statusCounts.maybe})` },
    { value: 'interested', label: `Interested (${statusCounts.interested})` },
    { value: 'waitlist', label: `Waitlist (${statusCounts.waitlist})` },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      className="sm:max-w-2xl"
    >
      <ModalHeader>
        <ModalTitle>Attendees - {eventTitle}</ModalTitle>
      </ModalHeader>

      <ModalBody className="space-y-4">
        {/* Search bar */}
        <Input
          type="text"
          placeholder="Search attendees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={18} />}
        />

        {/* Capacity display */}
        <CapacityDisplay
          current={currentCapacity}
          max={maxCapacity}
          variant="default"
        />

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Attendees list */}
        <div className="space-y-2">
          {loading ? (
            <div className="py-8 text-center text-[var(--color-gray-500)]">
              Loading attendees...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-[var(--color-danger)]">
              {error}
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div className="py-8 text-center text-[var(--color-gray-500)]">
              {searchQuery
                ? 'No attendees match your search'
                : activeTab === 'all'
                ? 'No attendees yet'
                : `No attendees with status "${activeTab}"`}
            </div>
          ) : (
            filteredAttendees.map((attendee) => (
              <AttendeeListItem
                key={attendee.id}
                userId={attendee.user_id}
                name={attendee.user.full_name || 'Unknown'}
                email={attendee.user.email}
                avatarUrl={attendee.user.avatar_url}
                status={attendee.status}
                respondedAt={attendee.responded_at}
                showActions={isOrganizer}
                onMessage={onMessage}
                onEmail={onEmail}
              />
            ))
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

AttendeesModal.displayName = 'AttendeesModal';
