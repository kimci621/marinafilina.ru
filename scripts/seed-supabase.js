// Run once: node scripts/seed-supabase.js
const { createClient } = require('@supabase/supabase-js');
const content = require('../data/content.default.json');

const supabase = createClient(
  'https://zoltnasyqvhzcmkwiilt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbHRuYXN5cXZoemNta3dpaWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzc4NDQ0MywiZXhwIjoyMDk5MzYwNDQzfQ.V4gFyAexzv3j_cZyPB6zp0qTGg82I9u1NNHr9-KtXqQ'
);

async function seed() {
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });

  if (error) {
    console.log('❌', error.message);
    console.log('\nНужно создать таблицу. Скопируй SQL из docs/supabase-setup.sql');
    console.log('и выполни в Supabase SQL Editor:\n');
    console.log('https://supabase.com/dashboard/project/zoltnasyqvhzcmkwiilt/sql/new\n');
  } else {
    console.log('✅ Контент загружен в Supabase');
  }
}

seed();
