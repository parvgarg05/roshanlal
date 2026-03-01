import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

// Paths that require authentication
const ADMIN_PATHS = ['/admin'];
// Paths inside admin that are public (like the login page)
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Check if the route is an admin route
    const isAdminRoute = ADMIN_PATHS.some((path) => pathname.startsWith(path));

    if (!isAdminRoute) {
        return NextResponse.next();
    }

    // 2. Allow access to /admin/login without a token
    const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.some((path) => pathname === path);
    if (isPublicAdminRoute) {
        return NextResponse.next();
    }

    // 3. Verify the token for all other /admin/* routes
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
        // No token? Redirect to login
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Verify signature
    const verifiedToken = await verifyAuthToken(token);

    if (!verifiedToken) {
        // Invalid or expired token? Clear it and redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', req.url));
        response.cookies.delete('admin_token');
        return response;
    }

    // 4. Token is valid. Allow the request to proceed.
    return NextResponse.next();
}

// Configure middleware to run only on strictly /admin routes
export const config = {
    matcher: ['/admin/:path*'],
};
