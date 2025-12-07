import { NextResponse, NextRequest } from 'next/server'
import { refreshTokens } from './libs/http/http'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    if (
        !request.cookies.get('accessToken') &&
        !request.cookies.get('refreshToken') &&
        path != '/auth'
    ) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    // if (!request.cookies.get('accessToken') && request.cookies.get("refreshToken")) {
    //     await refreshTokens()
    // }
    debugger
    if (
        !request.cookies.get('accessToken') &&
        request.cookies.get('refreshToken')
    ) {
        await refreshTokens()
    }

    // if (request.cookies.get("accessToken") && !request.cookies.get("companyId") && path != '/company') return NextResponse.redirect(new URL('/company', request.url))

    if (
        request.cookies.get('accessToken') &&
        !request.cookies.get('companyId') &&
        path != '/company'
    )
        return NextResponse.redirect(new URL('/company', request.url))

    if (
        path == '/' ||
        (path == '/company' && request.cookies.get('companyId')) ||
        (path == '/auth' && request.cookies.get('accessToken'))
    )
        return NextResponse.redirect(new URL('/profile', request.url))
}

export const config = {
    matcher: ['/', '/main', '/company', '/profile', '/auth', '/skill-orders', '/interviews', '/employees', '/skills-settings', '/teams'],
}