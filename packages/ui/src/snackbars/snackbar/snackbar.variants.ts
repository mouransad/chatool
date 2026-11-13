import { cva } from "class-variance-authority";

/*
 * Material Design 3 snackbar (m3.material.io/components/snackbar/specs,
 * Compose `SnackbarTokens` v0_103 + `Snackbar.kt`, MDC-Android
 * `Widget.Material3.Snackbar`):
 *
 * - **Container:** `inverse-surface`, `corner-extra-small` (4dp), elevation
 *   level 3, min height **48dp** (one line) / **68dp** (two lines), max width
 *   **600dp** (Compose `ContainerMaxWidth`).
 * - **Supporting text:** `body-medium` in `inverse-on-surface`, 14dp above and
 *   below (`SnackbarVerticalPadding`): 14 + 20 + 14 = 48dp for one line and
 *   14 + 40 + 14 = 68dp for two, so the token heights fall out of the layout.
 * - **Spacing** (Compose `OneRowSnackbar`): 16dp before the text; without a
 *   close button 8dp after the text (`TextEndExtraSpacing`) and 8dp at the
 *   end (the action's own 12dp padding completes the spec's 16dp); with one,
 *   the 48dp close target sits flush at the end (12 + 24 + 12dp).
 * - **Action on a new line** (`NewLineButtonSnackbar`): the text keeps 16dp on
 *   both sides; the action row aligns to the end with 4dp below it.
 *
 * Painted roles read a `--md-comp-snackbar-*` token first (the MD3 token
 * names) and fall back to the `--md-sys-*` role. Sizes are `rem`, so the
 * snackbar scales with the user's font size like the rest of the library.
 * Class strings stay **complete literals** so Tailwind can see them.
 */
export const snackbarVariants = cva(
  "min-h-12 ps-4 relative box-border flex w-full max-w-[var(--md-comp-snackbar-container-max-width,37.5rem)] rounded-[var(--md-comp-snackbar-container-shape,var(--md-sys-shape-corner-extra-small))] bg-[var(--md-comp-snackbar-container-color,var(--md-sys-color-inverse-surface))] text-start text-body-medium [overflow-wrap:anywhere] text-[color:var(--md-comp-snackbar-supporting-text-color,var(--md-sys-color-inverse-on-surface))] [box-shadow:var(--md-comp-snackbar-container-elevation,var(--md-sys-elevation-3))] group-data-[full-width=true]/snackbar-host:max-w-none group-data-[full-width=true]/snackbar-host:rounded-none forced-colors:outline forced-colors:outline-1 forced-colors:outline-[CanvasText]",
  {
    variants: {
      /** `inline`: one row. `stacked`: the action on its own line. */
      layout: {
        inline: "flex-row items-center",
        stacked: "flex-col",
      },
      /** Whether the ✕ close button is shown (it takes the end padding). */
      dismissible: {
        true: "pe-0",
        false: "",
      },
    },
    compoundVariants: [
      { layout: "inline", dismissible: false, class: "pe-2" },
      { layout: "stacked", dismissible: false, class: "pe-0" },
    ],
    defaultVariants: { layout: "inline", dismissible: false },
  },
);

/** The supporting text: 14dp above and below (Compose `SnackbarVerticalPadding`). */
export const TEXT = "min-w-0 py-3.5";

/** Inline: the text takes the free width; 8dp before the action without ✕. */
export const TEXT_INLINE = "flex-1";
export const TEXT_INLINE_GAP = "pe-2";

/** Stacked: the text spans the row with 16dp on both sides. */
export const TEXT_STACKED = "pe-4";

/**
 * `maxLines`: a line clamp with an ellipsis (MDC-Android's
 * `android:maxLines` + `ellipsize="end"`). The count is `--_sb-lines`. The
 * 14dp becomes margin, since `overflow` clips at the padding edge and would
 * let the next line show through the padding.
 */
export const TEXT_CLAMP =
  "my-3.5 py-0 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:var(--_sb-lines)] [line-clamp:var(--_sb-lines)]";

/** The action + ✕ row. */
export const ACTIONS = "flex shrink-0 items-center";

