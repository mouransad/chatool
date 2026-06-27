# Architecture

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **Architecture**

## Monorepo layout

```
chatool/
├─ pnpm-workspace.yaml     # packages/*
├─ package.json            # root scripts + devDeps shared by all packages
├─ tsconfig.json           # base config every package extends
├─ tsdown.preset.ts        # shared tsdown config (native directive preservation)
├─ eslint.config.mjs       # shared flat ESLint config
├─ .changeset/             # Changesets config
└─ packages/
   ├─ core/     @chatool/core      (ChatoolProvider + theme CSS)
   ├─ utils/    @chatool/utils
   ├─ ui/       @chatool/ui        (depends on @chatool/utils)
   └─ api/      @chatool/api
```

## Workspace dependency graph

```
@chatool/core     (ChatoolProvider + theme CSS)
@chatool/utils    (standalone)
@chatool/ui   ──▶ @chatool/utils   (workspace:^)
@chatool/api      (standalone)
```

`@chatool/ui` depends on `@chatool/utils` via the `workspace:^` protocol. On
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

`@chatool/core` ships raw `.css` (`styles.css` / `theme.css`) **alongside** its
built JS — the CSS files are not processed by tsdown, just published as-is.

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
