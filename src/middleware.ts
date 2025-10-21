import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    
    debugger
    const path = request.nextUrl.pathname

    if (!request.cookies.get("accessToken")) return NextResponse.redirect(new URL('/auth', request.url))
    
    if (!request.cookies.get("companyId") && path != '/company') return NextResponse.redirect(new URL('/company', request.url))
    
    if (path == '/') return NextResponse.redirect(new URL('/main', request.url))
}

export const config = {
    matcher: ['/', '/main', '/company'],
}