-- ============================================
-- Migration: Simplify RSVP Status
-- Description: Remove 'maybe' and 'interested' statuses, keep only 'going' and 'waitlist'
-- ============================================

-- Remove 'maybe' and 'interested' from the rsvp_status enum
-- Keep only 'going' and 'waitlist'
ALTER TABLE event_attendees
DROP CONSTRAINT IF EXISTS event_attendees_status_check;

ALTER TABLE event_attendees
ADD CONSTRAINT event_attendees_status_check
CHECK (status IN ('going', 'waitlist'));

-- Update comment
COMMENT ON COLUMN event_attendees.status IS 'RSVP status: going or waitlist';

-- Optional: Migrate any existing 'maybe' or 'interested' records to 'going'
-- Uncomment if you want to preserve existing RSVPs:
-- UPDATE event_attendees SET status = 'going' WHERE status IN ('maybe', 'interested');
