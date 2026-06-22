# karnameh-kit

A pnpm-workspace monorepo publishing five reusable, **registry-agnostic**
`@karnameh/*` packages for React apps. Consumers can be a **Next.js App Router**
app, a **Next.js Pages Router** app, or a **Vite SPA**.

| Package | What it is | Key deps | Peers |
| --- | --- | --- | --- |
| [`@karnameh/styles`](packages/styles) | CSS-only Tailwind v4 theme + shadcn token layer | — | `tailwindcss` |
| [`@karnameh/utils`](packages/utils) | `cn` + hooks (`useBoolean`, `useDelayVisibility`, `endPointUrlNormalizer`) | `clsx`, `tailwind-merge` | `react` |
| [`@karnameh/ui`](packages/ui) | shadcn UI components | `@karnameh/utils`, `@karnameh/icons`, `radix-ui`, `class-variance-authority` | `react`, `react-dom` |
| [`@karnameh/icons`](packages/icons) | SVGR-generated React SVG icons | — | `react` |
| [`@karnameh/api`](packages/api) | framework-agnostic axios client + typed services | `axios` | — |

Tooling: **pnpm workspaces**, **tsdown** (Rolldown + Oxc — ESM + CJS + `.d.ts`,
with native `"use client"` / `"use server"` directive preservation),
**Changesets**, **TypeScript 5**, **React 19**, **Tailwind CSS v4**.

> **Registry-agnostic by design.** No registry is hardcoded anywhere. Each
> package declares `publishConfig.access` only; you wire the registry through a
> `.npmrc` later — see [`.npmrc.example`](.npmrc.example) and the
> [Publishing guide](docs/guides/publishing.md).

---

## Documentation

The full, canonical documentation lives in **[`docs/`](docs/README.md)**. Quick
links:

- **[Getting started](docs/getting-started.md)** — prerequisites, install, commands.
- **[Architecture](docs/architecture.md)** & **[Build & tooling](docs/build-and-tooling.md)** — monorepo, dual ESM/CJS, the directive-preserving build.
- **[Conventions](docs/conventions.md)** — coding/exports/`"use client"`/peer-vs-dep rules.
- **Packages:** [styles](docs/packages/styles.md) · [utils](docs/packages/utils.md) · [ui](docs/packages/ui.md) · [icons](docs/packages/icons.md) · [api](docs/packages/api.md)
- **Guides:** [Local development](docs/guides/local-development.md) · [Publishing](docs/guides/publishing.md) · [Contributing](docs/guides/contributing.md)
- **Consuming per framework:** [App Router](docs/guides/consuming/nextjs-app-router.md) · [Pages Router](docs/guides/consuming/nextjs-pages-router.md) · [Vite](docs/guides/consuming/vite.md)

## Repository layout

```
karnameh-kit/
├─ pnpm-workspace.yaml        # packages/*
├─ package.json              # root scripts: build / lint / typecheck / release
├─ tsconfig.json             # base config every package extends
├─ tsdown.preset.ts          # shared tsdown config (native directive preservation)
├─ eslint.config.mjs         # shared flat ESLint config
├─ .changeset/               # Changesets config
├─ .npmrc.example            # documented registry step (copy to .npmrc later)
├─ AGENTS.md                 # canonical AI-agent instructions (see below)
├─ docs/                     # canonical human documentation
└─ packages/
   ├─ styles/   @karnameh/styles
   ├─ utils/    @karnameh/utils
   ├─ ui/       @karnameh/ui
   ├─ icons/    @karnameh/icons
   └─ api/      @karnameh/api
```

## Develop in this repo

```bash
pnpm install        # install all workspace deps
pnpm build          # build every package (dist/ + .d.ts)
pnpm dev            # tsdown --watch across packages
pnpm typecheck      # tsc --noEmit per package
pnpm lint           # eslint .
```

Details: [Getting started](docs/getting-started.md) ·
[Build & tooling](docs/build-and-tooling.md) (how tsdown preserves `"use client"`
and why re-export barrels carry the directive explicitly).

## Using the packages in an app

```bash
pnpm add @karnameh/styles @karnameh/utils @karnameh/ui @karnameh/icons @karnameh/api
pnpm add -D tailwindcss        # peer of @karnameh/styles
```

Import the design tokens once in your global CSS (Tailwind first):

```css
@import "tailwindcss";
@import "@karnameh/styles/styles.css";
```

Then follow your framework's guide — the only real difference is **where you call
`@karnameh/api` and where `baseURL` comes from**:

- [Next.js App Router](docs/guides/consuming/nextjs-app-router.md) — RSC / server action, `process.env`
- [Next.js Pages Router](docs/guides/consuming/nextjs-pages-router.md) — `getServerSideProps` / API route, `process.env`
- [Vite SPA](docs/guides/consuming/vite.md) — client-side, `import.meta.env`

Per-package usage and full export lists: [docs/packages](docs/packages/README.md).

## Develop locally against another repo (before publishing)

Use `pnpm link`, a `link:` dependency, or `pnpm pack` to iterate from a consuming
app without publishing. Full steps: [Local development](docs/guides/local-development.md).

## Publishing

Registry-agnostic, managed with Changesets: pick a registry + `.npmrc`, then
`pnpm changeset` → `pnpm version-packages` → `pnpm release`. Full steps:
[Publishing](docs/guides/publishing.md).

## AI agents (Claude, Cursor, Gemini, Copilot, …)

This repo carries instructions for AI coding tools. **[`AGENTS.md`](AGENTS.md)**
is the single source of truth; every tool-specific file is a thin pointer to it,
so all tools share the same rules with no drift:

| Tool | File |
| --- | --- |
| Claude Code | [`CLAUDE.md`](CLAUDE.md) (`@AGENTS.md` import) + per-package `AGENTS.md` |
| Cursor | [`.cursor/rules/karnameh.mdc`](.cursor/rules/karnameh.mdc) (+ native `AGENTS.md`) |
| GitHub Copilot | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) |
| Gemini | [`GEMINI.md`](GEMINI.md) |
| Codex / Zed / Windsurf / others | [`AGENTS.md`](AGENTS.md) (read natively) |

Each package also has a scoped `packages/*/AGENTS.md`. How it's wired:
[docs/ai-agents.md](docs/ai-agents.md).
