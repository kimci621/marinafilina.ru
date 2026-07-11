import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import type { SiteContent } from '@/types/content';

const DEFAULT_PATH = join(process.cwd(), 'data', 'content.default.json');
const RUNTIME_PATH = join(process.cwd(), 'data', 'content.json');

// In-memory cache: survives warm function invocations on Vercel
let cachedContent: SiteContent | null = null;

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

async function loadFromFile(path: string): Promise<SiteContent> {
  const raw = await readFile(path, 'utf-8');
  return JSON.parse(raw) as SiteContent;
}

export async function getContent(): Promise<SiteContent> {
  if (cachedContent) return cachedContent;

  // Try runtime file
  if (await fileExists(RUNTIME_PATH)) {
    cachedContent = await loadFromFile(RUNTIME_PATH);
    return cachedContent;
  }

  // Fallback to factory defaults
  if (await fileExists(DEFAULT_PATH)) {
    cachedContent = await loadFromFile(DEFAULT_PATH);
    try { await writeFile(RUNTIME_PATH, JSON.stringify(cachedContent, null, 2), 'utf-8'); } catch {}
    return cachedContent;
  }

  throw new Error('No content file found');
}

export async function updateContent(content: SiteContent): Promise<void> {
  cachedContent = content;

  try {
    await writeFile(RUNTIME_PATH, JSON.stringify(content, null, 2), 'utf-8');
  } catch {
    // Vercel read-only filesystem — data lives in memory cache
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
