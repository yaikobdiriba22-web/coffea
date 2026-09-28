import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid contact form data' }, { status: 400 })
    }

    const { name, email, phone, subject, message } = parsed.data

    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    })

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unable to send message' }, { status: 500 })
  }
}
