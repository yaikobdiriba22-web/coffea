import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'
import { z } from 'zod'

const cartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
})

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    let userId = session?.id || 'guest-user'

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      })
    }

    return NextResponse.json({ cart, items: cart?.items || [] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = cartSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 })
    }

    const { productId, quantity } = parsed.data
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    let userId = session?.id || 'guest-user'

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      })
    }

    const existingItem = cart.items.find((item) => item.productId === productId)

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json({ success: true, cart: updatedCart })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
