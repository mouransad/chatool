# Material Design 3 tokens & theming

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Material Design 3**

`@chatool/*` implements **Material Design 3 (Material You)**. This page is the
single source of truth for the token system, the Tailwind mapping, and — the
firm requirement — **how consuming apps customize everything**.

`@chatool/icons` already ships **Material Symbols** (Outlined / Rounded / Sharp /
Filled), so the design language is consistent end-to-end.

## Token tiers (the architecture)

Mirrors Material Web / Angular Material 3. Three tiers, CSS custom properties
throughout:

| Tier          | Prefix        | Holds                                                                                      | Where                                                  |
| ------------- | ------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| **Reference** | `--md-ref-*`  | raw values (the type family)                                                               | `@chatool/core/theme.css`                              |
| **System**    | `--md-sys-*`  | roles: color, typescale, shape, elevation, state, motion — **the public theming contract** | `@chatool/core/theme.css` (`:root` + `.dark`)          |
| **Component** | `--md-comp-*` | a component's own knobs (default to `--md-sys-*`)                                          | the component's cva `*.variants.ts` (in `@chatool/ui`) |

The **system tokens are what consumers override.** They follow the MD3 spec
names exactly, so output from the **Material Theme Builder** (or
`material-color-utilities`) drops into `:root` / `.dark` unchanged.

## The ergonomics layer (`@theme inline`)

`theme.css` maps every `--md-sys-*` token to a Tailwind v4 theme variable, so
components style with short utilities instead of raw `var()`:

| MD3 token                              | Tailwind utility                                            |
| -------------------------------------- | ----------------------------------------------------------- |
| `--md-sys-color-primary`               | `bg-primary`, `text-primary`, `border-primary`              |
| `--md-sys-color-on-surface`            | `text-on-surface`                                           |
| `--md-sys-color-surface-container-low` | `bg-surface-container-low`                                  |
| `--md-sys-shape-corner-medium`         | `rounded-md` (`rounded-full` is built-in)                   |
| `--md-sys-typescale-label-large-*`     | `text-label-large` (size + line-height + weight + tracking) |
| `--md-sys-elevation-1`                 | `shadow-elevation-1`                                        |

> **Rule:** components reference **tokens, never raw hex** — always a `--color-*`
> utility (or `var(--md-sys-*)` for state-layer `color-mix`), never a literal
> color. That is what makes every component themeable from one place.

## Component tokens (`--md-comp-*`) — per-component customization

Each `@chatool/ui` component exposes its own override layer so an app can re-theme
**one** component (globally or per-instance) without affecting the rest. A painted
role reads its component token first and falls back to the computed value:

```
/* in the component's cva (Tailwind arbitrary value) */
bg-[var(--md-comp-button-container-color,var(--_bg))]
```

`--_bg` / `--_main` / `--_container` / … are **local vars** set by the `variant`
and `color` (the `color` prop assigns the palette; the `variant` picks which roles
to paint). Naming is `--md-comp-<component>-<role>`, e.g.
`--md-comp-button-container-color`, `--md-comp-button-label-text-color`,
`--md-comp-button-outline-color`, `--md-comp-icon-button-*`, `--md-comp-fab-*`,
`--md-comp-toggle-button-*`. Consumers override globally (in `:root`) or per
instance (`style={{ "--md-comp-button-container-color": "#006971" }}`). This
mirrors Material Web's component-token model. The full override surface lives in
each component's `*.variants.ts`; document new tokens in
[packages/ui/README.md](../../packages/ui/README.md).

The four customization layers, increasingly specific: **global `--md-sys-*`** →
**`color` prop** → **`--md-comp-*` token** → **`className`** (cva + `cn` merge).

## Token groups (what ships)

- **Color** — full MD3 role set: `primary` / `secondary` / `tertiary` / `error`
  (each `·` `on-` `·` `-container` `·` `on-…-container`); the surface hierarchy
  (`surface`, `surface-dim/bright`, `surface-container-lowest…highest`,
  `on-surface`, `on-surface-variant`); `outline`, `outline-variant`,
  `inverse-surface`, `inverse-on-surface`, `inverse-primary`, `scrim`, `shadow`,
  `surface-tint`. Light in `:root`, dark in `.dark`.
- **Typography** — the 15-role type scale (`display/headline/title/body/label` ×
  `large/medium/small`), each with `-font` / `-size` / `-line-height` / `-weight`
  / `-tracking`. Default family **Roboto** via `--md-ref-typeface-{plain,brand}`.
- **Shape** — `--md-sys-shape-corner-{none,extra-small,small,medium,large,extra-large,full}`
  (`0 · 4 · 8 · 12 · 16 · 28 · 9999px`).
- **Elevation** — `--md-sys-elevation-{0..5}` dual-layer box-shadows.
- **State** — `--md-sys-state-{hover,focus,pressed,dragged}-opacity`
  (`8% · 10% · 10% · 16%`), applied as a translucent on-color overlay
  (`color-mix`). The canonical `before:` overlay element is the richer form.
- **Motion** — `--md-sys-motion-easing-*` and `--md-sys-motion-duration-*`.
- **Spacing** — **none added.** MD3's 4dp grid is Tailwind's default 4px scale;
  use `p-*` / `gap-*` directly (touch target 48dp = `min-h-12`).

## Customization model (the four ways)

1. **Brand / global** — override `--md-sys-color-*` (+ typescale / shape) in
   `:root` and `.dark` after `@import "@chatool/core/styles.css"`. Paste a
   Material Theme Builder export verbatim.
2. **Type family** — override `--md-ref-typeface-plain` / `-brand` once.
3. **Tailwind utilities** — `@theme inline` exposes `bg-*` / `text-*` /
   `rounded-*` / `text-<role>` / `shadow-elevation-*`, so app code never touches
   hex.
4. **Per-component** — `className` (merged through cva + `cn`) and exported
   `*Variants` (e.g. `buttonVariants`) for composition.

Dark mode is **class-based** (`.dark` on `<html>`), driven by `ChatoolProvider`'s
no-flash script — see [Client vs Server Components](client-server-components.md)
and the [core README](../../packages/core/README.md).

## Building a component (MD3 checklist)

- Style with token utilities (`bg-primary text-on-primary`), never literals.
- Shape from the scale (`rounded-full` for buttons/chips, `rounded-lg`/`rounded-xl`
  for cards/sheets).
- Type from the scale (`text-label-large` for buttons, `text-body-medium` for
  body copy).
- Interactive surfaces get a **state layer** (hover/focus/pressed) from the on-color.
- Respect the **48dp** minimum touch target.
- `Button` is the reference implementation: see
  [`packages/ui/src/button/button.variants.ts`](../../packages/ui/src/button/button.variants.ts).

## Reference

- Material Design 3 — <https://m3.material.io>
- Type scale tokens — <https://m3.material.io/styles/typography/type-scale-tokens>
- Color roles — <https://m3.material.io/styles/color/roles>
- Material Web theming — <https://material-web.dev/theming/material-theming/>
- Material Theme Builder — <https://material-foundation.github.io/material-theme-builder/>

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
