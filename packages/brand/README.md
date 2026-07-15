# CrapMedia brand assets

## Source files (you maintain these)

| File | Background | Typical size | Purpose |
|------|------------|--------------|---------|
| **`poop.png`** | Transparent | 1024×1024 PNG | Primary logo — UI, favicons, PWA 192px |
| **`icon-solid.png`** | Black (or solid) | 1024×1024+ PNG | Optional — PWA 512px maskable icon |

Place both files in **`packages/brand/`** only. Do not drop icons directly into `apps/*/public/` — they get overwritten by sync.

## Sync to both apps

```bash
pnpm sync:brand
```

Generates resized outputs for **player** and **web**:

| Output | Source | Size |
|--------|--------|------|
| `public/icon.png` | `poop.png` | 192×192 |
| `public/icon-512.png` | `icon-solid.png` (fallback: `poop.png`) | 512×512 |
| `public/favicon.png` | `poop.png` | 48×48 |
| `app/icon.png` | `poop.png` | 512×512 |
| `app/apple-icon.png` | `poop.png` | 180×180 |
| `app/favicon.ico` | `poop.png` | 16 / 32 / 48 multi-size |

Commit the source files in `packages/brand/` and the generated files under each app after syncing.

## Other files

| File | Purpose |
|------|---------|
| `visualizer.gif` | Legacy driving visualizer reference |
| `favicon.png` / `favicon-site.png` | Old StackCP export — **not** used |
