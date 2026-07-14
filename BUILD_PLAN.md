# CrapMedia — Build Plan

> **Vision:** A free, low-maintenance player focused on *what you choose to play* — YouTube streams, personal MP3 libraries, and driving-friendly controls. Donation-supported, not subscription-heavy.
>
> **Domains:** `crapmedia.com` (home) · `play.crapmedia.com` (player app)  
> **Player delivery:** Progressive Web App (PWA) — installable on mounted phone, home-screen icon from `packages/brand/`  
> **Open source:** [MIT License](LICENSE) — contributions welcome ([CONTRIBUTING.md](CONTRIBUTING.md))  
> **Default skin:** **Charcoal** + bundled **Stone** — accent `#00B87A`; community skins later
>
> **Out of scope:** Linkstack (removed), central media hosting, music licensing

---

## 1. Product summary

### Problem
- YouTube’s UI is poor for long-form listening (audiobooks) and dangerous to fix while driving.
- Existing music apps charge heavily and host media themselves.
- Personal MP3 libraries live everywhere (shared hosting, cloud, self-hosted servers).

### Solution
- **play.crapmedia.com** — minimal player UI, playlists, driving mode.
- Stream from **YouTube** (video IDs, no file hosting).
- Connect **remote libraries** via pluggable connectors (HTTP/PHP first, Subsonic/cloud later).
- **crapmedia.com** — simple marketing home, link to player, donate.

### Principles
| Principle | Implication |
|-----------|-------------|
| Don’t host media | Connectors + YouTube only |
| Low maintenance cost | Vercel + Supabase free tiers, aggressive caching |
| Free core features | Donations optional, no paywall on playback |
| Driving-first UX | Large controls, wake lock, optional voice |
| Extensible from day one | Unified `Track` model, connector interface |
| Open & themeable | MIT license; swappable **skins** via CSS tokens ([`docs/THEMING.md`](docs/THEMING.md)) |
| Community-friendly | CONTRIBUTING.md; skins & connectors as entry points for contributors |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         crapmedia.com                           │
│              Marketing · About · Donate · → Open Player         │
│                      (Next.js · Vercel)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      play.crapmedia.com                         │
│         Player · Playlists · Driving mode · Library sources     │
│                      (Next.js · Vercel)                         │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
               ▼                              ▼
        ┌─────────────┐              ┌───────────────────┐
        │  Supabase   │              │  External media   │
        │  Auth + DB  │              │  (never on Vercel)│
        └─────────────┘              └───────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              YouTube CDN            User shared hosting          Subsonic / cloud
              (IFrame API)           (HTTP connector)             (later phases)
```

### Repo structure (monorepo)

```
crapmedia/
├── apps/
│   ├── web/                    # crapmedia.com
│   └── player/                 # play.crapmedia.com
├── packages/
│   ├── ui/                     # Components, ThemeProvider, skins
│   │   └── themes/
│   │       ├── charcoal/       # Default — cool slate
│   │       ├── stone/          # Bundled — warm charcoal
│   │       └── manifest.json   # Bundled skin registry
│   ├── brand/                  # Logo, PWA icons
│   ├── db/                     # Schema, types, Drizzle/Prisma client
│   └── connectors/             # youtube | http-api | subsonic | ...
├── docs/
│   ├── THEMING.md              # Skin system & contributor guide
│   └── connector-spec.md       # HTTP connector API for self-hosters
├── CONTRIBUTING.md
├── LICENSE                     # MIT
├── BUILD_PLAN.md
├── turbo.json
└── package.json
```

### Vercel projects
| Project | Root | Domain |
|---------|------|--------|
| `crapmedia-web` | `apps/web` | `crapmedia.com`, `www` → redirect |
| `crapmedia-player` | `apps/player` | `play.crapmedia.com` |

### Core data model

```typescript
// Conceptual — implement in packages/db

User {
  id, email, name, avatarUrl?, createdAt
}

LibrarySource {
  id, userId, type,           // 'youtube' | 'http_api' | 'subsonic' | ...
  name, configEncrypted,      // URLs, tokens — encrypt at rest
  lastSyncedAt?, isDefault?
}

Playlist {
  id, userId, name, description?,
  isDrivingDefault?, sortOrder, createdAt, updatedAt
}

