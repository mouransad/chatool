# Getting started

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **Getting started**

## Prerequisites

- **Node** ≥ 20
- **pnpm** ≥ 9 (this repo pins `pnpm@10.10.0` via `packageManager`)

```bash
corepack enable   # makes the pinned pnpm available, if you don't have it
```

## Install

```bash
pnpm install
```

No install-time build scripts need approval — tsdown/Rolldown ship prebuilt
native binaries.

## Everyday commands

| Command | What it does |
| --- | --- |
| `pnpm build` | Build every package to `dist/` (ESM + CJS + `.d.ts`). |
| `pnpm dev` | `tsdown --watch` across all packages. |
| `pnpm typecheck` | `tsc --noEmit` per package. |
| `pnpm lint` | `eslint .` over the workspace. |
| `pnpm changeset` | Record a release note (see [Publishing](guides/publishing.md)). |

Run `pnpm build && pnpm typecheck && pnpm lint` before considering a change done.

## What to read next

- [Architecture](architecture.md) — how the monorepo and build fit together.
- [Conventions](conventions.md) — the rules to follow when changing code.
- [Consuming the packages](guides/consuming/README.md) — wiring them into an app.

---

Up: [Docs](README.md) · [Repo README](../README.md)
