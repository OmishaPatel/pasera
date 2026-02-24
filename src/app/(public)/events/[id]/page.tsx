// Event Detail Page
// Server component for data fetching, client wrapper for modals

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventById, getEventAttendees, getAttendeeCountByStatus, getUserRSVPStatus } from '@/lib/supabase/queries/events';
import { createClient } from '@/lib/supabase/server';
import { EventDetailClient } from './EventDetailClient';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await getEventById(id);

    return {
      title: `${event.title} | Pasera`,
      description: event.description,
      openGraph: {
        title: event.title,
        description: event.description,
        images: event.hero_image_url ? [event.hero_image_url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Event Not Found | Pasera',
    };
  }
}

// Server Component for data fetching
export default async function EventDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  try {
    // Fetch event data from Supabase
    const event = await getEventById(id);

    // Fetch attendees with profiles
    const attendeesWithProfiles = await getEventAttendees(id);

    // Get attendee counts by status
    const attendeeCounts = await getAttendeeCountByStatus(id);

    // Get user's RSVP status
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userRSVP = null;
    if (user) {
      userRSVP = await getUserRSVPStatus(id, user.id);
    }

    // Pass data to client component
    return (
      <EventDetailClient
        event={event}
        attendees={attendeesWithProfiles}
        attendeeCounts={attendeeCounts}
        userRSVP={userRSVP}
      />
    );
  } catch (error) {
    // Handle 404
    notFound();
  }
}
