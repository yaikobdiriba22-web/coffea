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

    const totalOrders = await prisma.order.count()
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } })
    const totalProducts = await prisma.product.count()
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } })
    const totalRevenue = await prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED'] } },
      _sum: { total: true },
    })

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { items: true },
    })

    return NextResponse.json({
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentOrders,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
