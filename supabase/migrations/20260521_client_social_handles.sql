-- Add social media handle columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS facebook_page_name TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS linkedin_page_name TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS tiktok_handle TEXT;
