import { Resend } from 'resend';
import { WaitlistNotificationEmail, WaitlistNotificationEmailText } from './templates/waitlist-notification';
import { render } from '@react-email/render';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface WaitlistNotificationParams {
  to: string;
  userName?: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  claimUrl: string;
  expiresAt: string;
}

/**
 * Send waitlist notification email
 */
export async function sendWaitlistNotification(params: WaitlistNotificationParams) {
  try {
    // Render React email template to HTML
    const html = await render(
      WaitlistNotificationEmail({
        eventTitle: params.eventTitle,
        eventDate: params.eventDate,
        eventTime: params.eventTime,
        claimUrl: params.claimUrl,
        expiresAt: params.expiresAt,
        userName: params.userName,
      })
    );

    // Render plain text version
    const text = WaitlistNotificationEmailText({
      eventTitle: params.eventTitle,
      eventDate: params.eventDate,
      eventTime: params.eventTime,
      claimUrl: params.claimUrl,
      expiresAt: params.expiresAt,
      userName: params.userName,
    });

    const { data, error } = await resend.emails.send({
      from: 'Pasera <notifications@pasera.co>',
      to: params.to,
      subject: `🎉 Spot available: ${params.eventTitle}`,
      html,
      text,
      headers: {
        'X-Entity-Ref-ID': `waitlist-${Date.now()}`,
      },
      tags: [
        {
          name: 'category',
          value: 'waitlist_notification',
        },
      ],
    });

    if (error) {
      console.error('[Email] Failed to send waitlist notification:', {
        error,
        to: params.to,
        eventTitle: params.eventTitle,
      });
      return { success: false, error };
    }

    console.log('[Email] Waitlist notification sent successfully:', {
      to: params.to,
      messageId: data?.id,
      eventTitle: params.eventTitle,
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Exception sending waitlist notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Test email sending (for development)
 */
export async function sendTestEmail(to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Pasera <notifications@pasera.co>',
      to,
      subject: 'Test Email from Pasera',
      html: '<h1>Test Email</h1><p>If you received this, email sending is working!</p>',
    });

    if (error) {
      console.error('[Email] Test email failed:', error);
      return { success: false, error };
    }

    console.log('[Email] Test email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[Email] Exception sending test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
