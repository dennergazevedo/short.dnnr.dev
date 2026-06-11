import { notFound, redirect } from 'next/navigation'
import { query } from '@/lib/db'

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const result = await query('SELECT * FROM links WHERE slug = $1', [slug])

  if (result.rows.length === 0) {
    notFound()
  }

  const link = result.rows[0]

  await query('UPDATE links SET clicks = clicks + 1 WHERE slug = $1', [slug])

  redirect(link.original_url)
}
