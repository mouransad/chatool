/*
 * Shared configuration for the `@chatool/ui` **card** family — the Material 3
 * card measurements, per-variant tokens, state wiring and motion, kept in one
 * file so future siblings (e.g. a carousel item) draw the **exact same** card.
 *
 * Sources (all three agree unless noted):
 *
 * - m3.material.io/components/cards (specs, guidelines, accessibility): three
 *   variants — elevated / filled / outlined — that differ in style only; a 12dp
 *   (`corner-medium`) container; 16dp padding; ≤ 8dp between cards; text is
 *   start-aligned. A card is either a **non-actionable container** (no hover, no
 *   ripple, no role) or **directly actionable** (one tab stop, hover + ripple,
 *   `button`/`link` role) — never an action stacked on an actionable surface.
 * - Compose `ElevatedCardTokens` / `FilledCardTokens` / `OutlinedCardTokens`
 *   (v0_210) + Material Web tokens v34 (`md-comp-*-card`): container colors,
 *   per-state elevations, the 1dp `outline-variant` outline, the `on-surface`
 *   state layer, the 3dp `secondary` focus indicator 2dp outside the container.
 * - Compose `material3/internal/Elevation.kt`: elevation enters on
 *   `tween(120ms, FastOutSlowIn)` and leaves on `tween(150ms, (0.4,0,0.6,1))`.
 * - MDC-Android `MaterialCardView` (the only Material implementation with a
 *   **checked** card): `secondary` 16% tint, `secondary` outline, a 24dp
 *   check-circle 8dp from the top-end corner, `secondary` state layer.
 * - M3 Expressive shape: the 10-step corner scale (incl. large-increased 20dp,
 *   extra-large-increased 32dp, extra-extra-large 48dp) and **optical
 *   roundness** (inner radius = outer radius − padding) for inset media.
 *
 * Every value reads a `--md-comp-card-*` token first and falls back to the spec
 * value (in `rem`, so cards scale with the user's font size). All card locals
 * are prefixed `--_c-` so they never leak into nested controls (a checkbox in a
 * card has its own `--_sl-*` chain), and the base **resets** every conditional
 * local so a card nested in a hovered/selected card doesn't inherit its state.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full — never compose a variant prefix with a
 * utility. In arbitrary `calc()` values the operator is written `_-_` (Tailwind
 * turns a bare `-var(--_x)` into `var(-- x)`).
 */

/** MD3 card variants: same legibility + function, different separation style. */
export type CardVariant = "elevated" | "filled" | "outlined";

/**
 * The M3 Expressive corner-radius scale. `medium` (12dp) is the card spec;
 * larger steps are for hero / expressive moments. MD3 cautions against `full`
 * on information-dense containers, so it's intentionally not offered.
 */
export type CardShape =
  | "none"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "large-increased"
  | "extra-large"
  | "extra-large-increased"
  | "extra-extra-large";

/**
 * Per-shape container radius as the `--_c-shape` local, which children read
 * (inset media derives its optically-round radius from it). Only `medium`, the
 * spec default, honours the global `--md-comp-card-container-shape` override —
 * an explicit `shape` prop always wins.
 */
export const SHAPE: Record<CardShape, string> = {
  none: "[--_c-shape:var(--md-sys-shape-corner-none,0px)]",
  "extra-small": "[--_c-shape:var(--md-sys-shape-corner-extra-small,0.25rem)]",
  small: "[--_c-shape:var(--md-sys-shape-corner-small,0.5rem)]",
  medium:
    "[--_c-shape:var(--md-comp-card-container-shape,var(--md-sys-shape-corner-medium,0.75rem))]",
  large: "[--_c-shape:var(--md-sys-shape-corner-large,1rem)]",
  "large-increased":
    "[--_c-shape:var(--md-sys-shape-corner-large-increased,1.25rem)]",
  "extra-large": "[--_c-shape:var(--md-sys-shape-corner-extra-large,1.75rem)]",
  "extra-large-increased":
    "[--_c-shape:var(--md-sys-shape-corner-extra-large-increased,2rem)]",
  "extra-extra-large":
    "[--_c-shape:var(--md-sys-shape-corner-extra-extra-large,3rem)]",
};

