-- ============================================
-- Migration: Create Events Table
-- Description: Core table for outdoor events
-- ============================================

-- Create events table
CREATE TABLE events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Organizer (Foreign Key to profiles)
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Event Details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'outdoor_adventure' CHECK (
    category IN ('outdoor_adventure', 'hiking', 'camping', 'climbing', 'biking', 'kayaking', 'skiing', 'other')
  ),

  -- Date & Time
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Location
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  location_lat DECIMAL(10, 8),  -- Latitude: -90 to 90
  location_lng DECIMAL(11, 8),  -- Longitude: -180 to 180

  -- Capacity Management
  max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
  current_capacity INTEGER DEFAULT 0 CHECK (current_capacity >= 0),

  -- Event Metadata
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  elevation INTEGER,  -- in feet

  -- Pricing
  pricing_type TEXT DEFAULT 'free' CHECK (pricing_type IN ('free', 'paid')),
  price DECIMAL(10, 2) CHECK (price >= 0),

  -- Visibility & Status
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled', 'completed')),

  -- Media
  hero_image_url TEXT,

  -- Packing List (MVP: Simple text field)
  packing_list_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE events IS 'Outdoor events with details, location, and capacity management';
COMMENT ON COLUMN events.packing_list_notes IS 'Free-text packing list (e.g., "Water bottles, Trail snacks")';
COMMENT ON COLUMN events.current_capacity IS 'Auto-updated by trigger when attendees change';

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public events viewable by everyone, private events only by organizer
CREATE POLICY "Public events viewable by everyone"
  ON events FOR SELECT
  USING (visibility = 'public' OR organizer_id = auth.uid());

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update their own events
CREATE POLICY "Organizers can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Organizers can delete their own events
CREATE POLICY "Organizers can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = organizer_id);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Index on organizer_id for filtering events by organizer
CREATE INDEX idx_events_organizer ON events(organizer_id);

-- Index on event_date for filtering/sorting by date
CREATE INDEX idx_events_date ON events(event_date);

-- Index on status for filtering active/full/cancelled events
CREATE INDEX idx_events_status ON events(status);

-- Index on category for filtering by activity type
CREATE INDEX idx_events_category ON events(category);

-- Composite index on location for geospatial queries
CREATE INDEX idx_events_location ON events(location_lat, location_lng);

-- ============================================
-- Triggers
-- ============================================

-- Trigger: Update updated_at timestamp on event updates
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
