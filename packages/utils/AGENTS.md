# AGENTS.md — @chatool/utils

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/utils.md](../../docs/packages/utils.md).

- **Keep the root entry (`.`) pure** — it exports `cn` only and must have **no**
  `"use client"` so it stays importable from Server Components.
- **Hooks live behind `./hooks`** and that bundle is `"use client"`. Each hook
  file (`useBoolean`, `useDelayVisibility`) starts with `"use client";`, **and so
  does the barrel `src/hooks/index.ts`** — tsdown only keeps a directive that's
  at the top of the entry's own source, so the re-export barrel needs it too.
- `react` is a `peerDependency`; `clsx` + `tailwind-merge` are `dependencies`.
- Two subpaths exist: `.` and `./hooks`. If you add another, update `exports` +
  `tsdown.config.ts` together (ESM `.mjs`/`.d.mts` + CJS `.cjs`/`.d.cts`).
