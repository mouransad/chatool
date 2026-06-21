# @karnameh/icons

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) →
> [Packages](README.md) → **@karnameh/icons**

Tree-shakeable React SVG icon components, generated from raw SVGs with
[SVGR](https://react-svgr.com/). Extracted from `@karnameh/ui` so icons can be
consumed (and versioned) on their own.

- **Deps:** none · **Peers:** `react` ^19
- **Build:** `@svgr/cli` (devDep) generates `src/`, then `tsdown` bundles `dist/`.
- **Source SVGs:** [`packages/icons/svg`](../../packages/icons/svg)
- **Generated components:** [`packages/icons/src`](../../packages/icons/src)
  (build output — do not hand-edit)

## Exports

A single tree-shakeable barrel — `sideEffects: false` lets bundlers drop unused
icons, so there are no per-icon subpaths.

| Subpath | Components | Directive |
| --- | --- | --- |
| `@karnameh/icons` | `KarnamehLogoIcon`, `ChevronDownIcon`, `ChevronRightIcon`, `CheckIcon`, `SpinnerIcon`, … | none (server-safe) |

## Usage

```tsx
import { ChevronDownIcon } from "@karnameh/icons";

<ChevronDownIcon className="size-6 text-primary" />;
```

Icons use `currentColor` (tint with `text-*`) and default to `1em` sizing
(`icon: true`), so `size-*` / `className` controls dimensions.

## Adding an icon

1. Add a kebab-case SVG to [`svg/`](../../packages/icons/svg) authored with
   `stroke="currentColor"` / `fill="currentColor"`.
2. Run `pnpm --filter @karnameh/icons generate`.
3. The filename becomes the export: `arrow-right-icon.svg` → `ArrowRightIcon`.

`pnpm build` re-runs `generate` (`prebuild`) before bundling. See
[build-and-tooling.md](../build-and-tooling.md).

---

Up: [Packages](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
