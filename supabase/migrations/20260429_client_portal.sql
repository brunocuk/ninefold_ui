-- Migration: Create client portal tables
-- Date: 2026-04-29

-- ============================================
-- Table 1: portal_users - Client Login Credentials
-- ============================================
CREATE TABLE IF NOT EXISTS portal_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  avatar_url TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portal_users_client ON portal_users(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_users_email ON portal_users(email);

-- ============================================
-- Table 2: content_items - Social Media Content for Approval
-- ============================================
CREATE TABLE IF NOT EXISTS content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  contract_id UUID REFERENCES recurring_contracts(id) ON DELETE SET NULL,

  -- Scheduling
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,

  -- Content
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'tiktok')),
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'story', 'reel', 'carousel')),
  caption TEXT,
  media_urls TEXT[] DEFAULT '{}',
  hashtags TEXT[] DEFAULT '{}',

  -- Approval workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revision_requested', 'published')),
  client_feedback TEXT,
  revision_notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES portal_users(id) ON DELETE SET NULL,

  -- Internal
  created_by UUID,  -- CRM user who created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_items_client ON content_items(client_id);
CREATE INDEX IF NOT EXISTS idx_content_items_contract ON content_items(contract_id);
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled ON content_items(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_platform ON content_items(platform);

-- ============================================
-- Table 3: website_change_requests - Client-Submitted Requests
-- ============================================
CREATE TABLE IF NOT EXISTS website_change_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  submitted_by UUID REFERENCES portal_users(id) ON DELETE SET NULL,

  -- Request details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  page_url TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  attachments TEXT[] DEFAULT '{}',

  -- Status tracking
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'in_progress', 'completed', 'declined')),
  admin_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_change_requests_client ON website_change_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON website_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_change_requests_priority ON website_change_requests(priority);

-- ============================================
-- Table 4: portal_messages - Communication Thread
-- ============================================
CREATE TABLE IF NOT EXISTS portal_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,

  -- Message content
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  sender_id UUID,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',

  -- Threading (optional)
  related_to_type TEXT CHECK (related_to_type IN ('content_item', 'change_request', 'project')),
  related_to_id UUID,

  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portal_messages_client ON portal_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_messages_sender ON portal_messages(sender_type, sender_id);
CREATE INDEX IF NOT EXISTS idx_portal_messages_related ON portal_messages(related_to_type, related_to_id);
CREATE INDEX IF NOT EXISTS idx_portal_messages_unread ON portal_messages(client_id, read_at) WHERE read_at IS NULL;

-- ============================================
-- Table 5: project_milestones - Project Progress Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,

  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);

-- ============================================
-- Enable Row Level Security (RLS) for all tables
-- ============================================
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for portal_users
-- ============================================
CREATE POLICY "Enable read for authenticated" ON portal_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated" ON portal_users
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated" ON portal_users
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated" ON portal_users
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable anon read for portal_users" ON portal_users
  FOR SELECT TO anon USING (true);

CREATE POLICY "Enable anon insert for portal_users" ON portal_users
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable anon update for portal_users" ON portal_users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Enable anon delete for portal_users" ON portal_users
  FOR DELETE TO anon USING (true);

-- ============================================
-- RLS Policies for content_items
-- ============================================
CREATE POLICY "Enable read for authenticated" ON content_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated" ON content_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated" ON content_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated" ON content_items
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable anon read for content_items" ON content_items
  FOR SELECT TO anon USING (true);

CREATE POLICY "Enable anon insert for content_items" ON content_items
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable anon update for content_items" ON content_items
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Enable anon delete for content_items" ON content_items
  FOR DELETE TO anon USING (true);

-- ============================================
-- RLS Policies for website_change_requests
-- ============================================
CREATE POLICY "Enable read for authenticated" ON website_change_requests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated" ON website_change_requests
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated" ON website_change_requests
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated" ON website_change_requests
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable anon read for website_change_requests" ON website_change_requests
  FOR SELECT TO anon USING (true);

CREATE POLICY "Enable anon insert for website_change_requests" ON website_change_requests
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable anon update for website_change_requests" ON website_change_requests
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Enable anon delete for website_change_requests" ON website_change_requests
  FOR DELETE TO anon USING (true);

-- ============================================
-- RLS Policies for portal_messages
-- ============================================
CREATE POLICY "Enable read for authenticated" ON portal_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated" ON portal_messages
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated" ON portal_messages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated" ON portal_messages
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable anon read for portal_messages" ON portal_messages
  FOR SELECT TO anon USING (true);

CREATE POLICY "Enable anon insert for portal_messages" ON portal_messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable anon update for portal_messages" ON portal_messages
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Enable anon delete for portal_messages" ON portal_messages
  FOR DELETE TO anon USING (true);

-- ============================================
-- RLS Policies for project_milestones
-- ============================================
CREATE POLICY "Enable read for authenticated" ON project_milestones
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated" ON project_milestones
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated" ON project_milestones
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated" ON project_milestones
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable anon read for project_milestones" ON project_milestones
  FOR SELECT TO anon USING (true);

CREATE POLICY "Enable anon insert for project_milestones" ON project_milestones
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable anon update for project_milestones" ON project_milestones
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Enable anon delete for project_milestones" ON project_milestones
  FOR DELETE TO anon USING (true);

-- ============================================
-- Updated_at Triggers
-- ============================================

-- portal_users
CREATE OR REPLACE FUNCTION update_portal_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_portal_users_updated_at ON portal_users;
CREATE TRIGGER trigger_portal_users_updated_at
  BEFORE UPDATE ON portal_users
  FOR EACH ROW
  EXECUTE FUNCTION update_portal_users_updated_at();

-- content_items
CREATE OR REPLACE FUNCTION update_content_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_content_items_updated_at ON content_items;
CREATE TRIGGER trigger_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_content_items_updated_at();

-- website_change_requests
CREATE OR REPLACE FUNCTION update_change_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_change_requests_updated_at ON website_change_requests;
CREATE TRIGGER trigger_change_requests_updated_at
  BEFORE UPDATE ON website_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_change_requests_updated_at();

-- ============================================
-- Create Supabase Storage bucket for portal uploads
-- Note: Run this in Supabase dashboard or via API
-- ============================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('portal-uploads', 'portal-uploads', true)
-- ON CONFLICT (id) DO NOTHING;
