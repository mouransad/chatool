# Chatool — Documentation

> **You are here:** [Repo README](../README.md) → **Docs**

The canonical, in-depth documentation for the `chatool` monorepo. The root
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
  - [@chatool/utils](packages/utils.md)
  - [@chatool/ui](packages/ui.md)
  - [@chatool/icons](packages/icons.md)
  - [@chatool/api](packages/api.md)
  - [@chatool/core](packages/core.md)

## Guides

- [Guides index](guides/README.md)
  - [Local development](guides/local-development.md)
  - [Publishing](guides/publishing.md)
  - [Contributing](guides/contributing.md)
  - [Storybook](guides/storybook.md)
  - [Consuming the packages](guides/consuming/README.md)
    - [Next.js App Router](guides/consuming/nextjs-app-router.md)
    - [Next.js Pages Router](guides/consuming/nextjs-pages-router.md)
    - [Vite SPA](guides/consuming/vite.md)
