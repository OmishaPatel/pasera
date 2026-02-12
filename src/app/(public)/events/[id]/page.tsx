// Event Detail Page
// Server component for data fetching, client wrapper for modals

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventById, getEventAttendees, getAttendeeCountByStatus } from '@/lib/supabase/queries/events';
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

    // Pass data to client component
    return (
      <EventDetailClient
        event={event}
        attendees={attendeesWithProfiles}
        attendeeCounts={attendeeCounts}
      />
    );
  } catch (error) {
    // Handle 404
    notFound();
  }
}
