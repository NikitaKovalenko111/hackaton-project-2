import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (!request.cookies.get("accessToken")) return NextResponse.redirect(new URL('/auth', request.url))
}

export const config = {
    matcher: '/',
}