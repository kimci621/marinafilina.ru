import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { put, head, del } from '@vercel/blob';
import type { SiteContent } from '@/types/content';

const DEFAULT_PATH = join(process.cwd(), 'data', 'content.default.json');
const RUNTIME_PATH = join(process.cwd(), 'data', 'content.json');
const BLOB_PATH = 'content.json';

// In-memory cache: instant reads for warm instances
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
    const blob = await head(BLOB_PATH);
    if (!blob) return null;
    const res = await fetch(blob.url);
    const raw = await res.text();
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

async function saveToBlob(content: SiteContent): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    // Delete old blob first, then upload new one
    try { await del(BLOB_PATH); } catch {}
    await put(BLOB_PATH, JSON.stringify(content, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });
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
    // Also sync to local file for dev convenience
    try { await writeFile(RUNTIME_PATH, JSON.stringify(blobContent, null, 2), 'utf-8'); } catch {}
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
    try { await writeFile(RUNTIME_PATH, JSON.stringify(cachedContent, null, 2), 'utf-8'); } catch {}
    return cachedContent;
  }

  throw new Error('No content file found');
}

export async function updateContent(content: SiteContent): Promise<void> {
  cachedContent = content;

  // Primary: save to Blob (production)
  const saved = await saveToBlob(content);

  // Fallback: save to local file (dev, or if Blob unavailable)
  try {
    await writeFile(RUNTIME_PATH, JSON.stringify(content, null, 2), 'utf-8');
  } catch {}
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
