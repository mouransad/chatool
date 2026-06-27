# @chatool/ui

## 0.3.0

### Minor Changes

- 04e1023: Remove the `dropdown-menu`, `bottom-sheet`, and `bottom-sheet-header` components
  to focus the package on `button` for now. Their `exports` subpaths and tsdown
  entries are gone, and `@chatool/icons` is no longer a dependency (only `button`
  remains, which doesn't use icons).

### Patch Changes

- a9c42e5: Adopt the component-directory code-style standard: `button` now lives in
  `src/button/` (`index.tsx` barrel + `button.tsx` arrow component + `button.types.ts`
  - `button.variants.ts`). No public API change — `@chatool/ui/button` still default-
    exports `Button` and named-exports `Button`/`buttonVariants`/`ButtonProps`, and the
    `dist/button.*` filenames are unchanged. The standard (own directory, arrow
    components, separate types/variants, `useLogic` for non-trivial logic) is
    documented in `docs/conventions/` and ESLint-enforced for `packages/ui/src/**`.

## 0.2.2

### Patch Changes

- Merge `@chatool/styles` into `@chatool/core`. The CSS-only theme layer is now
  shipped by `@chatool/core` as two new subpaths, and the standalone
  `@chatool/styles` package is removed.

  **Breaking — migrate your CSS imports and dependency:**

  - `@chatool/styles/styles.css` → `@chatool/core/styles.css`
  - `@chatool/styles/theme.css` → `@chatool/core/theme.css`
  - Remove `@chatool/styles` from your dependencies (the CSS now comes from
    `@chatool/core`, which you already install for `ChatoolProvider`).

  `tailwindcss` is now an **optional** peer of `@chatool/core` (only needed to
  process the theme CSS). `@chatool/ui`'s docs/description now point at
  `@chatool/core` for its required design tokens.

## 0.2.1

### Patch Changes

- Replace the placeholder sample icons with a curated Material Symbols set.

  `@chatool/icons` now ships ~80 common icons, each in four styles — Outlined,
  Rounded, Sharp, Filled — generated (weight 400) from the `@material-symbols/svg-400`
  source via the new `pnpm sync:icons` allowlist. Icons default to `1em` sizing and
  `currentColor`.

  **Breaking:** the old subpaths (`CheckIcon`, `ChevronDownIcon`, `ChevronRightIcon`,
  `SpinnerIcon`, `ChatoolLogoIcon`) are removed. Import the styled equivalents
  instead, e.g. `@chatool/icons/CheckOutlined`, `@chatool/icons/ChevronRightOutlined`,
  `@chatool/icons/ProgressActivityOutlined`. `@chatool/ui`'s dropdown-menu now uses
  `CheckOutlined` / `ChevronRightOutlined` internally.

- Updated dependencies
  - @chatool/icons@0.3.0

## 0.2.0

### Minor Changes

- Ship complete docs inside each package tarball so they're available in consumers'
  `node_modules` for AI tools and humans.

  Each package now bundles a **complete, self-contained `README.md`** (the canonical
  per-package reference) and a generated **`llms.txt`** (an llmstxt.org-style entry
  point listing install, exports, and usage rules). Stale/incorrect import examples
  (e.g. `@chatool/ui` / `@chatool/icons` root-barrel imports) were corrected.

### Patch Changes

- Updated dependencies
  - @chatool/utils@0.1.0
  - @chatool/icons@0.2.0

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
