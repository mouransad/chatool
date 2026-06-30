---
"@chatool/ui": minor
---

Add `@chatool/ui/button-group` — the MD3 **Expressive** button group, a new member
of the button family.

- An invisible container that arranges `Button` / `IconButton` children and adds
  the group-level interaction. `variant`:
  - **standard** _(default)_ — children stay flexible; **pressing a button expands
    it and compresses its neighbors** (the Expressive squish), animated in pure CSS.
    Children keep their own shape and per-button press morph. ~12dp gap.
  - **connected** — a tight **2dp** cluster (no width interaction between buttons).
    Children keep their **own default radius**; selection morphs the selected
    child's shape via the button's own smooth round→square animation. The group
    never overrides a child's border-radius, so the select/deselect morph stays
    smooth (between finite radii — no snap from `rounded-full`).
- `orientation` `horizontal` _(default)_ · `vertical`.
- **Server-Component-safe** (no `"use client"`): the squish + morph are CSS-only,
  and the group owns no selection state — each child keeps its own `selected` /
  `aria-pressed`, so a single-/multi-select segmented control is just a connected
  group of toggle buttons.
- Accessibility: renders a **`role="group"`** (pass `aria-label` /
  `aria-labelledby`); children stay individual Tab stops. `asChild` forwards the
  group styles + role onto your element.
- Gap overridable via `--md-comp-button-group-gap`.
