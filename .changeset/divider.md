---
"@chatool/ui": minor
---

Add `@chatool/ui/divider`, the Material 3 divider: a 1dp `outline-variant` line
for grouping content in lists and containers.

- Horizontal or vertical, full-width or inset (`start`, `end`, `middle`, 16dp by
  default), with logical insets that flip in right-to-left layouts.
- A `heavy` 8dp weight, and an optional label drawn between two line segments.
- Decorative by default, as MD3 specifies; `decorative={false}` renders a native
  `<hr>` or `role="separator"`, and `asChild` places it on an `<li>` in lists and
  menus.
- Customizable through `--md-comp-divider-*` tokens, visible in forced-colors
  mode, and a pure Server Component with no client JavaScript.
