/*
 * Shared configuration for the `@chatool/ui` **overlay** family: every
 * component that floats above the page next to (or over) other content.
 * `tooltip` is the first member; menus, selects, popovers and dialogs reuse the
 * same pieces so they all enter, leave, stack and position alike:
 *
 * - `config.ts` (this file): the Expressive motion, the top-layer positioner
 *   reset and the animated popup wrapper, as literal class fragments.
 * - `placement.ts`: logical sides / alignments and their physical resolution.
 * - `position.ts` + `use-position.ts`: anchored positioning (Floating UI) with
 *   collision handling, the transform origin and the caret.
 * - `top-layer.ts`: the native Popover API top layer and the portal root.
 * - `use-presence.ts`: mount → enter → exit → unmount.
 * - `dismiss.ts`: the shared Escape stack and outside-press detection.
 * - `focus.ts`: tabbable lookup for non-modal focus hand-off.
 * - `describe.ts`: hidden description nodes for `aria-describedby`.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full (never a variant prefix + a utility).
 */

/**
 * M3 **Expressive** motion as CSS `linear()` easings, sampled from the real
 * springs in Compose's `ExpressiveMotionTokens` (mass 1, solved analytically,
 * sampled to a 0.2% settle threshold). Compose's `TooltipBox` animates its
 * scale on `MotionSchemeKeyTokens.FastSpatial` and its alpha on `FastEffects`:
 *
 * - `--_ov-spatial` / `--_ov-sd`: **fast spatial**, `spring(dampingRatio =
 *   0.6, stiffness = 800)`, 350ms, ~9.5% overshoot. For the popup's scale.
 * - `--_ov-fx` / `--_ov-ed`: **fast effects**, `spring(1, 3800)`, 140ms, no
 *   overshoot. For opacity, and for the whole exit.
 *
 * All four are overridable for every overlay at once
 * (`--md-comp-overlay-spatial-easing` / `-spatial-duration`,
 * `--md-comp-overlay-effects-easing` / `-effects-duration`), e.g. set the
 * durations to `0s` to switch overlay motion off.
 */
export const MOTION =
  "[--_ov-spatial:var(--md-comp-overlay-spatial-easing,linear(0,0.054,0.185,0.352,0.527,0.69,0.827,0.934,1.011,1.06,1.086,1.095,1.091,1.079,1.063,1.047,1.031,1.018,1.007,1,0.995,0.992,0.991,0.991,0.992,0.994,0.995,0.997,1))] [--_ov-sd:var(--md-comp-overlay-spatial-duration,350ms)] [--_ov-fx:var(--md-comp-overlay-effects-easing,linear(0,0.102,0.293,0.481,0.635,0.751,0.833,0.891,0.929,0.954,0.971,0.982,0.988,0.993,0.996,0.997,1))] [--_ov-ed:var(--md-comp-overlay-effects-duration,140ms)]";

/**
 * The **positioner**: the element that is placed next to the anchor. It is a
 * native `popover="manual"`, so the browser puts it in the **top layer**: above
 * every stacking context, `overflow` clip and modal `<dialog>`, with no
 * `z-index` arithmetic. Browsers without the Popover API ignore the attribute
 * and fall back to this `position: fixed` + `z-index` (overridable with
 * `--md-comp-overlay-z-index`).
 *
 * The rest undoes the user-agent `[popover]` styles (`inset: 0`, `margin:
 * auto`, a border, padding, `overflow: auto`, `Canvas` / `CanvasText` colors).
 * Its position is written as `translate` by `position.ts`, so following the
 * anchor on scroll never triggers layout.
 *
 * It ignores the pointer until it's open, and hides while its anchor is
 * scrolled out of view (`data-anchor-hidden`, for overlays that stay open).
 */
export const POSITIONER =
  "group/overlay pointer-events-none fixed z-[var(--md-comp-overlay-z-index,1500)] m-0 w-max overflow-visible border-0 bg-transparent p-0 text-inherit [inset:0_auto_auto_0] data-[anchor-hidden]:invisible data-[state=open]:pointer-events-auto";

/**
 * A transparent **hover bridge** across the gap between the anchor and the
 * overlay (`--_ov-gap`, written by `position.ts`), so a pointer travelling
 * from one to the other never "leaves". Only for hoverable overlays
 * (WCAG 1.4.13: content shown on hover must itself be hoverable).
 */
export const HOVER_BRIDGE =
  "before:absolute before:content-[''] data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:bottom-full data-[side=bottom]:before:h-[var(--_ov-gap,0px)] data-[side=left]:before:inset-y-0 data-[side=left]:before:left-full data-[side=left]:before:w-[var(--_ov-gap,0px)] data-[side=right]:before:inset-y-0 data-[side=right]:before:right-full data-[side=right]:before:w-[var(--_ov-gap,0px)] data-[side=top]:before:inset-x-0 data-[side=top]:before:top-full data-[side=top]:before:h-[var(--_ov-gap,0px)]";

/**
 * The **popup**: the wrapper that animates. It paints nothing, so the surface
 * inside can cast a shadow and hang a caret outside its box without either
 * being clipped or re-rasterized mid-animation.
 *
 * - **Enter** (`data-state="open"` on the positioner): scale from
 *   `--md-comp-overlay-enter-scale` (0.8, Compose / MDC) on the fast-spatial
 *   spring while fading in on fast effects.
 * - **Exit**: back to 0.8 and transparent on fast effects only. Exits get out
 *   of the way; only entrances bounce. CSS uses the transition declared on the
 *   **destination** state, which is why the two directions can differ.
 *
 * It grows out of the anchor: `--_ov-origin` (written by `position.ts`) is the
 * point on the overlay's anchor-facing edge nearest the anchor's centre, the
 * same point a caret hangs from. `prefers-reduced-motion` keeps the fade and
 * drops the scale.
 */
export const POPUP =
  "origin-[var(--_ov-origin,center)] scale-[var(--md-comp-overlay-enter-scale,0.8)] opacity-0 [transition:scale_var(--_ov-ed)_var(--_ov-fx),opacity_var(--_ov-ed)_var(--_ov-fx)] group-data-[state=open]/overlay:scale-100 group-data-[state=open]/overlay:opacity-100 group-data-[state=open]/overlay:[transition:scale_var(--_ov-sd)_var(--_ov-spatial),opacity_var(--_ov-ed)_var(--_ov-fx)] motion-reduce:scale-100 motion-reduce:[transition:opacity_var(--_ov-ed)_var(--_ov-fx)] motion-reduce:group-data-[state=open]/overlay:[transition:opacity_var(--_ov-ed)_var(--_ov-fx)]";
