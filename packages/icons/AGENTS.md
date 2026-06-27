# AGENTS.md — @chatool/icons

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).

- **Icon set: Material Symbols (weight 400, Apache-2.0)**, four styles per icon —
  Outlined, Rounded, Sharp, Filled. Source SVGs come from the
  `@material-symbols/svg-400` devDependency via a curated allowlist in
  [`scripts/sync-icons.mjs`](scripts/sync-icons.mjs). To add/extend icons, edit the
  `ICONS` array (snake_case base names) and run
  `pnpm --filter @chatool/icons sync:icons` (rewrites `svg/`), then commit `svg/`.
  `sync:icons` is manual — the build never runs it.
- **`svg/` is the source of truth.** Files are kebab-case `<base>-<style>.svg`
  (e.g. `home-outlined.svg`, `home-filled.svg`). `pnpm --filter @chatool/icons
generate` runs SVGR over them, writing typed components + the `src/index.ts`
  barrel. "Filled" is the Material Symbols fill axis of the outlined glyph.
- **`src/` is generated** by SVGR (`svgr.config.mjs`). Do not hand-edit files in
  `src/` — they are overwritten on every `generate` / `build` (`prebuild` runs
  `generate`). Change the SVG or the config instead.
- **Icons are pure** (no hooks, no `"use client"`) — server-safe. Don't add a
  directive.
- **Export names are PascalCase**, derived from the SVG filename:
  `home-outlined.svg` → `HomeOutlined`, `chevron-right-filled.svg` →
  `ChevronRightFilled`. Keep filenames kebab-case so the generated names stay
  stable.
- **`react` is a `peerDependency`** (and is externalized by the tsdown preset,
  incl. `react/jsx-runtime`). `@svgr/cli` is a `devDependency` — it never ships.
- **Per-icon subpaths, no root barrel.** The package exposes a single `./*`
  wildcard export mapping `@chatool/icons/<IconName>` → `dist/<IconName>` (each a
  `default` export), and the tsdown entry is the glob `src/*.tsx`. There is **no**
  `.` export, so the IDE auto-imports the subpath
  (`import HomeOutlined from "@chatool/icons/HomeOutlined"`) instead of a
  root barrel. SVGR still emits `src/index.ts`, but it is `.ts` (not matched by
  the `*.tsx` entry) so it is neither built nor published — don't add a `.`
  export or list it as an entry.
- Material Symbols ship without a `fill` attribute, so the SVGR config
  (`svgr.config.mjs`) injects `fill="currentColor"` (alongside `icon: true` for
  1em sizing). `text-*` utilities then tint them and `className` / `size-*`
  controls dimensions. Don't strip the `fill` from `svgProps`.
- **The Storybook gallery shows a _representative sample_, not every icon.** The
  set is the full curated Material Symbols list (~80 icons × 4 styles), far too
  many to enumerate by hand, so
  [`apps/storybook/stories/Icons.stories.tsx`](../../apps/storybook/stories/Icons.stories.tsx)
  demos a hand-picked subset plus the four styles and the size/color behaviors.
  When you add a _new kind_ of icon worth showcasing, add it to the `gallery` map;
  routine additions to the `ICONS` allowlist don't each need a gallery entry.
