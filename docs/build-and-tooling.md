# Build & tooling

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → [Architecture](architecture.md) → **Build & tooling**

## The shared tsdown preset

We build with **[tsdown](https://tsdown.dev)** (Rolldown + Oxc). It's fast and,
crucially for this repo, **directive-aware** — it preserves `"use client"` /
`"use server"` natively, so there is no extra plugin and no treeshake caveat.

[`tsdown.preset.ts`](../tsdown.preset.ts) exports `defineChatoolConfig(...)`,
used by every package's `tsdown.config.ts`. It sets:

- `format: ["esm", "cjs"]` and `dts: true` → dual output + declarations.
- `sourcemap: true`, `clean: true`.

A package only specifies its `entry` map, e.g.:

```ts
// packages/ui/tsdown.config.ts
import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  entry: {
    // One entry per component — @chatool/ui is subpath-only (no barrel).
    button: "src/button.tsx",
  },
});
```

The `entry` can also be a glob: `@chatool/icons` uses `entry: ["src/*.tsx"]` to
emit one module per icon (served by its `./*` wildcard export).

No `external` list is needed: tsdown externalizes `dependencies` and
`peerDependencies` (and their subpaths, e.g. `react/jsx-runtime`) automatically —
only the package's own source is bundled. Shared code between entries is split
into deduped chunks.

> tsdown loads the TypeScript config via `unrun`, a devDependency at the repo
> root. Rolldown ships prebuilt native binaries, so there's no install-time build
> script to approve.

## Output naming

tsdown distinguishes ESM/CJS by **extension** (independent of `"type"`):

- ESM → `dist/<entry>.mjs` + types `dist/<entry>.d.mts`
- CJS → `dist/<entry>.cjs` + types `dist/<entry>.d.cts`

Each package's `exports` map points the `import` condition at the `.mjs`/`.d.mts`
files and the `require` condition at the `.cjs`/`.d.cts` files.

## Preserving `"use client"` / `"use server"`

tsdown keeps module-level directives in the bundled output for **both** formats.
After a build:

- `packages/ui/dist/button.mjs` (and `.cjs`) start with `"use client";`
- `packages/utils/dist/hooks/index.mjs` starts with `"use client";`
- pure modules (`cn`, icons, the api client) have **no** directive.

### ⚠️ Re-export-only barrels need an explicit directive

tsdown keeps a directive only when it sits at the **top of the entry's own
source**. A barrel that just `export * from "./foo"` does **not** inherit the
directive from the files it re-exports. So a client barrel must carry it
explicitly at the top of its source:

- [`packages/utils/src/hooks/index.ts`](../packages/utils/src/hooks/index.ts) → `"use client";`

`@chatool/ui` has no barrel (it is subpath-only) — each component entry is its
own source and carries its own `"use client";`. If you create a **new** client
barrel/entry, put `"use client";` at its top.

## ESLint

[`eslint.config.mjs`](../eslint.config.mjs) is a flat config combining
`@eslint/js`, `typescript-eslint`, and `eslint-plugin-react-hooks`. It ignores
`**/dist/**`. Run with `pnpm lint` (or `pnpm lint:fix`).

## TypeScript

[`tsconfig.json`](../tsconfig.json) at the root is the base every package
extends. It is strict (`strict`, `noUncheckedIndexedAccess`,
`verbatimModuleSyntax`, `isolatedModules`) and `noEmit` — tsdown, not tsc,
produces declarations. Each `packages/*/tsconfig.json` extends it and sets
`include` (`src` + `tsdown.config.ts`). `typecheck` runs `tsc --noEmit`.

## Related

- [Architecture](architecture.md) — the bigger picture.
- [Conventions](conventions.md) — exports/directive rules to follow.

---

Up: [Architecture](architecture.md) · [Docs](README.md) · [Repo README](../README.md)
