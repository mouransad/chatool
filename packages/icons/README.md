# @karnameh/icons

Tree-shakeable React SVG icon components for Karnameh apps, generated from raw
SVGs with [SVGR](https://react-svgr.com/).

## Usage

```tsx
import { ChevronDownIcon, SpinnerIcon } from "@karnameh/icons";

<ChevronDownIcon className="size-6 text-primary" />
<SpinnerIcon className="size-4 animate-spin" />
```

Icons are pure, server-safe components (no `"use client"`). They inherit color
from `currentColor` (`text-*`) and scale with `className` / `size-*` (default
`1em`).

## Adding an icon

1. Drop a raw SVG into [`svg/`](./svg) using a kebab-case name, e.g.
   `arrow-right-icon.svg`. Author it with `stroke="currentColor"` /
   `fill="currentColor"`.
2. Generate the components + barrel:

   ```bash
   pnpm --filter @karnameh/icons generate
   ```

3. The filename becomes the export name: `arrow-right-icon.svg` →
   `ArrowRightIcon`.

`src/` is generated output — never edit it by hand. `pnpm build` regenerates it
(`prebuild`) before bundling to `dist/`.
