import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const schema = z.object({
      productId: z.string(),
      quantity: z.number().int().positive().max(20),
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid cart item payload' }, { status: 400 })
    }

    const { productId, quantity } = parsed.data

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || !product.isAvailable) {
      return NextResponse.json({ error: 'Product is unavailable' }, { status: 400 })
    }

    const cart = await prisma.cart.upsert({
      where: { userId: 'guest-user' },
      create: { userId: 'guest-user' },
      update: {},
    })

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity },
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Cart error', error)
    return NextResponse.json({ error: 'Unable to add to cart' }, { status: 500 })
  }
}

export async function GET() {
  const cart = await prisma.cart.findUnique({
    where: { userId: 'guest-user' },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json({
    count: cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    items: cart?.items ?? [],
  })
}
