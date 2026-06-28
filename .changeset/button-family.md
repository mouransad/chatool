---
"@chatool/ui": major
---

Build out the complete Material Design 3 **button family**. Adds four new
subpaths alongside the rewritten `button`:

- **`@chatool/ui/button`** — common buttons, now with `color`
  (primary/secondary/tertiary/error), the M3 Expressive `size` scale (xs–xl),
  `shape` (round/square), `startIcon`/`endIcon`, `loading`/`loadingPosition`/
  `loadingIndicator`, `fullWidth`, `disableElevation`, and group inheritance.
- **`@chatool/ui/icon-button`** — `IconButton`, four styles
  (standard/filled/tonal/outlined), sizes, widths, and **toggle** support
  (`selected`/`defaultSelected`/`onSelectedChange`) via Radix `Toggle`.
- **`@chatool/ui/fab`** — `Fab`, sizes (sm/md/lg), `extended`, color styles
  (incl. `surface`), `lowered`.
- **`@chatool/ui/button-group`** — `ButtonGroup`, `standard`/`connected` layout,
  shares `buttonVariant`/`color`/`size` with its children.
- **`@chatool/ui/toggle-button-group`** — `ToggleButtonGroup` +
  `ToggleButtonGroupItem`, single & multi select (Radix `ToggleGroup`), the
  segmented-button look.

Every component is themeable via per-component `--md-comp-*` CSS variables (which
fall back to `--md-sys-*`), the `color` prop, or `className`.

**BREAKING (`Button`):** the size scale changed from `default`/`sm`/`lg`/`icon`
to `xs`/`s`/`m`/`l`/`xl` (default is now `s`); the old icon-only `size="icon"`
moves to the dedicated `IconButton`.
