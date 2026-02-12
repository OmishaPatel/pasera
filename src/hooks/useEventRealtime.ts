'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { EventWithOrganizer } from '@/types/event';

/**
 * Real-time hook for live event updates
 * Subscribes to Supabase Realtime changes for a specific event
 */
export function useEventRealtime(
  eventId: string,
  initialEvent: EventWithOrganizer
) {
  const [event, setEvent] = useState<EventWithOrganizer>(initialEvent);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to event changes
    const channel = supabase
      .channel(`event:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          console.log('[Realtime] Event updated:', payload);
          // Merge the update with existing data to preserve organizer info
          setEvent((prev) => ({
            ...prev,
            ...payload.new,
            organizer: prev.organizer, // Preserve organizer data
          } as EventWithOrganizer));
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('[Realtime] Unsubscribing from event:', eventId);
      supabase.removeChannel(channel);
    };
  }, [eventId, supabase]);

  return { event, isConnected };
}

/**
 * Real-time hook for event attendees
 * Subscribes to attendee changes for a specific event
 */
export function useEventAttendeesRealtime(eventId: string) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to attendee changes
    const channel = supabase
      .channel(`attendees:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // All events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'event_attendees',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log('[Realtime] Attendee changed:', payload);
          // Trigger a refresh by incrementing the counter
          setRefreshTrigger((prev) => prev + 1);
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Attendees subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('[Realtime] Unsubscribing from attendees:', eventId);
      supabase.removeChannel(channel);
    };
  }, [eventId, supabase]);

  return { refreshTrigger };
}
