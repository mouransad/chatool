# @chatool/icons

Tree-shakeable React SVG icon components for Chatool apps, generated from raw SVGs
with [SVGR](https://react-svgr.com/). The icon set is
[Material Symbols](https://fonts.google.com/icons) (weight 400, Apache-2.0), with
**four styles per icon — Outlined, Rounded, Sharp, Filled**.

- **Dependencies:** none
- **Peers:** `react` ^19

## Install

```bash
pnpm add @chatool/icons
# react ^19 is a peer
```

## Exports

**Per-icon subpaths via a single `./*` wildcard export — no root barrel.** Each
icon resolves to its own module with a `default` export, so editors auto-import the
exact path and bundlers ship only what you use. Icons are pure and server-safe (no
`"use client"`).

| Subpath | Component |
| --- | --- |
| `@chatool/icons/<IconName><Style>` | the icon's `default` export — `<Style>` is one of `Outlined`, `Rounded`, `Sharp`, `Filled`. e.g. `HomeOutlined`, `SearchRounded`, `CheckSharp`, `FavoriteFilled`, … |

Every base icon ships all four styles, so e.g. `Check` is available as
`CheckOutlined`, `CheckRounded`, `CheckSharp`, and `CheckFilled`.

## Usage

```tsx
import HomeOutlined from "@chatool/icons/HomeOutlined";
import ProgressActivityOutlined from "@chatool/icons/ProgressActivityOutlined";

<HomeOutlined className="size-6 text-primary" />;
<ProgressActivityOutlined className="size-4 animate-spin" />;
```

Icons inherit color from `currentColor` (tint with `text-*`) and default to `1em`
sizing, so `className` / `size-*` controls dimensions. Note that **weight is fixed
at build time** (Material Symbols weight 400) — it is not a runtime prop, because
the SVG path geometry differs per weight.

## Adding / changing icons (when developing this package)

Icons come from the [`@material-symbols/svg-400`](https://www.npmjs.com/package/@material-symbols/svg-400)
package via a curated allowlist:

1. Add the base icon name (snake_case, as named upstream — e.g. `arrow_right`) to
   the `ICONS` array in [`scripts/sync-icons.mjs`](scripts/sync-icons.mjs).
2. Run `pnpm --filter @chatool/icons sync:icons`. This rewrites `svg/` with the
   four `<base>-<style>.svg` variants for every icon.
3. Commit `svg/`. The names become subpaths + exports automatically:
   `arrow-right-outlined.svg` → `import ArrowRightOutlined from "@chatool/icons/ArrowRightOutlined"`.
   The `./*` wildcard export covers them — no `package.json` change needed.

You can also drop a hand-made kebab-case `svg/<name>-<style>.svg` directly (use
`fill="currentColor"` or rely on the SVGR config that injects it).

`svg/` is the committed source of truth; `src/` is generated output — never
hand-edit `src/`. `pnpm build` re-runs SVGR (`generate` via `prebuild`) before
bundling to `dist/`. `sync:icons` is run manually, not by the build.

## For AI agents

- **Import one icon per subpath**: `import HomeOutlined from
  "@chatool/icons/HomeOutlined"`. There is **no root barrel** — do not write
  `import { HomeOutlined } from "@chatool/icons"`.
- Each name is `<IconName><Style>` where `<Style>` ∈ `Outlined | Rounded | Sharp |
  Filled` (Material Symbols). Every icon is a **default export**; the name is
  PascalCase derived from the kebab-case SVG filename (`home-outlined.svg` →
  `HomeOutlined`).
- Icons are **pure / server-safe** (no `"use client"`) — usable in Server
  Components.
- Style with `text-*` (color via `currentColor`) and `size-*` / `className`
  (dimensions; default `1em`). **Weight is fixed at build time** — not a prop.
- `react` is a peer supplied by the app.

## Related

- `@chatool/ui` — components that use these icons.
