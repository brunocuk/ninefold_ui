-- Add platforms array column and migrate existing data
ALTER TABLE content_items
ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing platform data to platforms array
UPDATE content_items
SET platforms = ARRAY[platform]
WHERE platform IS NOT NULL AND (platforms IS NULL OR platforms = '{}');

-- Note: Keeping the old 'platform' column for backwards compatibility
-- Can be removed in a future migration once all code is updated
