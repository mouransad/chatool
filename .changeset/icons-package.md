---
"@karnameh/icons": minor
"@karnameh/ui": minor
---

Extract SVG icons into a new `@karnameh/icons` package. Icons are now generated
from raw SVGs in `packages/icons/svg/` via SVGR (`pnpm generate`) and shipped as
a single tree-shakeable barrel. `@karnameh/ui` no longer exports `./icons` and
drops the `lucide-react` dependency — its internal `Check` / `ChevronRight`
glyphs now come from `@karnameh/icons` (`CheckIcon` / `ChevronRightIcon`).

Migration: import icons from `@karnameh/icons` instead of `@karnameh/ui/icons`.
