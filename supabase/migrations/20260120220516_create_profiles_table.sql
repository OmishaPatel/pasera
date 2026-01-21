-- ============================================
-- Migration: Create Profiles Table
-- Description: Extends auth.users with profile information
-- ============================================

-- Create profiles table
CREATE TABLE profiles (
  -- Primary Key: References Supabase auth.users
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,

  -- User Information
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,

  -- Role: 'member' (default) or 'organizer'
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'organizer')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN profiles.role IS 'User role: member or organizer';

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Triggers
-- ============================================

-- Trigger: Update updated_at timestamp on profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
