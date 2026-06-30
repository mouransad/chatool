---
"@chatool/ui": minor
---

Add `@chatool/ui/button-group` — the MD3 button group, a new member of the button
family.

- An **invisible container** that spaces and shapes `Button` / `IconButton`
  children. `variant` `standard` _(default, family gap, children keep their own
  shape)_ · `connected` _(2dp gap + a shared segmented track: child corners square
  off and only the group's leading/trailing edges round)_.
- `orientation` `horizontal` _(default)_ · `vertical`.
- **Server-Component-safe** (no `"use client"`): a pure layout that owns no
  selection state — each child keeps its own `selected` / `aria-pressed`, so a
  single-select segmented control is just a connected group of toggle buttons.
- Accessibility: renders a **`role="group"`** (pass `aria-label` /
  `aria-labelledby`); children stay individual Tab stops. `asChild` forwards the
  group styles + role onto your element.
- Gap overridable via `--md-comp-button-group-gap`.
