'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'

interface AuthSheetProps {
  open: boolean
  onClose: () => void
  onContinueWithoutLogin: () => void
}

export default function AuthSheet({ open, onClose, onContinueWithoutLogin }: AuthSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 42 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-white px-6 pb-8 pt-5 shadow-2xl sm:bottom-auto sm:top-1/2 sm:rounded-3xl sm:-translate-y-1/2"
          >
            {/* Handle bar */}
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-zinc-200 sm:hidden" />

            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                  <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Salvar seu link?</h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Entre para organizar e acompanhar todos os seus links encurtados.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/api/auth/google"
                className="cursor-pointer flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar com Google
              </Link>

              <Link
                href="/login"
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-500"
              >
                Entrar com email
              </Link>

              <Link
                href="/register"
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Criar conta grátis
              </Link>
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-100" />
              <span className="text-xs text-zinc-400">ou</span>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>

            <button
              onClick={onContinueWithoutLogin}
              className="cursor-pointer w-full rounded-xl py-2.5 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
            >
              Continuar sem login
              <span className="ml-1 text-xs text-zinc-300">(link não ficará salvo)</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
