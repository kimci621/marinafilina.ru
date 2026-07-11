const { createClient } = require('@supabase/supabase-js');

const URL = 'https://zoltnasyqvhzcmkwiilt.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbHRuYXN5cXZoemNta3dpaWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzc4NDQ0MywiZXhwIjoyMDk5MzYwNDQzfQ.V4gFyAexzv3j_cZyPB6zp0qTGg82I9u1NNHr9-KtXqQ';

async function main() {
  const supabase = createClient(URL, KEY);

  // Create table using raw SQL via REST
  const { error: sqlError } = await supabase.rpc('exec_sql', {
    query: 'CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY DEFAULT 1, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW()); INSERT INTO site_content (id, data) VALUES (1, \'{}\'::jsonb) ON CONFLICT (id) DO NOTHING; ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;'
  });
  console.log('SQL:', sqlError?.message || 'OK');

  // Alternatively, try direct table creation via REST
  // First try to select — if table exists, it'll work
  const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
  if (error) {
    console.log('Table does not exist, needs manual SQL creation');
    console.log('Go to: https://supabase.com/dashboard/project/zoltnasyqvhzcmkwiilt/sql/new');
    console.log('Run the SQL from docs/supabase-setup.sql');
  } else {
    console.log('Table exists, current data:', data);

    // Insert default content
    const defaultContent = require('./data/content.default.json');
    const { error: upsertError } = await supabase.from('site_content').upsert({
      id: 1,
      data: defaultContent,
      updated_at: new Date().toISOString()
    });
    console.log('Seed:', upsertError?.message || 'OK');
  }
}

main();
