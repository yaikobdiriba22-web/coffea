import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const payload = Object.fromEntries(formData.entries())
    const parsed = schema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid contact form submission' }, { status: 400 })
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unable to send message' }, { status: 500 })
  }
}
