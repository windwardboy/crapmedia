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

## Player routes

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/playlists` | List & create playlists |
| `/playlists/[id]` | Edit playlist |
| `/drive` | Driving mode |
| `/settings` | Account & appearance |

## Supabase database

After creating the Supabase project, run the SQL in [`supabase/migrations/001_playlists.sql`](../supabase/migrations/001_playlists.sql) via **SQL Editor** in the dashboard (creates `playlists` + `playlist_tracks` with RLS).

For **Continue listening** on the home screen, also run [`supabase/migrations/002_last_played_at.sql`](../supabase/migrations/002_last_played_at.sql).

## YouTube (player only)

1. In [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Library** → enable **YouTube Data API v3**.
2. **Credentials → Create credentials → API key** (restrict to YouTube Data API v3 if you like).
3. Add `YOUTUBE_API_KEY` to the **player** Vercel project (and `apps/player/.env.local` for dev). **Do not** use `NEXT_PUBLIC_` — keep it server-side only.
4. Redeploy the player after adding the key.

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
