'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { logout } from '@/app/actions/auth'
import type { SessionPayload } from '@/lib/jwt'

export default function NavbarClient({ session }: { session: SessionPayload | null }) {
  return (
    <div className="flex items-center gap-2">
      {session ? (
        <>
          <span className="hidden text-sm text-zinc-500 sm:block">{session.name}</span>
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Dashboard
            </motion.div>
          </Link>
          <form action={logout}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="cursor-pointer rounded-lg px-4 py-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Sair
            </motion.button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg px-4 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Entrar
            </motion.div>
          </Link>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors cursor-pointer shadow-sm shadow-violet-200"
            >
              Criar conta
            </motion.div>
          </Link>
        </>
      )}
    </div>
  )
}
