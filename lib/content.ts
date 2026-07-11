import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { SiteContent } from '@/types/content';
import defaultContent from '@/data/content.json';

const CONTENT_PATH = join(process.cwd(), 'data', 'content.json');

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(CONTENT_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return defaultContent as unknown as SiteContent;
  }
}

export async function updateContent(content: SiteContent): Promise<void> {
  await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf-8');
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
