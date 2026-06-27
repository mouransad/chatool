# GitHub Copilot instructions

The canonical, full instructions live in **[AGENTS.md](../AGENTS.md)** (and the
per-package `packages/*/AGENTS.md`). Read it. The essentials are inlined below
because Copilot does not follow links automatically.

## Project

pnpm-workspace monorepo publishing five registry-agnostic `@chatool/*` packages
(`utils`, `ui`, `icons`, `api`, `core`) for React apps. Stack: pnpm + tsdown
(ESM+CJS+dts) + Changesets + TypeScript 5 + React 19 + Tailwind v4.

## Commands

`pnpm install` · `pnpm build` · `pnpm dev` · `pnpm typecheck` · `pnpm lint` ·
`pnpm format` (Prettier, repo-wide; `format:check` to verify) · `pnpm changeset` ·
`pnpm storybook` (internal component catalog, `apps/storybook`).
Run `pnpm build && pnpm typecheck && pnpm lint` before finishing. Formatting is
owned by Prettier (+ `prettier-plugin-tailwindcss`); ESLint defers via
`eslint-config-prettier`, and a husky + lint-staged pre-commit hook enforces it.

## Hard rules

- **tsdown preserves `"use client"`/`"use server"` natively**, but only at the
  top of an entry's own source. Re-export-only barrels (e.g.
  `packages/utils/src/hooks/index.ts`) carry `"use client";` explicitly — keep it.
- **`@chatool/api` is framework-agnostic**: no `process.env`, no `"use server"`,
  no framework imports; `baseURL` is always injected.
- **Server Components by default.** Pure components (props → JSX) ship with NO
  directive (render as RSC in App Router; work in Pages Router / Vite / webpack).
  Add `"use client";` only for client features (hooks incl. any `useLogic`,
  context, internal event-handler wiring, browser/DOM APIs, class components, or a
  client-only dep like `radix-ui`). When in doubt add it — omitting it from an
  interactive component is a hard App-Router error; adding it is at worst a
  suppressible Vite `MODULE_LEVEL_DIRECTIVE` warning. Icons/`cn`/the api client
  stay directive-free. Spec: `docs/conventions/client-server-components.md`.
- Every package is `"type": "module"`; keep `exports` maps + `tsdown` entries in
  sync (ESM `.mjs`/`.d.mts` + CJS `.cjs`/`.d.cts`) when adding subpaths.
- **`@chatool/ui` and `@chatool/icons` are subpath-only (no root barrel).**
  Import `@chatool/ui/button` (its `default` is `Button`) and
  `@chatool/icons/<IconName>` — never `@chatool/ui` / `@chatool/icons`.
- **`@chatool/ui` component structure** (icons exempt): each component is its own
  kebab-case directory under `packages/ui/src/` (`button/` → `index.tsx` +
  `button.tsx` + `button.types.ts` + `button.variants.ts` + optional
  `use-logic.ts`). Components are arrow functions, one per file, default-exported;
  types/cva in separate `*.types.ts`/`*.variants.ts`; non-trivial logic in a
  `useLogic` hook. **If** the component is a client component, the view file AND
  the `index.tsx` entry barrel each carry `"use client";` (pure ones carry none).
  The tsdown entry key equals the subpath. Enforced by `eslint-plugin-react` +
  `eslint-plugin-unicorn` for `packages/ui/src/**`. Spec:
  `docs/conventions/component-structure.md`.
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
