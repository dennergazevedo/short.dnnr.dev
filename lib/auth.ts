import { cookies } from 'next/headers'
import { signJWT, verifyJWT, type SessionPayload } from '@/lib/jwt'

export type { SessionPayload }

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return verifyJWT(token)
}

export async function createSession(user: SessionPayload) {
  const token = await signJWT(user)
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
