import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

let initialized = false

async function ensureInit() {
  if (initialized) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      name VARCHAR(255),
      google_id VARCHAR(255) UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      original_url TEXT NOT NULL,
      slug VARCHAR(20) UNIQUE NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS links_slug_idx ON links(slug)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS links_user_id_idx ON links(user_id)`)
  initialized = true
}

export async function query(text: string, params?: unknown[]) {
  await ensureInit()
  return pool.query(text, params)
}
