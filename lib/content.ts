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

// Fetch only fields matching given prefixes (atomic, fast)
async function getFields(prefixes: string[]): Promise<Record<string, any>> {
  const client = getClient();
  if (!client) throw new Error('No client');

  // Build OR query: path LIKE 'nav.%' OR path LIKE 'home.%' ...
  let query = client.from(TABLE).select('path, value');
  for (const prefix of prefixes) {
    query = query.or(`path.like.${prefix}.%`);
  }

  const { data, error } = await query;
  if (error || !data) throw error;

  const flat: Record<string, any> = {};
  for (const row of data) {
    flat[row.path] = row.value;
  }
  return flat;
}

// Fetch a single field atomically
export async function getField(path: string[]): Promise<any> {
  try {
    const client = getClient();
    if (!client) throw new Error('No client');
    const key = path.join('.');
    const { data, error } = await client.from(TABLE).select('value').eq('path', key).single();
    if (error || !data) throw error;
    return data.value;
  } catch {
    // Fallback to default content
    let current: any = defaultContent;
    for (const key of path) current = current?.[key];
    return current;
  }
}

// Full content (admin only)
export async function getContent(): Promise<SiteContent> {
  try {
    const flat = await getFields(['']);
    if (Object.keys(flat).length > 0) {
      return unflatten(flat) as SiteContent;
    }
  } catch {}
  return defaultContent as unknown as SiteContent;
}

// Home page: only nav, home, footer, ui, photos
export async function getHomeContent() {
  try {
    const flat = await getFields(['nav', 'home', 'footer', 'ui', 'photos', 'projects']);
    const full = unflatten(flat);
    return {
      nav: full.nav,
      home: full.home,
      footer: full.footer,
      ui: full.ui,
      photos: full.photos || {},
      projects: full.projects || {},
    };
  } catch {
    return {
      nav: (defaultContent as any).nav,
      home: (defaultContent as any).home,
      footer: (defaultContent as any).footer,
      ui: (defaultContent as any).ui,
      photos: {},
      projects: (defaultContent as any).projects || {},
    };
  }
}

// About page: only nav, about, footer, ui
export async function getAboutContent() {
  try {
    const flat = await getFields(['nav', 'about', 'footer', 'ui', 'photos']);
    const full = unflatten(flat);
    return {
      nav: full.nav,
      about: full.about,
      footer: full.footer,
      ui: full.ui,
      photos: full.photos || {},
    };
  } catch {
    return {
      nav: (defaultContent as any).nav,
      about: (defaultContent as any).about,
      footer: (defaultContent as any).footer,
      ui: (defaultContent as any).ui,
      photos: {},
    };
  }
}

export async function updateContent(content: SiteContent): Promise<void> {
  const client = getClient();
  if (!client) return;
  const flat = flatten(content);
  const rows = Object.entries(flat).map(([path, value]) => ({ path, value }));
  await client.from(TABLE).upsert(rows);
}

export async function patchField(path: string[], value: any): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client.from(TABLE).upsert({
    path: path.join('.'),
    value,
    updated_at: new Date().toISOString(),
  });
}

export async function getProjectSlugs(): Promise<string[]> {
  const home = await getField(['home']);
  return home?.projects || [];
}

export async function getProject(slug: string): Promise<any> {
  const project = await getField(['projects', slug]);
  if (project) return project;
  return (defaultContent as any).projects?.[slug] || null;
}
