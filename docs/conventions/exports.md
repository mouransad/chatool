# Exports maps

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Exports maps**

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
[Build & tooling](../build-and-tooling.md).

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
