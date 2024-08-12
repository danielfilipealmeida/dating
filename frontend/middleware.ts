import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const allowedUnauthenticatedRoutes = [
        '/',
        '/login',
        '/signup',
        '/favicon.ico'
    ]
    
    const currentUser = request.cookies.get('currentUser')?.value

    if(!currentUser) {
        if (allowedUnauthenticatedRoutes.includes(request.nextUrl.pathname)) {
            return
        }
        
        return Response.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  }