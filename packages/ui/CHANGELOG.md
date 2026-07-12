# @chatool/ui

## 2.0.0

### Major Changes

- 868cc00: Refactored the design system structure to migrate from Material Design 3 back to shadcn:
  - Removed Material Design 3 buttons, icon-buttons, button-groups, ripples, and spinners from `@chatool/ui`.
  - Removed Material Design 3 theme variables and replaced them with shadcn-compliant oklch colors and radius variables in `@chatool/core`.
  - Initialized shadcn configuration in `packages/ui/components.json`.
  - Simplified tailwind-merge configuration in `@chatool/utils`.
  - Updated all internal apps (playground and storybook) and documentation to remove MD3 references.

### Patch Changes

- Updated dependencies [868cc00]
  - @chatool/utils@0.1.2

## 1.0.0

### Major Changes

- a9b314d: Rework `@chatool/ui/button` to follow the Material Design 3 spec, and ship the
  button family incrementally.

  **`Button` (MD3 common button):**

  - Styles `filled` _(default)_ · `tonal` · `elevated` · `outlined` · `text` —
    **color is fixed per style** per the spec (no `color` prop).
  - M3 Expressive sizes `xs` · `s` _(default)_ · `m` · `l` · `xl`
    (32 / 40 / 56 / 96 / 136 dp).
  - `shape` `round` _(default, pill)_ · `square`, both with a **press shape-morph**
    (size-aware so the corner squish is visible at every size). Round rests at a
    finite half-height radius (not `rounded-full`) so the morph interpolates
    smoothly instead of snapping.
  - `cursor-pointer` on hover (native `<button>` otherwise shows the arrow cursor).
  - **Server-Component-safe:** the module carries **no `"use client"`**, so `Button`
    renders as a React Server Component (Next App Router) and works in Pages Router /
    Vite / webpack. Its only client part is the press **ripple**, a separate
    `"use client"` island (its own internal chunk) — `Slot`/`asChild`, `Spinner`,
    `cn` and the variants are all server-safe.
  - Built-in MD3 press feedback: a pointer **ripple** (Web Animations API, no extra
    deps), the **state layer** (hover/focus/press), and the shape-morph.
  - **Accessibility — follows the WAI-ARIA APG button pattern:** native `<button>`
    (role + Space/Enter); `aria-*` pass through (`aria-pressed`, `aria-haspopup`,
    `aria-expanded`, `aria-label`, …); a **loading** button is non-actionable (mouse
    **and** keyboard) and `aria-busy` while keeping its color + spinner; icon-only
    buttons take `aria-label`; `asChild` expects a natively interactive child.
  - Leading/trailing icon (`startIcon` / `endIcon`), `loading` (+ `loadingPosition`
    / `loadingIndicator`), `asChild`, `disabled`.
  - Per-instance theming via `--md-comp-button-*` CSS variables (fall back to
    `--md-sys-*`).
  - Label/icon and outline colors use an explicit `color:` hint so `cn` keeps them
    next to the typescale class — fixes token-colored text/icons rendering with the
    wrong (inherited) color.

  **BREAKING:** removes the non-spec `color`, `fullWidth`, and `disableElevation`
  props (color is now fixed per style); and defaults `type` to `"button"` (HTML
  defaults to `"submit"`) — pass `type="submit"` for form-submit buttons.

  The rest of the family — icon button, FAB, button group, toggle / segmented — is
  **deferred** and will ship in a later release.

- 5070036: Migrate the design system from shadcn to **Material Design 3 (Material You)**.

  **`@chatool/core`** — `theme.css` now ships the MD3 token foundation: `--md-sys-*`
  system tokens (full color role set, the 15-role type scale, shape, elevation,
  state-layer, and motion) in `:root` + `.dark`, plus `--md-ref-typeface-*`. These
  are mapped to Tailwind utilities via `@theme inline` (`bg-primary`,
  `text-on-surface`, `bg-surface-container-low`, `rounded-*`, `text-label-large`,
  `shadow-elevation-1`, …). `styles.css` base layer now uses MD3 surface/on-surface
  roles and the body type scale.

  **BREAKING:** the shadcn tokens (`--primary`, `--muted`, `--accent`,
  `--destructive`, `--card`, `--popover`, `--border`, `--input`, `--ring`,
  `--radius`, and their `*-foreground` Tailwind utilities like `bg-card` /
  `text-muted-foreground`) are removed. Customize by overriding `--md-sys-*` (Material
  Theme Builder output drops in 1:1) — see `docs/conventions/material-design.md`.

  **`@chatool/ui`** — `Button` is rewritten to the MD3 spec.

  **BREAKING:** variants are now `filled` (default) · `tonal` · `elevated` ·
  `outlined` · `text` (previously `default` · `secondary` · `destructive` ·
  `outline` · `ghost` · `link`); buttons are pill-shaped (`rounded-full`) and use the
  Label Large type scale. Sizes (`default` · `sm` · `lg` · `icon`) are unchanged in
  name.

