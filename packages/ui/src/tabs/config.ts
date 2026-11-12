/*
 * Shared configuration for the `@chatool/ui` **tabs** family: the MD3 tab
 * geometry, per-variant color roles, state wiring and Expressive motion. Kept
 * in one file so every part of the family (tab list, tab, panels) draws and
 * moves from the same numbers.
 *
 * Sources (they agree unless noted):
 *
 * - m3.material.io/components/tabs (specs, guidelines, accessibility): primary
 *   and secondary variants; a 48dp container (64dp with a stacked icon and
 *   label); 24dp icons; `title-small` labels; a 1dp `outline-variant` divider
 *   **inside** the height; the primary indicator is 3dp tall with a `3,3,0,0`
 *   shape, inset 2dp on each side of the content and at least 24dp long; the
 *   secondary indicator is 2dp and spans the whole tab; 8dp between an inline
 *   icon and its label, 4dp between the label and a badge, and a badge overlaps
 *   a stacked icon by 6dp; scrollable tabs start 52dp from the leading edge.
 * - Compose `material3/tokens/{Primary,Secondary}NavigationTabTokens.kt` and
 *   Material Web tokens v34 (`md-comp-{primary,secondary}-navigation-tab`): the
 *   color roles per state. Primary: selected = `primary`; unselected =
 *   `on-surface-variant`, `on-surface` while hovered / focused / pressed; the
 *   state layer is `primary` when selected and for an unselected press,
 *   `on-surface` otherwise. Secondary: selected = `on-surface`, state layer
 *   always `on-surface`. Focus indicator: 3dp `secondary`, drawn **inward**
 *   (`inner-offset` −3dp) with an 8dp shape (Material Web `md-focus-ring`).
 * - Compose `material3/Tab.kt` + `TabRow.kt`: the content color fades **in** on
 *   `DefaultEffects` and **out** on `FastEffects`; the ripple is always the
 *   selected color; fixed tabs split the row equally; scrollable tabs are at
 *   least 90dp wide, pad 52dp at the edges and spring the selected tab to the
 *   center; the indicator's offset and width animate on `DefaultSpatial`.
 * - MDC-Android `Widget.Material3.TabLayout`: `tabIndicatorAnimationMode =
 *   elastic` — the indicator's two edges travel on separate curves, so the
 *   leading edge pulls ahead and the trailing edge catches up.
 *
 * Every painted role resolves through a **priority chain of locals**: each
 * state only sets its own local and the chain picks the strongest, so the
 * result never depends on stylesheet order (Prettier's class sorting is safe).
 * Locals are prefixed `--_tb-` (tab) / `--_ti-` (indicator) / `--_tp-` (panel)
 * so they can't collide with nested components.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full. In arbitrary `calc()` values the
 * operators are written `_-_` / `_*_` / `_+_` (Tailwind rewrites a bare
 * `-var(--_x)` / `*var(--_x)` as `var(-- x)`).
 */

/** The two MD3 tab variants. */
export type TabsVariant = "primary" | "secondary";

/**
 * M3 **Expressive** motion as CSS `linear()` easings, sampled from the real
 * springs in Compose's `ExpressiveMotionTokens` (mass 1, solved analytically,
 * sampled to a 0.2% settle threshold):
 *
 * - `--_ti-ease`: the spatial spring curve, `dampingRatio = 0.8` (~1.5%
 *   overshoot). Compose's **default spatial** (`stiffness = 380`) settles in
 *   412ms — `--_ti-lead`; **slow spatial** (`stiffness = 200`) has the same
 *   shape and settles in 567ms — `--_ti-trail`. The elastic indicator runs its
 *   leading edge on the first and its trailing edge on the second.
 * - `--_tb-fx`: **default effects**, `spring(1, 1600)`, 212ms. A tab's color
 *   fading in as it becomes selected (Compose `TabTransition`).
 * - `--_tb-fx-fast`: **fast effects**, `spring(1, 3800)`, 137ms. The color
 *   fading out of a deselected tab, and state-layer feedback.
 *
 * All are overridable through `--md-comp-tabs-*` tokens (set the durations to
 * `0s` to switch a motion off). Reduced motion is handled in the logic: the
 * indicator fades instead of travelling and scrolling jumps.
 */
