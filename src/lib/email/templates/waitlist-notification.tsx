import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Button,
  Hr,
} from '@react-email/components';

interface WaitlistNotificationEmailProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  claimUrl: string;
  expiresAt: string;
  userName?: string;
}

export function WaitlistNotificationEmail({
  eventTitle,
  eventDate,
  eventTime,
  claimUrl,
  expiresAt,
  userName,
}: WaitlistNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🏔️ OutdoorPath</Text>
            <Heading style={title}>Great News! A Spot Opened Up!</Heading>
            <Text style={subtitle}>
              {userName ? `Hi ${userName}, y` : 'Y'}ou've moved to the front of the waitlist
            </Text>
          </Section>

          <Section style={eventDetails}>
            <Text style={eventTitleStyle}>{eventTitle}</Text>
            <Text style={eventInfo}>📅 {eventDate}</Text>
            <Text style={eventInfo}>🕐 {eventTime}</Text>
          </Section>

          <Section style={urgentNotice}>
            <Text style={urgentNoticeText}>
              <strong>⏰ Time Sensitive:</strong> You have until <strong>{expiresAt}</strong> to claim your spot.
              If you don't claim it within 2 hours, it will be offered to the next person in line.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button href={claimUrl} style={ctaButton}>
              Claim Your Spot Now
            </Button>
          </Section>

          <Section style={linkSection}>
            <Text style={linkText}>
              Or copy and paste this link into your browser:
            </Text>
            <Link href={claimUrl} style={link}>
              {claimUrl}
            </Link>
          </Section>

          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              This email was sent because you joined the waitlist for this event on OutdoorPath.
            </Text>
            <Text style={footerText}>
              <Link href={`${claimUrl.split('/events/')[0]}/dashboard`} style={footerLink}>
                Manage your events
              </Link>
              {' | '}
              <Link href={`${claimUrl.split('/events/')[0]}/settings`} style={footerLink}>
                Email preferences
              </Link>
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} OutdoorPath. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
  borderRadius: '8px',
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 40px 0',
};

const logo = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#FF6B35',
  margin: '0 0 10px',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 10px',
};

const subtitle = {
  fontSize: '16px',
  color: '#666',
  margin: '0 0 30px',
};

const eventDetails = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 40px 30px',
};

const eventTitleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 10px',
};

const eventInfo = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 5px',
};

const urgentNotice = {
  backgroundColor: '#fff3cd',
  borderLeft: '4px solid #ffc107',
  padding: '15px',
  margin: '0 40px 30px',
  borderRadius: '4px',
};

const urgentNoticeText = {
  fontSize: '14px',
  color: '#856404',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  padding: '0 40px',
};

const ctaButton = {
  backgroundColor: '#FF6B35',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '16px',
  textDecoration: 'none',
  display: 'inline-block',
};

const linkSection = {
  textAlign: 'center' as const,
  padding: '20px 40px 0',
};

const linkText = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 10px',
};

const link = {
  color: '#FF6B35',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
};

const footer = {
  textAlign: 'center' as const,
  padding: '0 40px 40px',
  marginTop: '40px',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '0 0 20px',
};

const footerText = {
  fontSize: '12px',
  color: '#999',
  margin: '0 0 10px',
};

const footerLink = {
  color: '#FF6B35',
  textDecoration: 'none',
};

const copyright = {
  fontSize: '12px',
  color: '#999',
  marginTop: '20px',
};

// Plain text version for email clients that don't support HTML
export function WaitlistNotificationEmailText({
  eventTitle,
  eventDate,
  eventTime,
  claimUrl,
  expiresAt,
  userName,
}: WaitlistNotificationEmailProps) {
  return `
OutdoorPath - A Spot Opened Up!

Hi ${userName || 'there'},

Great news! A spot has opened up for the event you were waitlisted for:

Event: ${eventTitle}
Date: ${eventDate}
Time: ${eventTime}

IMPORTANT: You have until ${expiresAt} to claim your spot (2 hours from now).
If you don't claim it within this time, it will be offered to the next person in line.

Claim your spot now:
${claimUrl}

---
This email was sent because you joined the waitlist for this event on OutdoorPath.

© ${new Date().getFullYear()} OutdoorPath. All rights reserved.
  `.trim();
}
