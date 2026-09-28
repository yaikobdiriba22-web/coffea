import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  categoryId: z.string(),
  mainImage: z.string().optional(),
  isAvailable: z.boolean(),
})

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: { category: true, images: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = schema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: params.productId },
      data: parsed.data,
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    await prisma.product.delete({ where: { id: params.productId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
