'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Join the waitlist for a full event
 */
export async function joinWaitlist(eventId: string) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to join the waitlist');
  }

  // Check event exists and is full
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, title, current_capacity, max_capacity, status')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    throw new Error('Event not found');
  }

  if (event.status === 'cancelled') {
    throw new Error('Cannot join waitlist for a cancelled event');
  }

  if (event.current_capacity < event.max_capacity) {
    throw new Error('Event is not full. You can RSVP directly.');
  }

  // Check if user already has an RSVP or is on waitlist
  const { data: existingRSVP } = await supabase
    .from('event_attendees')
    .select('status, waitlist_position')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingRSVP) {
    if (existingRSVP.status === 'going') {
      throw new Error('You are already attending this event');
    }
    if (existingRSVP.status === 'waitlist') {
      return {
        success: true,
        message: 'You are already on the waitlist',
        position: existingRSVP.waitlist_position || 0,
        alreadyOnWaitlist: true,
      };
    }
  }

  // Get the next waitlist position
  const { data: maxPositionData } = await supabase
    .from('event_attendees')
    .select('waitlist_position')
    .eq('event_id', eventId)
    .eq('status', 'waitlist')
    .order('waitlist_position', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxPositionData?.waitlist_position || 0) + 1;

  // Add user to waitlist
  const { error: upsertError } = await supabase
    .from('event_attendees')
    .upsert(
      {
        event_id: eventId,
        user_id: user.id,
        status: 'waitlist',
        waitlist_position: nextPosition,
        responded_at: new Date().toISOString(),
        waitlist_notified_at: null,
        waitlist_expires_at: null,
      },
      {
        onConflict: 'event_id,user_id',
      }
    );

  if (upsertError) {
    console.error('Error joining waitlist:', upsertError);
    throw new Error('Failed to join waitlist. Please try again.');
  }

  // Revalidate pages
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    message: 'Successfully joined waitlist',
    position: nextPosition,
    alreadyOnWaitlist: false,
  };
}

/**
 * Claim a waitlist spot (when notified that a spot opened)
 */
export async function claimWaitlistSpot(eventId: string) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to claim a spot');
  }

  // Get user's waitlist entry
  const { data: attendee, error: attendeeError } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single();

  if (attendeeError || !attendee) {
    throw new Error('Waitlist entry not found');
  }

  if (attendee.status !== 'waitlist') {
    throw new Error('You are not on the waitlist for this event');
  }

  // Check if user was notified
  if (!attendee.waitlist_notified_at) {
    throw new Error('You have not been notified of an available spot yet');
  }

  // Check if claim window has expired (2 hours)
  if (attendee.waitlist_expires_at) {
    const expirationTime = new Date(attendee.waitlist_expires_at);
    const now = new Date();

    if (now > expirationTime) {
      throw new Error('Your claim window has expired');
    }
  }

  // Update status from waitlist to going
  const { error: updateError } = await supabase
    .from('event_attendees')
    .update({
      status: 'going',
      waitlist_position: null,
      waitlist_notified_at: null,
      waitlist_expires_at: null,
      responded_at: new Date().toISOString(),
    })
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Error claiming waitlist spot:', updateError);
    throw new Error('Failed to claim spot. Please try again.');
  }

  // Revalidate pages
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    message: 'Successfully claimed your spot!',
  };
}

/**
 * Leave the waitlist
 */
export async function leaveWaitlist(eventId: string) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in');
  }

  // Check if user is on waitlist
  const { data: attendee } = await supabase
    .from('event_attendees')
    .select('status')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!attendee || attendee.status !== 'waitlist') {
    throw new Error('You are not on the waitlist');
  }

  // Remove from waitlist
  const { error: deleteError } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('Error leaving waitlist:', deleteError);
    throw new Error('Failed to leave waitlist. Please try again.');
  }

  // Revalidate pages
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return {
    success: true,
    message: 'Successfully left the waitlist',
  };
}

/**
 * Get user's waitlist info for an event
 */
export async function getWaitlistInfo(eventId: string) {
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
    .eq('status', 'waitlist')
    .maybeSingle();

  if (error) {
    console.error('Error fetching waitlist info:', error);
    return null;
  }

  return data;
}
