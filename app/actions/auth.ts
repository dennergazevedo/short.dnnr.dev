'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/auth'
import { LoginSchema, RegisterSchema } from '@/lib/definitions'

export type AuthState =
  | {
      error?: string
      success?: boolean
    }
  | undefined

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors
    return { error: errors.email?.[0] || errors.password?.[0] || 'Dados inválidos' }
  }

  const { email, password } = validated.data

  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]

  if (!user || !user.password_hash) {
    return { error: 'Email ou senha incorretos' }
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return { error: 'Email ou senha incorretos' }
  }

  await createSession({ userId: user.id, email: user.email, name: user.name })
  redirect('/dashboard')
}

export async function register(state: AuthState, formData: FormData): Promise<AuthState> {
  const validated = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors
    return { error: errors.name?.[0] || errors.email?.[0] || errors.password?.[0] || 'Dados inválidos' }
  }

  const { name, email, password } = validated.data

  const existing = await query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    return { error: 'Este email já está cadastrado' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const result = await query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
    [name, email, passwordHash]
  )

  const user = result.rows[0]
  await createSession({ userId: user.id, email: user.email, name: user.name })
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
