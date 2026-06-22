# Karnameh Kit — Documentation

> **You are here:** [Repo README](../README.md) → **Docs**

The canonical, in-depth documentation for the `karnameh-kit` monorepo. The root
[README](../README.md) is a short overview; everything detailed lives here.

## Start here

- [Getting started](getting-started.md) — prerequisites, install, first build.

## Concepts

- [Architecture](architecture.md) — monorepo layout, workspace graph, dual
  ESM/CJS output.
  - [Build & tooling](build-and-tooling.md) — tsdown preset, native directive
    preservation, ESLint, base tsconfig.
- [Conventions](conventions.md) — coding, exports, `"use client"`, peer-vs-dep,
  Changesets.
- [AI agents](ai-agents.md) — how `AGENTS.md` + the per-tool shims are wired.

## Packages

- [Packages index](packages/README.md)
  - [@karnameh/styles](packages/styles.md)
  - [@karnameh/utils](packages/utils.md)
  - [@karnameh/ui](packages/ui.md)
  - [@karnameh/icons](packages/icons.md)
  - [@karnameh/api](packages/api.md)

## Guides

- [Guides index](guides/README.md)
  - [Local development](guides/local-development.md)
  - [Publishing](guides/publishing.md)
  - [Contributing](guides/contributing.md)
  - [Consuming the packages](guides/consuming/README.md)
    - [Next.js App Router](guides/consuming/nextjs-app-router.md)
    - [Next.js Pages Router](guides/consuming/nextjs-pages-router.md)
    - [Vite SPA](guides/consuming/vite.md)
