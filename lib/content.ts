import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { put, get } from '@vercel/blob';
import type { SiteContent } from '@/types/content';

const DEFAULT_PATH = join(process.cwd(), 'data', 'content.default.json');
const RUNTIME_PATH = join(process.cwd(), 'data', 'content.json');
const BLOB_PATH = 'content.json';

let cachedContent: SiteContent | null = null;

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

async function loadFromFile(path: string): Promise<SiteContent> {
  const raw = await readFile(path, 'utf-8');
  return JSON.parse(raw) as SiteContent;
}

async function loadFromBlob(): Promise<SiteContent | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const result = await get(BLOB_PATH, { access: 'private' });
    if (!result || !result.blob) return null;
    const res = await fetch(result.blob.url);
    const raw = await res.text();
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

async function saveToBlob(content: SiteContent): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    await put(BLOB_PATH, JSON.stringify(content, null, 2), { access: 'private' });
    return true;
  } catch {
    return false;
  }
}

export async function getContent(): Promise<SiteContent> {
  if (cachedContent) return cachedContent;

  // 1. Try Blob (production persistence)
  const blobContent = await loadFromBlob();
  if (blobContent) {
    cachedContent = blobContent;
    return cachedContent;
  }

  // 2. Try runtime file (local dev)
  if (await fileExists(RUNTIME_PATH)) {
    cachedContent = await loadFromFile(RUNTIME_PATH);
    return cachedContent;
  }

  // 3. Fallback to factory defaults
  if (await fileExists(DEFAULT_PATH)) {
    cachedContent = await loadFromFile(DEFAULT_PATH);
    return cachedContent;
  }

  throw new Error('No content file found');
}

export async function updateContent(content: SiteContent): Promise<void> {
  cachedContent = content;
  await saveToBlob(content);
  try { await writeFile(RUNTIME_PATH, JSON.stringify(content, null, 2), 'utf-8'); } catch {}
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
