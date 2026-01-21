-- ============================================
-- Migration: Add Helper Functions
-- Description: Shared functions used by multiple tables
-- ============================================

-- Function: Update updated_at timestamp automatically
-- Used by: profiles, events
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at column on row updates';

-- Function: Auto-create profile on user signup
-- Used by: auth.users (trigger)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates a profile when a new user signs up';

-- Function: Update event capacity when attendees change
-- Used by: event_attendees (trigger)
CREATE OR REPLACE FUNCTION update_event_capacity()
RETURNS TRIGGER AS $$
DECLARE
  new_capacity INTEGER;
BEGIN
  -- Count attendees with status 'going' for the event
  SELECT COUNT(*) INTO new_capacity
  FROM event_attendees
  WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    AND status = 'going';

  -- Update the event's current_capacity and status
  UPDATE events
  SET current_capacity = new_capacity,
      status = CASE
        WHEN new_capacity >= max_capacity THEN 'full'
        ELSE 'active'
      END
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_event_capacity() IS 'Automatically updates event capacity and status when attendees change';

-- ============================================
-- Auth Trigger (applies to auth.users table)
-- ============================================

-- Trigger: Auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
