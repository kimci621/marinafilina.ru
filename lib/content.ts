import { supabase } from './supabase';
import defaultContent from '@/data/content.default.json';
import type { SiteContent } from '@/types/content';

// Single-row table: id=1 always
const ROW_ID = 1;

export async function getContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', ROW_ID)
      .single();

    if (data?.data && !error) {
      return data.data as SiteContent;
    }
  } catch {
    // Supabase unavailable — fallback to defaults
  }

  return defaultContent as unknown as SiteContent;
}

export async function updateContent(content: SiteContent): Promise<void> {
  await supabase
    .from('site_content')
    .upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() });
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
