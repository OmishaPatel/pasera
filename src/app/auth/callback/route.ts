import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    console.log('[OAuth] Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // If there's an error, redirect to error page
      console.error('[OAuth] Exchange failed:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`);
    }

    // Successful authentication, redirect to dashboard or next page
    console.log('[OAuth] Session created successfully:', {
      userId: data.user?.id,
      email: data.user?.email,
      metadata: data.user?.user_metadata
    });
    return NextResponse.redirect(`${origin}${next}`);
  }

  // No code present, redirect to error page
  return NextResponse.redirect(`${origin}/auth/error?message=No+authorization+code+found`);
}