PlaylistTrack {
  id, playlistId, position,
  sourceType,                 // 'youtube' | 'remote'
  sourceRef,                  // JSON: { videoId } | { sourceId, path } | { url }
  title, artist?, durationSec?, thumbnailUrl?,
  lastPositionSec?            // resume audiobooks
}
```

### Connector interface (`packages/connectors`)

Every library source implements:

| Method | Purpose |
|--------|---------|
| `validateConfig()` | Test connection on “Add library” |
| `listTracks(cursor?)` | Browse / sync library |
| `getStreamUrl(trackRef)` | URL for `<audio>` (not proxied) |
| `search?(query)` | Optional search |

**MVP connectors:** `youtube` (metadata + iframe), `http_api` (PHP connector).

---

## 3. Build phases

### Phase 0 — Foundation (Week 1)
**Goal:** Repo, deploy pipeline, empty shells live on domains.

- [x] Create monorepo (Turborepo + pnpm)
- [x] Scaffold `apps/web` and `apps/player` (Next.js 15, App Router, TypeScript)
- [x] Shared `packages/ui` — **Charcoal + Stone** themes, `ThemeProvider`, `manifest.json`
- [ ] Supabase project: auth (Google OAuth), Postgres
- [ ] Vercel: two projects, env vars, DNS for `play.crapmedia.com`
- [x] `apps/web`: placeholder landing — logo, tagline, “Open Player”, donate link stub
- [x] `apps/player`: shell — home, `/drive`, `/settings`, PWA manifest, skin picker

**Exit criteria:** Both URLs resolve over HTTPS; Google sign-in works on player.

---

### Phase 1 — MVP Player (Weeks 2–4)
**Goal:** YouTube playlists + driving mode. Usable daily in the car (mounted).

#### 1A — Auth & shell
- [ ] Auth.js / Supabase Auth — Google OAuth
- [ ] Player layout: sidebar (desktop) / bottom nav (mobile)
- [ ] Routes: `/`, `/playlists`, `/playlists/[id]`, `/drive`, `/settings`
- [ ] Settings: account, driving defaults, **Appearance → skin picker** (Charcoal + Stone)

#### 1B — YouTube integration
- [ ] YouTube IFrame Player API wrapper (play, pause, seek, next, end events)
- [ ] YouTube Data API: video metadata (title, channel, duration, thumbnail)
- [ ] **Cache metadata in DB** — never re-fetch on every play
- [ ] Add track by URL or video ID
- [ ] Import YouTube playlist URL (one-off fetch, store IDs locally)

#### 1C — Playlists
- [ ] CRUD playlists
- [ ] Reorder tracks (drag or move up/down)
- [ ] Queue: play playlist, skip prev/next
- [ ] **Resume position** per track (`lastPositionSec`)

#### 1D — Driving mode (`/drive`)
- [ ] Full-screen minimal UI: title, artist/channel, queue position
- [ ] Large play / pause / prev / next (min 64px touch targets)
- [ ] **Screen Wake Lock API** while playing
- [ ] Lightweight **CSS wave animation** when playing (no Web Audio)
- [ ] Optional: dim “ambient” styling for night driving
- [ ] Default playlist picker (“Use this playlist in Drive”)

#### 1E — Polish & ship
- [ ] Handle embed-blocked videos gracefully
- [ ] Error states: offline, API quota, deleted video
- [ ] PWA manifest + icons from `packages/brand/` + “Add to Home Screen” for mounted phone
- [ ] Basic rate limiting on API routes

**Exit criteria:** You can import a YT audiobook playlist, drive with mounted phone, resume next day.

---

### Phase 2 — Remote MP3 connector (Weeks 5–7)
**Goal:** Play self-hosted MP3s from shared hosting (your current PHP setup).

#### 2A — HTTP connector spec
- [ ] Document `docs/connector-spec.md`
- [ ] Endpoints: `scan_music`, `get_stream_url`, optional `auth`
- [ ] CORS headers for `play.crapmedia.com`

#### 2B — PHP connector package
- [ ] Refactor existing `music-player` API into standalone **CrapMedia Connector**
- [ ] Deploy on your StackCP as first real library source
- [ ] Passcode / API key support

#### 2C — Player integration
- [ ] “Add library” wizard: URL + credentials → test connection
- [ ] Browse remote library, add tracks to playlists
- [ ] Unified player: switch YouTube iframe ↔ HTML5 `<audio>`
- [ ] Mixed playlists (YT + remote tracks)

#### 2D — Import helpers
- [ ] M3U playlist import (URLs from anywhere)
- [ ] Migrate existing JSON playlists from old player

**Exit criteria:** One playlist mixing YouTube chapters + your hosted MP3s.

---

### Phase 3 — Marketing site & donations (Week 8)
**Goal:** Replace Linkstack-era home with intentional crapmedia.com.

- [ ] `apps/web`: proper landing (what it is, privacy, open source connector link)
- [ ] Donate: Ko-fi / Buy Me a Coffee embed in footer + player settings
- [ ] Privacy policy + terms (minimal — you store playlists, not media)
- [ ] Redirect old `/music-player/` → `play.crapmedia.com` + connector docs
- [ ] Decommission Linkstack; simplify or retire Laravel on StackCP

**Exit criteria:** Single public face; legacy paths documented.

---

### Phase 4 — Quality of life (Weeks 9–12)
**Goal:** Features that make it stick — still free, still cheap.

- [ ] **Voice commands** (Web Speech API): pause, play, next, previous
- [ ] Keyboard shortcuts (desktop)
- [ ] Search across playlists
- [ ] Duplicate track detection
- [ ] Export playlist (JSON / M3U)
- [ ] “Continue listening” on home screen
- [ ] Optional: Subsonic/Navidrome connector (one integration, many servers)

**Exit criteria:** Hands-free basics in driving mode without paid AI.

---

### Phase 5 — Optional AI & cloud connectors (when donations allow)
**Goal:** Nice-to-have, rate-limited, never required.

| Feature | Tech | Budget guard |
|---------|------|--------------|
| “Find on YouTube” from description | Small LLM + YT search | 5 calls/user/day |
| Messy title cleanup | Rules first, LLM fallback | Cache forever |
| Broken video suggestions | YT search on delete | On-demand only |
| Google Drive / Dropbox | OAuth per provider | User’s bandwidth |

- [ ] Feature flag `aiAssistEnabled`
- [ ] Usage counter per user in DB
- [ ] Monitor monthly LLM spend; disable if over donation runway

---

## 4. UI routes (player)

| Route | Phase | Description |
|-------|-------|-------------|
| `/` | 1 | Home — continue listening, playlists, “Drive” CTA |
| `/drive` | 1 | Driving mode (minimal) |
| `/playlists` | 1 | List playlists |
| `/playlists/[id]` | 1 | Edit + play |
| `/playlists/new` | 1 | Create |
| `/library` | 2 | Connected sources |
| `/library/connect` | 2 | Add source wizard |
| `/library/[sourceId]` | 2 | Browse remote library |
| `/settings` | 1 | Account, driving defaults, donate, voice toggle |
| `/import` | 2 | M3U / YT URL import |

---

## 5. Budget & ops

### Target monthly cost (Phase 1–3)
| Item | Budget |
|------|--------|
| Vercel | £0 (hobby) |
| Supabase | £0 (free tier) |
| Domain | ~£1–2/mo (amortized) |
| YouTube API | £0 with caching |
| LLM (Phase 5) | £0 until enabled |
| **Total** | **~£0–5/mo** |

### Scale triggers (plan before hitting limits)
| Signal | Action |
|--------|--------|
| YouTube quota exceeded | User OAuth for imports; increase cache TTL |
| Supabase 500MB DB | Archive old metadata; prune |
| Vercel bandwidth | Review asset sizes; static export where possible |
| Abuse / scraping | Stricter auth, rate limits |

### Donation placement
- Footer on crapmedia.com
- Settings → “Support CrapMedia” on player (no interrupt modals)
- Optional supporter badge (cosmetic)

---

## 6. Brainstorm backlog

> Ideas to evaluate — not committed. Tag when pulling into a phase.

### Driving & safety
- [ ] **Gesture controls** — swipe left/right for skip (large hit areas)
- [ ] **Auto-enter drive mode** when phone connects to car Bluetooth (Web Bluetooth API — limited support, research needed)
- [ ] **Passenger lock** — prevent accidental taps (long-press to unlock)
- [ ] **Speed-aware UI** — hide non-essentials above X km/h (GPS permission tradeoff)

### Playback
- [ ] Sleep timer (“stop after 30 min”)
- [ ] Playback speed (0.75×–2×) — especially for audiobooks; YT iframe support varies
- [ ] Skip silence (audiobooks — hard for YT, easier for MP3)
- [ ] Crossfade between MP3 tracks only
- [ ] Bookmarks / chapters within a long video (manual markers)

### Library & sync
- [ ] **Subsonic** connector — covers Navidrome, Ampache, etc.
- [ ] **WebDAV** connector for Nextcloud
- [ ] **Google Drive / Dropbox / OneDrive** — OAuth folder pick
- [ ] Public playlist sharing (read-only link, no account required to listen?)
- [ ] Playlist templates (“Audiobook”, “Road trip”) 

### Social & community (low priority)
- [ ] Share playlist export link (JSON)
- [ ] “Community connectors” directory — user-submitted server types
- [x] Open-source repo (MIT) + CONTRIBUTING.md

### AI (Phase 5+)
- [ ] Voice: “play playlist X” / “add this video” (Web Speech + local fuzzy match first)
- [ ] LLM: natural language playlist from “12 chapters of Book Title”
- [ ] Auto-detect duplicate chapters across uploads
- [ ] Transcript-based chapter jump (expensive — YT captions API)

### Technical
- [ ] Offline PWA cache for **UI only** (not media)
- [ ] iOS standalone PWA quirks testing
- [ ] E2E tests: Playwright for playlist CRUD + mock player
- [ ] Self-hosted option: Docker compose for whole stack (for paranoid users — not MVP)

### Brand & web
- [ ] crapmedia.com blog / changelog
- [ ] Comparison page: “Not a streaming service — a remote control for your media”
- [ ] PWA icons from `packages/brand/` (poop + headphones)

### Skins & community
- [ ] **Community skin gallery** (third-party skins via PR → `manifest.json`)
- [ ] “Road” high-contrast skin for daytime driving
- [ ] Per-skin driving-mode preview in skin picker
- [ ] GitHub `good first issue` labels for skins & connectors

---

## 7. Open decisions

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Subdomain final name | `play` / `listen` / `player` | **`play.crapmedia.com`** |
| 2 | ORM | Drizzle vs Prisma | **Drizzle** (lighter, SQL-friendly) |
| 3 | Auth | Supabase Auth vs Auth.js | **Supabase Auth** (one vendor with DB) |
| 4 | Mixed playlists in MVP? | Yes / No | **Phase 2** (after remote connector) |
| 5 | Require login to play? | Yes / No | **Yes** for sync; consider read-only public playlists in Phase 4 |
| 6 | Open source? | Full / connector only / closed | **Full repo — MIT** ([LICENSE](LICENSE)) |
| 7 | Legacy Laravel on StackCP | Keep for connector only / retire | **Keep minimal PHP connector**, retire Linkstack/Laravel app |
| 8 | Playback speed in MVP? | Yes / No | **Phase 4** (YT iframe limitations) |

---

## 8. Risks & mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| YouTube blocks embeds | Track won’t play | Show message; optional “open in YouTube” link |
| YouTube API quota | Import breaks | Cache; user OAuth; stored metadata |
| YT changes mobile web rules | Less relevant — mounted foreground | Wake lock; PiP fallback |
| Connector CORS issues | MP3 won’t play | Document `.htaccess`; test without proxy |
| Free tier limits | Downtime / bill shock | Monitoring alerts; scale plan doc |
| Solo maintainer burnout | Stalled project | Small phases; MIT + CONTRIBUTING; skins/connectors as on-ramps |

---

## 9. Success metrics (personal → community)

### Phase 1 (personal)
- [ ] Daily dogfood in car for 2 weeks without reverting to raw YouTube
- [ ] Resume works across sessions
- [ ] Battery acceptable on 1-hour drive

### Phase 2
- [ ] Old PHP library fully accessible via connector
- [ ] Zero media cost on your Vercel bill

### Phase 3+
- [ ] 10+ external users (friends/beta) without support fire drill
- [ ] Donations cover domain + any paid tier
- [ ] At least 1 **external contributor** (skin, connector, or docs PR)

---

## 10. Immediate next steps

1. **Confirm** subdomain: `play.crapmedia.com`
2. **Confirm** stack: Next.js + Supabase + Vercel monorepo
3. **Phase 0 kickoff:** scaffold repo, Supabase, DNS
4. **Parallel:** Draft `connector-spec.md` from existing PHP `api.php` (prep for Phase 2)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-14 | Initial build plan from architecture brainstorming session |
| 2026-07-14 | Workspace cleanup: removed ~2 GB StackCP backup; kept `legacy/`, `packages/brand/`, playlist JSON |
| 2026-07-14 | MIT license, skin system (Charcoal default), CONTRIBUTING + THEMING docs |
| 2026-07-14 | Bundled **Stone** warm skin; Charcoal cool slate refined; `themes/manifest.json` |
| 2026-07-14 | **Phase 0 scaffold:** monorepo, web + player apps, ThemeProvider, driving mode shell |
