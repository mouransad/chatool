---
"@chatool/ui": minor
---

Add `@chatool/ui/icon-button` — the MD3 icon-only button, a new member of the
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
