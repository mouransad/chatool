---
"@chatool/ui": major
---

Rework `@chatool/ui/button` to follow the Material Design 3 spec, and ship the
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
