# @chatool/icons

Tree-shakeable React SVG icon components for Chatool apps, generated from raw SVGs
with [SVGR](https://react-svgr.com/). Extracted from `@chatool/ui` so icons can be
consumed and versioned on their own.

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
| `@chatool/icons/<IconName>` | the icon's `default` export — e.g. `ChevronDownIcon`, `ChevronRightIcon`, `CheckIcon`, `SpinnerIcon`, `ChatoolLogoIcon`, … |

## Usage

```tsx
import ChevronDownIcon from "@chatool/icons/ChevronDownIcon";
import SpinnerIcon from "@chatool/icons/SpinnerIcon";

<ChevronDownIcon className="size-6 text-primary" />;
<SpinnerIcon className="size-4 animate-spin" />;
```

Icons inherit color from `currentColor` (tint with `text-*`) and default to `1em`
sizing, so `className` / `size-*` controls dimensions.

## Adding an icon (when developing this package)

1. Add a kebab-case SVG to `svg/` authored with `stroke="currentColor"` /
   `fill="currentColor"`, e.g. `arrow-right-icon.svg`.
2. Run `pnpm --filter @chatool/icons generate`.
3. The filename becomes the subpath + export: `arrow-right-icon.svg` →
   `import ArrowRightIcon from "@chatool/icons/ArrowRightIcon"`. The `./*` wildcard
   export covers it automatically — no `package.json` change needed.

`src/` is generated output — never hand-edit it. `pnpm build` re-runs `generate`
(`prebuild`) before bundling to `dist/`.

## For AI agents

- **Import one icon per subpath**: `import ChevronDownIcon from
  "@chatool/icons/ChevronDownIcon"`. There is **no root barrel** — do not write
  `import { ChevronDownIcon } from "@chatool/icons"`.
- Every icon is a **default export**; the component name is PascalCase derived from
  the kebab-case SVG filename (`chevron-down-icon.svg` → `ChevronDownIcon`).
- Icons are **pure / server-safe** (no `"use client"`) — usable in Server
  Components.
- Style with `text-*` (color via `currentColor`) and `size-*` / `className`
  (dimensions; default `1em`).
- `react` is a peer supplied by the app.

## Related

- `@chatool/ui` — components that use these icons.
