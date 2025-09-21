import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isProtectedRoute = [
      '/dashboard',
      '/profile',
      '/premium',
      '/image-editor',
      '/watermark-remover'
    ].some(route => req.nextUrl.pathname.startsWith(route))

    // Redirect to signin if accessing protected route without authentication
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes and auth pages
        const publicRoutes = [
          '/',
          '/remove-background',
          '/image-upscaler',
          '/about',
          '/contact',
          '/blog',
          '/pricing',
          '/privacy',
          '/terms'
        ]
        
        const isPublicRoute = publicRoutes.some(route => 
          req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith('/blog/')
        )
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        
        return isPublicRoute || isAuthPage || !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}

