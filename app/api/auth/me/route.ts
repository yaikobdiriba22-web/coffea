import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = decodeSession(request.headers.get('cookie')?.split('coffea_session=')[1]?.split(';')[0])
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, name: true, phone: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
