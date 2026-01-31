-- Waitlist Notification System
-- Automatically notifies next person in waitlist when a spot opens

-- Function to notify next person in waitlist
CREATE OR REPLACE FUNCTION notify_waitlist()
RETURNS TRIGGER AS $$
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

-- Create trigger for waitlist notifications
DROP TRIGGER IF EXISTS trigger_waitlist_notification ON event_attendees;

CREATE TRIGGER trigger_waitlist_notification
AFTER UPDATE OR DELETE ON event_attendees
FOR EACH ROW
EXECUTE FUNCTION notify_waitlist();

-- Create index for faster waitlist queries
CREATE INDEX IF NOT EXISTS idx_event_attendees_waitlist_notified
ON event_attendees(event_id, status, waitlist_notified_at)
WHERE status = 'waitlist';

COMMENT ON FUNCTION notify_waitlist() IS 'Automatically notifies the next person in the waitlist when a spot becomes available';
COMMENT ON TRIGGER trigger_waitlist_notification ON event_attendees IS 'Triggers waitlist notification when someone cancels or changes from going status';
