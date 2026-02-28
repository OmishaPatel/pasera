-- Fix waitlist notification trigger to bypass RLS
-- This allows the trigger to update waitlist_notified_at for other users
-- Critical fix: User canceling their RSVP needs permission to notify next person in waitlist

CREATE OR REPLACE FUNCTION notify_waitlist()
RETURNS TRIGGER
SECURITY DEFINER  -- ⭐ KEY FIX - Bypasses RLS so trigger can notify other users
AS $$
DECLARE
  next_user_id UUID;
  next_position INTEGER;
BEGIN
  -- Only proceed if someone changed from 'going' status or deleted their RSVP
  IF (TG_OP = 'DELETE' AND OLD.status = 'going') OR
     (TG_OP = 'UPDATE' AND OLD.status = 'going' AND NEW.status != 'going') THEN

    -- Find next person in waitlist who hasn't been notified
    SELECT user_id, waitlist_position
    INTO next_user_id, next_position
    FROM event_attendees
    WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
      AND status = 'waitlist'
      AND waitlist_notified_at IS NULL
    ORDER BY waitlist_position ASC
    LIMIT 1;

    -- If found, set notification timestamp and 2-hour expiration
    IF next_user_id IS NOT NULL THEN
      UPDATE event_attendees
      SET
        waitlist_notified_at = NOW(),
        waitlist_expires_at = NOW() + INTERVAL '2 hours'
      WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
        AND user_id = next_user_id
        AND status = 'waitlist';

      RAISE NOTICE 'Notified waitlist user % at position %', next_user_id, next_position;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION notify_waitlist() IS 'Automatically notifies the next person in the waitlist when a spot becomes available. SECURITY DEFINER bypasses RLS.';
