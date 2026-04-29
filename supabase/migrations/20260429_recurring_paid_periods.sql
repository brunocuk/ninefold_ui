-- Add paid_periods JSONB column to track which billing periods have been paid
-- Format: array of period strings like ["2025-01", "2025-02", "2025-03"]

ALTER TABLE recurring_contracts
ADD COLUMN IF NOT EXISTS paid_periods JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN recurring_contracts.paid_periods IS 'Array of paid period strings in YYYY-MM format for monthly or YYYY for yearly billing';
