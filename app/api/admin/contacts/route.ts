import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}
