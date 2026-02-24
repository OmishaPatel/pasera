import { createClient } from '@/lib/supabase/server';

/**
 * Get all public events with optional filters
 */
export async function getEvents(filters?: {
  category?: string;
  difficulty?: string;
  status?: string;
  search?: string;
  organizerId?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(id, full_name, avatar_url, email)
    `)
    .eq('visibility', 'public')
    .order('event_date', { ascending: true });

  // Apply category filter
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  // Apply difficulty filter
  if (filters?.difficulty && filters.difficulty !== 'all') {
    query = query.eq('difficulty', filters.difficulty);
  }

  // Apply status filter
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  // Apply search filter (title, description, location)
  if (filters?.search && filters.search.trim() !== '') {
    const searchTerm = `%${filters.search}%`;
    query = query.or(
      `title.ilike.${searchTerm},description.ilike.${searchTerm},location_name.ilike.${searchTerm},location_address.ilike.${searchTerm}`
    );
  }

  // Apply organizer filter
  if (filters?.organizerId) {
    query = query.eq('organizer_id', filters.organizerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!organizer_id(id, full_name, avatar_url, email, role)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw error;
  }

  return data;
}

/**
 * Get all events organized by a specific user
 */
export async function getEventsByOrganizer(organizerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('event_date', { ascending: false });

  if (error) {
    console.error('Error fetching organizer events:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get event attendees with profile information
 */
export async function getEventAttendees(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      user:profiles!user_id(id, full_name, avatar_url, email)
    `)
    .eq('event_id', eventId)
    .order('responded_at', { ascending: false });

  if (error) {
    console.error('Error fetching attendees:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get attendee count by status for an event
 */
export async function getAttendeeCountByStatus(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_attendees')
    .select('status')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching attendee counts:', error);
    throw error;
  }

  const counts = {
    going: 0,
    waitlist: 0,
  };

  data?.forEach((attendee) => {
    if (attendee.status in counts) {
      counts[attendee.status as keyof typeof counts]++;
    }
  });

  return counts;
}

/**
 * Get user's RSVP status for an event
 */
export async function getUserRSVPStatus(eventId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user RSVP:', error);
    return null;
  }

  return data;
}

/**
 * Get events the user has RSVP'd to
 */
export async function getUserEvents(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      event:events(
        *,
        organizer:profiles!organizer_id(id, full_name, avatar_url)
      )
    `)
    .eq('user_id', userId)
    .order('responded_at', { ascending: false });

  if (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get user's RSVP statuses for multiple events (browse page optimization)
 */
export async function getUserRSVPsForEvents(
  eventIds: string[]
): Promise<Map<string, import('@/types/event').AttendeeStatus>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Map();
  }

  const { data, error } = await supabase
    .from('event_attendees')
    .select('event_id, status')
    .eq('user_id', user.id)
    .in('event_id', eventIds);

  if (error) {
    console.error('Error fetching user RSVPs:', error);
    return new Map();
  }

  const rsvpMap = new Map<string, import('@/types/event').AttendeeStatus>();
  data?.forEach(rsvp => {
    rsvpMap.set(rsvp.event_id, rsvp.status as import('@/types/event').AttendeeStatus);
  });

  return rsvpMap;
}
