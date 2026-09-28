import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED']),
})

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { items: { include: { product: true } }, user: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: { status: parsed.data.status as any },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
