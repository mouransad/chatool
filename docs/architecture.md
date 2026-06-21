# Architecture

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **Architecture**

## Monorepo layout

```
karnameh-kit/
├─ pnpm-workspace.yaml     # packages/*
├─ package.json            # root scripts + devDeps shared by all packages
├─ tsconfig.json           # base config every package extends
├─ tsdown.preset.ts        # shared tsdown config (native directive preservation)
├─ eslint.config.mjs       # shared flat ESLint config
├─ .changeset/             # Changesets config
└─ packages/
   ├─ styles/   @karnameh/styles   (CSS only — no build step)
   ├─ utils/    @karnameh/utils
   ├─ ui/       @karnameh/ui        (depends on @karnameh/utils)
   └─ api/      @karnameh/api
```

## Workspace dependency graph

```
@karnameh/styles   (standalone, CSS)
@karnameh/utils    (standalone)
@karnameh/ui   ──▶ @karnameh/utils   (workspace:^)
@karnameh/api      (standalone)
```

`@karnameh/ui` depends on `@karnameh/utils` via the `workspace:^` protocol. On
publish, Changesets/pnpm rewrites that to the real version — see
[Publishing](guides/publishing.md).

## Dual ESM + CJS output

Every buildable package is `"type": "module"` and emits both formats through
tsdown, which names outputs by extension:

- ESM → `dist/<entry>.mjs` + types `dist/<entry>.d.mts`
- CJS → `dist/<entry>.cjs` + types `dist/<entry>.d.cts`

Each package's `exports` map points the `import` condition at the ESM files and
the `require` condition at the CJS files, so both module systems resolve types
and runtime correctly.

`@karnameh/styles` has **no build** — it ships raw `.css` and a no-op `build`
script so `pnpm -r build` stays uniform.

## Build internals

The shared tsdown preset and the `"use client"`/`"use server"` directive
handling (including the re-export-barrel rule) are the subtle parts. They have
their own page:

➡️ [Build & tooling](build-and-tooling.md)

## Related

- [Conventions](conventions.md) — the rules that keep the above consistent.
- [Packages](packages/README.md) — per-package exports and design.

---

Up: [Docs](README.md) · [Repo README](../README.md)
