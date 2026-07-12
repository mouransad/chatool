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

A pnpm-workspace monorepo publishing four **registry-agnostic** `@chatool/*`
packages for React apps (Next.js App Router, Next.js Pages Router, Vite SPA).

| Package          | Role                                                     | Peers                             |
| ---------------- | -------------------------------------------------------- | --------------------------------- |
| `@chatool/utils` | `cn` + hooks                                             | `react`                           |
| `@chatool/ui`    | shadcn components                                        | `react`, `react-dom`              |
| `@chatool/icons` | SVGR-generated React SVG icons                           | `react`                           |
| `@chatool/core`  | app-root `ChatoolProvider` (theme/dark-mode) + theme CSS | `react`, `tailwindcss` (optional) |

Stack: pnpm workspaces, tsdown (ESM+CJS+`.d.ts`), Changesets, TypeScript 5,
React 19, Tailwind CSS v4.

## Commands

```bash
pnpm install      # install workspace deps
pnpm build        # build every package (dist/ + .d.ts)
pnpm dev          # tsdown --watch across packages
pnpm typecheck    # tsc --noEmit per package
pnpm lint         # eslint .
pnpm format       # prettier --write . (repo-wide; `format:check` to verify)
pnpm changeset    # record a release note (required for functional changes)
pnpm storybook    # run the internal component catalog (apps/storybook) at :6006
```

> Internal apps live under `apps/*` (not published): `playground` (Next.js) and
> `storybook` (the `@chatool/*` component catalog — `pnpm storybook`). For a fast
> dev loop both **dev-resolve `@chatool/*` to package `src`** (playground via
> `tsconfig.json` `paths` + `transpilePackages`; storybook via Vite
> `resolve.alias` from [`dev-aliases.mjs`](dev-aliases.mjs)) so editing `src/`
> hot-reloads with no rebuild — the published `exports` still point at `dist`, so
> consumers are unaffected. Root `build`/`typecheck`/`lint` target `packages/*`
> only, and `eslint .` ignores `apps/**` (they self-lint).

Always run `pnpm build && pnpm typecheck && pnpm lint` before declaring work
done. Formatting is owned by **Prettier** (`prettier.config.mjs`, with
`prettier-plugin-tailwindcss` for class sorting); ESLint defers to it via
`eslint-config-prettier`. A husky pre-commit hook runs `lint-staged`
(`prettier --write` on staged files + `eslint --fix` on `packages/**`), so
formatting is enforced automatically — run `pnpm format` if you bypass it.

## Hard rules (do not violate)

1. **Re-export-only barrels need an explicit directive.** tsdown
   ([tsdown.preset.ts](tsdown.preset.ts)) preserves `"use client"` /
   `"use server"` natively, but **only** when the directive is at the top of the
   entry's own source. A barrel that just `export *` does not inherit it — so
   `packages/utils/src/hooks/index.ts` carries `"use client";` at the top. Keep
   it there; add it to any new client barrel.
   See [docs/build-and-tooling.md](docs/build-and-tooling.md).
2. **Directives are intentional.** Client hooks and client UI components start
   with `"use client"`. Pure modules (`cn`, icons) must **not**
   have it. Don't add or remove a directive without understanding the boundary.
3. **Keep `exports` maps in sync.** When you add a component/hook/service subpath,
   add a matching `exports` entry (ESM `.mjs`/`.d.mts` + CJS `.cjs`/`.d.cts`) and
   a `tsdown` entry. Every package is `"type": "module"`.
   3b. **Subpath-only, no root barrels for `@chatool/ui` and `@chatool/icons`.**
   Neither package exposes a `.` export — every symbol is reachable from exactly
   one path so the IDE auto-imports the subpath, not a root barrel. `@chatool/ui`
   ships one subpath per component (`./button`, `./dropdown-menu`, …, each with
   `default` + named exports); `@chatool/icons` uses a single `./*` wildcard
   export mapping `@chatool/icons/<IconName>` → `dist/<IconName>` (default
   export). Don't re-add a `.` export or a published root barrel to either.
4. **peer vs dep:** runtime libraries the app already owns (react, react-dom,
   tailwindcss) are `peerDependencies`; everything bundled-against is a `dependency`.
5. **Registry-agnostic.** Never hardcode a registry. Publish config lives in
   `publishConfig` + a local `.npmrc` (see [.npmrc.example](.npmrc.example)).
