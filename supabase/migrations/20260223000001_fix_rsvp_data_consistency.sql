-- ============================================
-- Migration: Fix RSVP Data Consistency
-- Description: Recalculate event capacities and ensure UNIQUE constraint
-- ============================================

-- Step 1: Remove any duplicate RSVPs (if they exist)
-- Keep the most recent RSVP for each user-event pair
WITH duplicates AS (
  SELECT
    id,
    event_id,
    user_id,
    ROW_NUMBER() OVER (
      PARTITION BY event_id, user_id
      ORDER BY responded_at DESC, created_at DESC
    ) AS rn
  FROM event_attendees
)
DELETE FROM event_attendees
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Log if any duplicates were removed
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  IF deleted_count > 0 THEN
    RAISE NOTICE 'Removed % duplicate RSVP records', deleted_count;
  ELSE
    RAISE NOTICE 'No duplicate RSVPs found';
  END IF;
END $$;

-- Step 2: Recalculate current_capacity for all events
-- This ensures the stored value matches actual "going" attendee count
UPDATE events e
SET
  current_capacity = (
    SELECT COUNT(*)
    FROM event_attendees
    WHERE event_id = e.id AND status = 'going'
  ),
  status = CASE
    -- Preserve cancelled and completed status
    WHEN e.status IN ('cancelled', 'completed') THEN e.status
    -- Mark as full if at capacity
    WHEN (
      SELECT COUNT(*)
      FROM event_attendees
      WHERE event_id = e.id AND status = 'going'
    ) >= e.max_capacity THEN 'full'
    -- Mark as active if previously full but now has space
    WHEN e.status = 'full' AND (
      SELECT COUNT(*)
      FROM event_attendees
      WHERE event_id = e.id AND status = 'going'
    ) < e.max_capacity THEN 'active'
    -- Keep existing status for other cases
    ELSE e.status
  END;

-- Log the results
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Recalculated capacity for % events', updated_count;
END $$;

-- Step 3: Ensure UNIQUE constraint exists and is enforced
-- This prevents duplicate RSVPs from the same user on the same event
DO $$
BEGIN
  -- Check if constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'event_attendees'::regclass
    AND conname = 'event_attendees_event_id_user_id_key'
  ) THEN
    -- Add constraint if missing
    ALTER TABLE event_attendees
    ADD CONSTRAINT event_attendees_event_id_user_id_key
    UNIQUE (event_id, user_id);

    RAISE NOTICE 'Added UNIQUE constraint on (event_id, user_id)';
  ELSE
    RAISE NOTICE 'UNIQUE constraint already exists';
  END IF;
END $$;

-- Add helpful comment
COMMENT ON CONSTRAINT event_attendees_event_id_user_id_key ON event_attendees
IS 'Prevents duplicate RSVPs - one RSVP per user per event';

-- Step 4: Verify the fix by reporting any remaining inconsistencies
DO $$
DECLARE
  mismatch_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO mismatch_count
  FROM events e
  WHERE e.current_capacity != (
    SELECT COUNT(*)
    FROM event_attendees
    WHERE event_id = e.id AND status = 'going'
  );

  IF mismatch_count > 0 THEN
    RAISE WARNING 'Found % events with capacity mismatches after fix. Manual investigation required.', mismatch_count;
  ELSE
    RAISE NOTICE 'All event capacities are now consistent!';
  END IF;
END $$;
