import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  const session = decodeSession(cookies().get('coffea_session')?.value)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json({ orders })
}
