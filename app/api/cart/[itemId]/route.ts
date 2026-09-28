import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    await prisma.cartItem.delete({
      where: { id: params.itemId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const body = await request.json()
    const schema = z.object({ quantity: z.number().int().positive().max(20) })
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    }

    const updated = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity: parsed.data.quantity },
    })

    return NextResponse.json({ success: true, item: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}
