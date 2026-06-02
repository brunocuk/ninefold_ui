-- Add issuer_company column to quotes table
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS issuer_company TEXT DEFAULT 'progmatiq';

-- Add comment for documentation
COMMENT ON COLUMN quotes.issuer_company IS 'Company issuing the quote: progmatiq or endemik';
