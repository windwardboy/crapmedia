# CrapMedia

Work in progress — a free, driving-friendly media player. **Phase 0 scaffold is live locally.**

| Site | URL | Purpose |
|------|-----|---------|
| **Marketing** | [crapmedia.com](https://crapmedia.com) | Home, about, donate |
| **Player** | [play.crapmedia.com](https://play.crapmedia.com) | Playlists, driving mode, library connectors |

## Quick start

```bash
pnpm install
pnpm dev
```

- **Marketing:** http://localhost:3000  
- **Player:** http://localhost:3001 — try `/drive` and `/settings` (skins)

See [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) for build, env, and Vercel deploy notes.

## Status

Phase 0 complete locally: monorepo, Charcoal + Stone themes, PWA manifest, driving mode shell.

Next: **Phase 1** — Supabase auth, YouTube playlists. See [`BUILD_PLAN.md`](BUILD_PLAN.md).

## Repo layout

```
├── apps/
│   ├── web/           # crapmedia.com
│   └── player/        # play.crapmedia.com (PWA)
├── packages/
│   ├── ui/            # Themes, ThemeProvider, WaveBars
│   └── brand/         # Logo & icons (poop + headphones 🎧)
├── legacy/            # Reference PHP player for Phase 2 connector
├── docs/
├── CONTRIBUTING.md
├── LICENSE            # MIT
└── BUILD_PLAN.md
```

## Design

- **Bundled skins:** **Charcoal** (cool slate, default) and **Stone** (warm) — accent `#00B87A` on both
- **More skins:** community contributions — see [`docs/THEMING.md`](docs/THEMING.md)

## Contributing

Contributions welcome — especially **skins**, **connectors**, and driving-mode UX. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE) — free to use, modify, and distribute.
