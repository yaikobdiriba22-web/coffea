import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  orderType: z.enum(['PICKUP', 'DELIVERY']),
  deliveryAddress: z.string().optional(),
  deliveryNote: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout data' }, { status: 400 })
    }

    const { name, email, phone, orderType, deliveryAddress, deliveryNote } = parsed.data

    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    let userId = 'guest-user'
    if (sessionToken) {
      try {
        const { decodeSession } = await import('@/lib/auth')
        const session = decodeSession(sessionToken)
        if (session) userId = session.id
      } catch {}
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const deliveryFee = orderType === 'DELIVERY' ? 50 : 0
    const total = subtotal + deliveryFee

    const orderNumber = `ORD-${Date.now()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        orderType: orderType as any,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : null,
        deliveryNote,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING',
        paymentMethod: 'CASH_PICKUP',
        paymentStatus: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
            subtotal: item.product.price * item.quantity,
          })),
        },
      },
    })

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    return NextResponse.json({ success: true, order, orderNumber })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unable to place order' }, { status: 500 })
  }
}
