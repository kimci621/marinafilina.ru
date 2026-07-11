import { getClient } from './supabase';
import defaultContent from '@/data/content.default.json';
import type { SiteContent } from '@/types/content';

const TABLE = 'site_fields';

function flatten(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
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

function unflatten(flat: Record<string, any>): any {
  const result: any = {};
  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
}

export async function getContent(): Promise<SiteContent> {
  try {
    const client = getClient();
    if (!client) throw new Error('No client');

    const { data, error } = await client.from(TABLE).select('path, value');
    if (error || !data) throw error;

    const flat: Record<string, any> = {};
    for (const row of data) {
      flat[row.path] = row.value;
    }

    if (Object.keys(flat).length > 0) {
      return unflatten(flat) as SiteContent;
    }
  } catch {
    // Supabase unavailable — fallback
  }

  return defaultContent as unknown as SiteContent;
}

export async function updateContent(content: SiteContent): Promise<void> {
  // Full save (used by seed and PUT)
  const client = getClient();
  if (!client) return;

  const flat = flatten(content);
  const rows = Object.entries(flat).map(([path, value]) => ({ path, value }));
  await client.from(TABLE).upsert(rows);
}

export async function patchField(path: string[], value: any): Promise<void> {
  const client = getClient();
  if (!client) return;

  const key = path.join('.');
  await client.from(TABLE).upsert({ path: key, value, updated_at: new Date().toISOString() });
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
