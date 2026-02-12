import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { sendWaitlistNotification } from '@/lib/email/sender';
import { format } from 'date-fns';

/**
 * Webhook handler for waitlist notifications
 * Triggered by Supabase when waitlist_notified_at is updated
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload = await request.json();

    console.log('[Webhook] Waitlist notification triggered:', {
      type: payload.type,
      table: payload.table,
      record: payload.record?.user_id,
    });

    // Verify this is an UPDATE event for event_attendees
    if (payload.type !== 'UPDATE' || payload.table !== 'event_attendees') {
      return NextResponse.json(
        { error: 'Invalid webhook event type' },
        { status: 400 }
      );
    }

    const { record, old_record } = payload;

    // Check if waitlist_notified_at was just set (null -> timestamp)
    if (
      !old_record?.waitlist_notified_at &&
      record?.waitlist_notified_at &&
      record?.status === 'waitlist'
    ) {
      // Fetch event and user details
      const supabase = createServiceRoleClient();

      const [eventResult, userResult] = await Promise.all([
        supabase
          .from('events')
          .select('id, title, event_date, start_time, end_time')
          .eq('id', record.event_id)
          .single(),
        supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', record.user_id)
          .single(),
      ]);

      if (eventResult.error || !eventResult.data) {
        console.error('[Webhook] Event not found:', eventResult.error);
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }

      if (userResult.error || !userResult.data) {
        console.error('[Webhook] User not found:', userResult.error);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const event = eventResult.data;
      const user = userResult.data;

      // Format dates for email
      const eventDate = format(new Date(event.event_date), 'EEEE, MMMM d, yyyy');
      const eventTime = event.start_time
        ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
        : 'Time TBD';
      const expiresAt = format(
        new Date(record.waitlist_expires_at),
        'h:mm a \'on\' EEEE, MMMM d'
      );

      // Generate claim URL
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
      const claimUrl = `${baseUrl}/events/${event.id}?claim=true`;

      // Send email notification
      const emailResult = await sendWaitlistNotification({
        to: user.email,
        userName: user.full_name,
        eventTitle: event.title,
        eventDate,
        eventTime,
        claimUrl,
        expiresAt,
      });

      if (!emailResult.success) {
        console.error('[Webhook] Failed to send email:', emailResult.error);
        return NextResponse.json(
          { error: 'Failed to send email', details: emailResult.error },
          { status: 500 }
        );
      }

      console.log('[Webhook] Waitlist notification sent successfully:', {
        userId: user.id,
        eventId: event.id,
        email: user.email,
      });

      return NextResponse.json({
        success: true,
        message: 'Notification sent',
        userId: user.id,
        eventId: event.id,
      });
    }

    // Not a waitlist notification event, ignore
    return NextResponse.json({
      success: true,
      message: 'Event ignored (not a new waitlist notification)',
    });
  } catch (error) {
    console.error('[Webhook] Error processing waitlist notification:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'waitlist-notification',
    timestamp: new Date().toISOString(),
  });
}
