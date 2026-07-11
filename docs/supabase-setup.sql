-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- 1. Site content table
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert default content
INSERT INTO site_content (id, data) VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Photos storage bucket
-- Go to Supabase → Storage → New bucket
-- Name: photos
-- Public bucket: YES
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- 4. Enable RLS (Row Level Security) and policies
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read" ON site_content
  FOR SELECT USING (true);

-- Allow service role write
CREATE POLICY "Service write" ON site_content
  FOR ALL USING (true)
  WITH CHECK (true);