export const MOTION =
  "[--_ti-ease:var(--md-comp-tabs-indicator-easing,linear(0,0.031,0.107,0.209,0.32,0.433,0.538,0.634,0.718,0.789,0.847,0.894,0.931,0.959,0.979,0.994,1.004,1.01,1.013,1.015,1.015,1.014,1.013,1.011,1.01,1.008,1.006,1.005,1.004,1.003,1))] [--_ti-lead:var(--md-comp-tabs-indicator-leading-duration,412ms)] [--_ti-trail:var(--md-comp-tabs-indicator-trailing-duration,567ms)] [--_tb-fx:var(--md-comp-tabs-effects-easing,linear(0,0.081,0.242,0.412,0.561,0.681,0.772,0.84,0.889,0.924,0.948,0.965,0.976,0.984,0.989,0.993,0.995,0.997,1))] [--_tb-fx-d:var(--md-comp-tabs-effects-duration,212ms)] [--_tb-fx-fast:var(--md-comp-tabs-fast-effects-easing,linear(0,0.099,0.285,0.47,0.623,0.74,0.824,0.883,0.923,0.95,0.968,0.98,0.987,0.992,0.995,0.997,1))] [--_tb-fx-fast-d:var(--md-comp-tabs-fast-effects-duration,137ms)]";

/**
 * Per-variant roles, set on the tab list and **inherited** by its tabs, so a
 * tab never needs to know its variant to paint itself:
 *
 * - `--_tb-active`: label + icon color of the selected tab.
 * - `--_tb-sel-state`: state-layer color of the selected tab.
 * - `--_tb-press-state`: state-layer (and ripple) color of an unselected tab
 *   while pressed — `primary` for primary tabs (the ripple previews the color
 *   the tab is about to take), `on-surface` for secondary.
 * - `--_ti-h` / `--_ti-r` / `--_ti-in`: indicator height, shape, and its inset
 *   from the content edges. The primary inset is `min(2dp, (content − 24dp) /
 *   2)`, which is the spec's 2dp inset **and** its 24dp minimum length in one
 *   value (an icon-only tab gets a 24dp indicator that may exceed its content).
 */
export const VARIANT: Record<TabsVariant, string> = {
  primary:
    "[--_tb-active:var(--md-comp-tabs-active-label-text-color,var(--md-sys-color-primary))] [--_tb-sel-state:var(--md-comp-tabs-active-state-layer-color,var(--md-sys-color-primary))] [--_tb-press-state:var(--md-comp-tabs-pressed-state-layer-color,var(--md-sys-color-primary))] [--_ti-h:var(--md-comp-tabs-primary-indicator-height,0.1875rem)] [--_ti-r:var(--md-comp-tabs-primary-indicator-shape,0.1875rem_0.1875rem_0_0)] [--_ti-in:min(var(--md-comp-tabs-primary-indicator-inset,0.125rem),calc((100%_-_var(--md-comp-tabs-indicator-min-width,1.5rem))/2))]",
  secondary:
    "[--_tb-active:var(--md-comp-tabs-active-label-text-color,var(--md-sys-color-on-surface))] [--_tb-sel-state:var(--md-comp-tabs-active-state-layer-color,var(--md-sys-color-on-surface))] [--_tb-press-state:var(--md-comp-tabs-pressed-state-layer-color,var(--md-sys-color-on-surface))] [--_ti-h:var(--md-comp-tabs-secondary-indicator-height,0.125rem)] [--_ti-r:var(--md-comp-tabs-secondary-indicator-shape,0)] [--_ti-in:0px]",
};

/**
 * The tab list container: `surface` fill (Compose `TabRow` is a `Surface`) and
 * the 1dp divider painted **inside** the height by `::after`, under the tabs
 * (the scroller sits above it, so the selected indicator covers it).
 */
export const LIST =
  "relative isolate flex min-w-0 items-stretch bg-[var(--md-comp-tabs-container-color,var(--md-sys-color-surface))]";

