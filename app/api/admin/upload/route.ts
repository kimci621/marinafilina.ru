import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { verifyToken } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { await verifyToken(token); return true; } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Max 5MB' }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!validateMagic(bytes, file.type)) return NextResponse.json({ error: 'Invalid content' }, { status: 400 });

  const ext = file.type.split('/')[1] || 'jpg';
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { url } = await request.json();
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  try { await unlink(join(process.cwd(), 'public', url)); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
}

function validateMagic(bytes: Uint8Array, mime: string): boolean {
  if (bytes.length < 4) return false;
  const h = Array.from(bytes.slice(0, 4));
  switch (mime) {
    case 'image/jpeg': return h[0] === 0xFF && h[1] === 0xD8 && h[2] === 0xFF;
    case 'image/png': return h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4E && h[3] === 0x47;
    case 'image/webp': return h[0] === 0x52 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x46;
    case 'image/gif': return h[0] === 0x47 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x38;
    default: return false;
  }
}