/** Stacked: aligned to the end, 4dp from the bottom, 8dp from the end without ✕. */
export const ACTIONS_STACKED = "self-end pb-1";
export const ACTIONS_STACKED_GAP = "pe-2";

/**
 * The action: MD3's **text button** (40dp, 12dp side padding, `label-large`)
 * in `inverse-primary`, with an `inverse-primary` state layer (the spec's
 * hover 8% / focus 10% / pressed 10%) and a focus ring that reads on the
 * inverse surface.
 */
export const ACTION =
  "px-3 [--_fg:var(--md-comp-snackbar-action-label-text-color,var(--md-sys-color-inverse-primary))] [--_state:var(--md-comp-snackbar-action-state-layer-color,var(--md-sys-color-inverse-primary))] focus-visible:ring-[color:var(--md-comp-snackbar-focus-indicator-color,var(--md-sys-color-inverse-primary))] focus-visible:ring-offset-[color:var(--md-comp-snackbar-container-color,var(--md-sys-color-inverse-surface))]";

/**
 * The ✕ close affordance: a 40dp standard icon button in a 48dp target
 * (Compose's `IconButton` + minimum interactive size), a **24dp** icon
 * (`SnackbarTokens.IconSize`) in `inverse-on-surface`, with a matching state
 * layer.
 */
export const DISMISS =
  "m-1 [&_svg]:size-6 [--_fg:var(--md-comp-snackbar-icon-color,var(--md-sys-color-inverse-on-surface))] [--_state:var(--md-comp-snackbar-icon-state-layer-color,var(--md-sys-color-inverse-on-surface))] focus-visible:ring-[color:var(--md-comp-snackbar-focus-indicator-color,var(--md-sys-color-inverse-primary))] focus-visible:ring-offset-[color:var(--md-comp-snackbar-container-color,var(--md-sys-color-inverse-surface))]";

/*
 * ------------------------------------------------------------------------
 * The host
 * ------------------------------------------------------------------------
 */

/**
 * The host: a landmark pinned to the bottom (or top) of the viewport, or of
 * its positioned parent when `contained`. It is a native `popover="manual"`
 * (unless contained), so it renders in the browser's **top layer** above every
 * stacking context with no `z-index` race; the rest resets the `[popover]`
 * user-agent styles. It never takes the pointer itself, only its snackbars
 * do, so the page underneath stays usable (MD3: snackbars "don't block users
 * from interacting with page content").
 *
 * Spacing from the edges is `--md-comp-snackbar-host-margin` (12dp, the
 * padding Compose's `Snackbar(snackbarData)` adds) plus the safe-area inset,
 * plus `offset`, plus the `anchor`'s height above the edge (`--_sb-anchor`).
 *
 * It is a size **container**: snackbars fill the width on compact layouts
 * (< 600dp) and shrink to their content between 20rem and 600dp above that
 * (MD3: on medium and expanded "snackbars should scale horizontally";
 * MDC-Android's `sw600dp` min width 320dp).
 */
