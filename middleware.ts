import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeSession } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isAdminRoute && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const session = decodeSession(request.cookies.get('coffea_session')?.value)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
