import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { verifyToken } from '@/lib/auth';
import { getClient } from '@/lib/supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { await verifyToken(token); return true; } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const client = getClient();
  if (!client) return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Max 5MB' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split('/')[1] || 'jpg';
  const filename = `${randomUUID()}.${ext}`;

  const { data, error } = await client.storage
    .from('photos')
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });

  const { data: urlData } = client.storage.from('photos').getPublicUrl(filename);
  return NextResponse.json({ url: urlData.publicUrl });
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const client = getClient();
  if (!client) return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });

  const { url } = await request.json();
  const parts = url?.split('/');
  const filename = parts?.[parts.length - 1];
  if (!filename) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });

  const { error } = await client.storage.from('photos').remove([filename]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
