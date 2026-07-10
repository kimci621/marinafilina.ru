import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

const attempts: Map<string, { count: number; blockedUntil: number }> = new Map();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const record = attempts.get(ip);
  if (record && record.blockedUntil > now) {
    const remaining = Math.ceil((record.blockedUntil - now) / 1000);
    return NextResponse.json(
      { error: `Слишком много попыток. Попробуйте через ${remaining} сек.` },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (password !== ADMIN_PASSWORD) {
    const current = attempts.get(ip) || { count: 0, blockedUntil: 0 };
    current.count++;
    if (current.count >= MAX_ATTEMPTS) {
      current.blockedUntil = now + BLOCK_DURATION;
    }
    attempts.set(ip, current);
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await createToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return response;
}
