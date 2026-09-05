# Quiltt Next.js Template

A modern starter for building financial data products on the [Quiltt](https://quiltt.dev) platform with Next.js.

It comes pre-wired with the [Quiltt React SDK](https://quiltt.dev/connector/sdk/react), server-side Session token issuance, the Quiltt Connector, and type-safe GraphQL — so you can go from clone to "connect a bank account and read the data" as fast as possible.

## ✨ What's included

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Quiltt React SDK** — `QuilttProvider`, `QuilttButton`, `useQuilttSession`, and an Apollo GraphQL client (`gql` / `useQuery`) that automatically attaches the Session token
- **Secure, server-side Sessions** — a Route Handler mints Profile-scoped Quiltt Session tokens behind `QUILTT_API_KEY_SECRET`; nothing sensitive reaches the browser
- **A clear auth seam** — the one place you swap the demo identity resolution for your own auth provider
- **Protected dashboard** with server-side route guarding
- **Connector integration** — launch the Quiltt Connector to connect accounts
- **Quiltt GraphQL** — sample `profile` / `accounts` operations, plus **GraphQL Codegen** preconfigured (client preset, output git-ignored)
- **Modern UI tooling** — Tailwind CSS v4, shadcn/ui components, dark mode, Biome (lint/format), and pnpm

## 🚀 Getting started

### Prerequisites

- **Node.js 20.9+** (`.nvmrc` pins `24`)
- **pnpm**
- A **Quiltt account** with:
  - an **API key secret** (`qltt_...`), and
  - a **Connector** (create one in the [Quiltt Dashboard](https://dashboard.quiltt.dev))

### 1. Install

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in your credentials:

```env
# Server-only — from the Quiltt Dashboard
QUILTT_API_KEY_SECRET="your_api_key_secret"

# The Connector ID your <QuilttButton /> will launch
NEXT_PUBLIC_QUILTT_CONNECTOR_ID="your_connector_id"

# Optional — the demo Profile (p_...) the sign-in page signs in as
QUILTT_USER_ID="p_..."
```

> Never prefix `QUILTT_API_KEY_SECRET` with `NEXT_PUBLIC_`, and never commit `.env.local`.

### 3. (Optional) Generate GraphQL types

GraphQL Codegen introspects the Quiltt schema and emits typed helpers into `src/gql/` (git-ignored). Requires `QUILTT_API_KEY_SECRET`:

```bash
pnpm graphql:generate
```

The app itself builds and runs without this step — sample pages use the SDK's runtime `gql` tag so you can start before configuring anything. See [GraphQL tooling](#-graphql-tooling).

### 4. Run it

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), click **Sign in**, and:

1. Sign in with your demo Profile (`QUILTT_USER_ID`) or paste any Profile ID (`p_...`)
2. Click **Connect account** to launch the Quiltt Connector
3. Watch the connected account appear on the dashboard, fetched over the Quiltt GraphQL API

## 🔐 How authentication works

Quiltt doesn't manage your end-users. **Profiles** are your users inside Quiltt, and a **Session token** is a Profile-scoped, 24-hour JWT that authenticates that user to the Connector and GraphQL API.

This template demonstrates the recommended pattern:

```
Browser ── POST /api/session { profileId } ──▶  Next.js Route Handler
                                                   │  mints a Session token via the Quiltt Auth API
                                                   ▼
Browser ◀──────── { token, userId, expiresAt } + HttpOnly cookie
```

- The **Route Handler** (`src/app/api/session/route.ts`) mints Session tokens using `QUILTT_API_KEY_SECRET` (server-only) and remembers the signed-in Profile in an **HttpOnly cookie**.
- The **SDK** stores the Session token client-side and automatically attaches it to `QuilttButton` and every GraphQL request.
- The **dashboard** is guarded **server-side** — no cookie, no render.

### The auth seam (bring your own auth)

Everything Quiltt-specific lives in two files:

- `src/lib/quiltt.ts` — `issueQuilttSessionToken(profileId)` calls the Quiltt Auth API.
- `src/app/api/session/route.ts` — the demo sign-in resolves a Profile ID from the request body or `QUILTT_USER_ID`.

To plug in your real identity provider (Auth.js, Clerk, your own backend, ...), replace that demo resolution so that `profileId` comes from your authenticated user — e.g.:

```ts
const user = await getCurrentUser(); // your auth provider
if (!user) return 401;
const { token } = await issueQuilttSessionToken(user.quilttProfileId);
```

### Session token best practices

- Session tokens are rate-limited (**10/hour, 20/day per Profile**) — mint them on sign-in and cache them, not on every request.
- Revoke tokens on sign-out (this template calls `revokeSession()`).
- Prefer server-to-server [Basic Auth](https://quiltt.dev/authentication) when you don't need a user-scoped token.

See [Issuing Session Tokens](https://quiltt.dev/authentication/issuing-session-tokens) for details.

## 📁 Project structure

```
src/
├── app/
│   ├── api/
│   │   └── session/route.ts     # Mint / clear demo Session (POST/DELETE)
│   ├── dashboard/page.tsx       # Protected dashboard (server-guarded)
│   ├── sign-in/page.tsx         # Demo sign-in
│   ├── layout.tsx               # Root layout (fonts, theme, <QuilttProviders>)
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Tailwind v4 + shadcn/ui theme tokens
├── components/
│   ├── dashboard/dashboard-client.tsx  # Connect button + accounts (client)
│   ├── sign-in-form.tsx         # Demo sign-in form
│   ├── quiltt-provider.tsx      # Mounts <QuilttProvider> once
│   ├── theme-toggle.tsx
│   └── ui/                      # shadcn/ui primitives (button, card, input, label)
├── graphql/
│   └── operations.graphql       # Sample operations consumed by codegen
└── lib/
    ├── quiltt.ts                # Server-side Quiltt helpers (auth seam)
    ├── session.ts               # Demo session cookie helpers
    └── utils.ts                 # cn()
```

## 🧩 GraphQL tooling

This template uses [GraphQL Code Generator](https://the-guild.dev/graphql/codegen/docs/getting-started) with the `client` preset:

- **Operations** live in `src/**/*.graphql` (see `src/graphql/operations.graphql`).
- **Schema source**: `https://api.quiltt.io/v1/graphql`, authenticated with `QUILTT_API_KEY_SECRET`.
- **Output**: generated typed helpers in `src/gql/` — **git-ignored** — so schema churn never pollutes your diffs.

```bash
pnpm graphql:generate   # one-shot
pnpm graphql:watch      # watch mode
```

The generated documents are `TypedDocumentNode`s, so you can pass them straight to the `useQuery` re-exported by `@quiltt/react` for fully typed results.

Follow the [GraphQL Tooling tutorial](https://quiltt.dev/get-started/tutorials/graphql-tooling) for the full walkthrough.

## 📜 Scripts

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `pnpm dev`              | Start the dev server (Turbopack)               |
| `pnpm build`            | Create a production build                      |
| `pnpm start`            | Start the production server                    |
| `pnpm typecheck`        | Run `tsc --noEmit`                             |
| `pnpm lint`             | Biome check                                    |
| `pnpm format`           | Biome format                                   |
| `pnpm graphql:generate` | Generate GraphQL types into `src/gql/`         |
| `pnpm graphql:watch`    | Regenerate GraphQL types on file changes       |

## 📚 Learn more

- [Quiltt Docs](https://quiltt.dev) — Connectors, authentication, and the GraphQL API
- [React SDK reference](https://quiltt.dev/connector/sdk/react)
- [Authentication tutorial](https://quiltt.dev/get-started/tutorials/authentication)
- [Quiltt on GitHub](https://github.com/quiltt/quiltt-sdks)

## 🤝 Contributing

Contributions are welcome. Please open an issue or pull request.

## 📄 License

[MIT](./LICENSE.md) © Quiltt, Inc.
