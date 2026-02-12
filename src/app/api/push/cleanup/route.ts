import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * API endpoint to clean up old push notification subscriptions for a user
 * This is useful when testing (unregister/re-register creates new endpoints)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all existing subscriptions for this user
    // A new one will be created immediately after
    const { error, count } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[Push Cleanup] Failed to delete old subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to cleanup subscriptions' },
        { status: 500 }
      );
    }

    console.log('[Push Cleanup] Deleted', count, 'old subscription(s) for user:', userId);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${count || 0} old subscription(s)`,
      count: count || 0,
    });
  } catch (error) {
    console.error('[Push Cleanup] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
