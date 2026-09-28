import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
