import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge, COOKIE_NAME } from '@/lib/auth-edge'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(COOKIE_NAME)?.value

    if (!token || !(await verifyTokenEdge(token))) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload')) {
    const token = req.cookies.get(COOKIE_NAME)?.value

    if (!token || !(await verifyTokenEdge(token))) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload'],
}
