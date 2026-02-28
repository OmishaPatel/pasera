-- ============================================
-- Migration: Fix Webhook Settings (Add app_settings table)
-- Description: Add app_settings table and helper functions for webhook URL management
-- This fixes the permission issue with ALTER DATABASE commands
-- ============================================

-- Step 1: Create settings table to store webhook configuration
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default webhook URL (localhost for development)
INSERT INTO app_settings (key, value)
VALUES ('webhook_base_url', 'http://localhost:3000')
ON CONFLICT (key) DO NOTHING;

-- Step 2: Update the webhook function to use app_settings table
CREATE OR REPLACE FUNCTION notify_waitlist_promotion_webhook()
RETURNS TRIGGER
SECURITY DEFINER  -- Run with elevated privileges to make HTTP requests
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  webhook_url TEXT;
  webhook_payload JSONB;
BEGIN
  -- Get webhook base URL from app_settings table
  SELECT value INTO webhook_url
  FROM app_settings
  WHERE key = 'webhook_base_url';

  -- Fallback to localhost if not set
  IF webhook_url IS NULL THEN
    webhook_url := 'http://localhost:3000';
  END IF;

  webhook_url := webhook_url || '/api/webhooks/waitlist-notification';

  -- Build webhook payload matching Supabase webhook format
  webhook_payload := jsonb_build_object(
    'type', 'UPDATE',
    'table', 'event_attendees',
    'schema', 'public',
    'record', to_jsonb(NEW),
    'old_record', to_jsonb(OLD)
  );

  -- Send HTTP POST request asynchronously (non-blocking)
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := webhook_payload
  );

  RAISE NOTICE 'Webhook sent for user % promoted to event %', NEW.user_id, NEW.event_id;

  RETURN NEW;
END;
$$;

-- Step 3: Create helper function to update webhook URL
CREATE OR REPLACE FUNCTION set_webhook_url(new_url TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE app_settings
  SET value = new_url, updated_at = NOW()
  WHERE key = 'webhook_base_url';

  IF NOT FOUND THEN
    INSERT INTO app_settings (key, value)
    VALUES ('webhook_base_url', new_url);
  END IF;

  RAISE NOTICE 'Webhook URL updated to: %', new_url;
END;
$$;

-- Step 4: Create helper function to get current webhook URL
CREATE OR REPLACE FUNCTION get_webhook_url()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  url TEXT;
BEGIN
  SELECT value INTO url
  FROM app_settings
  WHERE key = 'webhook_base_url';

  RETURN COALESCE(url, 'http://localhost:3000');
END;
$$;

-- Step 5: Update comments
COMMENT ON TABLE app_settings IS 'Application configuration settings';
COMMENT ON FUNCTION notify_waitlist_promotion_webhook() IS 'Sends HTTP webhook notification when a user is promoted from waitlist to going status. Reads webhook URL from app_settings table.';
COMMENT ON FUNCTION set_webhook_url(TEXT) IS 'Updates the webhook base URL in app_settings table';
COMMENT ON FUNCTION get_webhook_url() IS 'Returns the current webhook base URL from app_settings table';

-- ============================================
-- VERIFICATION
-- ============================================
-- To verify this migration worked:
--   SELECT * FROM app_settings;
--   SELECT get_webhook_url();
-- ============================================
