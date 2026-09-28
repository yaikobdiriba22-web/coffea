import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = decodeSession(cookies().get('coffea_session')?.value)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const status = body.status as string

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  })

  return NextResponse.json({ success: true, order: updated })
}
