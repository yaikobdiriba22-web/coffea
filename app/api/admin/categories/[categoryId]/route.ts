import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
})

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.categoryId },
      include: { products: true },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string } }
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
      return NextResponse.json({ error: 'Invalid category data' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id: params.categoryId },
      data: parsed.data,
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionToken = cookie?.split('coffea_session=')[1]?.split(';')[0]
    const session = decodeSession(sessionToken)

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    await prisma.category.delete({ where: { id: params.categoryId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
