-- Migration: Create social_media_reports table
-- Date: 2026-04-10

-- Table: social_media_reports
-- Stores monthly social media reports for tracking content delivery and engagement metrics
CREATE TABLE IF NOT EXISTS social_media_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES recurring_contracts(id) ON DELETE CASCADE NOT NULL,
  reference TEXT NOT NULL,  -- SMR-202604-CLIENTNAME

  -- Period
  report_month INTEGER NOT NULL CHECK (report_month >= 1 AND report_month <= 12),
  report_year INTEGER NOT NULL CHECK (report_year >= 2020),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Content Delivered (what was actually produced)
  -- { fotografija: 8, talkingHead: 4, videoCarousel: 0, staticCarousel: 0, reel: 5, story: 10 }
  content_delivered JSONB DEFAULT '{}',

  -- Content Planned (from contract)
  -- { fotografija: 8, talkingHead: 4, videoCarousel: 2, staticCarousel: 2, reel: 4, story: 8 }
  content_planned JSONB DEFAULT '{}',

  -- Total posts published across all platforms
  posts_published INTEGER DEFAULT 0,

  -- Engagement Metrics per platform
  -- {
  --   instagram: { followers: 1250, follower_change: 85, posts: 12, reach: 15000, impressions: 20000, engagement: 450, engagement_rate: 4.2 },
  --   facebook: { followers: 800, follower_change: 30, posts: 10, reach: 8000, impressions: 12000, engagement: 200, engagement_rate: 2.5 },
  --   linkedin: { followers: 500, follower_change: 20, posts: 8, reach: 4000, impressions: 6000, engagement: 150, engagement_rate: 3.0 },
  --   tiktok: { followers: 2000, follower_change: 150, posts: 6, views: 50000, engagement: 800, engagement_rate: 1.6 }
  -- }
  platforms JSONB DEFAULT '{}',

  -- Totals (calculated from platforms)
  total_reach INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5,2),
  follower_growth INTEGER DEFAULT 0,

  -- Top Content
  -- [{ platform: 'instagram', type: 'reel', reach: 5000, engagement: 320, description: 'Product showcase video' }]
  top_posts JSONB DEFAULT '[]',

  -- Paid Ads (if Dominacija tier)
  paid_ads_enabled BOOLEAN DEFAULT false,
  paid_ads_spend DECIMAL(10,2),
  paid_ads_impressions INTEGER,
  paid_ads_clicks INTEGER,
  paid_ads_conversions INTEGER,
  paid_ads_ctr DECIMAL(5,2),
  paid_ads_cpc DECIMAL(10,2),

  -- Narrative
  summary_text TEXT,
  highlights TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  notes TEXT,

  -- Status & Tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent')),
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_to TEXT,
  email_id TEXT,
  view_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(contract_id, report_month, report_year)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_social_media_reports_contract ON social_media_reports(contract_id);
CREATE INDEX IF NOT EXISTS idx_social_media_reports_period ON social_media_reports(report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_social_media_reports_status ON social_media_reports(status);

-- Enable Row Level Security (RLS)
ALTER TABLE social_media_reports ENABLE ROW LEVEL SECURITY;

-- Policies for social_media_reports (allow both authenticated and anon for CRM)
CREATE POLICY "Enable read access for authenticated users" ON social_media_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON social_media_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON social_media_reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON social_media_reports
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow anon access (for API routes using anon key)
CREATE POLICY "Enable public read for social media reports" ON social_media_reports
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Enable anon insert for social media reports" ON social_media_reports
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable anon update for social media reports" ON social_media_reports
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable anon delete for social media reports" ON social_media_reports
  FOR DELETE
  TO anon
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_social_media_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_social_media_reports_updated_at ON social_media_reports;
CREATE TRIGGER trigger_social_media_reports_updated_at
  BEFORE UPDATE ON social_media_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_social_media_reports_updated_at();
