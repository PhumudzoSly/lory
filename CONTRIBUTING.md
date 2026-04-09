# Contributing to Lory

Thanks for your interest in improving Lory.

## Ground Rules

- Be respectful in discussions and reviews.
- Keep pull requests focused and small when possible.
- Write clear commit messages that explain intent.
- Add or update tests for behavior changes.

## Local Setup

Prerequisites:

- Node.js 20+
- pnpm 9+
- Rust (stable) and cargo
- Tauri prerequisites for your OS

Install dependencies:

```bash
pnpm install
```

Run the web UI:

```bash
pnpm dev
```

Run the desktop app:

```bash
pnpm tauri dev
```

## Quality Checks

Before opening a PR, run:

```bash
pnpm lint
pnpm test
pnpm build
```

## Pull Request Process

1. Create a feature branch from `main`.
2. Implement your change.
3. Run quality checks locally.
4. Open a PR with:
   - Problem statement
   - What changed
   - How you validated it

## Reporting Issues

Please include:

- OS and app version
- Reproduction steps
- Expected behavior
- Actual behavior
- Logs or screenshots where useful
