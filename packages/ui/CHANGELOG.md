# @chatool/ui

## 0.1.0

### Minor Changes

- 9748740: Extract SVG icons into a new `@chatool/icons` package. Icons are now generated
  from raw SVGs in `packages/icons/svg/` via SVGR (`pnpm generate`) and shipped as
  per-icon subpaths. `@chatool/ui` no longer exports `./icons` and drops the
  `lucide-react` dependency — its internal `Check` / `ChevronRight` glyphs now come
  from `@chatool/icons` (`CheckIcon` / `ChevronRightIcon`).

  Migration: import each icon from its own path, e.g.
  `import CheckIcon from "@chatool/icons/CheckIcon"`, instead of
  `@chatool/ui/icons`.

- 8da047b: Switch `@chatool/ui` and `@chatool/icons` to subpath-only exports (no root
  barrel) so editors auto-import the specific path instead of a root barrel.

  - `@chatool/ui` drops its `.` export and `src/index.ts` barrel. Import each
    component from its subpath; `./button` now also has a `default` export:
    `import Button from "@chatool/ui/button"`.
  - `@chatool/icons` drops its `.` barrel export in favor of a `./*` wildcard:
    `import ChevronDownIcon from "@chatool/icons/ChevronDownIcon"`.

  Migration:

  ```diff
  -import { Button } from "@chatool/ui";
  +import Button from "@chatool/ui/button";

  -import { ChevronDownIcon } from "@chatool/icons";
  +import ChevronDownIcon from "@chatool/icons/ChevronDownIcon";
  ```

### Patch Changes

- Updated dependencies [9748740]
- Updated dependencies [8da047b]
  - @chatool/icons@0.1.0