export const snackbarHostVariants = cva(
  "group/snackbar-host m-0 p-0 @container pointer-events-none box-border flex h-auto max-h-none w-auto max-w-none flex-col overflow-visible border-0 bg-transparent text-inherit [--_sb-margin:var(--md-comp-snackbar-host-margin,0.75rem)] [--_sb-offset:var(--md-comp-snackbar-host-offset,0px)]",
  {
    variants: {
      /** `bottom` (MD3) or `top`. */
      side: {
        bottom:
          "[inset:auto_0_0_0] justify-end pb-[calc(var(--_sb-margin)_+_var(--_sb-offset)_+_var(--_sb-anchor,0px)_+_var(--_sb-safe-bottom,0px))]",
        top: "[inset:0_0_auto_0] justify-start pt-[calc(var(--_sb-margin)_+_var(--_sb-offset)_+_var(--_sb-anchor,0px)_+_var(--_sb-safe-top,0px))]",
      },
      /**
       * Where snackbars sit on wide layouts (MD3: "left-aligned or
       * center-aligned … consistently placed on the same spot"). On compact
       * layouts they span the width either way.
       */
      align: {
        start: "[--_sb-justify:start]",
        center: "[--_sb-justify:center]",
        end: "[--_sb-justify:end]",
      },
      /**
       * Edge to edge, square corners, no margin (MDC-Android's
       * `Widget.Material3.Snackbar.FullWidth`; MD3: only when the UI has no
       * persistent navigation at that edge).
       */
      fullWidth: {
        true: "[--_sb-margin:0px]",
        false: "",
      },
      /**
       * Inside the nearest positioned ancestor (a pane, a card, a dialog)
       * instead of the viewport.
       */
      contained: {
        true: "absolute z-[var(--md-comp-snackbar-host-z-index,10)]",
        false:
          "fixed z-[var(--md-comp-snackbar-host-z-index,1600)] pr-[calc(var(--_sb-margin)_+_env(safe-area-inset-right,0px))] pl-[calc(var(--_sb-margin)_+_env(safe-area-inset-left,0px))] [--_sb-safe-bottom:env(safe-area-inset-bottom,0px)] [--_sb-safe-top:env(safe-area-inset-top,0px)]",
      },
    },
    compoundVariants: [{ contained: true, class: "px-[var(--_sb-margin)]" }],
    defaultVariants: {
      side: "bottom",
      align: "center",
      fullWidth: false,
      contained: false,
    },
  },
);

/**
 * Every snackbar shares one grid cell, so a replacement **crossfades** over
 * the one leaving (Compose's `FadeInFadeOutWithScale` keeps both in one
 * `Box`), aligned to the host's edge.
 */
export const STACK =
  "grid w-full [justify-items:var(--_sb-justify)] group-data-[side=bottom]/snackbar-host:items-end group-data-[side=top]/snackbar-host:items-start";

/**
 * One snackbar's **presence** wrapper (Compose's `FadeInFadeOutWithScale`):
 *
 * - **Enter:** scale 0.8 → 1 on the Expressive **fast spatial** spring
 *   (`dampingRatio 0.6, stiffness 800`, ~9.5% overshoot) while fading in on
 *   **fast effects** (`1, 3800`). `--_ov-*` come from the overlay family's
 *   `MOTION`, so `--md-comp-overlay-*` retunes every overlay at once.
 * - **Exit:** back to 0.8 on fast spatial while fading out on fast effects
 *   (Compose animates both directions with the same specs). A swiped
 *   snackbar (`data-swiped`) leaves the way it was thrown, without scaling.
 * - `prefers-reduced-motion`: the fade only.
 *
 * It also carries the responsive width (see {@link snackbarHostVariants}).
 */
export const ITEM =
  "pointer-events-auto col-start-1 row-start-1 w-full origin-center rounded-[var(--md-comp-snackbar-container-shape,var(--md-sys-shape-corner-extra-small))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--md-comp-snackbar-focus-indicator-color,var(--md-sys-color-secondary))] scale-[var(--md-comp-snackbar-enter-scale,0.8)] opacity-0 [transition:opacity_var(--_ov-ed)_var(--_ov-fx),scale_var(--_ov-sd)_var(--_ov-spatial)] group-data-[full-width=true]/snackbar-host:!w-full group-data-[full-width=true]/snackbar-host:!max-w-none data-[state=closed]:pointer-events-none data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[swiped]:scale-100 motion-reduce:scale-100 motion-reduce:[transition:opacity_var(--_ov-ed)_var(--_ov-fx)] @min-[600px]:w-fit @min-[600px]:max-w-[var(--md-comp-snackbar-container-max-width,37.5rem)] @min-[600px]:min-w-[min(var(--md-comp-snackbar-container-min-width,20rem),100%)]";

/**
 * The swipe layer inside the presence wrapper. The swipe engine writes its
 * `translate` / `opacity` / `transition` inline, so a drag never re-renders;
 * this only lets the page keep scrolling on the other axis.
 */
export const SWIPE_LAYER =
  "data-[swipe-axis=x]:touch-pan-y data-[swipe-axis=y]:touch-pan-x data-[swipe-axis=xy]:touch-none";
