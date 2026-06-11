'use client'

import { useActionState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { shortenUrl, type ShortenState } from '@/app/actions/links'

interface AddLinkFormProps {
  onSuccess: () => void
}

export default function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [state, action, pending] = useActionState<ShortenState, FormData>(shortenUrl, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.shortUrl) {
      formRef.current?.reset()
      onSuccess()
    }
  }, [state?.shortUrl, onSuccess])

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3 sm:flex-row">
      <input
        name="url"
        type="url"
        placeholder="https://example.com/url-longa"
        required
        className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={pending}
        className="cursor-pointer whitespace-nowrap rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Encurtando...' : '+ Adicionar link'}
      </motion.button>
      {state?.error && (
        <p className="w-full text-sm text-red-500">{state.error}</p>
      )}
    </form>
  )
}
