import Link from 'next/link'
import { getSession } from '@/lib/auth'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const session = await getSession()

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex cursor-pointer items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white shadow-sm shadow-violet-200">
            S
          </div>
          <span className="font-semibold text-zinc-900 tracking-tight">
            short<span className="text-zinc-400">.dnnr.dev</span>
          </span>
        </Link>
        <NavbarClient session={session} />
      </nav>
    </header>
  )
}
