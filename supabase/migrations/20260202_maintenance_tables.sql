-- Migration: Create maintenance_reports table (simplified - no activity logging)
-- Date: 2026-02-02

-- Table: maintenance_reports
-- Stores generated monthly reports with Lighthouse and Analytics data
CREATE TABLE IF NOT EXISTS maintenance_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES recurring_contracts(id) ON DELETE CASCADE NOT NULL,
  report_month INTEGER NOT NULL CHECK (report_month >= 1 AND report_month <= 12),
  report_year INTEGER NOT NULL CHECK (report_year >= 2020),
  reference TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Summary content
  summary_text TEXT,
  highlights TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  notes TEXT,

  -- Lighthouse scores (0-100)
  lighthouse JSONB DEFAULT '{
    "performance": null,
    "accessibility": null,
    "best_practices": null,
    "seo": null,
    "lcp": null,
    "fid": null,
    "cls": null
  }',

  -- Google Analytics data
  analytics JSONB DEFAULT '{
    "sessions": null,
    "users": null,
    "pageviews": null,
    "bounce_rate": null,
    "avg_session_duration": null,
    "new_users_percentage": null,
    "top_pages": [],
    "traffic_sources": {}
  }',

  -- Comparison to previous period (percentage change)
  analytics_comparison JSONB DEFAULT '{
    "sessions_change": null,
    "users_change": null,
    "pageviews_change": null,
    "bounce_rate_change": null
  }',

  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent')),
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_to TEXT,
  email_id TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(contract_id, report_month, report_year)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_contract ON maintenance_reports(contract_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_period ON maintenance_reports(report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_status ON maintenance_reports(status);

-- Enable Row Level Security (RLS)
ALTER TABLE maintenance_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable public read for reports" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable anon insert for reports" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable anon update for reports" ON maintenance_reports;
DROP POLICY IF EXISTS "Enable anon delete for reports" ON maintenance_reports;

-- Policies for maintenance_reports (allow both authenticated and anon for CRM)
CREATE POLICY "Enable read access for authenticated users" ON maintenance_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON maintenance_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON maintenance_reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON maintenance_reports
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow anon access (for API routes using anon key)
CREATE POLICY "Enable public read for reports" ON maintenance_reports
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Enable anon insert for reports" ON maintenance_reports
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable anon update for reports" ON maintenance_reports
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable anon delete for reports" ON maintenance_reports
  FOR DELETE
  TO anon
  USING (true);
