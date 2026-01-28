// Mock attendee data for Phase 4 development
// TODO: Phase 5 - Replace with Supabase queries

import { EventAttendee } from '@/types/event';
import { mockUsers } from './users';

export const mockAttendees: EventAttendee[] = [
  // Event 1: Runyon Canyon Sunrise Hike (15/20 capacity)
  { id: 'att-1', event_id: 'event-1', user_id: 'user-2', status: 'going', responded_at: '2026-01-26T10:30:00Z', created_at: '2026-01-26T10:30:00Z' },
  { id: 'att-2', event_id: 'event-1', user_id: 'user-3', status: 'going', responded_at: '2026-01-26T11:00:00Z', created_at: '2026-01-26T11:00:00Z' },
  { id: 'att-3', event_id: 'event-1', user_id: 'user-4', status: 'going', responded_at: '2026-01-26T12:15:00Z', created_at: '2026-01-26T12:15:00Z' },
  { id: 'att-4', event_id: 'event-1', user_id: 'user-5', status: 'going', responded_at: '2026-01-26T14:20:00Z', created_at: '2026-01-26T14:20:00Z' },
  { id: 'att-5', event_id: 'event-1', user_id: 'user-6', status: 'going', responded_at: '2026-01-26T15:45:00Z', created_at: '2026-01-26T15:45:00Z' },
  { id: 'att-6', event_id: 'event-1', user_id: 'user-7', status: 'going', responded_at: '2026-01-26T16:30:00Z', created_at: '2026-01-26T16:30:00Z' },
  { id: 'att-7', event_id: 'event-1', user_id: 'user-8', status: 'going', responded_at: '2026-01-26T17:00:00Z', created_at: '2026-01-26T17:00:00Z' },
  { id: 'att-8', event_id: 'event-1', user_id: 'user-2', status: 'maybe', responded_at: '2026-01-26T18:00:00Z', created_at: '2026-01-26T18:00:00Z' },
  { id: 'att-9', event_id: 'event-1', user_id: 'user-3', status: 'maybe', responded_at: '2026-01-26T19:00:00Z', created_at: '2026-01-26T19:00:00Z' },
  { id: 'att-10', event_id: 'event-1', user_id: 'user-4', status: 'interested', responded_at: '2026-01-26T20:00:00Z', created_at: '2026-01-26T20:00:00Z' },
  { id: 'att-11', event_id: 'event-1', user_id: 'user-5', status: 'interested', responded_at: '2026-01-26T21:00:00Z', created_at: '2026-01-26T21:00:00Z' },
  { id: 'att-12', event_id: 'event-1', user_id: 'user-6', status: 'interested', responded_at: '2026-01-26T22:00:00Z', created_at: '2026-01-26T22:00:00Z' },
  { id: 'att-13', event_id: 'event-1', user_id: 'user-7', status: 'interested', responded_at: '2026-01-27T08:00:00Z', created_at: '2026-01-27T08:00:00Z' },
  { id: 'att-14', event_id: 'event-1', user_id: 'user-8', status: 'interested', responded_at: '2026-01-27T09:00:00Z', created_at: '2026-01-27T09:00:00Z' },
  { id: 'att-15', event_id: 'event-1', user_id: 'user-2', status: 'waitlist', responded_at: '2026-01-27T10:00:00Z', created_at: '2026-01-27T10:00:00Z' },

  // Event 2: Santa Monica Beach Yoga (15/15 - FULL)
  { id: 'att-16', event_id: 'event-2', user_id: 'user-1', status: 'going', responded_at: '2026-01-21T10:00:00Z', created_at: '2026-01-21T10:00:00Z' },
  { id: 'att-17', event_id: 'event-2', user_id: 'user-4', status: 'going', responded_at: '2026-01-21T11:00:00Z', created_at: '2026-01-21T11:00:00Z' },
  { id: 'att-18', event_id: 'event-2', user_id: 'user-5', status: 'going', responded_at: '2026-01-21T12:00:00Z', created_at: '2026-01-21T12:00:00Z' },
  { id: 'att-19', event_id: 'event-2', user_id: 'user-6', status: 'going', responded_at: '2026-01-21T13:00:00Z', created_at: '2026-01-21T13:00:00Z' },
  { id: 'att-20', event_id: 'event-2', user_id: 'user-7', status: 'going', responded_at: '2026-01-21T14:00:00Z', created_at: '2026-01-21T14:00:00Z' },
  { id: 'att-21', event_id: 'event-2', user_id: 'user-8', status: 'going', responded_at: '2026-01-21T15:00:00Z', created_at: '2026-01-21T15:00:00Z' },
  { id: 'att-22', event_id: 'event-2', user_id: 'user-2', status: 'going', responded_at: '2026-01-22T10:00:00Z', created_at: '2026-01-22T10:00:00Z' },
  { id: 'att-23', event_id: 'event-2', user_id: 'user-3', status: 'going', responded_at: '2026-01-22T11:00:00Z', created_at: '2026-01-22T11:00:00Z' },
  { id: 'att-24', event_id: 'event-2', user_id: 'user-4', status: 'going', responded_at: '2026-01-22T12:00:00Z', created_at: '2026-01-22T12:00:00Z' },
  { id: 'att-25', event_id: 'event-2', user_id: 'user-5', status: 'going', responded_at: '2026-01-22T13:00:00Z', created_at: '2026-01-22T13:00:00Z' },
  { id: 'att-26', event_id: 'event-2', user_id: 'user-6', status: 'going', responded_at: '2026-01-22T14:00:00Z', created_at: '2026-01-22T14:00:00Z' },
  { id: 'att-27', event_id: 'event-2', user_id: 'user-7', status: 'going', responded_at: '2026-01-22T15:00:00Z', created_at: '2026-01-22T15:00:00Z' },
  { id: 'att-28', event_id: 'event-2', user_id: 'user-8', status: 'going', responded_at: '2026-01-22T16:00:00Z', created_at: '2026-01-22T16:00:00Z' },
  { id: 'att-29', event_id: 'event-2', user_id: 'user-1', status: 'going', responded_at: '2026-01-23T10:00:00Z', created_at: '2026-01-23T10:00:00Z' },
  { id: 'att-30', event_id: 'event-2', user_id: 'user-2', status: 'going', responded_at: '2026-01-23T11:00:00Z', created_at: '2026-01-23T11:00:00Z' },
  { id: 'att-31', event_id: 'event-2', user_id: 'user-3', status: 'waitlist', responded_at: '2026-01-24T10:00:00Z', created_at: '2026-01-24T10:00:00Z' },
  { id: 'att-32', event_id: 'event-2', user_id: 'user-4', status: 'waitlist', responded_at: '2026-01-24T11:00:00Z', created_at: '2026-01-24T11:00:00Z' },

  // Event 3: Griffith Observatory Star Gazing (10/25 capacity)
  { id: 'att-33', event_id: 'event-3', user_id: 'user-2', status: 'going', responded_at: '2026-01-21T10:00:00Z', created_at: '2026-01-21T10:00:00Z' },
  { id: 'att-34', event_id: 'event-3', user_id: 'user-3', status: 'going', responded_at: '2026-01-21T11:00:00Z', created_at: '2026-01-21T11:00:00Z' },
  { id: 'att-35', event_id: 'event-3', user_id: 'user-4', status: 'going', responded_at: '2026-01-21T12:00:00Z', created_at: '2026-01-21T12:00:00Z' },
  { id: 'att-36', event_id: 'event-3', user_id: 'user-5', status: 'going', responded_at: '2026-01-21T13:00:00Z', created_at: '2026-01-21T13:00:00Z' },
  { id: 'att-37', event_id: 'event-3', user_id: 'user-6', status: 'maybe', responded_at: '2026-01-21T14:00:00Z', created_at: '2026-01-21T14:00:00Z' },
  { id: 'att-38', event_id: 'event-3', user_id: 'user-7', status: 'maybe', responded_at: '2026-01-21T15:00:00Z', created_at: '2026-01-21T15:00:00Z' },
  { id: 'att-39', event_id: 'event-3', user_id: 'user-8', status: 'interested', responded_at: '2026-01-21T16:00:00Z', created_at: '2026-01-21T16:00:00Z' },
  { id: 'att-40', event_id: 'event-3', user_id: 'user-1', status: 'interested', responded_at: '2026-01-22T10:00:00Z', created_at: '2026-01-22T10:00:00Z' },
  { id: 'att-41', event_id: 'event-3', user_id: 'user-2', status: 'interested', responded_at: '2026-01-22T11:00:00Z', created_at: '2026-01-22T11:00:00Z' },
  { id: 'att-42', event_id: 'event-3', user_id: 'user-3', status: 'interested', responded_at: '2026-01-22T12:00:00Z', created_at: '2026-01-22T12:00:00Z' },

  // Event 4: Malibu Creek Bike Ride (12/18 capacity)
  { id: 'att-43', event_id: 'event-4', user_id: 'user-1', status: 'going', responded_at: '2026-01-23T10:00:00Z', created_at: '2026-01-23T10:00:00Z' },
  { id: 'att-44', event_id: 'event-4', user_id: 'user-2', status: 'going', responded_at: '2026-01-23T11:00:00Z', created_at: '2026-01-23T11:00:00Z' },
  { id: 'att-45', event_id: 'event-4', user_id: 'user-3', status: 'going', responded_at: '2026-01-23T12:00:00Z', created_at: '2026-01-23T12:00:00Z' },
  { id: 'att-46', event_id: 'event-4', user_id: 'user-4', status: 'going', responded_at: '2026-01-23T13:00:00Z', created_at: '2026-01-23T13:00:00Z' },
  { id: 'att-47', event_id: 'event-4', user_id: 'user-5', status: 'going', responded_at: '2026-01-23T14:00:00Z', created_at: '2026-01-23T14:00:00Z' },
  { id: 'att-48', event_id: 'event-4', user_id: 'user-6', status: 'going', responded_at: '2026-01-23T15:00:00Z', created_at: '2026-01-23T15:00:00Z' },
  { id: 'att-49', event_id: 'event-4', user_id: 'user-8', status: 'going', responded_at: '2026-01-23T16:00:00Z', created_at: '2026-01-23T16:00:00Z' },
  { id: 'att-50', event_id: 'event-4', user_id: 'user-1', status: 'maybe', responded_at: '2026-01-24T10:00:00Z', created_at: '2026-01-24T10:00:00Z' },
  { id: 'att-51', event_id: 'event-4', user_id: 'user-2', status: 'maybe', responded_at: '2026-01-24T11:00:00Z', created_at: '2026-01-24T11:00:00Z' },
  { id: 'att-52', event_id: 'event-4', user_id: 'user-3', status: 'interested', responded_at: '2026-01-24T12:00:00Z', created_at: '2026-01-24T12:00:00Z' },
  { id: 'att-53', event_id: 'event-4', user_id: 'user-4', status: 'interested', responded_at: '2026-01-24T13:00:00Z', created_at: '2026-01-24T13:00:00Z' },
  { id: 'att-54', event_id: 'event-4', user_id: 'user-5', status: 'interested', responded_at: '2026-01-24T14:00:00Z', created_at: '2026-01-24T14:00:00Z' },
];

