# Legacy PHP music player

Reference copy of the original CrapMedia music player (StackCP / shared hosting).

**Do not deploy from this folder as-is.** It will be reworked into the standalone **HTTP connector** documented in Phase 2 of [`../BUILD_PLAN.md`](../BUILD_PLAN.md).

## What's here

| Path | Purpose |
|------|---------|
| `music-player/*.php` | Auth, API, UI shell |
| `music-player/api.php` | `scan_music`, playlist CRUD — connector prototype |
| `music-player/playlists/*.json` | Sample playlist exports for migration tests |
| `music-player/js/player.js` | Original client logic (reference only) |

## Not included

- `music/` — ~1.7 GB of MP3s (remain on live hosting only)
- Credentials — `config.php` uses placeholders
