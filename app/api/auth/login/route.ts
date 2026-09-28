import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cart = await prisma.cart.findUnique({
    where: { userId: 'guest-user' },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json({
    items: cart?.items ?? [],
    count: cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const productId = body.productId as string
  const quantity = Number(body.quantity ?? 1)

  if (!productId) return NextResponse.json({ error: 'Product is required' }, { status: 400 })
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
  }

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
}
