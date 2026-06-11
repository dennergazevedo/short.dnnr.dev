import { getSession } from '@/lib/auth'
import { getUserLinks } from '@/app/actions/links'
import LinksTable from '@/components/LinksTable'
import type { Link } from '@/lib/definitions'

export default async function DashboardPage() {
  const session = await getSession()
  const links = (await getUserLinks()) as Link[]

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0)

  return (
    <main className="min-h-screen pt-14">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-600">Dashboard</p>
          <h1 className="mt-1 text-2xl font-black text-zinc-900">
            Olá, {session?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie seus links encurtados.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Total de links</p>
            <p className="mt-2 text-3xl font-black text-zinc-900">{links.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Total de cliques</p>
            <p className="mt-2 text-3xl font-black text-zinc-900">{totalClicks}</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 col-span-2 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-violet-500">Conta</p>
            <p className="mt-2 truncate text-sm font-semibold text-violet-800">{session?.email}</p>
          </div>
        </div>

        {/* Links table */}
        <LinksTable initialLinks={links} />
      </div>
    </main>
  )
}
