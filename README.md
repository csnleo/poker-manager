# Poker Manager

Desktop helper for poker players (macOS & Windows), built with Tauri 2, React and TypeScript.

Planned features:

- Range creator (v1 — see [docs/SPEC.md](docs/SPEC.md))
- Poker games analyzer

## Prerequisites

- Node.js 22.12+ (LTS)
- Rust (stable) — see the [Tauri prerequisites](https://tauri.app/start/prerequisites/)

## Commands

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run tauri dev` | Run the app in development mode |
| `npm test` | Run unit tests |
| `npm run dist` | Build the app and copy the executable into `dist/` (gitignored) |

Saved ranges are stored locally in `ranges/` (created automatically, gitignored).

## License

[MIT](LICENSE)
