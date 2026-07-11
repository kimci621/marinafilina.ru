import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import type { SiteContent } from '@/types/content';

const DEFAULT_PATH = join(process.cwd(), 'data', 'content.default.json');
const RUNTIME_PATH = join(process.cwd(), 'data', 'content.json');

// In-memory cache: survives warm function invocations on Vercel
// On local dev: file persistence is the primary store
let cachedContent: SiteContent | null = null;

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

export async function getContent(): Promise<SiteContent> {
  // 1. Return cached content if available (fast path for warm instances)
  if (cachedContent) return cachedContent;

  // 2. Try runtime file (works locally, may exist on Vercel from seed)
  if (await fileExists(RUNTIME_PATH)) {
    const raw = await readFile(RUNTIME_PATH, 'utf-8');
    cachedContent = JSON.parse(raw);
    return cachedContent;
  }

  // 3. Fallback to factory defaults
  if (await fileExists(DEFAULT_PATH)) {
    const raw = await readFile(DEFAULT_PATH, 'utf-8');
    cachedContent = JSON.parse(raw);
    // Seed runtime file so next reads can use it (best-effort)
    try { await writeFile(RUNTIME_PATH, raw, 'utf-8'); } catch {}
    return cachedContent;
  }

  throw new Error('No content file found');
}

export async function updateContent(content: SiteContent): Promise<void> {
  // In-memory cache (works everywhere, instant)
  cachedContent = structuredClone(content);

  // File persistence (works locally; silently fails on Vercel read-only FS)
  try {
    await writeFile(RUNTIME_PATH, JSON.stringify(content, null, 2), 'utf-8');
  } catch {
    // Vercel read-only filesystem — data is in cache, pages will use it
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
