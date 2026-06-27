# Conventions

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **Conventions**

Rules to follow when changing code. AI agents: these are also summarized in
[AGENTS.md](../AGENTS.md).

## Package shape

Every buildable package has:

- `"type": "module"` and `sideEffects: false` (except `@chatool/styles`, which
  marks `**/*.css` as side-effectful).
- `"files": ["dist", "llms.txt"]` (styles ships its `.css` files + `llms.txt`).
  `README.md` is shipped automatically by npm. `llms.txt` is generated — see
  [docs shipped to consumers](ai-agents.md#docs-shipped-to-consumers-node_modules).
- a `build` (`tsdown`), `dev` (`tsdown --watch`), and `typecheck` (`tsc --noEmit`)
  script, plus `"prepack": "node ../../scripts/gen-llms.mjs ."`.
- `"publishConfig": { "access": "public" }` — **no registry** is hardcoded.

## Exports maps

Use explicit conditional `exports`. For each subpath provide both conditions:

```jsonc
"./button": {
  "import": { "types": "./dist/button.d.mts", "default": "./dist/button.mjs" },
  "require": { "types": "./dist/button.d.cts", "default": "./dist/button.cjs" }
}
```

When you add a component/hook/service that should be importable on its own:

1. add a `tsdown` entry for it,
2. add the matching `exports` subpath,
3. re-export it from the package barrel (`src/index.ts`) **only if that package
   still has one** — `@chatool/utils` keeps a `hooks` barrel, but `@chatool/ui`
   and `@chatool/icons` are subpath-only (no root barrel) so there is nothing to
   re-export from.

Keep `import`/`require` filenames consistent with the dual-output naming from
[Build & tooling](build-and-tooling.md).

## `"use client"` / `"use server"`

- React **hooks** and **client components** start with `"use client";`.
- Pure modules — `cn`, SVG icons, the api client/services — have **no** directive.
- tsdown preserves directives natively — but only at the top of an entry's own
  source. A **re-export-only barrel** (`packages/utils/src/hooks/index.ts`)
  carries `"use client";` explicitly; keep it there. (`@chatool/ui` is
  subpath-only — each component entry carries its own directive, no barrel.)
- `@chatool/api` must never contain `"use server"` — it stays framework-agnostic.

## Dependencies: peer vs dep

- **peerDependencies:** libraries the consuming app already owns and must
  deduplicate — `react`, `react-dom`, `tailwindcss`.
- **dependencies:** everything else the package needs at runtime — `clsx`,
  `tailwind-merge`, `radix-ui`, `class-variance-authority`, `axios`, and
  `@chatool/{utils,icons}` (as `workspace:^`).
- Mirror peers in `devDependencies` so the package builds/typechecks in isolation.

## TypeScript

- Strict mode everywhere; honor `verbatimModuleSyntax` → use `import type` /
  `export type` for type-only symbols.
- Prefer real exported types over ambient globals (e.g. the api `GetBanners*`
  types are real exports).

## Formatting & linting

- **Prettier owns formatting.** Config lives in [`prettier.config.mjs`](../prettier.config.mjs)
  (defaults + [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss),
  which sorts `className`/`cn`/`cva` class lists). Run `pnpm format` (or
  `pnpm format:check` to verify); `.prettierignore` skips generated output.
- **ESLint owns code quality, not style.** [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
  is appended last in every ESLint config (root + both apps) so the two tools
  never disagree. The existing `no-unused-vars` / `consistent-type-imports` /
  react-hooks rules are untouched.
- **Enforced on commit.** A husky pre-commit hook runs `lint-staged`
  (`prettier --write` on staged files repo-wide + `eslint --fix` on `packages/**`).
  The hook installs via the root `prepare` script on `pnpm install`.

## Changesets

Every functional change ships with a Changeset:

```bash
pnpm changeset      # pick packages + bump type + summary
```

See [Publishing](guides/publishing.md) for the full release flow.

## Related

- [Build & tooling](build-and-tooling.md)
- [Contributing](guides/contributing.md) — applying these when adding things.

---

Up: [Docs](README.md) · [Repo README](../README.md)
