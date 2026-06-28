---
"@chatool/core": major
"@chatool/ui": major
---

Migrate the design system from shadcn to **Material Design 3 (Material You)**.

**`@chatool/core`** — `theme.css` now ships the MD3 token foundation: `--md-sys-*`
system tokens (full color role set, the 15-role type scale, shape, elevation,
state-layer, and motion) in `:root` + `.dark`, plus `--md-ref-typeface-*`. These
are mapped to Tailwind utilities via `@theme inline` (`bg-primary`,
`text-on-surface`, `bg-surface-container-low`, `rounded-*`, `text-label-large`,
`shadow-elevation-1`, …). `styles.css` base layer now uses MD3 surface/on-surface
roles and the body type scale.

**BREAKING:** the shadcn tokens (`--primary`, `--muted`, `--accent`,
`--destructive`, `--card`, `--popover`, `--border`, `--input`, `--ring`,
`--radius`, and their `*-foreground` Tailwind utilities like `bg-card` /
`text-muted-foreground`) are removed. Customize by overriding `--md-sys-*` (Material
Theme Builder output drops in 1:1) — see `docs/conventions/material-design.md`.

**`@chatool/ui`** — `Button` is rewritten to the MD3 spec.

**BREAKING:** variants are now `filled` (default) · `tonal` · `elevated` ·
`outlined` · `text` (previously `default` · `secondary` · `destructive` ·
`outline` · `ghost` · `link`); buttons are pill-shaped (`rounded-full`) and use the
Label Large type scale. Sizes (`default` · `sm` · `lg` · `icon`) are unchanged in
name.
