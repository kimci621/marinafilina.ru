import { NextRequest, NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/content';
import { verifyToken } from '@/lib/auth';

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { await verifyToken(token); return true; } catch { return false; }
}

function deepSet(obj: any, path: (string | number)[], value: any) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!(path[i] in current)) current[path[i]] = typeof path[i + 1] === 'number' ? [] : {};
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

function deepDelete(obj: any, path: (string | number)[]) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!(path[i] in current)) return;
    current = current[path[i]];
  }
  const last = path[path.length - 1];
  if (Array.isArray(current)) {
    current.splice(last as number, 1);
  } else {
    delete current[last];
  }
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const content = await getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { path, value, action } = await request.json();

    if (!path || !Array.isArray(path)) {
      return NextResponse.json({ error: 'Missing path array' }, { status: 400 });
    }

    const content = await getContent();

    if (action === 'delete') {
      deepDelete(content, path);
    } else {
      deepSet(content, path, value);
    }

    await updateContent(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.nav || !body.home || !body.about || !body.projects || !body.footer) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }
    await updateContent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
