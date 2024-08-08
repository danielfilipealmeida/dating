import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const allowedUnauthenticatedRoutes = [
        '/login',
        '/signup'
    ]

    const currentUser = request.cookies.get('currentUser')?.value

    // todo: fix this later
    /*
    if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }
        */

    if (!currentUser && !allowedUnauthenticatedRoutes.includes(request.nextUrl.pathname)) {
        return Response.redirect(new URL(request.nextUrl.pathname, request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  }