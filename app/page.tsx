import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import ShortenForm from "@/components/ShortenForm";
import HomeAnimations from "@/components/HomeAnimations";

export const metadata: Metadata = {
  title: "short.dnnr.dev — Encurtador de Links",
};

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Links curtos e limpos",
    description: "Transforme URLs enormes em links compactos e fáceis de compartilhar em qualquer lugar.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Rastreamento de cliques",
    description: "Saiba quantas vezes seu link foi acessado. Cada clique é registrado em tempo real no dashboard.",
    highlight: true,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    title: "Gerencie todos os seus links",
    description: "Um dashboard completo para criar, copiar e excluir seus links encurtados em um só lugar.",
    highlight: true,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Sem expiração",
    description: "Seus links ficam ativos para sempre. Nenhuma data de validade, nenhuma surpresa.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Redirecionamento instantâneo",
    description: "Sem delays, sem páginas intermediárias. Quem clica chega direto ao destino.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Sem cadastro obrigatório",
    description: "Encurte links na hora, sem criar conta. Crie uma conta apenas se quiser rastrear os cliques.",
  },
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">
        {/* Dot grid background */}
        <div className="hero-dots absolute inset-0 opacity-60" />
        {/* Radial fade over dots */}
        <div
          className="absolute inset-0 bg-radial-gradient"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, #FAFAF9 100%)",
          }}
        />

        <HomeAnimations>
          <div className="relative text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              Links encurtados instantaneamente
            </div>

            <h1 className="mt-2 text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl md:text-7xl">
              Encurte seus
              <br />
              <span className="text-violet-600">links.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base text-zinc-500 sm:text-lg">
              Transforme URLs longas em links curtos, elegantes e rastreáveis —
              em segundos.
            </p>
          </div>

          <div className="relative mt-10 w-full max-w-2xl">
            <ShortenForm isLoggedIn={!!session} />
          </div>
        </HomeAnimations>
      </section>

      {/* Funcionalidades */}
      <section className="border-t border-zinc-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-500">
              Funcionalidades
            </p>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Tudo que você precisa,<br className="hidden sm:block" /> nada que você não quer.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-zinc-500">
              Simples para quem só quer encurtar. Poderoso para quem quer acompanhar resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                  f.highlight
                    ? "border-violet-200 bg-violet-50"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                {f.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                    Requer login
                  </span>
                )}
                <div
                  className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                    f.highlight
                      ? "bg-violet-100 text-violet-600"
                      : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {f.icon}
                </div>
                <h3 className="mb-1 text-sm font-bold text-zinc-900">{f.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-500">
              Como funciona
            </p>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Três passos. Pronto.
            </h2>
          </div>

          <div className="relative">
            {/* Linha conectora */}
            <div className="absolute left-5 top-10 hidden h-[calc(100%-5rem)] w-px bg-zinc-200 sm:block" />

            <div className="flex flex-col gap-8">
              {[
                {
                  step: "01",
                  title: "Cole a URL longa",
                  description: "Qualquer link — de artigos, vídeos, documentos ou sites — funciona.",
                },
                {
                  step: "02",
                  title: "Gere o link curto",
                  description: "Em menos de um segundo você tem um link short.dnnr.dev/xxx pronto para usar.",
                },
                {
                  step: "03",
                  title: "Compartilhe e acompanhe",
                  description: "Envie o link onde quiser. Se estiver logado, veja cada clique no dashboard em tempo real.",
                },
              ].map((item) => (
                <div key={item.step} className="relative flex gap-6 sm:items-start">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-white text-xs font-black text-violet-600">
                    {item.step}
                  </div>
                  <div className="pb-2">
                    <h3 className="mb-1 text-base font-bold text-zinc-900">{item.title}</h3>
                    <p className="text-sm text-zinc-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            Gratuito para sempre
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Quer ver quantos cliques<br className="hidden sm:block" /> seus links recebem?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-zinc-500">
            Crie uma conta grátis e tenha acesso ao dashboard com rastreamento de cliques, histórico de links e muito mais.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="cursor-pointer rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/login"
              className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-zinc-400">
          <span>© {new Date().getFullYear()} short.dnnr.dev</span>
          <span>
            by{" "}
            <a
              href="https://dnnr.dev"
              className="hover:text-zinc-700 transition-colors"
            >
              dnnr
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
