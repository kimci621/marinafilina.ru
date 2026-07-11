-- Run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/zoltnasyqvhzcmkwiilt/sql/new

-- Drop old single-row table
DROP TABLE IF EXISTS site_content CASCADE;

-- New: key-value store — each field is a separate row
CREATE TABLE site_fields (
  path TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON site_fields FOR SELECT USING (true);
CREATE POLICY "Service write" ON site_fields FOR ALL USING (true) WITH CHECK (true);
