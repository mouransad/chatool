---
"@chatool/ui": minor
---

Add `@chatool/ui/badge`, the Material 3 badge: a notification, count or status
marker for icons and navigation items.

- A 6dp small dot (no `value`) or a 16dp large pill (`value`), sized, shaped and
  colored to the MD3 spec (`error` / `on-error`, `label-small`).
- Wrap an icon and it anchors itself inside the icon's box at the upper trailing
  corner with the spec offsets. Placement is logical, so it mirrors in RTL.
  Without children it renders inline.
- MD3 content rules built in: `max` (`999+`), `maxLength` truncation, a hidden
  zero (`showZero` to keep it), and `locale` for localized digits.
- Accessible by default: the visible `999+` is hidden from screen readers, which
  hear the full value or "New notification". `label` customizes or silences it,
  and `invisible` hides the badge with an exit animation.
- M3 Expressive motion in pure CSS: it springs in, pops when the count changes,
  morphs between dot and pill, and honors reduced motion.
- `color`, `placement`, `size`, `asChild` and `--md-comp-badge-*` tokens for
  color, geometry, offsets and motion. A pure Server Component with no client
  JavaScript.
