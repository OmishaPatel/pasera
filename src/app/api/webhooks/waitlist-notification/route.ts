import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { sendWaitlistNotification } from '@/lib/email/sender';
import { format } from 'date-fns';

/**
 * Webhook handler for waitlist notifications
 * Triggered by database trigger when a user is automatically promoted from waitlist to going status
 * Note: The database trigger (notify_waitlist_promotion_webhook) only fires for waitlist → going transitions,
 * so we can assume all requests are valid promotion events
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload = await request.json();
    const { record } = payload;

    console.log('[Webhook] Waitlist promotion notification:', {
      userId: record?.user_id,
      eventId: record?.event_id,
    });

    // Validate required fields
    if (!record?.user_id || !record?.event_id) {
      console.error('[Webhook] Missing required fields:', record);
      return NextResponse.json(
        { error: 'Missing user_id or event_id in webhook payload' },
        { status: 400 }
      );
    }

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

    // Generate event URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const eventUrl = `${baseUrl}/events/${event.id}`;

    // Send email notification
    const emailResult = await sendWaitlistNotification({
      to: user.email,
      userName: user.full_name,
      eventTitle: event.title,
      eventDate,
      eventTime,
      eventUrl,
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
