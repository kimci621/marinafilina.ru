import type { SiteContent } from '@/types/content';
import defaultContent from '@/data/content.json';

let kvGet: ((key: string) => Promise<SiteContent | null>) | null = null;
let kvSet: ((key: string, value: SiteContent) => Promise<unknown>) | null = null;

// Lazy-load KV to avoid errors when not configured
async function getKV() {
  if (!kvGet) {
    try {
      const { kv } = await import('@vercel/kv');
      kvGet = async (key: string) => kv.get<SiteContent>(key);
      kvSet = async (key: string, value: SiteContent) => kv.set(key, value);
    } catch {
      kvGet = async () => null;
      kvSet = async () => {};
    }
  }
  return { get: kvGet!, set: kvSet! };
}

const CONTENT_KEY = 'site:content';

export async function getContent(): Promise<SiteContent> {
  try {
    const { get } = await getKV();
    const stored = await get(CONTENT_KEY);
    if (stored?.nav && stored?.home) {
      return stored;
    }
  } catch {
    // KV unavailable, use default
  }
  return defaultContent as unknown as SiteContent;
}

export async function updateContent(content: SiteContent): Promise<void> {
  const { set } = await getKV();
  await set(CONTENT_KEY, content);
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
