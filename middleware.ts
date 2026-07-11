import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect API routes with middleware
  // Admin page auth is handled client-side via layout.tsx
  if (pathname.startsWith('/api/admin')) {
    // Allow login endpoint
    if (pathname === '/api/admin/login') return NextResponse.next();

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Token verification happens in each API route handler for simplicity
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
