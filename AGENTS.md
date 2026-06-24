# AGENTS.md

Canonical instructions for **any** AI coding agent working in this repo (Claude
Code, Cursor, Gemini, GitHub Copilot, Codex, Windsurf, …). Tool-specific files
(`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`,
`.cursor/rules/*.mdc`) are thin pointers to this file — **edit rules here, not
there.** See [docs/ai-agents.md](docs/ai-agents.md) for how the wiring works.

> Monorepo scoping: each package also has its own `packages/*/AGENTS.md` with
> rules that apply only inside that package. The nearest `AGENTS.md` wins.

---

## What this repo is

A pnpm-workspace monorepo publishing five **registry-agnostic** `@chatool/*`
packages for React apps (Next.js App Router, Next.js Pages Router, Vite SPA).

| Package | Role | Peers |
| --- | --- | --- |
| `@chatool/styles` | CSS-only Tailwind v4 theme + shadcn tokens | `tailwindcss` |
| `@chatool/utils` | `cn` + hooks | `react` |
| `@chatool/ui` | shadcn components | `react`, `react-dom` |
| `@chatool/icons` | SVGR-generated React SVG icons | `react` |
| `@chatool/api` | framework-agnostic axios client + services | — |

Stack: pnpm workspaces, tsdown (ESM+CJS+`.d.ts`), Changesets, TypeScript 5,
React 19, Tailwind CSS v4.

## Commands

```bash
pnpm install      # install workspace deps
pnpm build        # build every package (dist/ + .d.ts)
pnpm dev          # tsdown --watch across packages
pnpm typecheck    # tsc --noEmit per package
pnpm lint         # eslint .
pnpm changeset    # record a release note (required for functional changes)
```

Always run `pnpm build && pnpm typecheck && pnpm lint` before declaring work
done.

## Hard rules (do not violate)

1. **Re-export-only barrels need an explicit directive.** tsdown
   ([tsdown.preset.ts](tsdown.preset.ts)) preserves `"use client"` /
   `"use server"` natively, but **only** when the directive is at the top of the
   entry's own source. A barrel that just `export *` does not inherit it — so
   `packages/utils/src/hooks/index.ts` carries `"use client";` at the top. Keep
   it there; add it to any new client barrel.
   See [docs/build-and-tooling.md](docs/build-and-tooling.md).
2. **`@chatool/api` stays framework-agnostic.** No `process.env`, no
   `"use server"`, no framework imports. `baseURL` is always **injected** by the
   caller (`createHttpClient` / `createServices`).
3. **Directives are intentional.** Client hooks and client UI components start
   with `"use client"`. Pure modules (`cn`, icons, the api client) must **not**
   have it. Don't add or remove a directive without understanding the boundary.
4. **Keep `exports` maps in sync.** When you add a component/hook/service subpath,
   add a matching `exports` entry (ESM `.mjs`/`.d.mts` + CJS `.cjs`/`.d.cts`) and
   a `tsdown` entry. Every package is `"type": "module"`.
4b. **Subpath-only, no root barrels for `@chatool/ui` and `@chatool/icons`.**
   Neither package exposes a `.` export — every symbol is reachable from exactly
   one path so the IDE auto-imports the subpath, not a root barrel. `@chatool/ui`
   ships one subpath per component (`./button`, `./dropdown-menu`, …, each with
   `default` + named exports); `@chatool/icons` uses a single `./*` wildcard
   export mapping `@chatool/icons/<IconName>` → `dist/<IconName>` (default
   export). Don't re-add a `.` export or a published root barrel to either.
5. **peer vs dep:** runtime libraries the app already owns (react, react-dom,
   tailwindcss) are `peerDependencies`; everything bundled-against is a `dependency`.
6. **Registry-agnostic.** Never hardcode a registry. Publish config lives in
   `publishConfig` + a local `.npmrc` (see [.npmrc.example](.npmrc.example)).
7. **Every functional change needs a Changeset** (`pnpm changeset`).
8. **Docs, shims & changesets stay in sync — it's part of "done".** A change
   isn't finished until the docs and per-tool shims it affects are updated (plus a
   Changeset for functional changes). This repo's whole premise is *no drift*
   (see [docs/ai-agents.md](docs/ai-agents.md)). Use the **sync map** below; when
   in doubt run the [`/sync-docs`](.claude/skills/sync-docs/SKILL.md) skill, which
   audits and fixes drift end-to-end. Edit canonical files, **never** regenerate
   a shim by hand beyond the inlined rules.

### Sync map

| When you change… | Also update… |
| --- | --- |
| A hard rule / command / the package list/count in this file | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) (it **inlines** rules + the package count), and [docs/conventions.md](docs/conventions.md) if it's a coding convention |
| A package's `exports` / subpaths / `tsdown` entries / directives | that package's `packages/*/AGENTS.md`, [docs/packages/](docs/packages/)`<pkg>.md` (Exports + Usage), and [docs/guides/contributing.md](docs/guides/contributing.md) / [docs/conventions.md](docs/conventions.md) if the add-subpath flow changed |
| Add or remove a package | the table in [What this repo is](#what-this-repo-is) (+ its "five packages" count), root [README.md](README.md), [docs/README.md](docs/README.md) + [docs/packages/README.md](docs/packages/README.md) lists, and the count in the Copilot shim |
| Add or remove an AI-tool shim | the table in [docs/ai-agents.md](docs/ai-agents.md) |
| Any functional (non-doc) change | add a Changeset (`pnpm changeset`) |

## Conventions

Full coding/exports/naming conventions: [docs/conventions.md](docs/conventions.md).
Architecture & build internals: [docs/architecture.md](docs/architecture.md) →
[docs/build-and-tooling.md](docs/build-and-tooling.md).

## Documentation map

- Human docs (canonical): [docs/README.md](docs/README.md)
- Per-package deep dives: [docs/packages/README.md](docs/packages/README.md)
- Guides (local dev, publishing, per-framework): [docs/guides/README.md](docs/guides/README.md)
- Per-package agent rules: [packages/styles/AGENTS.md](packages/styles/AGENTS.md) ·
  [packages/utils/AGENTS.md](packages/utils/AGENTS.md) ·
  [packages/ui/AGENTS.md](packages/ui/AGENTS.md) ·
  [packages/icons/AGENTS.md](packages/icons/AGENTS.md) ·
  [packages/api/AGENTS.md](packages/api/AGENTS.md)
