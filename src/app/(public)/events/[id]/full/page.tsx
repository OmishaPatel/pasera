// Event Full State Page
// Displays waitlist information when event is at capacity
// TODO: Phase 5 - Replace with Supabase queries

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEventById, getAttendeesByStatus } from '@/lib/mock';
import { EventFullClient } from './EventFullClient';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return {
      title: 'Event Not Found | Pasera',
    };
  }

  return {
    title: `${event.title} - Event Full | Pasera`,
    description: `${event.title} is currently full. Join the waitlist to be notified if a spot opens up.`,
    openGraph: {
      title: `${event.title} - Event Full`,
      description: 'This event is currently at capacity. Join the waitlist for updates.',
      images: event.hero_image_url ? [event.hero_image_url] : [],
    },
  };
}

// Server Component for data fetching
export default async function EventFullPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch event data
  const event = getEventById(id);

  // Handle 404
  if (!event) {
    notFound();
  }

  // Redirect if event is NOT full
  const isFull = event.status === 'full' || event.current_capacity >= event.max_capacity;
  if (!isFull) {
    redirect(`/events/${id}`);
  }

  // Get waitlist attendees
  const waitlistAttendees = getAttendeesByStatus(id, 'waitlist');
  const waitlistCount = waitlistAttendees.length;

  // Pass data to client component
  return <EventFullClient event={event} waitlistCount={waitlistCount} />;
}
