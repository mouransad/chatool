# @karnameh/icons

## 0.1.0

### Minor Changes

- 9748740: Extract SVG icons into a new `@karnameh/icons` package. Icons are now generated
  from raw SVGs in `packages/icons/svg/` via SVGR (`pnpm generate`) and shipped as
  per-icon subpaths. `@karnameh/ui` no longer exports `./icons` and drops the
  `lucide-react` dependency — its internal `Check` / `ChevronRight` glyphs now come
  from `@karnameh/icons` (`CheckIcon` / `ChevronRightIcon`).

  Migration: import each icon from its own path, e.g.
  `import CheckIcon from "@karnameh/icons/CheckIcon"`, instead of
  `@karnameh/ui/icons`.

- 8da047b: Switch `@karnameh/ui` and `@karnameh/icons` to subpath-only exports (no root
  barrel) so editors auto-import the specific path instead of a root barrel.

  - `@karnameh/ui` drops its `.` export and `src/index.ts` barrel. Import each
    component from its subpath; `./button` now also has a `default` export:
    `import Button from "@karnameh/ui/button"`.
  - `@karnameh/icons` drops its `.` barrel export in favor of a `./*` wildcard:
    `import ChevronDownIcon from "@karnameh/icons/ChevronDownIcon"`.

  Migration:

  ```diff
  -import { Button } from "@karnameh/ui";
  +import Button from "@karnameh/ui/button";

  -import { ChevronDownIcon } from "@karnameh/icons";
  +import ChevronDownIcon from "@karnameh/icons/ChevronDownIcon";
  ```
