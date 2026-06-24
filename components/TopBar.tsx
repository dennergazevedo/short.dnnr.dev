'use client'

import { useState, useRef, useEffect } from 'react'

type Project = {
  id: string
  label: string
  url: string
  description: string
}

const t = {
  bar: 'bg-white/95 border-zinc-200/80',
  dot: 'bg-zinc-300',
  breadcrumbRoot: 'text-zinc-400 hover:text-zinc-700',
  breadcrumbSep: 'text-zinc-300',
  breadcrumbCurrent: 'text-zinc-700',
  button: 'text-zinc-400 hover:text-zinc-700',
  dropdown: 'bg-white border-zinc-200 shadow-zinc-200/60',
  itemDefault: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
  itemCurrent: 'bg-zinc-100 text-zinc-900',
  itemDotTop: 'bg-zinc-400 group-hover:bg-zinc-600',
  itemDotRest: 'bg-zinc-300 group-hover:bg-zinc-400',
  itemDesc: 'text-zinc-400 group-hover:text-zinc-500',
  footer: 'border-zinc-200/80 text-zinc-400',
}

export function TopBar() {
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const currentProject = projects.find((p) => p.id === 'short.dnnr.dev')

  useEffect(() => {
    fetch('https://dnnr.dev/projects.json')
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div
      className={`sticky top-0 left-0 right-0 z-[9999] h-8 border-b backdrop-blur-md flex items-center justify-between px-3 select-none ${t.bar}`}
    >
      <a
        href="https://dnnr.dev"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-1.5 text-[11px] font-mono transition-colors ${t.breadcrumbRoot}`}
      >
        <span className={`inline-block w-3.5 h-3.5 rounded-full flex-shrink-0 ${t.dot}`} />
        <span>dnnr</span>
        {currentProject && (
          <>
            <span className={t.breadcrumbSep}>/</span>
            <span className={t.breadcrumbCurrent}>{currentProject.label}</span>
          </>
        )}
      </a>

      <div ref={containerRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className={`flex items-center gap-1 text-[11px] font-mono transition-colors h-8 px-2 cursor-pointer ${t.button}`}
        >
          <span>projetos</span>
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            aria-hidden="true"
            className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          >
            <path
              d="M1.5 3.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            className={`absolute right-0 top-full mt-1 w-68 border rounded-lg shadow-2xl overflow-hidden ${t.dropdown}`}
          >
            <div className="p-1">
              {projects.map((project, index) => {
                const isCurrent = project.id === 'short.dnnr.dev'
                const isTop = index < 3
                return (
                  <a
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors group ${
                      isCurrent ? t.itemCurrent : t.itemDefault
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-1.5 h-1.5 rounded-full transition-colors ${
                        isCurrent ? 'bg-emerald-500' : isTop ? t.itemDotTop : t.itemDotRest
                      }`}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[11px] font-mono leading-tight truncate">
                        {project.label}
                      </span>
                      <span
                        className={`text-[10px] leading-tight truncate transition-colors ${t.itemDesc}`}
                      >
                        {project.description}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="flex-shrink-0 text-[9px] font-mono text-emerald-500/70 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        atual
                      </span>
                    )}
                  </a>
                )
              })}
            </div>

            <div className={`border-t px-3 py-2 ${t.footer}`}>
              <span className="text-[10px] font-mono">dnnr.dev — projetos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
