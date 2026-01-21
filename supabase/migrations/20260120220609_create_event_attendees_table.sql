-- ============================================
-- Migration: Create Event Attendees Table
-- Description: Tracks RSVPs and waitlist for events
-- ============================================

-- Create event_attendees table
CREATE TABLE event_attendees (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Status: going, maybe, interested, or waitlist
  status TEXT DEFAULT 'going' CHECK (
    status IN ('going', 'maybe', 'interested', 'waitlist')
  ) NOT NULL,

  -- Response Tracking
  responded_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Waitlist Management
  waitlist_position INTEGER,
  waitlist_notified_at TIMESTAMPTZ,
  waitlist_expires_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Constraint: One RSVP per user per event
  UNIQUE(event_id, user_id)
);

-- Add comments for documentation
COMMENT ON TABLE event_attendees IS 'User RSVPs and attendance status for events';
COMMENT ON COLUMN event_attendees.waitlist_position IS 'Position in queue when event is full';
COMMENT ON COLUMN event_attendees.waitlist_expires_at IS '2-hour claim window deadline';

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Anyone can see who's attending public events
CREATE POLICY "Attendees viewable by event participants"
  ON event_attendees FOR SELECT
  USING (true);

-- Users can RSVP to events
CREATE POLICY "Users can manage their own attendance"
  ON event_attendees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own RSVP status
CREATE POLICY "Users can update their own attendance"
  ON event_attendees FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can cancel their RSVP
CREATE POLICY "Users can delete their own attendance"
  ON event_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Index on event_id for looking up attendees by event
CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);

-- Index on user_id for looking up user's RSVPs
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);

-- Index on status for filtering by RSVP status
CREATE INDEX idx_event_attendees_status ON event_attendees(status);

-- Partial index on waitlist for efficient waitlist queries
CREATE INDEX idx_event_attendees_waitlist
  ON event_attendees(event_id, waitlist_position)
  WHERE waitlist_position IS NOT NULL;

-- ============================================
-- Triggers
-- ============================================

-- Trigger: Update event capacity when attendee is added
CREATE TRIGGER update_capacity_on_attendee_insert
  AFTER INSERT ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_event_capacity();

-- Trigger: Update event capacity when attendee status changes
CREATE TRIGGER update_capacity_on_attendee_update
  AFTER UPDATE ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_event_capacity();

-- Trigger: Update event capacity when attendee is removed
CREATE TRIGGER update_capacity_on_attendee_delete
  AFTER DELETE ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_event_capacity();
