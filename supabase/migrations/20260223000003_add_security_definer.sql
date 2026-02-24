-- ============================================
-- Migration: Add SECURITY DEFINER to capacity trigger
-- Description: Fix RLS blocking trigger updates
-- ============================================

-- The trigger was failing because RLS blocked non-organizers from updating events
-- SECURITY DEFINER makes the function run with elevated privileges

CREATE OR REPLACE FUNCTION update_event_capacity()
RETURNS TRIGGER
SECURITY DEFINER  -- ⭐ KEY FIX - Bypasses RLS so trigger can update events table
SET search_path = public
AS $$
DECLARE
  new_capacity INTEGER;
  max_cap INTEGER;
  event_row RECORD;
BEGIN
  -- Lock the event row to prevent race conditions
  SELECT max_capacity, status INTO event_row
  FROM events
  WHERE id = COALESCE(NEW.event_id, OLD.event_id)
  FOR UPDATE;

  max_cap := event_row.max_capacity;

  -- Count attendees with status 'going'
  SELECT COUNT(*) INTO new_capacity
  FROM event_attendees
  WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    AND status = 'going';

  -- Enforce capacity limit
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    IF NEW.status = 'going' AND new_capacity > max_cap THEN
      RAISE EXCEPTION 'Event is at full capacity (% / %)', max_cap, max_cap
        USING HINT = 'Join the waitlist instead',
              ERRCODE = 'check_violation';
    END IF;
  END IF;

  -- Update capacity (now works because SECURITY DEFINER bypasses RLS!)
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

COMMENT ON FUNCTION update_event_capacity() IS 'Updates event capacity with row locking and SECURITY DEFINER to bypass RLS';
