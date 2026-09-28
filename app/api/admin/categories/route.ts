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

export async function POST(request: Request) {
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
      return NextResponse.json({ error: 'Invalid category data' }, { status: 400 })
    }

    const category = await prisma.category.create({ data: parsed.data })
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
