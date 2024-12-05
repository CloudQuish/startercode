// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log('Middleware - Session:', !!session);

    // Auth routes protection
    if (session && ['/login', '/register', '/forgot-password'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protected routes
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password'],
};