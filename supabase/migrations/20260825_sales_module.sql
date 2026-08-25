-- Sales module: salespeople (Karlo), lead ownership, quote ownership, commissions
-- Run this in the Supabase SQL editor before deploying the sales module code.

-- 1. Sales users (mirrors portal_users pattern: bcrypt hash, app-level auth)
CREATE TABLE IF NOT EXISTS sales_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  commission_rate DECIMAL(4,3) NOT NULL DEFAULT 0.200,
  active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_users_email ON sales_users(email);

-- 2. Lead ownership + call tracking
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS sales_user_id UUID REFERENCES sales_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contact_log JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_leads_sales_user ON leads(sales_user_id);

-- 3. Quote ownership
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS sales_user_id UUID REFERENCES sales_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quotes_sales_user ON quotes(sales_user_id);

-- 4. Commissions: one row per landed payment (deposit via webhook, final marked manually in CRM)
CREATE TABLE IF NOT EXISTS sales_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_user_id UUID NOT NULL REFERENCES sales_users(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('deposit', 'final')),
  base_amount DECIMAL(10,2) NOT NULL,
  rate DECIMAL(4,3) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'payable' CHECK (status IN ('payable', 'paid')),
  paid_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (quote_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_sales_commissions_user ON sales_commissions(sales_user_id);

-- 5. Row Level Security
-- Same convention as portal_users (20260429_client_portal.sql): RLS on, permissive
-- policies for anon + authenticated because the app queries with the anon key.
ALTER TABLE sales_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for authenticated" ON sales_users;
CREATE POLICY "Enable read for authenticated" ON sales_users
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated" ON sales_users;
CREATE POLICY "Enable insert for authenticated" ON sales_users
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for authenticated" ON sales_users;
CREATE POLICY "Enable update for authenticated" ON sales_users
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable delete for authenticated" ON sales_users;
CREATE POLICY "Enable delete for authenticated" ON sales_users
  FOR DELETE TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable anon read for sales_users" ON sales_users;
CREATE POLICY "Enable anon read for sales_users" ON sales_users
  FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Enable anon insert for sales_users" ON sales_users;
CREATE POLICY "Enable anon insert for sales_users" ON sales_users
  FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Enable anon update for sales_users" ON sales_users;
CREATE POLICY "Enable anon update for sales_users" ON sales_users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable anon delete for sales_users" ON sales_users;
CREATE POLICY "Enable anon delete for sales_users" ON sales_users
  FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Enable read for authenticated" ON sales_commissions;
CREATE POLICY "Enable read for authenticated" ON sales_commissions
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated" ON sales_commissions;
CREATE POLICY "Enable insert for authenticated" ON sales_commissions
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for authenticated" ON sales_commissions;
CREATE POLICY "Enable update for authenticated" ON sales_commissions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable delete for authenticated" ON sales_commissions;
CREATE POLICY "Enable delete for authenticated" ON sales_commissions
  FOR DELETE TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable anon read for sales_commissions" ON sales_commissions;
CREATE POLICY "Enable anon read for sales_commissions" ON sales_commissions
  FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Enable anon insert for sales_commissions" ON sales_commissions;
CREATE POLICY "Enable anon insert for sales_commissions" ON sales_commissions
  FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Enable anon update for sales_commissions" ON sales_commissions;
CREATE POLICY "Enable anon update for sales_commissions" ON sales_commissions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable anon delete for sales_commissions" ON sales_commissions;
CREATE POLICY "Enable anon delete for sales_commissions" ON sales_commissions
  FOR DELETE TO anon USING (true);
