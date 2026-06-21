# Conventions

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **Conventions**

Rules to follow when changing code. AI agents: these are also summarized in
[AGENTS.md](../AGENTS.md).

## Package shape

Every buildable package has:

- `"type": "module"` and `sideEffects: false` (except `@karnameh/styles`, which
  marks `**/*.css` as side-effectful).
- `"files": ["dist"]` (styles ships its `.css` files instead).
- a `build` (`tsdown`), `dev` (`tsdown --watch`), and `typecheck` (`tsc --noEmit`)
  script.
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
3. re-export it from the package barrel (`src/index.ts`) if appropriate.

Keep `import`/`require` filenames consistent with the dual-output naming from
[Build & tooling](build-and-tooling.md).

## `"use client"` / `"use server"`

- React **hooks** and **client components** start with `"use client";`.
- Pure modules — `cn`, SVG icons, the api client/services — have **no** directive.
- tsdown preserves directives natively — but only at the top of an entry's own
  source. **Re-export-only barrels** (`packages/utils/src/hooks/index.ts`,
  `packages/ui/src/index.ts`) carry `"use client";` explicitly; keep it there.
- `@karnameh/api` must never contain `"use server"` — it stays framework-agnostic.

## Dependencies: peer vs dep

- **peerDependencies:** libraries the consuming app already owns and must
  deduplicate — `react`, `react-dom`, `tailwindcss`.
- **dependencies:** everything else the package needs at runtime — `clsx`,
  `tailwind-merge`, `radix-ui`, `class-variance-authority`, `axios`, and
  `@karnameh/{utils,icons}` (as `workspace:^`).
- Mirror peers in `devDependencies` so the package builds/typechecks in isolation.

## TypeScript

- Strict mode everywhere; honor `verbatimModuleSyntax` → use `import type` /
  `export type` for type-only symbols.
- Prefer real exported types over ambient globals (e.g. the api `GetBanners*`
  types are real exports).

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
