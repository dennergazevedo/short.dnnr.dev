@AGENTS.md

# short.dnnr.dev — Contexto do Projeto

Encurtador de links pessoal com autenticação JWT, Google OAuth e dashboard de gerenciamento.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — configuração via `@theme` no `globals.css`, sem `tailwind.config.js`
- **Framer Motion** — animações em todos os componentes interativos (`'use client'` obrigatório)
- **PostgreSQL via Neon** — cliente `pg`, pool único em `lib/db.ts`
- **JWT com `jose`** — compatível com Edge Runtime (usado no middleware)
- **bcryptjs** — hash de senhas (Node.js runtime, não Edge)
- **Zod** — validação de formulários nos Server Actions

## Arquitetura

### Separação Edge / Node.js

O middleware (`middleware.ts`) roda em **Edge Runtime**. Por isso, a lógica JWT está em `lib/jwt.ts` (sem imports de `next/headers`). A `lib/auth.ts` importa de `lib/jwt.ts` e usa `cookies()` do `next/headers` — só pode ser usada em Server Components, Server Actions e Route Handlers (Node.js runtime).

**Nunca importar `lib/auth.ts` dentro de `middleware.ts`** — quebra o Edge Runtime.

### Server Actions

Todos os server actions estão em `app/actions/`. Os de autenticação (`auth.ts`) usam `redirect()` após sucesso — o TypeScript pode reclamar de tipo de retorno, mas é o comportamento esperado do Next.js.

### Banco de dados

`lib/db.ts` executa `CREATE TABLE IF NOT EXISTS` na primeira query (flag `initialized`). Não há sistema de migrations. Em produção, as tabelas são criadas automaticamente no primeiro request.

### Fluxo de autenticação

1. **Email/senha** → Server Action → `bcrypt.compare` → `createSession` (cookie `session` httpOnly)
2. **Google OAuth** → `GET /api/auth/google` → redirect Google → `GET /api/auth/callback/google` → troca código por token → busca/cria usuário → `signJWT` → seta cookie na Response

O cookie de sessão se chama `session`. O state CSRF do OAuth se chama `oauth_state` (expira em 10 min).

### Proteção de rotas

O `middleware.ts` protege `/dashboard/*` — redireciona para `/login` se não houver sessão válida. O `app/dashboard/layout.tsx` também verifica a sessão como segunda camada de segurança.

## Convenções de código

- **Componentes server** por padrão. Adicionar `'use client'` apenas quando necessário (framer-motion, hooks, event handlers)
- **`params` é uma Promise** em Next.js 16: sempre `const { slug } = await params`
- **`cookies()` é assíncrono** em Next.js 16: sempre `const cookieStore = await cookies()`
- Todos os botões e elementos clicáveis devem ter `cursor-pointer` no className (Tailwind v4 não aplica por padrão em `<button>`)
- URLs de links na tabela do dashboard usam caminhos relativos (`/slug`) para evitar hydration mismatch — `window.location.origin` só é usado dentro de event handlers

## Estrutura de pastas

```
app/
  [slug]/page.tsx       — redirect para URL original (incrementa cliques)
  actions/
    auth.ts             — login, register, logout
    links.ts            — shortenUrl, getUserLinks, deleteLink
  api/auth/
    google/route.ts             — inicia OAuth
    callback/google/route.ts    — callback OAuth
  dashboard/
    layout.tsx          — guarda de autenticação server-side
    page.tsx            — stats + tabela de links
  login/page.tsx
  register/page.tsx
  layout.tsx            — root layout com Navbar
  page.tsx              — home pública com ShortenForm

components/
  Navbar.tsx            — server component, lê sessão
  NavbarClient.tsx      — client component, botões do navbar
  ShortenForm.tsx       — formulário com lógica do AuthSheet
  AuthSheet.tsx         — sheet de login para usuários anônimos
  HomeAnimations.tsx    — wrapper de animação de entrada
  LinksTable.tsx        — tabela com copy/delete
  AddLinkForm.tsx       — form inline de novo link no dashboard

lib/
  jwt.ts                — signJWT / verifyJWT (Edge-safe)
  auth.ts               — getSession / createSession / deleteSession
  db.ts                 — pool PostgreSQL + init de tabelas
  definitions.ts        — schemas Zod + tipos TypeScript
```

## Variáveis de ambiente

```
DATABASE_URL          — connection string PostgreSQL (Neon)
JWT_SECRET            — mínimo 32 caracteres
GOOGLE_CLIENT_ID      — Google Cloud Console
GOOGLE_CLIENT_SECRET  — Google Cloud Console
APP_URL               — URL base (http://localhost:3000 em dev)
```

Redirect URI do Google: `{APP_URL}/api/auth/callback/google`

## Comandos

```bash
npm run dev     # desenvolvimento (Turbopack)
npm run build   # build de produção
npm run start   # servidor de produção
npm run lint    # ESLint
```
