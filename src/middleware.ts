import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // If trying to access a protected route without auth token
  const isProtectedRoute = pathname.startsWith('/account') || 
                          pathname.startsWith('/checkout') ||
                          pathname.startsWith('/orders');

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/customer-login', request.url));
    }

    try {
      // Verify token
      verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/customer-login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/orders/:path*'],
}; 