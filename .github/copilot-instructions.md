# GitHub Copilot instructions

The canonical, full instructions live in **[AGENTS.md](../AGENTS.md)** (and the
per-package `packages/*/AGENTS.md`). Read it. The essentials are inlined below
because Copilot does not follow links automatically.

## Project

pnpm-workspace monorepo publishing six registry-agnostic `@chatool/*` packages
(`styles`, `utils`, `ui`, `icons`, `api`, `core`) for React apps. Stack: pnpm + tsdown
(ESM+CJS+dts) + Changesets + TypeScript 5 + React 19 + Tailwind v4.

## Commands

`pnpm install` · `pnpm build` · `pnpm dev` · `pnpm typecheck` · `pnpm lint` ·
`pnpm changeset`. Run `pnpm build && pnpm typecheck && pnpm lint` before finishing.

## Hard rules

- **tsdown preserves `"use client"`/`"use server"` natively**, but only at the
  top of an entry's own source. Re-export-only barrels (e.g.
  `packages/utils/src/hooks/index.ts`) carry `"use client";` explicitly — keep it.
- **`@chatool/api` is framework-agnostic**: no `process.env`, no `"use server"`,
  no framework imports; `baseURL` is always injected.
- Client hooks/components keep `"use client"`; pure modules (`cn`, icons, the api
  client) must not have it.
- Every package is `"type": "module"`; keep `exports` maps + `tsdown` entries in
  sync (ESM `.mjs`/`.d.mts` + CJS `.cjs`/`.d.cts`) when adding subpaths.
- **`@chatool/ui` and `@chatool/icons` are subpath-only (no root barrel).**
  Import `@chatool/ui/button` (its `default` is `Button`) and
  `@chatool/icons/<IconName>` — never `@chatool/ui` / `@chatool/icons`.
- peer vs dep: react/react-dom/tailwindcss are `peerDependencies`.
- Registry-agnostic: never hardcode a registry.
- Every functional change needs a Changeset (`pnpm changeset`).
- **Each package ships its own docs.** `packages/<pkg>/README.md` is the single
  canonical, self-contained per-package reference (no `../../docs` links — they
  break in `node_modules`); npm ships it. Each package also ships a **generated**
  `llms.txt` (in `files`) — never hand-edit it; run `pnpm gen:llms` (it also runs on
  `pnpm build` and at publish via `prepack`). `docs/packages/<pkg>.md` is a pointer.
- **Keep docs + shims in sync** with every change — this file, `docs/`, and
  `packages/*/AGENTS.md` must match the code (see the sync map in `AGENTS.md`; the
  `/sync-docs` skill automates it).
