# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Branding Assets (SVG)

This project includes an SVG asset generator for buddy faces and publishing assets.

- Generate SVG assets:
  - `pnpm assets:svg`
- Generate platform bundle icons for Tauri (`.ico`, `.icns`, and PNG sizes) from SVG:
  - `pnpm icons:generate`

Generated outputs:

- `src-tauri/icons/icon.svg` (source icon)
- `public/favicon.svg`
- `public/brand/buddy-idle.svg`
- `public/brand/buddy-happy.svg`
- `public/brand/buddy-sleeping.svg`
- `public/brand/lory-wordmark.svg`

Recommended release flow:

1. Run `pnpm icons:generate`.
2. Run `pnpm build`.
3. Run `pnpm tauri build`.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
