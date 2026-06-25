# AGENTS.md — @chatool/icons

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).

- **`svg/` is the source of truth.** Add a raw `.svg` there (kebab-case, e.g.
  `arrow-right-icon.svg`), then run `pnpm --filter @chatool/icons generate`.
  SVGR writes typed components + the `src/index.ts` barrel.
- **`src/` is generated** by SVGR (`svgr.config.mjs`). Do not hand-edit files in
  `src/` — they are overwritten on every `generate` / `build` (`prebuild` runs
  `generate`). Change the SVG or the config instead.
- **Icons are pure** (no hooks, no `"use client"`) — server-safe. Don't add a
  directive.
- **Export names are PascalCase**, derived from the SVG filename:
  `chevron-down-icon.svg` → `ChevronDownIcon`. Keep filenames kebab-case so the
  generated names stay stable and match the old `@chatool/ui` icon API.
- **`react` is a `peerDependency`** (and is externalized by the tsdown preset,
  incl. `react/jsx-runtime`). `@svgr/cli` is a `devDependency` — it never ships.
- **Per-icon subpaths, no root barrel.** The package exposes a single `./*`
  wildcard export mapping `@chatool/icons/<IconName>` → `dist/<IconName>` (each a
  `default` export), and the tsdown entry is the glob `src/*.tsx`. There is **no**
  `.` export, so the IDE auto-imports the subpath
  (`import ChevronDownIcon from "@chatool/icons/ChevronDownIcon"`) instead of a
  root barrel. SVGR still emits `src/index.ts`, but it is `.ts` (not matched by
  the `*.tsx` entry) so it is neither built nor published — don't add a `.`
  export or list it as an entry.
- Author SVGs with `stroke="currentColor"` / `fill="currentColor"` so `text-*`
  utilities tint them, and rely on `icon: true` (1em sizing) so `className` /
  `size-*` controls dimensions.
- **Adding an icon also needs a gallery entry** in
  [`apps/storybook/stories/Icons.stories.tsx`](../../apps/storybook/stories/Icons.stories.tsx),
  which enumerates icons by hand — run the `/sync-storybook` skill.
