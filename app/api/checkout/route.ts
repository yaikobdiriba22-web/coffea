import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  orderType: z.enum(['PICKUP', 'DELIVERY']),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid checkout data' }, { status: 400 })
    }

    const { name, email, phone, orderType, deliveryAddress, notes } = parsed.data

    // Get cart for guest user
    const cart = await prisma.cart.findUnique({
      where: { userId: 'guest-user' },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const deliveryFee = orderType === 'DELIVERY' ? 50 : 0
    const total = subtotal + deliveryFee

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Create order (without user association for guest checkout)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: 'guest-user',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        orderType: orderType as any,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : null,
        deliveryNote: notes,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING',
        paymentMethod: 'CASH_PICKUP',
        paymentStatus: 'PENDING',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
            subtotal: item.product.price * item.quantity,
          })),
        },
      },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    return NextResponse.json({ success: true, order, orderNumber })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unable to place order' }, { status: 500 })
  }
}
