import { readFile, writeFile, copyFile, access } from 'fs/promises';
import { join } from 'path';
import type { SiteContent } from '@/types/content';

const RUNTIME_PATH = join(process.cwd(), 'data', 'content.json');
const DEFAULT_PATH = join(process.cwd(), 'data', 'content.default.json');

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

export async function getContent(): Promise<SiteContent> {
  // 1. Try runtime content (gitignored, survives between deploys locally)
  if (await fileExists(RUNTIME_PATH)) {
    const raw = await readFile(RUNTIME_PATH, 'utf-8');
    return JSON.parse(raw);
  }

  // 2. Fallback to default (committed to git, factory defaults)
  if (await fileExists(DEFAULT_PATH)) {
    const raw = await readFile(DEFAULT_PATH, 'utf-8');
    return JSON.parse(raw);
  }

  // 3. Ultimate fallback (should never happen)
  throw new Error('No content file found');
}

export async function updateContent(content: SiteContent): Promise<void> {
  await writeFile(RUNTIME_PATH, JSON.stringify(content, null, 2), 'utf-8');
}

export async function resetToDefaults(): Promise<void> {
  if (await fileExists(DEFAULT_PATH)) {
    await copyFile(DEFAULT_PATH, RUNTIME_PATH);
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