/**
 * Per-variant **static** locals (every variant sets every one, so a nested card
 * never inherits its parent's): rest / disabled container (`--_c-bg`,
 * `--_c-bg-dis`), outline at rest / focus / selected / disabled (`--_c-ol*`),
 * and the elevation per state — rest, hover, focus, pressed, dragged, disabled
 * (`--_c-e0/eh/ef/ep/ed/ex`) — exactly as the Compose / Material Web tokens.
 *
 * Disabled containers follow Compose's `CardDefaults`: elevated → `surface`,
 * filled → `surface-variant` 38% over its container, outlined keeps its
 * container and fades the outline to `outline` 12%.
 */
export const VARIANT: Record<CardVariant, string> = {
  elevated:
    "[--_c-bg:var(--md-sys-color-surface-container-low)] [--_c-bg-dis:var(--md-sys-color-surface)] [--_c-ol:transparent] [--_c-ol-focus:transparent] [--_c-ol-sel:transparent] [--_c-ol-dis:transparent] [--_c-e0:var(--md-comp-card-container-elevation,var(--md-sys-elevation-1))] [--_c-eh:var(--md-sys-elevation-2)] [--_c-ef:var(--md-sys-elevation-1)] [--_c-ep:var(--md-sys-elevation-1)] [--_c-ed:var(--md-sys-elevation-4)] [--_c-ex:var(--md-sys-elevation-1)]",
  filled:
    "[--_c-bg:var(--md-sys-color-surface-container-highest)] [--_c-bg-dis:color-mix(in_srgb,var(--md-sys-color-surface-variant)_38%,var(--_c-base-bg))] [--_c-ol:transparent] [--_c-ol-focus:transparent] [--_c-ol-sel:transparent] [--_c-ol-dis:transparent] [--_c-e0:var(--md-comp-card-container-elevation,var(--md-sys-elevation-0))] [--_c-eh:var(--md-sys-elevation-1)] [--_c-ef:var(--md-sys-elevation-0)] [--_c-ep:var(--md-sys-elevation-0)] [--_c-ed:var(--md-sys-elevation-3)] [--_c-ex:var(--md-sys-elevation-0)]",
  outlined:
    "[--_c-bg:var(--md-sys-color-surface)] [--_c-bg-dis:var(--_c-base-bg)] [--_c-ol:var(--md-comp-card-outline-color,var(--md-sys-color-outline-variant))] [--_c-ol-focus:var(--md-sys-color-on-surface)] [--_c-ol-sel:var(--md-sys-color-secondary)] [--_c-ol-dis:color-mix(in_srgb,var(--md-sys-color-outline)_12%,transparent)] [--_c-e0:var(--md-comp-card-container-elevation,var(--md-sys-elevation-0))] [--_c-eh:var(--md-sys-elevation-1)] [--_c-ef:var(--md-sys-elevation-0)] [--_c-ep:var(--md-sys-elevation-0)] [--_c-ed:var(--md-sys-elevation-3)] [--_c-ex:var(--md-sys-elevation-0)]",
};

/**
 * Motion. State changes use Compose's elevation tweens — **enter** 120ms
 * FastOutSlowIn (`--_c-tr-on`), **exit** 150ms `(0.4,0,0.6,1)` (`--_c-tr`) —
 * applied to the shadow, the container / state-layer color and the outline (CSS
 * runs the transition declared on the destination state, so each interaction
 * setter swaps in `--_c-tr-in`). A `shape` change morphs the corners on the M3
 * **Expressive default spatial** spring, `spring(0.8, 380)`, 412ms, as a CSS
 * `linear()` sampled from Compose's `ExpressiveMotionTokens`. Reduced motion
 * keeps the color/shadow fades and drops the spatial morph.
 */
