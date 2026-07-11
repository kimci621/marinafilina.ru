// Seed Supabase with default content
// Run: node scripts/seed-supabase.js
const { createClient } = require('@supabase/supabase-js');
const content = require('../data/content.default.json');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zoltnasyqvhzcmkwiilt.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbHRuYXN5cXZoemNta3dpaWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzc4NDQ0MywiZXhwIjoyMDk5MzYwNDQzfQ.V4gFyAexzv3j_cZyPB6zp0qTGg82I9u1NNHr9-KtXqQ'
);

function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

async function seed() {
  const flat = flatten(content);
  const rows = Object.entries(flat).map(([path, value]) => ({ path, value }));

  const { error } = await supabase.from('site_fields').upsert(rows);
  if (error) {
    console.log('❌', error.message);
    console.log('\nНужно выполнить SQL из docs/supabase-setup.sql в SQL Editor');
  } else {
    console.log(`✅ ${rows.length} полей загружено в Supabase (key-value)`);
  }
}

seed();