6. **Every functional change needs a Changeset** (`pnpm changeset`).
   6b. **Each package ships its own docs.** `packages/<pkg>/README.md` is the single
   **canonical, complete** per-package reference and is **self-contained** (no
   `../../docs` relative links — they break in `node_modules`). npm ships README
   automatically. Each package also ships a generated **`llms.txt`** (an
   llmstxt.org-style LLM entry point) produced by
   [`scripts/gen-llms.mjs`](scripts/gen-llms.mjs) from the README's
   `## For AI agents` section + `package.json` — **never hand-edit `llms.txt`**, and
   keep `"llms.txt"` in each package's `files`. `docs/packages/<pkg>.md` is a thin
   pointer to the README. Regenerate with `pnpm gen:llms` (also runs on `pnpm build`
   via `postbuild` and at publish via each package's `prepack`).
7. **Docs, shims, changesets & stories stay in sync — it's part of "done".** A
   change isn't finished until the docs and per-tool shims it affects are updated
   (plus a Changeset for functional changes, and a Storybook story for new
   `@chatool/ui`/`@chatool/icons`). This repo's whole premise is _no drift_
   (see [docs/ai-agents.md](docs/ai-agents.md)). Use the **sync map** below; the
   one-shot way to enforce it is the [`/sync`](.agents/skills/sync/SKILL.md) skill,
   which orchestrates [`/sync-docs`](.agents/skills/sync-docs/SKILL.md) (docs, shims,
   llms.txt, exports, changesets) + [`/sync-storybook`](.agents/skills/sync-storybook/SKILL.md)
   (story coverage) and runs the final build/typecheck/lint. Edit canonical files,
   **never** regenerate a shim by hand beyond the inlined rules.

### Sync map

| When you change…                                                                | Also update…                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A hard rule / command / the package list/count in this file                     | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) (it **inlines** rules + the package count), and the relevant file under [docs/conventions/](docs/conventions/) if it's a coding convention                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| A package's `exports` / subpaths / `tsdown` entries / directives                | that package's `packages/*/AGENTS.md`, the canonical **`packages/<pkg>/README.md`** (Exports + Usage + "For AI agents"), then regenerate `llms.txt` (`pnpm gen:llms`), the dev source maps if you added a `@chatool/ui` component subpath (so the internal apps hot-reload it from source: [`dev-aliases.mjs`](dev-aliases.mjs) for Storybook + `paths` in [`apps/playground/tsconfig.json`](apps/playground/tsconfig.json) for the playground), and [docs/guides/contributing.md](docs/guides/contributing.md) / [docs/conventions/](docs/conventions/) if the add-subpath flow changed (`docs/packages/<pkg>.md` is just a pointer — no content change needed) |
| A `@chatool/ui` component or `@chatool/icons` icon                              | add/extend a story in [`apps/storybook`](apps/storybook) — run [`/sync-storybook`](.agents/skills/sync-storybook/SKILL.md) (stories don't auto-discover; the icon gallery is enumerated by hand)                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| A package's `README.md` "For AI agents" section or `package.json` `description` | regenerate `llms.txt` (`pnpm gen:llms`) — it's derived, never hand-edited                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Add or remove a package                                                         | the table in [What this repo is](#what-this-repo-is) (+ its "four packages" count), root [README.md](README.md), [docs/README.md](docs/README.md) + [docs/packages/README.md](docs/packages/README.md) lists, and the count in the Copilot shim                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Add or remove an AI-tool shim                                                   | the table in [docs/ai-agents.md](docs/ai-agents.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Any functional (non-doc) change to a published package                          | add a Changeset (`pnpm changeset`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Conventions

Full coding/exports/naming conventions: [docs/conventions/](docs/conventions/)
(one file per category). Architecture & build internals:
[docs/architecture.md](docs/architecture.md) →
[docs/build-and-tooling.md](docs/build-and-tooling.md).

**shadcn & Tailwind CSS v4.** The design system is **shadcn**. `@chatool/core`
ships the token layer — standard CSS variables (`--background`, `--primary`, `--radius`, etc.)
in `:root`/`.dark`, mapped to Tailwind utilities via `@theme inline` (`bg-primary`,
`text-foreground`, `rounded-md`, `border-border`).
Components style with **token utilities, never raw hex**; apps customize by
overriding standard CSS variables. Canonical spec:
[docs/conventions/shadcn.md](docs/conventions/shadcn.md).

**Server Components by default.** A pure component (props → JSX) ships with **no**
directive so it can render as a React Server Component in Next App Router and works
everywhere (Pages Router / Vite / webpack). Add `"use client";` **only** when the
module needs client features (hooks — including any custom `useLogic` —, context,
internal event-handler wiring, browser/DOM APIs, class components, or a client-only
dep like `radix-ui`). When in doubt add it: omitting it from an interactive
component is a hard App-Router build error, while adding it is at worst a
suppressible Vite warning. Canonical spec:
[docs/conventions/client-server-components.md](docs/conventions/client-server-components.md).

**`@chatool/ui` component structure:** each component is its own kebab-case
directory under `packages/ui/src/` (e.g. `button/` with `index.tsx` +
`button.tsx` + `button.types.ts` + `button.variants.ts` + optional `use-logic.ts`);
components are arrow functions, one per file, default-exported, with types and
cva variants in separate `*.types.ts` / `*.variants.ts` files and non-trivial
logic split into a `useLogic` hook. **If** the component is a client component, the
view file **and** the `index.tsx` entry barrel each carry `"use client";` (a pure
server component has none). Enforced for `packages/ui/src/**` by
`eslint-plugin-react` + `eslint-plugin-unicorn`. Icons are exempt. Canonical spec:
[docs/conventions/component-structure.md](docs/conventions/component-structure.md).

## Documentation map

- Human docs (canonical): [docs/README.md](docs/README.md)
- Per-package deep dives: [docs/packages/README.md](docs/packages/README.md)
- Guides (local dev, publishing, per-framework): [docs/guides/README.md](docs/guides/README.md)
- Per-package agent rules: [packages/utils/AGENTS.md](packages/utils/AGENTS.md) ·
  [packages/ui/AGENTS.md](packages/ui/AGENTS.md) ·
  [packages/icons/AGENTS.md](packages/icons/AGENTS.md) ·
  [packages/core/AGENTS.md](packages/core/AGENTS.md)
