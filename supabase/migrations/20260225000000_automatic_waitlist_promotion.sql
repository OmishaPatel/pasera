-- ============================================
-- Migration: Automatic Waitlist Promotion
-- Description: Transform opt-in waitlist (claim within 2 hours) to automatic promotion (opt-out)
-- Changes:
--   1. Remove waitlist_notified_at and waitlist_expires_at columns
--   2. Replace notify_waitlist() to auto-promote users to 'going' status
--   3. Handle multiple simultaneous promotions
-- ============================================

-- Step 1: Drop existing waitlist notification trigger
DROP TRIGGER IF EXISTS trigger_waitlist_notification ON event_attendees;

-- Step 2: Remove claim window columns (no longer needed)
ALTER TABLE event_attendees
  DROP COLUMN IF EXISTS waitlist_notified_at,
  DROP COLUMN IF EXISTS waitlist_expires_at;

-- Step 3: Drop old notify_waitlist function
DROP FUNCTION IF EXISTS notify_waitlist();

-- Step 4: Create new auto_promote_waitlist function
CREATE OR REPLACE FUNCTION auto_promote_waitlist()
RETURNS TRIGGER
SECURITY DEFINER  -- Bypass RLS to allow trigger to update other users' records
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  event_rec RECORD;
  available_spots INTEGER;
  promoted_count INTEGER := 0;
BEGIN
  -- Only proceed if someone changed from 'going' status or deleted their RSVP
  IF NOT (
    (TG_OP = 'DELETE' AND OLD.status = 'going') OR
    (TG_OP = 'UPDATE' AND OLD.status = 'going' AND NEW.status != 'going')
  ) THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Get event details with row lock to prevent race conditions
  SELECT id, max_capacity, status
  INTO event_rec
  FROM events
  WHERE id = COALESCE(NEW.event_id, OLD.event_id)
  FOR UPDATE;

  -- Don't promote if event is cancelled
  IF event_rec.status = 'cancelled' THEN
    RAISE NOTICE 'Event % is cancelled, skipping waitlist promotion', event_rec.id;
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Calculate how many spots are now available
  -- available_spots = max_capacity - current_going_count
  SELECT event_rec.max_capacity - COUNT(*)
  INTO available_spots
  FROM event_attendees
  WHERE event_id = event_rec.id
    AND status = 'going';

  -- If no spots available, nothing to do
  IF available_spots <= 0 THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  RAISE NOTICE 'Event %: % spot(s) available, promoting from waitlist', event_rec.id, available_spots;

  -- Promote next N people from waitlist (ordered by created_at for FIFO)
  -- Use UPDATE with RETURNING to get count of promoted users
  WITH users_to_promote AS (
    SELECT id, user_id
    FROM event_attendees
    WHERE event_id = event_rec.id
      AND status = 'waitlist'
    ORDER BY created_at ASC  -- FIFO: earliest joiners first
    LIMIT available_spots
    FOR UPDATE SKIP LOCKED  -- Prevent race conditions
  )
  UPDATE event_attendees ea
  SET
    status = 'going',
    waitlist_position = NULL,  -- Clear waitlist position
    responded_at = NOW()       -- Set response timestamp
  FROM users_to_promote utp
  WHERE ea.id = utp.id;

  -- Get count of promoted users
  GET DIAGNOSTICS promoted_count = ROW_COUNT;

  RAISE NOTICE 'Event %: Promoted % user(s) from waitlist to going', event_rec.id, promoted_count;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 5: Create trigger for automatic promotion
CREATE TRIGGER trigger_auto_promote_waitlist
  AFTER UPDATE OR DELETE ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION auto_promote_waitlist();

-- Step 6: Add optimized index for waitlist queries (created_at based)
DROP INDEX IF EXISTS idx_event_attendees_waitlist_notified;

CREATE INDEX IF NOT EXISTS idx_event_attendees_waitlist_fifo
  ON event_attendees(event_id, status, created_at)
  WHERE status = 'waitlist';

-- Step 7: Add comments for documentation
COMMENT ON FUNCTION auto_promote_waitlist() IS 'Automatically promotes waitlisted users to going status when spots become available. Handles multiple simultaneous promotions.';
COMMENT ON TRIGGER trigger_auto_promote_waitlist ON event_attendees IS 'Triggers automatic waitlist promotion when someone cancels or changes from going status';
COMMENT ON INDEX idx_event_attendees_waitlist_fifo IS 'Optimized index for FIFO waitlist queries based on created_at timestamp';
