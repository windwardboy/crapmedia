# Development

## Prerequisites

- Node.js 20+
- pnpm 9+

## Install

```bash
pnpm install
```

## Run locally

Both apps together:

```bash
pnpm dev
```

Or individually:

| App | Command | URL |
|-----|---------|-----|
| Marketing (`@crapmedia/web`) | `pnpm dev:web` | http://localhost:3000 |
| Player (`@crapmedia/player`) | `pnpm dev:player` | http://localhost:3001 |

## Build

```bash
pnpm build
```

## Player routes (Phase 0)

| Route | Purpose |
|-------|---------|
| `/` | Home shell |
| `/drive` | Driving mode demo + wake lock |
| `/settings` | Charcoal / Stone skin picker |

## Environment

Copy `.env.example` in each app when Phase 1 adds Supabase / YouTube.

## Deploy (Vercel)

Two projects from one repo. **Root Directory** must be set per project; `vercel.json` in each app runs install/build from the monorepo root.

| Project | Root directory | Domain |
|---------|----------------|--------|
| `crapmedia-web` | `apps/web` | `crapmedia.com` |
| `crapmedia-player` | `apps/player` | `play.crapmedia.com` |

If install fails, confirm **Settings → General → Root Directory** matches the table. Each app’s `vercel.json` uses `cd ../.. && pnpm install`.

Set `NEXT_PUBLIC_PLAYER_URL=https://play.crapmedia.com` on the **web** project, then redeploy.

## Monorepo layout

```
apps/web          → crapmedia.com
apps/player       → play.crapmedia.com (PWA)
packages/ui       → themes, ThemeProvider, shared UI
packages/brand    → logo assets
legacy/           → PHP connector reference
```
