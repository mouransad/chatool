# chatool

A pnpm-workspace monorepo publishing four reusable, **registry-agnostic**
`@chatool/*` packages for React apps. Consumers can be a **Next.js App Router**
app, a **Next.js Pages Router** app, or a **Vite SPA**.

| Package                            | What it is                                                                   | Key deps                                                                   | Peers                             |
| ---------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------- |
| [`@chatool/utils`](packages/utils) | `cn` + hooks (`useBoolean`, `useDelayVisibility`, `endPointUrlNormalizer`)   | `clsx`, `tailwind-merge`                                                   | `react`                           |
| [`@chatool/ui`](packages/ui)       | Material Design 3 UI components                                              | `@chatool/utils`, `@chatool/icons`, `radix-ui`, `class-variance-authority` | `react`, `react-dom`              |
| [`@chatool/icons`](packages/icons) | SVGR-generated React SVG icons                                               | —                                                                          | `react`                           |
| [`@chatool/core`](packages/core)   | app-root `ChatoolProvider` (light/dark/system theme) + Tailwind v4 theme CSS | —                                                                          | `react`, `tailwindcss` (optional) |

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
- **[Conventions](docs/conventions/README.md)** — coding/exports/`"use client"`/peer-vs-dep rules.
- **Packages:** [utils](docs/packages/utils.md) · [ui](docs/packages/ui.md) · [icons](docs/packages/icons.md) · [core](docs/packages/core.md)
- **Guides:** [Local development](docs/guides/local-development.md) · [Publishing](docs/guides/publishing.md) · [Contributing](docs/guides/contributing.md)
- **Consuming per framework:** [App Router](docs/guides/consuming/nextjs-app-router.md) · [Pages Router](docs/guides/consuming/nextjs-pages-router.md) · [Vite](docs/guides/consuming/vite.md)

## Repository layout

```
chatool/
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
   ├─ utils/    @chatool/utils
   ├─ ui/       @chatool/ui
   ├─ icons/    @chatool/icons
   └─ core/     @chatool/core   (ChatoolProvider + theme CSS)
```

## Develop in this repo

```bash
pnpm install        # install all workspace deps
pnpm build          # build every package (dist/ + .d.ts)
pnpm dev            # tsdown --watch across packages
pnpm typecheck      # tsc --noEmit per package
pnpm lint           # eslint .
pnpm storybook      # internal component catalog (apps/storybook) at :6006
```

The repo also ships two internal (unpublished) apps under `apps/`: a Next.js
`playground` (`pnpm playground`) and a `storybook` component catalog
(`pnpm storybook` — see the [Storybook guide](docs/guides/storybook.md)).

Details: [Getting started](docs/getting-started.md) ·
[Build & tooling](docs/build-and-tooling.md) (how tsdown preserves `"use client"`
and why re-export barrels carry the directive explicitly).

## Using the packages in an app

```bash
pnpm add @chatool/utils @chatool/ui @chatool/icons @chatool/core
pnpm add -D tailwindcss        # (optional) peer of @chatool/core
```

Import the design tokens once in your global CSS (Tailwind first):

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

Then follow your framework's guide — the only real difference is **where you
mount `ChatoolProvider`**:

- [Next.js App Router](docs/guides/consuming/nextjs-app-router.md) — root layout
- [Next.js Pages Router](docs/guides/consuming/nextjs-pages-router.md) — `pages/_app`
- [Vite SPA](docs/guides/consuming/vite.md) — app root

Per-package usage and full export lists: [docs/packages](docs/packages/README.md).

## Develop locally against another repo (before publishing)

Use `pnpm link`, a `link:` dependency, or `pnpm pack` to iterate from a consuming
app without publishing. Full steps: [Local development](docs/guides/local-development.md).

## Fork & re-brand

This project is built to be forked. To rename the `@chatool/*` scope to your own in
one case-aware pass (package names, imports, exports, docs, AI shims, identifiers,
file/dir names), run the **`rename-project`** skill:

```bash
node .claude/skills/rename-project/rename.mjs <your-scope> && pnpm install
```

Runbook: [`.claude/skills/rename-project/SKILL.md`](.claude/skills/rename-project/SKILL.md).

## Publishing

Registry-agnostic, managed with Changesets: pick a registry + `.npmrc`, then
`pnpm changeset` → `pnpm version-packages` → `pnpm release`. Full steps:
[Publishing](docs/guides/publishing.md).

## AI agents (Claude, Cursor, Gemini, Copilot, …)

This repo carries instructions for AI coding tools. **[`AGENTS.md`](AGENTS.md)**
is the single source of truth; every tool-specific file is a thin pointer to it,
so all tools share the same rules with no drift:

| Tool                            | File                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Claude Code                     | [`CLAUDE.md`](CLAUDE.md) (`@AGENTS.md` import) + per-package `AGENTS.md`        |
| Cursor                          | [`.cursor/rules/chatool.mdc`](.cursor/rules/chatool.mdc) (+ native `AGENTS.md`) |
| GitHub Copilot                  | [`.github/copilot-instructions.md`](.github/copilot-instructions.md)            |
| Gemini                          | [`GEMINI.md`](GEMINI.md)                                                        |
| Codex / Zed / Windsurf / others | [`AGENTS.md`](AGENTS.md) (read natively)                                        |

Each package also has a scoped `packages/*/AGENTS.md`. How it's wired:
[docs/ai-agents.md](docs/ai-agents.md).
