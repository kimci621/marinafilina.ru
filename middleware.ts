import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/admin') || pathname === '/admin') {
    if (pathname === '/api/admin/login') return NextResponse.next();

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
