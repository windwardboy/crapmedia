# Theming & skins

CrapMedia supports **skins** — swappable visual themes for the player (and optionally the marketing site). Skins are a first-class extension point for contributors.

## Bundled skins (ship together)

Two official skins are **bundled from Phase 1**:

| Skin | ID | Background | Vibe |
|------|-----|------------|------|
| **Charcoal** ⭐ default | `charcoal` | `#242628` cool slate | Crisp, daylight / OLED mounts |
| **Stone** | `stone` | `#2A2826` warm grey-brown | Cozy, long audiobook sessions |

Shared accent on both: **`#00B87A`** · hover **`#00CF8C`**

Preview locally: `packages/ui/themes/charcoal/preview.html` (side-by-side driving UI mock).

Registry: `packages/ui/themes/manifest.json` lists bundled skin IDs for `ThemeProvider`.

---

## Token contract

All skins define the same CSS custom properties. Components use `var(--cm-*)` only — never hard-code hex values.

| Token | Charcoal | Stone |
|-------|----------|-------|
| `--cm-bg` | `#242628` | `#2A2826` |
| `--cm-bg-elevated` | `#2E3136` | `#353230` |
| `--cm-bg-subtle` | `#1A1C1E` | `#201E1C` |
| `--cm-accent` | `#00B87A` | `#00B87A` |
| `--cm-accent-hover` | `#00CF8C` | `#00CF8C` |
| `--cm-accent-muted` | `rgb(0 184 122 / 0.18)` | same |
| `--cm-accent-on` | `#FFFFFF` | `#FFFFFF` |
| `--cm-text` | `#ECEEEF` | `#ECEAE8` |
| `--cm-text-muted` | `#9CA3AF` | `#A8A29E` |
| `--cm-border` | `#3A3F44` | `#454240` |
| `--cm-danger` | `#EF5F5F` | `#EF5F5F` |
| `--cm-focus-ring` | `rgb(0 184 122 / 0.45)` | same |

Driving mode uses the **same skin tokens** with layout overrides (larger type, bigger hit targets).

---

## Architecture

```
packages/ui/
├── themes/
│   ├── manifest.json       # bundled skin registry
│   ├── charcoal/           # default
│   ├── stone/              # warm bundled skin
│   └── README.md
├── components/             # var(--cm-accent) only
└── ThemeProvider.tsx       # load skin CSS, persist choice
```

### Skin metadata (`theme.json`)

Each skin folder includes `theme.css` + `theme.json` (id, name, description, author, version, default flag).

### Runtime behaviour

1. **Default:** `charcoal` on first visit.
2. **User preference:** `localStorage` key `cm-theme` (sync to Supabase profile later).
3. **Settings → Appearance:** picker with Charcoal + Stone previews.
4. **Driving mode:** respects active skin.

---

## Authoring a new skin (contributors)

1. Copy `packages/ui/themes/charcoal/` → `packages/ui/themes/<your-id>/`.
2. Override all `--cm-*` tokens in `theme.css`.
3. Add `theme.json` + preview screenshot (390×844).
4. PR — maintainer adds id to `manifest.json` if accepted for bundling, or document as optional/community.

See [`CONTRIBUTING.md`](../CONTRIBUTING.md) and [`packages/ui/themes/README.md`](../packages/ui/themes/README.md).

### Skin review guidelines

- Readable in **direct sunlight** (driving)
- Accent contrast ≥ WCAG AA on `--cm-bg` for buttons
- No heavy animations in driving mode
- System font stack or self-hosted fonts only

---

## Marketing site (`crapmedia.com`)

Uses Charcoal tokens by default. Stone optional on marketing site later.

---

## Phase roadmap

| Phase | Theming work |
|-------|----------------|
| **0** | Token contract, `ThemeProvider`, Charcoal + Stone CSS |
| **1** | Skin picker (both bundled skins) |
| **4+** | Community skins via PR; optional Midnight, Road, etc. |

---

## Future skin ideas (not bundled yet)

- **Midnight** — deeper black, purple accent
- **Road** — high-contrast amber on black (daytime mount)
- **Tape Deck** — retro skeuomorphic
- **Minimal Light** — light mode for glare
- Seasonal / easter-egg skins (opt-in)

Community skins: bundled in-repo (MIT) or listed in docs if external.
