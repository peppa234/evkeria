import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/events',
  '/organization/dashboard',
  '/organization/events',
  '/organization/profile',
];

// User auth routes (for regular users)
const userAuthRoutes = ['/auth/login', '/auth/signup'];

// Organization auth routes
const orgAuthRoutes = ['/auth/organization/login', '/auth/organization/signup'];

// Helper to decode JWT payload without verification (just to read type)
function decodeJwtPayload(token: string): { type?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Check both cookie names
  const userToken = request.cookies.get('evkeria_user_token')?.value;
  const orgToken = request.cookies.get('evkeria_org_token')?.value;
  
  const { pathname } = request.nextUrl;

  // Decode tokens to check types
  const userPayload = userToken ? decodeJwtPayload(userToken) : null;
  const orgPayload = orgToken ? decodeJwtPayload(orgToken) : null;
  const hasUserToken = userPayload?.type === 'user';
  const hasOrgToken = orgPayload?.type === 'organization';

  // Check if trying to access protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute) {
    // User routes require user token
    if (pathname === '/profile' || pathname.startsWith('/profile/')) {
      if (!hasUserToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
    // Organization routes require org token
    else if (pathname.startsWith('/organization')) {
      if (!hasOrgToken) {
        return NextResponse.redirect(new URL('/auth/organization/login', request.url));
      }
    }
    // Events route requires user token
    else if (pathname === '/events' || pathname.startsWith('/events/')) {
      if (!hasUserToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  }

  // Check auth routes - only redirect if same type is already logged in
  const isUserAuthRoute = userAuthRoutes.some((route) => pathname.startsWith(route));
  const isOrgAuthRoute = orgAuthRoutes.some((route) => pathname.startsWith(route));

  // If user is logged in and tries to access user auth routes → redirect to profile
  if (isUserAuthRoute && hasUserToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // If org is logged in and tries to access org auth routes → redirect to dashboard
  if (isOrgAuthRoute && hasOrgToken) {
    return NextResponse.redirect(new URL('/organization/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/profile/:path*',
    '/events',
    '/events/:path*',
    '/organization/:path*',
    '/auth/:path*',
  ],
};