export const MOTION =
  "[--_c-spatial:var(--md-comp-card-spatial-easing,linear(0,0.031,0.107,0.209,0.32,0.433,0.538,0.634,0.718,0.789,0.847,0.894,0.931,0.959,0.979,0.994,1.004,1.01,1.013,1.015,1.015,1.014,1.013,1.011,1.01,1.008,1.006,1.005,1.004,1.003,1))] [--_c-sd:var(--md-comp-card-spatial-duration,412ms)] motion-reduce:[--_c-sd:0s] [--_c-tr:box-shadow_var(--md-comp-card-exit-duration,150ms)_cubic-bezier(0.4,0,0.6,1),background-color_var(--md-comp-card-exit-duration,150ms)_cubic-bezier(0.4,0,0.6,1),border-color_var(--md-comp-card-exit-duration,150ms)_cubic-bezier(0.4,0,0.6,1),border-radius_var(--_c-sd)_var(--_c-spatial)] [--_c-tr-on:box-shadow_var(--md-comp-card-enter-duration,120ms)_cubic-bezier(0.4,0,0.2,1),background-color_var(--md-comp-card-enter-duration,120ms)_cubic-bezier(0.4,0,0.2,1),border-color_var(--md-comp-card-enter-duration,120ms)_cubic-bezier(0.4,0,0.2,1),border-radius_var(--_c-sd)_var(--_c-spatial)] [transition:var(--_c-tr-in,var(--_c-tr))]";

/**
 * Resets every **conditional** local to the guaranteed-invalid value, so each
 * card starts from rest even inside a hovered / selected / disabled card. The
 * state setters below out-specify these (they carry a pseudo-class), so the
 * reset never masks the card's own state.
 */
export const RESET =
  "[--_c-hover-e:initial] [--_c-focus-e:initial] [--_c-press-e:initial] [--_c-drag-e:initial] [--_c-off-e:initial] [--_c-sl-hover:initial] [--_c-sl-focus:initial] [--_c-sl-press:initial] [--_c-sl-drag:initial] [--_c-sl-off:initial] [--_c-focus-ol:initial] [--_c-sel-ol:initial] [--_c-off-ol:initial] [--_c-sel-bg:initial] [--_c-off-bg:initial] [--_c-sel-state:initial] [--_c-tr-in:initial] [--_c-chk:initial] [--_c-chk-tr:initial] [--_c-chk-dim:initial]";

/**
 * The container. Painted roles resolve through **priority chains of locals**
 * (each state only sets its own local; the chain picks the strongest), so the
 * result never depends on stylesheet order and Prettier's class sorting is safe:
 *
 * - container: disabled › selected › rest (`--md-comp-card-container-color`)
 * - elevation: disabled › dragged › pressed › hovered › focused › rest
 * - state layer: disabled › dragged › pressed › focused › hovered › none
 * - outline: disabled › selected › focused › rest
 *
 * The **state layer** is the `::before` and the **outline** the `::after`, both
 * stacked **above** the content (pointer-transparent) — like Compose, whose
 * border and indication draw over the card's content — so the hover tint and
 * the ripple cover full-bleed media too, and a full-bleed image runs under the
 * outline right to the container edge. Elevated / filled cards keep a
 * transparent outline: Windows High Contrast (`forced-colors`) repaints it, so
 * every card keeps a visible boundary there. The focus indicator is the
 * container's own `outline` (3dp `secondary`, 2dp outside), which
 * `overflow: clip` never clips.
 */
export const CONTAINER =
  "relative isolate flex min-w-0 overflow-clip text-start no-underline [--_c-pad:var(--md-comp-card-padding,1rem)] [--_c-base-bg:var(--md-comp-card-container-color,var(--_c-bg))] [--_c-state:var(--_c-sel-state,var(--md-comp-card-state-layer-color,var(--md-sys-color-on-surface)))] [--_c-sl:var(--_c-sl-off,var(--_c-sl-drag,var(--_c-sl-press,var(--_c-sl-focus,var(--_c-sl-hover,0%)))))] gap-[var(--md-comp-card-gap,1rem)] rounded-[var(--_c-shape)] bg-[var(--_c-off-bg,var(--_c-sel-bg,var(--_c-base-bg)))] p-[var(--_c-pad)] text-[color:var(--md-comp-card-content-color,var(--md-sys-color-on-surface))] [box-shadow:var(--_c-off-e,var(--_c-drag-e,var(--_c-press-e,var(--_c-hover-e,var(--_c-focus-e,var(--_c-e0))))))] outline-0 outline-offset-[var(--md-comp-card-focus-indicator-outline-offset,2px)] outline-[color:var(--md-comp-card-focus-indicator-color,var(--md-sys-color-secondary))] outline-solid [-webkit-tap-highlight-color:transparent] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:bg-[color-mix(in_srgb,var(--_c-state)_var(--_c-sl),transparent)] before:content-[''] before:[transition:inherit] after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:rounded-[inherit] after:border-[length:var(--md-comp-card-outline-width,1px)] after:border-solid after:border-[color:var(--_c-off-ol,var(--_c-sel-ol,var(--_c-focus-ol,var(--_c-ol))))] after:content-[''] after:[transition:inherit] data-interactive:cursor-pointer forced-colors:outline-[color:Highlight]";

