import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeSession } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Admin route protection
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = decodeSession(request.cookies.get('coffea_session')?.value)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Account page protection
  if (pathname.startsWith('/account')) {
    const session = decodeSession(request.cookies.get('coffea_session')?.value)
    if (!session || session.role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
