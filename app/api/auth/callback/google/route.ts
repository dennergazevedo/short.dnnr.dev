import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { signJWT } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const savedState = request.cookies.get('oauth_state')?.value
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', appUrl))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=google_not_configured', appUrl))
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/login?error=oauth_failed', appUrl))
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const googleUser = await userRes.json()

    let result = await query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [
      googleUser.id,
      googleUser.email,
    ])

    let user = result.rows[0]

    if (!user) {
      const insertResult = await query(
        'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *',
        [googleUser.name, googleUser.email, googleUser.id]
      )
      user = insertResult.rows[0]
    } else if (!user.google_id) {
      await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleUser.id, user.id])
    }

    const token = await signJWT({ userId: user.id, email: user.email, name: user.name })

    const response = NextResponse.redirect(new URL('/dashboard', appUrl))
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    response.cookies.delete('oauth_state')

    return response
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', appUrl))
  }
}