/**
 * **Hovered** — a directly actionable card (`data-interactive`) or a card whose
 * stretched `CardPrimaryAction` is hovered. Wrapped in `(hover: hover)` so a tap
 * on a touch screen never leaves a stuck highlight. Hovering a nested control
 * (raised above the stretched action) un-hovers the card, so the two never
 * stack — MD3's "no action on an actionable surface".
 */
export const HOVER =
  "[@media(hover:hover)]:[&:is([data-interactive]:hover,:has([data-slot=card-primary-action]:hover))]:[--_c-hover-e:var(--_c-eh)] [@media(hover:hover)]:[&:is([data-interactive]:hover,:has([data-slot=card-primary-action]:hover))]:[--_c-sl-hover:calc(var(--md-sys-state-hover-opacity,0.08)*100%)] [@media(hover:hover)]:[&:is([data-interactive]:hover,:has([data-slot=card-primary-action]:hover))]:[--_c-tr-in:var(--_c-tr-on)]";

/**
 * **Focused** (keyboard) — the card itself, a direct `<input>` child (a
 * `<label>` card over a visually-hidden checkbox/radio), or the stretched
 * primary action. Shows the 3dp focus indicator on the **container** (the
 * action's own outline is suppressed), and the outlined card's outline turns
 * `on-surface`.
 */
export const FOCUS =
  "[&:is([data-interactive]:focus-visible,:has(>input:focus-visible),:has([data-slot=card-primary-action]:focus-visible))]:[--_c-focus-e:var(--_c-ef)] [&:is([data-interactive]:focus-visible,:has(>input:focus-visible),:has([data-slot=card-primary-action]:focus-visible))]:[--_c-sl-focus:calc(var(--md-sys-state-focus-opacity,0.1)*100%)] [&:is([data-interactive]:focus-visible,:has(>input:focus-visible),:has([data-slot=card-primary-action]:focus-visible))]:[--_c-focus-ol:var(--_c-ol-focus)] [&:is([data-interactive]:focus-visible,:has(>input:focus-visible),:has([data-slot=card-primary-action]:focus-visible))]:[--_c-tr-in:var(--_c-tr-on)] [&:is([data-interactive]:focus-visible,:has(>input:focus-visible),:has([data-slot=card-primary-action]:focus-visible))]:outline-[length:var(--md-comp-card-focus-indicator-thickness,3px)]";

/** **Pressed** — the card or its stretched primary action. */
export const PRESS =
  "[&:is([data-interactive]:active,:has([data-slot=card-primary-action]:active))]:[--_c-press-e:var(--_c-ep)] [&:is([data-interactive]:active,:has([data-slot=card-primary-action]:active))]:[--_c-sl-press:calc(var(--md-sys-state-pressed-opacity,0.1)*100%)] [&:is([data-interactive]:active,:has([data-slot=card-primary-action]:active))]:[--_c-tr-in:var(--_c-tr-on)]";

/**
 * **Dragged** (`data-dragged`, set by the `dragged` prop) — picked up: raised to
 * the dragged elevation with the 16% dragged state layer, and drawn in front of
 * its siblings (MD3: "when moving a card, increase its elevation").
 */
export const DRAG =
  "data-[dragged=true]:z-[1] data-[dragged=true]:cursor-grabbing data-[dragged=true]:[--_c-drag-e:var(--_c-ed)] data-[dragged=true]:[--_c-sl-drag:calc(var(--md-sys-state-dragged-opacity,0.16)*100%)] data-[dragged=true]:[--_c-tr-in:var(--_c-tr-on)]";

