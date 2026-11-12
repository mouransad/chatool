---
"@chatool/ui": minor
---

Add `@chatool/ui/card`, the Material 3 card with M3 Expressive shape and motion.

- Three MD3 variants with the exact Compose / Material Web tokens: **filled**
  (default, `surface-container-highest`), **elevated** (`surface-container-low`,
  level 1) and **outlined** (`surface` + 1dp `outline-variant`). Per-state
  elevations (hover 2 / 1, pressed, dragged 4 / 3, disabled), the `on-surface` state
  layer at 8 / 10 / 10 / 16%, MD3's 3dp `secondary` focus indicator, and the
  disabled containers and outline from `CardDefaults`.
- Parts on the same subpath: `CardMedia` (full-bleed by default, orientation- and
  position-aware; `inset` with optically-round corners; `placement="first"` for
  MD3's heading-first reading order), `CardHeader` (`leading` / `trailing`),
  `CardContent`, `CardHeadline` (`<h3>`, `size`, `maxLines`), `CardSubhead`,
  `CardSupportingText`, `CardActions` (`align`) and `CardPrimaryAction`.
- **Accessible clickable cards.** `CardPrimaryAction` is a real link or button
  stretched over the card. The card hovers, ripples and focuses as one target, the
  link is named by its own text, headings stay headings, and nested buttons stay
  separately clickable. Short cards can also **be** the control
  (`<Card asChild><a|button|label>`), which is auto-detected as interactive.
- **Selectable cards** (MDC-Android's checked card): `selected` adds a `secondary`
  tint and outline and a check-circle that pops in on the Expressive fast-spatial
  spring. It sets `aria-pressed` on `<button>` cards and also follows a checked
  `<input>` inside a `<label>` card, so radio-group cards work with zero JS.
- `shape` covers the M3 Expressive corner scale (`none` … `extra-extra-large`).
  Changes morph on the Expressive spatial spring. `orientation` is `vertical` or
  `horizontal`. There are also `dragged` and `disabled` (native, `aria-disabled` or
  `inert`).
- Motion follows Compose: elevation enters in 120ms and exits in 150ms.
  `prefers-reduced-motion` drops the spatial motion. `forced-colors` keeps a
  boundary on every variant. `--md-comp-card-*` tokens cover colors, outline,
  shape, padding, gaps, elevation, focus, the check icon and motion.
- Server Components throughout: every state is CSS (`:has()`, attributes,
  pseudo-classes). The only client piece is the shared ripple.
