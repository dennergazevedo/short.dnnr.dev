import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { TopBar } from '@/components/TopBar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'short.dnnr.dev — Encurtador de Links',
  description: 'Transforme URLs longas em links curtos, elegantes e rastreáveis.',
  openGraph: {
    title: 'short.dnnr.dev',
    description: 'Transforme URLs longas em links curtos e elegantes.',
    siteName: 'short.dnnr.dev',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-stone-50 text-zinc-900 antialiased">
        <TopBar />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
