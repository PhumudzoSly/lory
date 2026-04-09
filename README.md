# Lory

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![CI](https://github.com/PhumudzoSly/lory/actions/workflows/ci.yml/badge.svg)

Lory is a desktop wellbeing companion that helps you balance focused work with healthy breaks.

Built with Tauri, React, TypeScript, and Vite.

## Highlights

- Focused work reminders
- Break scheduling and wellbeing prompts
- Customizable companion character and behavior
- Lightweight desktop app with native packaging

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- Desktop runtime: Tauri 2 + Rust
- Package manager: pnpm
- Quality: ESLint + Vitest + TypeScript checks

## Prerequisites

- Node.js 20+
- pnpm 8+
- Rust (stable) and Cargo
- Tauri system prerequisites for your OS:
  - https://v2.tauri.app/start/prerequisites/

## Quick Start

```bash
pnpm install
pnpm dev
```

Run the desktop app in development mode:

```bash
pnpm tauri dev
```

## Quality Gates

```bash
pnpm lint
pnpm test
pnpm build
```

Run all checks in one command:

```bash
pnpm check
```

## Production Build

Build web assets:

```bash
pnpm build
```

Build native installers:

```bash
pnpm tauri build
```

## Branding Assets

Generate SVG branding assets:

```bash
pnpm assets:svg
```

Generate Tauri bundle icons from SVG:

```bash
pnpm icons:generate
```

Generated outputs include:

- `src-tauri/icons/icon.svg`
- `public/favicon.svg`
- `public/brand/buddy-idle.svg`
- `public/brand/buddy-happy.svg`
- `public/brand/buddy-sleeping.svg`
- `public/brand/lory-wordmark.svg`

## CI and Dependency Hygiene

- GitHub Actions CI runs lint, test, and build on pushes and pull requests.
- Dependabot is configured for weekly updates to npm dependencies and GitHub Actions.

## Contributing

Contributions are welcome. Please read:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`

Before opening a PR:

1. Create a focused branch from `main`.
2. Run `pnpm check`.
3. Fill in the PR template with validation notes.

## Security

If you discover a vulnerability, please report it privately as described in `SECURITY.md`.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
