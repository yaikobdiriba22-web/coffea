import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('coffea_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  return response
}

export async function GET() {
  return NextResponse.json({ success: true })
}
