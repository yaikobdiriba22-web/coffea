import { randomBytes, createHmac, timingSafeEqual } from 'crypto'

export const AUTH_SECRET = process.env.AUTH_SECRET ?? 'dev-secret-change-me'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'CUSTOMER'
}

export function encodeSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64url')
  const signature = createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function decodeSession(token: string | undefined): SessionUser | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url')
  const expectedBuffer = Buffer.from(expected)
  const actualBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as SessionUser
    return parsed
  } catch {
    return null
  }
}

export function createSessionToken() {
  return randomBytes(32).toString('hex')
}
