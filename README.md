# short.dnnr.dev

Encurtador de links pessoal — limpo, moderno e com dashboard de gerenciamento.

## Funcionalidades

- **Encurtamento público** — qualquer pessoa pode encurtar uma URL sem criar conta
- **Autenticação completa** — email/senha e Google OAuth
- **Dashboard pessoal** — visualize todos os seus links com contagem de cliques
- **Gerenciamento de links** — adicione e apague links encurtados
- **Sheet de autenticação** — ao encurtar sem login, sugere criar conta para salvar o link
- **Redirect com rastreamento** — cada acesso ao link curto incrementa o contador de cliques

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Animações | Framer Motion |
| Banco de dados | PostgreSQL (Neon) |
| Autenticação | JWT (jose) + bcryptjs |
| Validação | Zod |

## Configuração

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.local.example .env.local
```

```env
# Banco de dados PostgreSQL (Neon ou qualquer PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Chave secreta para assinar os JWTs (mínimo 32 caracteres)
JWT_SECRET=sua-chave-secreta-aqui-minimo-32-caracteres

# Google OAuth — crie em https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# URL base da aplicação
APP_URL=http://localhost:3000
```

### 3. Configure o Google OAuth (opcional)

No [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Crie um projeto e ative a **Google+ API** (ou People API)
2. Crie uma credencial **OAuth 2.0 Client ID** do tipo *Web application*
3. Adicione a URI de redirecionamento autorizada:
   - Desenvolvimento: `http://localhost:3000/api/auth/callback/google`
   - Produção: `https://seu-dominio.com/api/auth/callback/google`
4. Copie o Client ID e Client Secret para o `.env.local`

### 4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

As tabelas do banco de dados são criadas automaticamente na primeira requisição.

## Estrutura do projeto

```
short.dnnr.dev/
├── app/
│   ├── [slug]/
│   │   └── page.tsx          # Redireciona para URL original
│   ├── actions/
│   │   ├── auth.ts           # Server Actions: login, register, logout
│   │   └── links.ts          # Server Actions: encurtar, listar, apagar
│   ├── api/auth/
│   │   ├── google/route.ts           # Inicia fluxo OAuth com Google
│   │   └── callback/google/route.ts  # Callback do Google OAuth
│   ├── dashboard/
│   │   ├── layout.tsx        # Proteção de rota (server-side)
│   │   └── page.tsx          # Dashboard com stats e tabela de links
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx            # Layout raiz com Navbar
│   ├── page.tsx              # Home pública
│   └── globals.css
├── components/
│   ├── Navbar.tsx            # Barra de navegação (server component)
│   ├── NavbarClient.tsx      # Botões do navbar (client component)
│   ├── ShortenForm.tsx       # Formulário de encurtamento
│   ├── AuthSheet.tsx         # Sheet de autenticação para anônimos
│   ├── HomeAnimations.tsx    # Wrapper de animação de entrada
│   ├── LinksTable.tsx        # Tabela de links com ações
│   └── AddLinkForm.tsx       # Formulário inline de novo link
├── lib/
│   ├── jwt.ts                # Funções JWT (Edge Runtime compatible)
│   ├── auth.ts               # Gerenciamento de sessão via cookies
│   ├── db.ts                 # Pool PostgreSQL + inicialização de tabelas
│   └── definitions.ts        # Schemas Zod e tipos TypeScript
├── middleware.ts              # Proteção de rotas no Edge Runtime
└── .env.local.example
```

## Schema do banco de dados

As tabelas são criadas automaticamente, mas para referência:

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name          VARCHAR(255),
  google_id     VARCHAR(255) UNIQUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE links (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  original_url TEXT NOT NULL,
  slug         VARCHAR(20) UNIQUE NOT NULL,
  clicks       INTEGER DEFAULT 0,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Links criados sem login têm `user_id = NULL` e não aparecem no dashboard.

## Deploy

O projeto é compatível com qualquer plataforma que suporte Next.js:

**Vercel (recomendado)**
```bash
vercel deploy
```

Configure as variáveis de ambiente no painel da Vercel e atualize `APP_URL` e a URI de redirect do Google OAuth para o domínio de produção.

## Licença

MIT