// Utility functions
export const getAttendeesByEvent = (eventId: string): EventAttendee[] =>
  mockAttendees.filter(a => a.event_id === eventId);

export const getAttendeesByStatus = (eventId: string, status: 'going' | 'maybe' | 'interested' | 'waitlist'): EventAttendee[] =>
  mockAttendees.filter(a => a.event_id === eventId && a.status === status);

export const getAttendeesWithProfiles = (eventId: string) => {
  const attendees = getAttendeesByEvent(eventId);
  return attendees.map(att => ({
    ...att,
    user: mockUsers.find(u => u.id === att.user_id)!,
  }));
};

export const getAttendeeCountByStatus = (eventId: string) => {
  const attendees = getAttendeesByEvent(eventId);
  return {
    going: attendees.filter(a => a.status === 'going').length,
    maybe: attendees.filter(a => a.status === 'maybe').length,
    interested: attendees.filter(a => a.status === 'interested').length,
    waitlist: attendees.filter(a => a.status === 'waitlist').length,
  };
};

// Simulate async data fetching (for Phase 5 transition)
export const fetchAttendeesByEvent = async (eventId: string): Promise<EventAttendee[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getAttendeesByEvent(eventId);
};

export const fetchAttendeesWithProfiles = async (eventId: string) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return getAttendeesWithProfiles(eventId);
};
