import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that require authentication
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    // Paths that are for guests only
    if (pathname.startsWith('/auth')) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    if (pathname === '/') {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth', '/'],
};
