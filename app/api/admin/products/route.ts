import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const schema = z.object({
      name: z.string().min(2),
      slug: z.string().min(2),
      description: z.string().min(10),
      price: z.number().positive(),
      discountPrice: z.number().positive().optional(),
      categoryId: z.string(),
      mainImage: z.string().url().optional(),
      preparationTime: z.number().int().positive().optional(),
      ingredients: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isPopular: z.boolean().optional(),
      isAvailable: z.boolean().optional(),
    })

    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid product payload' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        slug: parsed.data.slug,
        price: Number(parsed.data.price),
        discountPrice: parsed.data.discountPrice ? Number(parsed.data.discountPrice) : null,
        preparationTime: parsed.data.preparationTime ?? 5,
        ingredients: parsed.data.ingredients ?? '',
        isFeatured: parsed.data.isFeatured ?? false,
        isPopular: parsed.data.isPopular ?? false,
        isAvailable: parsed.data.isAvailable ?? true,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unable to create product' }, { status: 500 })
  }
}
