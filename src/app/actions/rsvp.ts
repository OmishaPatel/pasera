'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Update user's RSVP status for an event
 */
export async function updateRSVP(
  eventId: string,
  status: 'going' | 'maybe' | 'interested'
) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to RSVP');
  }

  // Check event exists and get capacity info
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, current_capacity, max_capacity, status, title')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    throw new Error('Event not found');
  }

  // Check if event is cancelled
  if (event.status === 'cancelled') {
    throw new Error('Cannot RSVP to a cancelled event');
  }

  // Check if user already has an RSVP
  const { data: existingRSVP } = await supabase
    .from('event_attendees')
    .select('status')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  // If trying to RSVP "going" and event is full
  if (status === 'going' && event.current_capacity >= event.max_capacity) {
    // If user doesn't have an existing "going" RSVP, redirect to waitlist
    if (!existingRSVP || existingRSVP.status !== 'going') {
      return {
        success: false,
        error: 'Event is full',
        action: 'join_waitlist',
      };
    }
  }

  // Upsert RSVP (will trigger DB function to update capacity)
  const { error: upsertError } = await supabase
    .from('event_attendees')
    .upsert(
      {
        event_id: eventId,
        user_id: user.id,
        status,
        responded_at: new Date().toISOString(),
        // Clear waitlist fields when updating RSVP
        waitlist_position: null,
        waitlist_notified_at: null,
        waitlist_expires_at: null,
      },
      {
        onConflict: 'event_id,user_id',
      }
    );

  if (upsertError) {
    console.error('Error updating RSVP:', upsertError);
    throw new Error('Failed to update RSVP. Please try again.');
  }

  // Revalidate the event page
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    message: `RSVP updated to "${status}"`,
  };
}

/**
 * Cancel user's RSVP for an event
 */
export async function cancelRSVP(eventId: string) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to cancel RSVP');
  }

  // Check if user has an RSVP
  const { data: existingRSVP } = await supabase
    .from('event_attendees')
    .select('id, status')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!existingRSVP) {
    throw new Error('No RSVP found to cancel');
  }

  // Delete the RSVP (will trigger DB function to update capacity and notify waitlist)
  const { error: deleteError } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Error cancelling RSVP:', deleteError);
    throw new Error('Failed to cancel RSVP. Please try again.');
  }

  // Revalidate the event page
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    message: 'RSVP cancelled successfully',
  };
}

/**
 * Get user's current RSVP status for an event
 */
export async function getUserRSVP(eventId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user RSVP:', error);
    return null;
  }

  return data;
}
