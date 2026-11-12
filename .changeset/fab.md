---
"@chatool/ui": minor
---

Add `@chatool/ui/fab`, the Material 3 Expressive **FAB and extended FAB** in one morphing element.

- `icon` alone is a FAB; add a `label` for an extended FAB; `expanded={false}` collapses it into a FAB on M3 Expressive's fast spatial spring (the label folds away, the icon glides to the center) while keeping the label as its accessible name.
- Exact M3 Expressive measurements (m3.material.io, Compose `material3` tokens): sizes `small` / `medium` (default, "most recommended") / `large` at 56 / 80 / 96dp with 16 / 20 / 28dp corners, 24 / 28 / 36dp icons, and extended padding, icon↔label space and label typescale per size.
- Six color styles (`primary-container` default, `secondary-container`, `tertiary-container`, `primary`, `secondary`, `tertiary`), `elevation` (`default` / `lowered` / `none`), and the state layer in the icon color.
- Responsive `size` and `expanded` keyed by MD3 window size classes (`{ compact, medium, expanded, large, extraLarge }`), resolved in CSS, so it works as a Server Component.
- `visible` show/hide (scale + fade, `inert` while hidden), a pop-in entrance on first render, `placement` (`bottom-end` / `bottom-center` / `bottom-start`, 16dp margins, safe-area and RTL aware), and `asChild` for links.
- MD3 focus indicator, forced-colors border, `prefers-reduced-motion` support, and `--md-comp-fab-*` tokens for colors, shape, focus, placement and motion.