- d71277c: Remove the `@chatool/ui/text-field` component and all of its configurations, stories, and playground usages.

### Minor Changes

- 35cd59f: Add `@chatool/ui/button-group` — the MD3 **Expressive** button group, a new member
  of the button family.

  - An invisible container that arranges `Button` / `IconButton` children and adds
    the group-level interaction. `variant`:
    - **standard** _(default)_ — children stay flexible; **pressing a button expands
      it and compresses its neighbors** (the Expressive squish), animated in pure CSS.
      Children keep their own shape and per-button press morph. ~12dp gap.
    - **connected** — a tight **2dp** cluster (no width interaction between buttons).
      Children keep their **own default radius**; selection morphs the selected
      child's shape via the button's own smooth round→square animation. The group
      never overrides a child's border-radius, so the select/deselect morph stays
      smooth (between finite radii — no snap from `rounded-full`).
  - `orientation` `horizontal` _(default)_ · `vertical`.
  - **Server-Component-safe** (no `"use client"`): the squish + morph are CSS-only,
    and the group owns no selection state — each child keeps its own `selected` /
    `aria-pressed`, so a single-/multi-select segmented control is just a connected
    group of toggle buttons.
  - Accessibility: renders a **`role="group"`** (pass `aria-label` /
    `aria-labelledby`); children stay individual Tab stops. `asChild` forwards the
    group styles + role onto your element.
  - Gap overridable via `--md-comp-button-group-gap`.

- 35cd59f: Add MD3 **toggle** support to `@chatool/ui/button`, matching `IconButton`'s API.

  - New `selected` prop turns the button into a toggle: it reflects `aria-pressed`,
    morphs a round button to square while selected, fills the `outlined` style with
    inverse-surface, and (with `selectedIcon`) swaps the leading icon.
  - New `selectedIcon` prop — the leading icon shown while `selected` (defaults to
    `startIcon`).
  - Omitting `selected` keeps the plain, non-toggle button (no `aria-pressed`), so
    this is backwards compatible. Per the APG, keep the accessible name constant
    across the toggle.

  `Button` and `IconButton` now share the same `selected` / `selectedIcon` toggle
  contract.

- 35cd59f: Add `@chatool/ui/icon-button` — the MD3 icon-only button, a new member of the
  button family.

  - Styles `standard` _(default)_ · `filled` · `tonal` · `outlined` —
    **color is fixed per style** per the spec (no `color` prop).
  - M3 Expressive sizes `xs` · `s` _(default)_ · `m` · `l` · `xl`, square containers
    on the same height scale as `Button` (32 / 40 / 56 / 96 / 136 dp).
  - `shape` `round` _(default, circle)_ · `square`, both with the press shape-morph.
  - **Toggle** via `selected`: reflects `aria-pressed`, morphs a round button to
    square while selected, and swaps to `selectedIcon`. Omit `selected` for a plain,
    non-toggle button.
  - Reuses the family's `ripple` island, spinner, state layer and focus ring, so it
    stays **Server-Component-safe** (no `"use client"`) and works in Next App Router /
    Pages Router / Vite / webpack.
  - Accessibility (APG button pattern): native `<button>`, default `type="button"`,
    `loading` non-actionable + `aria-busy`; **requires `aria-label`** (icon-only) and
    keeps the label constant across the toggle.
  - Per-component theming via `--md-comp-icon-button-{container-color,icon-color,outline-color,focus-color}`.

### Patch Changes

- Updated dependencies [e6e5f13]
  - @chatool/utils@0.1.1

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
