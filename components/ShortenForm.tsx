'use client'

import { useActionState, useRef, useState, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shortenUrl, type ShortenState } from '@/app/actions/links'
import AuthSheet from './AuthSheet'

interface ShortenFormProps {
  isLoggedIn: boolean
}

export default function ShortenForm({ isLoggedIn }: ShortenFormProps) {
  const [state, action, pending] = useActionState<ShortenState, FormData>(shortenUrl, undefined)
  const [copied, setCopied] = useState(false)
  const [showSheet, setShowSheet] = useState(false)
  const [pendingUrl, setPendingUrl] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!isLoggedIn) {
      e.preventDefault()
      const url = new FormData(e.currentTarget).get('url') as string
      if (!url) return
      setPendingUrl(url)
      setShowSheet(true)
    }
  }

  function handleContinueWithoutLogin() {
    setShowSheet(false)
    const fd = new FormData()
    fd.append('url', pendingUrl)
    startTransition(() => {
      action(fd)
    })
  }

  async function handleCopy() {
    if (!state?.shortUrl) return
    await navigator.clipboard.writeText(state.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="w-full max-w-2xl">
        <form ref={formRef} onSubmit={handleSubmit} action={action} className="flex flex-col gap-3 sm:flex-row">
          <input
            name="url"
            type="url"
            placeholder="Cole sua URL aqui... https://example.com/caminho/longo"
            required
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm sm:text-base"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={pending}
            className="cursor-pointer whitespace-nowrap rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Encurtando...
              </span>
            ) : (
              'Encurtar URL'
            )}
          </motion.button>
        </form>

        <AnimatePresence mode="wait">
          {state?.error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-red-500"
            >
              {state.error}
            </motion.p>
          )}

          {state?.shortUrl && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-violet-500 mb-0.5">Link encurtado ✓</p>
                <a
                  href={state.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-mono text-sm font-semibold text-violet-700 hover:text-violet-600 transition-colors"
                >
                  {state.shortUrl}
                </a>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="cursor-pointer shrink-0 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onContinueWithoutLogin={handleContinueWithoutLogin}
      />
    </>
  )
}