/** The 1dp divider along the bottom edge (`divider={false}` drops it). */
export const DIVIDER =
  "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-[var(--md-comp-tabs-divider-height,1px)] after:bg-[var(--md-comp-tabs-divider-color,var(--md-sys-color-outline-variant))] after:content-[''] forced-colors:after:bg-[CanvasText]";

/** The tabs' own row, above the divider. */
export const SCROLLER = "relative z-[1] flex min-w-0 flex-1 items-stretch";

/**
 * Scrollable row: native horizontal scrolling (touch, trackpad, Shift + wheel)
 * with the scrollbar hidden, as on Android. The 52dp edge padding (Compose
 * `ScrollableTabRowEdgeStartPadding`, MD3 "offset the first scrollable tab
 * 52dp from the leading edge") sits on both ends; `scroll-padding` keeps a
 * focused tab clear of it.
 */
export const SCROLLABLE =
  "overflow-x-auto overflow-y-hidden overscroll-x-contain px-[var(--md-comp-tabs-scrollable-edge-padding,3.25rem)] scroll-px-[var(--md-comp-tabs-scrollable-edge-padding,3.25rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * The tab itself. Geometry: `--_tb-h` 48dp (64dp stacked) minimum height,
 * 16dp side padding (Compose `HorizontalTextPadding`), 4dp between the content
 * and an inline badge.
 *
 * Colors (priority chains):
 *
 * - `--_tb-fg` label/icon = selected › interacting › rest.
 * - `--_tb-state` state layer / ripple = selected › pressed › rest.
 * - `--_tb-sl` state-layer opacity = off (disabled) › pressed › focused ›
 *   hovered › 0, at the `--md-sys-state-*` opacities (8 / 10 / 10%).
 *
 * `--_state` is the name the shared ripple island paints with.
 */
export const TAB =
  "group/tab relative isolate flex min-h-[var(--_tb-h)] min-w-0 cursor-pointer items-center justify-center gap-[var(--md-comp-tabs-badge-gap,0.25rem)] px-[var(--md-comp-tabs-padding,1rem)] text-title-small text-[color:var(--_tb-fg)] outline-none select-none [-webkit-tap-highlight-color:transparent] [--_tb-h:var(--md-comp-tabs-container-height,3rem)] aria-selected:z-[1]";

export const TAB_COLORS =
  "[--_tb-fg:var(--_tb-fg-sel,var(--_tb-fg-int,var(--md-comp-tabs-label-text-color,var(--md-sys-color-on-surface-variant))))] hover:[--_tb-fg-int:var(--md-comp-tabs-hover-label-text-color,var(--md-sys-color-on-surface))] focus-visible:[--_tb-fg-int:var(--md-comp-tabs-hover-label-text-color,var(--md-sys-color-on-surface))] active:[--_tb-fg-int:var(--md-comp-tabs-hover-label-text-color,var(--md-sys-color-on-surface))] aria-selected:[--_tb-fg-sel:var(--_tb-active)] [--_tb-state:var(--_tb-st-sel,var(--_tb-st-press,var(--md-comp-tabs-state-layer-color,var(--md-sys-color-on-surface))))] active:[--_tb-st-press:var(--_tb-press-state)] aria-selected:[--_tb-st-sel:var(--_tb-sel-state)] [--_state:var(--_tb-state)]";

/**
 * Color motion. CSS uses the transition declared on the **destination** state,
 * so a tab becoming selected fades in on default effects (212ms) and one
 * becoming unselected fades out on fast effects (137ms), like Compose.
 */
export const TAB_MOTION =
  "[transition:color_var(--_tb-fx-fast-d)_var(--_tb-fx-fast)] aria-selected:[transition:color_var(--_tb-fx-d)_var(--_tb-fx)]";

/** The state layer, painted by `::before` across the whole tab. */
export const TAB_STATE_LAYER =
  "[--_tb-sl:var(--_tb-sl-off,var(--_tb-sl-press,var(--_tb-sl-focus,var(--_tb-sl-hover,0))))] hover:[--_tb-sl-hover:var(--md-sys-state-hover-opacity,0.08)] focus-visible:[--_tb-sl-focus:var(--md-sys-state-focus-opacity,0.1)] active:[--_tb-sl-press:var(--md-sys-state-pressed-opacity,0.1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[var(--_tb-state)] before:opacity-[var(--_tb-sl)] before:[transition:opacity_var(--_tb-fx-fast-d)_var(--_tb-fx-fast),background-color_var(--_tb-fx-fast-d)_var(--_tb-fx-fast)] before:content-['']";

