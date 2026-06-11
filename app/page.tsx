import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import ShortenForm from "@/components/ShortenForm";
import HomeAnimations from "@/components/HomeAnimations";

export const metadata: Metadata = {
  title: "short.dnnr.dev — Encurtador de Links",
};

const sites = [
  {
    href: "https://tools.dnnr.dev",
    name: "tools.dnnr.dev",
    description: "Ferramentas para devs",
    icon: "🛠️",
    bg: "bg-amber-50",
    border: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-100",
    text: "text-amber-900",
    sub: "text-amber-600",
    arrow: "text-amber-300 group-hover:text-amber-500",
  },
  {
    href: "https://divisor.dev",
    name: "divisor.dev",
    description: "A/B Testing simplificado",
    icon: "⚗️",
    bg: "bg-purple-50",
    border: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100",
    text: "text-purple-900",
    sub: "text-purple-600",
    arrow: "text-purple-300 group-hover:text-purple-500",
  },
  {
    href: "https://dnnr.dev",
    name: "dnnr.dev",
    description: "Portfólio pessoal",
    icon: "✦",
    bg: "bg-sky-50",
    border: "border-sky-200 hover:border-sky-400",
    iconBg: "bg-sky-100",
    text: "text-sky-900",
    sub: "text-sky-600",
    arrow: "text-sky-300 group-hover:text-sky-500",
  },
  {
    href: "https://os.dnnr.dev",
    name: "os.dnnr.dev",
    description: "Janelas XD — Inspirado no Windows XP",
    icon: "🖥️",
    bg: "bg-neutral-100",
    border: "border-neutral-200 hover:border-neutral-400",
    iconBg: "bg-neutral-200",
    text: "text-neutral-900",
    sub: "text-neutral-500",
    arrow: "text-neutral-300 group-hover:text-neutral-500",
  },
  {
    href: "https://bibliotecasecreta.com.br",
    name: "bibliotecasecreta.com.br",
    description: "Recomendações literárias personalizadas com IA",
    icon: "📚",
    bg: "bg-stone-50",
    border: "border-stone-200 hover:border-stone-400",
    iconBg: "bg-stone-100",
    text: "text-stone-900",
    sub: "text-stone-600",
    arrow: "text-stone-300 group-hover:text-stone-500",
  },
  {
    href: "https://news.dnnr.dev",
    name: "news.dnnr.dev",
    description: "Notícias de Tech, Curadas por IA.",
    icon: "🗞️",
    bg: "bg-indigo-50",
    border: "border-indigo-200 hover:border-indigo-400",
    iconBg: "bg-indigo-100",
    text: "text-indigo-900",
    sub: "text-indigo-600",
    arrow: "text-indigo-300 group-hover:text-indigo-500",
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

      {/* Sites recomendados */}
      <section className="border-t border-zinc-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Outros projetos
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative cursor-pointer rounded-2xl border px-4 py-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${site.bg} ${site.border}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`absolute right-3 top-3 h-3.5 w-3.5 transition-opacity opacity-40 group-hover:opacity-80 ${site.text}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p className={`font-mono text-sm font-semibold ${site.text}`}>
                  {site.name}
                </p>
                <p className={`mt-0.5 text-xs ${site.sub}`}>
                  {site.description}
                </p>
              </a>
            ))}
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
