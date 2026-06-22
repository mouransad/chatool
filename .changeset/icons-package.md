---
"@karnameh/icons": minor
"@karnameh/ui": minor
---

Extract SVG icons into a new `@karnameh/icons` package. Icons are now generated
from raw SVGs in `packages/icons/svg/` via SVGR (`pnpm generate`) and shipped as
per-icon subpaths. `@karnameh/ui` no longer exports `./icons` and drops the
`lucide-react` dependency — its internal `Check` / `ChevronRight` glyphs now come
from `@karnameh/icons` (`CheckIcon` / `ChevronRightIcon`).

Migration: import each icon from its own path, e.g.
`import CheckIcon from "@karnameh/icons/CheckIcon"`, instead of
`@karnameh/ui/icons`.