/**
 * MD3 focus indicator (Material Web `md-focus-ring inward`): a 3dp `secondary`
 * outline drawn **inside** an 8dp-rounded box by `::after`. On the selected
 * tab it stops 1dp above the indicator so the two never overlap.
 */
export const TAB_FOCUS_RING =
  "after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:rounded-[var(--md-comp-tabs-focus-indicator-shape,0.5rem)] after:outline-0 after:-outline-offset-3 after:outline-[color:var(--md-comp-tabs-focus-indicator-color,var(--md-sys-color-secondary))] after:outline-solid after:content-[''] focus-visible:after:outline-3 aria-selected:after:bottom-[calc(var(--_ti-h)_+_1px)] forced-colors:after:outline-[color:Highlight]";

/**
 * Disabled (MD3 defines no disabled tab; Compose's `enabled = false` is the
 * reference): no state layer, content at the standard 38% opacity.
 */
export const TAB_DISABLED =
  "disabled:cursor-default disabled:[--_tb-sl-off:0] disabled:[--_tb-fg-int:initial] aria-disabled:cursor-default aria-disabled:[--_tb-sl-off:0] aria-disabled:[--_tb-fg-int:initial] [&:disabled>[data-slot=tab-content]]:opacity-38 [&:disabled>[data-slot=tab-badge]]:opacity-38 [&[aria-disabled=true]>[data-slot=tab-content]]:opacity-38 [&[aria-disabled=true]>[data-slot=tab-badge]]:opacity-38";

/**
 * The indicator. Its resting edges are `--_ti-in` inside the content box (the
 * whole tab for secondary tabs). While it moves, the logic animates two
 * registered `<length>` properties — `--chatool-tabs-indicator-start` (left
 * edge offset) and `--chatool-tabs-indicator-end` (right edge offset) — each
 * on its own spring, which is what makes the elastic stretch possible without
 * scaling (so the 3dp corners never distort).
 */
export const INDICATOR =
  "pointer-events-none absolute bottom-0 left-[calc(var(--_ti-in)_+_var(--chatool-tabs-indicator-start,0px))] right-[calc(var(--_ti-in)_-_var(--chatool-tabs-indicator-end,0px))] h-[var(--_ti-h)] rounded-[var(--_ti-r)] bg-[var(--md-comp-tabs-indicator-color,var(--md-sys-color-primary))] opacity-0 group-aria-selected/tab:opacity-100 forced-colors:bg-[CanvasText]";

/** Fade mode: the indicator cross-fades between tabs on default effects. */
export const INDICATOR_FADE =
  "[transition:opacity_var(--_tb-fx-d)_var(--_tb-fx)]";

/**
 * Panel enter transitions, played only after the user has changed tabs (never
 * on first paint). `slide` is MD3's **shared axis X** (lateral navigation
 * between peer destinations): the incoming panel travels 30dp from the side of
 * the newly selected tab while it fades in. `--_tp-dir` is ±1 from the
 * direction of travel and flips in RTL.
 */
export const PANEL_DIRECTION =
  "data-[direction=forward]:[--_tp-dir:1] data-[direction=backward]:[--_tp-dir:-1] rtl:data-[direction=forward]:[--_tp-dir:-1] rtl:data-[direction=backward]:[--_tp-dir:1]";

export const PANEL_ENTER = {
  slide:
    "[transition:opacity_var(--_tb-fx-d)_var(--_tb-fx),translate_var(--_ti-lead)_var(--_ti-ease)] starting:[translate:calc(var(--_tp-dir,0)_*_var(--md-comp-tabs-panel-slide-distance,1.875rem))_0] starting:opacity-0 motion-reduce:starting:[translate:none]",
  fade: "[transition:opacity_var(--_tb-fx-d)_var(--_tb-fx)] starting:opacity-0",
  none: "",
} as const;
