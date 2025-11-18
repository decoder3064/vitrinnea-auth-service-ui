import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // DISABLED FOR UI PREVIEW - All routes are accessible without authentication
  // TODO: Uncomment below when connecting to real backend to enable route protection
  
  // const token = request.cookies.get('access_token')?.value;
  // const { pathname } = request.nextUrl;

  // // Public routes that don't require authentication
  // const publicRoutes = ['/login'];
  
  // // Check if the current path is public
  // const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // // If user is not authenticated and trying to access protected route
  // if (!token && !isPublicRoute && pathname !== '/') {
  //   const loginUrl = new URL('/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // // If user is authenticated and trying to access login page
  // if (token && pathname === '/login') {
  //   const profileUrl = new URL('/profile', request.url);
  //   return NextResponse.redirect(profileUrl);
  // }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
