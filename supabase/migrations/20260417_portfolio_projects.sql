-- Migration: Create portfolio_projects table
-- Date: 2026-04-17

-- Table: portfolio_projects
-- Stores portfolio projects for the CRM with type-specific handling
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,

  -- Core Fields
  title TEXT NOT NULL,
  tagline TEXT,
  client_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN (
    'video_production', 'social_media', 'web_development', 'web_app', 'mobile_app'
  )),
  year TEXT,
  duration TEXT,

  -- Content
  description TEXT,
  challenge TEXT,
  solution TEXT,

  -- Media
  featured_image TEXT,
  hero_video TEXT,
  hero_image TEXT,
  gallery JSONB DEFAULT '[]',
  accent_color TEXT DEFAULT '#00FF94',

  -- Results & Categorization
  -- results: [{ metric: '97/100', label: 'Lighthouse Performance' }]
  results JSONB DEFAULT '[]',
  services TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',

  -- Testimonial
  -- { quote: '...', author: 'Name', role: 'CEO', company: 'Company', image: '/path.jpg' }
  testimonial JSONB,

  -- Sections (flexible content blocks)
  -- [{ type: 'text', title: '...', content: '...' }, { type: 'two-column', left: {...}, right: {...} }]
  sections JSONB DEFAULT '[]',

  -- Type-Specific Data (JSONB for flexibility)
  -- video_production: { videoEmbeds: [{url, title}], showreelUrl }
  -- social_media: { platforms: [], campaignMetrics: {reach, engagement}, contentSamples: [] }
  -- web_development: { lighthouse: {performance, accessibility, bestPractices, seo} }
  -- web_app: { features: [{name, description}], demoUrl, screenshots: [] }
  -- mobile_app: { appStoreUrl, playStoreUrl, screenshots: {ios: [], android: []} }
  type_data JSONB DEFAULT '{}',

  -- Publishing
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Links & Relations
  live_site_url TEXT,
  related_projects UUID[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_slug ON portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_type ON portfolio_projects(project_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_published ON portfolio_projects(published);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_display_order ON portfolio_projects(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Policies for portfolio_projects (allow both authenticated and anon for CRM)
CREATE POLICY "Enable read access for authenticated users" ON portfolio_projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON portfolio_projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON portfolio_projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow anon access (for API routes using anon key and public pages)
CREATE POLICY "Enable public read for portfolio projects" ON portfolio_projects
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Enable anon insert for portfolio projects" ON portfolio_projects
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable anon update for portfolio projects" ON portfolio_projects
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable anon delete for portfolio projects" ON portfolio_projects
  FOR DELETE
  TO anon
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_portfolio_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER trigger_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_projects_updated_at();
