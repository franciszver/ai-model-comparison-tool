import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip auth for API routes, static files, and login page
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const password = process.env.DASHBOARD_PASSWORD || 'change-me-in-production';
  const authHeader = request.headers.get('authorization');

  // Check if password is provided in Authorization header
  if (authHeader && authHeader === `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`) {
    return NextResponse.next();
  }

  // Check for password in cookie
  const passwordCookie = request.cookies.get('dashboard-auth');
  if (passwordCookie && passwordCookie.value === password) {
    return NextResponse.next();
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};

