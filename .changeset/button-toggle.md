---
"@chatool/ui": minor
---

Add MD3 **toggle** support to `@chatool/ui/button`, matching `IconButton`'s API.

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
