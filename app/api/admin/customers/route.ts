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

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
