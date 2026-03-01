// Browse Events Page
// Server component for fetching events data

import { getEvents, getUserRSVPsForEvents, getWaitlistDataForEvents } from '@/lib/supabase/queries/events';
import { createClient } from '@/lib/supabase/server';
import { EventsPageClient } from './EventsPageClient';
import { AttendeeStatus } from '@/types/event';

export default async function BrowseEventsPage() {
  // Fetch all public events from Supabase
  const events = await getEvents();

  // Get current user session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's RSVPs if authenticated
  let userRSVPs: Map<string, AttendeeStatus> = new Map();
  if (user && events.length > 0) {
    const eventIds = events.map(e => e.id);
    userRSVPs = await getUserRSVPsForEvents(eventIds);
  }

  // Convert Map to plain object for client component serialization
  const userRSVPsObject = Object.fromEntries(userRSVPs);

  // Fetch waitlist data for all events
  let waitlistData: Record<string, {
    position: number | null;
    count: number;
  }> = {};

  if (events.length > 0) {
    const eventIds = events.map(e => e.id);
    waitlistData = await getWaitlistDataForEvents(eventIds, user?.id);
  }

  return (
    <EventsPageClient
      events={events}
      userRSVPs={userRSVPsObject}
      isAuthenticated={!!user}
      waitlistData={waitlistData}
    />
  );
}