/**
 * **Selected** (MDC-Android's checked card) — `selected` prop, a checked direct
 * `<input>` child (a `<label>` card), or a pressed toggle primary action. Tints
 * the container `secondary` 16%, switches the state layer to `secondary`,
 * outlines an outlined card in `secondary`, and pops the check icon in on the
 * Expressive **fast spatial** spring (0.6 / 800, ~9.5% overshoot, 348ms).
 */
export const SELECTED =
  "[&:is([data-selected=true],:has(>input:checked),:has([data-slot=card-primary-action][aria-pressed=true]))]:[--_c-sel-bg:color-mix(in_srgb,var(--md-comp-card-selected-tint-color,var(--md-sys-color-secondary))_16%,var(--_c-base-bg))] [&:is([data-selected=true],:has(>input:checked),:has([data-slot=card-primary-action][aria-pressed=true]))]:[--_c-sel-state:var(--md-sys-color-secondary)] [&:is([data-selected=true],:has(>input:checked),:has([data-slot=card-primary-action][aria-pressed=true]))]:[--_c-sel-ol:var(--_c-ol-sel)] [&:is([data-selected=true],:has(>input:checked),:has([data-slot=card-primary-action][aria-pressed=true]))]:[--_c-chk:1] [&:is([data-selected=true],:has(>input:checked),:has([data-slot=card-primary-action][aria-pressed=true]))]:[--_c-chk-tr:scale_348ms_linear(0,0.027,0.098,0.198,0.315,0.437,0.557,0.67,0.771,0.858,0.931,0.988,1.031,1.062,1.082,1.092,1.095,1.092,1.085,1.076,1.064,1.053,1.042,1.031,1.021,1.013,1.006,1.001,0.997,0.994,0.992,0.991,0.991,0.991,0.992,0.993,0.994,0.995,0.996,0.997,1),opacity_137ms_linear(0,0.099,0.285,0.47,0.623,0.74,0.824,0.883,0.923,0.95,0.968,0.98,0.987,0.992,0.995,0.997,1)]";

/**
 * **Disabled** — `disabled` prop (`data-disabled`), a native `:disabled` /
 * `aria-disabled` card, a disabled direct `<input>`, or a disabled primary
 * action. Non-interactive, the disabled container + elevation + outline, no
 * state layer, and the content at 38% (the check icon dims through
 * `--_c-chk-dim`, so it stays hidden when unselected).
 */
export const DISABLED =
  "[&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:pointer-events-none [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:cursor-default [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:[--_c-off-bg:var(--_c-bg-dis)] [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:[--_c-off-ol:var(--_c-ol-dis)] [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:[--_c-off-e:var(--_c-ex)] [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:[--_c-sl-off:0%] [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))]:[--_c-chk-dim:0.38] [&:is([data-disabled=true],:disabled,[aria-disabled=true],:has(>input:disabled),:has([data-slot=card-primary-action]:is(:disabled,[aria-disabled=true])))>*:not([data-slot=card-check])]:opacity-[0.38]";

/**
 * The press ripple, lifted above the content (`z-[1]`, like the state layer) so
 * it reads across full-bleed media — MD3: "a touch ripple appears across the
 * card". Merged over the shared ripple's `-z-10` by `cn`.
 */
export const RIPPLE = "z-[1]";

/**
 * The MDC-Android checked icon: a 24dp check-circle 8dp from the top-end corner
 * (logical inset, so RTL mirrors it), above the state layer. Its visibility is
 * the inherited `--_c-chk` (0 / 1) driving `scale` + `opacity`; it enters on the
 * fast-spatial spring set by `SELECTED` and leaves on a quick
 * `emphasized-accelerate` fade-shrink (exits get out of the way).
 */
export const CHECK =
  "pointer-events-none absolute end-[var(--md-comp-card-checked-icon-margin,0.5rem)] top-[var(--md-comp-card-checked-icon-margin,0.5rem)] z-[2] flex size-[var(--md-comp-card-checked-icon-size,1.5rem)] opacity-[min(var(--_c-chk,0),var(--_c-chk-dim,1))] [scale:var(--_c-chk,0)] [transition:var(--_c-chk-tr,scale_150ms_cubic-bezier(0.3,0,0.8,0.15),opacity_150ms_cubic-bezier(0.3,0,0.8,0.15))] motion-reduce:[transition:opacity_150ms_linear] forced-colors:forced-color-adjust-none [&>svg]:size-full";
