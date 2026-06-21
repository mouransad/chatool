# AGENTS.md — @karnameh/icons

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).

- **`svg/` is the source of truth.** Add a raw `.svg` there (kebab-case, e.g.
  `arrow-right-icon.svg`), then run `pnpm --filter @karnameh/icons generate`.
  SVGR writes typed components + the `src/index.ts` barrel.
- **`src/` is generated** by SVGR (`svgr.config.mjs`). Do not hand-edit files in
  `src/` — they are overwritten on every `generate` / `build` (`prebuild` runs
  `generate`). Change the SVG or the config instead.
- **Icons are pure** (no hooks, no `"use client"`) — server-safe. Don't add a
  directive.
- **Export names are PascalCase**, derived from the SVG filename:
  `chevron-down-icon.svg` → `ChevronDownIcon`. Keep filenames kebab-case so the
  generated names stay stable and match the old `@karnameh/ui` icon API.
- **`react` is a `peerDependency`** (and is externalized by the tsdown preset,
  incl. `react/jsx-runtime`). `@svgr/cli` is a `devDependency` — it never ships.
- **One barrel, no per-icon subpaths.** `sideEffects: false` lets bundlers
  tree-shake unused icons, so a single `.` export is enough — don't add an
  `exports` entry per icon.
- Author SVGs with `stroke="currentColor"` / `fill="currentColor"` so `text-*`
  utilities tint them, and rely on `icon: true` (1em sizing) so `className` /
  `size-*` controls dimensions.
