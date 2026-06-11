'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Link } from '@/lib/definitions'
import AddLinkForm from './AddLinkForm'
import { deleteLink } from '@/app/actions/links'
import { useRouter } from 'next/navigation'

export default function LinksTable({ initialLinks }: { initialLinks: Link[] }) {
  const [showForm, setShowForm] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  function handleCopy(link: Link) {
    navigator.clipboard.writeText(`${window.location.origin}/${link.slug}`)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    await deleteLink(id)
    setConfirmDeleteId(null)
    setDeletingId(null)
    router.refresh()
  }

  const handleSuccess = useCallback(() => {
    setShowForm(false)
    router.refresh()
  }, [router])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })
  }

  function truncateUrl(url: string, max = 45) {
    return url.length > max ? url.slice(0, max) + '…' : url
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Seus links</h2>
          <p className="text-sm text-zinc-500">
            {initialLinks.length} link{initialLinks.length !== 1 ? 's' : ''} encurtado{initialLinks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-500 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Novo link'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-5 overflow-hidden"
          >
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-zinc-500">Adicionar novo link</p>
              <AddLinkForm onSuccess={handleSuccess} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {initialLinks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center"
        >
          <p className="text-3xl mb-3">🔗</p>
          <p className="text-zinc-500 font-medium">Nenhum link encurtado ainda</p>
          <p className="mt-1 text-sm text-zinc-400">Clique em &quot;Novo link&quot; para começar</p>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">URL Original</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Link Curto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 hidden sm:table-cell">Cliques</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 hidden md:table-cell">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">Ações</th>
              </tr>
            </thead>
            <tbody>
              {initialLinks.map((link, i) => (
                <motion.tr
                  key={link.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-zinc-100 hover:bg-zinc-50/60 transition-colors last:border-0"
                >
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.original_url}
                      className="truncate block text-zinc-500 hover:text-zinc-800 transition-colors text-xs"
                    >
                      {truncateUrl(link.original_url)}
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <a
                      href={`/${link.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors"
                    >
                      /{link.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-zinc-700 font-medium">{link.clicks}</span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-400 text-xs hidden md:table-cell">
                    {formatDate(link.created_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(link)}
                        className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                      >
                        {copiedId === link.id ? '✓' : 'Copiar'}
                      </motion.button>

                      <AnimatePresence mode="wait">
                        {confirmDeleteId === link.id ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={() => handleDelete(link.id)}
                              disabled={deletingId === link.id}
                              className="cursor-pointer rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              {deletingId === link.id ? '...' : 'Sim'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="cursor-pointer rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-50 transition-colors"
                            >
                              Não
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="delete"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmDeleteId(link.id)}
                            className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-red-400 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            Apagar
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
