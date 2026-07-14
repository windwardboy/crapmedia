# Contributing to CrapMedia

Thanks for your interest — contributions welcome.

## Ways to help

| Area | Good first contribution |
|------|---------------------------|
| **Skins / themes** | New colour skin — see [`docs/THEMING.md`](docs/THEMING.md) |
| **Connectors** | HTTP, Subsonic, cloud library sources — see `docs/connector-spec.md` (Phase 2) |
| **Player UX** | Driving mode, accessibility, keyboard shortcuts |
| **Docs** | Fix typos, improve setup guides |
| **Bugs** | Repro steps + PR welcome |

## Before you start

1. Read [`BUILD_PLAN.md`](BUILD_PLAN.md) for project direction and phase scope.
2. Open an issue for large changes (new connector type, breaking API) — quick fixes can go straight to PR.
3. Keep PRs focused; match existing code style when scaffolding exists.

## Skins

The player ships with two built-in skins — **Charcoal** and **Stone**. Copy either as a starting point.

1. Fork the repo.
2. Add a folder under `packages/ui/themes/<your-skin-id>/`.
3. Include `theme.css`, `theme.json`, and a preview screenshot.
4. PR with screenshots (normal + driving mode if layout differs).

## Connectors

Library connectors live in `packages/connectors/`. Each implements the interface in the build plan. PHP self-hosters can use the legacy reference in `legacy/music-player/`.

## Code of conduct

Be respectful. This is a free community project — no tolerance for harassment.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
