import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha obrigatória' }),
})

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter ao menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter ao menos 8 caracteres' }),
})

export const ShortenSchema = z.object({
  url: z.string().url({ message: 'URL inválida. Inclua http:// ou https://' }),
})

export interface Link {
  id: number
  user_id: number | null
  original_url: string
  slug: string
  clicks: number
  created_at: string
}
