-- CRM Calendar & Team Members Migration
-- Run this SQL in Supabase SQL Editor

-- =====================================================
-- 1. Create team_members table
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  color TEXT DEFAULT '#00FF94',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial team members
INSERT INTO team_members (name, email, color) VALUES
  ('Bruno', 'bruno@ninefold.eu', '#00FF94'),
  ('Petar', NULL, '#3b82f6')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. Create calendar_events table
-- =====================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start TIMESTAMP WITH TIME ZONE NOT NULL,
  "end" TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT DEFAULT 'meeting',
  related_to UUID,
  related_type TEXT,
  priority TEXT DEFAULT 'medium',
  reminder_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. Create event_assignees junction table
-- =====================================================
CREATE TABLE IF NOT EXISTS event_assignees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, team_member_id)
);

-- =====================================================
-- 4. Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_assignees ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. Create RLS Policies (allow all for anon/authenticated)
-- =====================================================

-- Team Members Policies
DROP POLICY IF EXISTS "Allow all for anon on team_members" ON team_members;
CREATE POLICY "Allow all for anon on team_members" ON team_members
  FOR ALL USING (true) WITH CHECK (true);

-- Calendar Events Policies
DROP POLICY IF EXISTS "Allow all for anon on calendar_events" ON calendar_events;
CREATE POLICY "Allow all for anon on calendar_events" ON calendar_events
  FOR ALL USING (true) WITH CHECK (true);

-- Event Assignees Policies
DROP POLICY IF EXISTS "Allow all for anon on event_assignees" ON event_assignees;
CREATE POLICY "Allow all for anon on event_assignees" ON event_assignees
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 6. Create indexes for better performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON calendar_events(start);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_event_assignees_event_id ON event_assignees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_assignees_team_member_id ON event_assignees(team_member_id);

-- =====================================================
-- Verification Queries (optional - run to verify)
-- =====================================================
-- SELECT * FROM team_members;
-- SELECT * FROM calendar_events;
-- SELECT * FROM event_assignees;
