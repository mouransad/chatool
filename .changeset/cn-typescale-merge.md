---
"@chatool/utils": patch
---

Teach `cn`'s `tailwind-merge` that the Material Design 3 typescale (`text-label-large`,
`text-title-medium`, …) are **font sizes**. Previously tailwind-merge mistook those
custom `text-*` names for text _colors_ and silently dropped a real color utility
placed next to one — e.g. `cn("text-label-large", "text-[color:var(--fg)]")` lost the
color, so token-colored text/icons fell back to the inherited color. The typescale and
a token color now coexist and still override correctly.
