-- ============================================
-- Migration: Fix Capacity Trigger with Row Locking and Security Definer
-- Description: Enforce capacity limits and bypass RLS for trigger updates
-- ============================================

CREATE OR REPLACE FUNCTION update_event_capacity()
RETURNS TRIGGER
SECURITY DEFINER  -- ⭐ THIS IS THE KEY FIX - Bypasses RLS
SET search_path = public
AS $$
DECLARE
  new_capacity INTEGER;
  max_cap INTEGER;
  event_row RECORD;
BEGIN
  -- Lock the event row to prevent race conditions (SELECT FOR UPDATE)
  SELECT max_capacity, status INTO event_row
  FROM events
  WHERE id = COALESCE(NEW.event_id, OLD.event_id)
  FOR UPDATE;

  max_cap := event_row.max_capacity;

  -- Count attendees with status 'going' (including this new one if INSERT/UPDATE)
  SELECT COUNT(*) INTO new_capacity
  FROM event_attendees
  WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    AND status = 'going';

  -- ENFORCE CAPACITY LIMIT: Prevent over-capacity RSVPs
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    IF NEW.status = 'going' AND new_capacity > max_cap THEN
      -- Reject if capacity exceeded
      RAISE EXCEPTION 'Event is at full capacity (% / %)', max_cap, max_cap
        USING HINT = 'Join the waitlist instead',
              ERRCODE = 'check_violation';
    END IF;
  END IF;

  -- Update the event's current_capacity and status (now bypasses RLS!)
  UPDATE events
  SET current_capacity = new_capacity,
      status = CASE
        WHEN new_capacity >= max_cap THEN 'full'
        ELSE 'active'
      END
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_event_capacity() IS 'Updates event capacity and enforces capacity limits with row-level locking. SECURITY DEFINER bypasses RLS.';
