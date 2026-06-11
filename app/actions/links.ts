'use server'

import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { ShortenSchema } from '@/lib/definitions'

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export type ShortenState =
  | {
      error?: string
      shortUrl?: string
      slug?: string
    }
  | undefined

export async function shortenUrl(state: ShortenState, formData: FormData): Promise<ShortenState> {
  const validated = ShortenSchema.safeParse({ url: formData.get('url') })

  if (!validated.success) {
    return { error: 'URL inválida. Inclua http:// ou https://' }
  }

  const { url } = validated.data
  const session = await getSession()

  let slug = ''
  for (let i = 0; i < 10; i++) {
    slug = generateSlug()
    const existing = await query('SELECT id FROM links WHERE slug = $1', [slug])
    if (existing.rows.length === 0) break
  }

  await query('INSERT INTO links (user_id, original_url, slug) VALUES ($1, $2, $3)', [
    session?.userId ?? null,
    url,
    slug,
  ])

  const baseUrl = process.env.APP_URL || 'http://localhost:3000'
  return { shortUrl: `${baseUrl}/${slug}`, slug }
}

export async function getUserLinks() {
  const session = await getSession()
  if (!session) return []

  const result = await query(
    'SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC',
    [session.userId]
  )
  return result.rows
}

export async function deleteLink(linkId: number): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado' }

  await query('DELETE FROM links WHERE id = $1 AND user_id = $2', [linkId, session.userId])
  return {}
}
