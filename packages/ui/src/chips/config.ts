/*
 * Shared configuration for the `@chatool/ui` **chip** family: the MD3 chip
 * geometry, per-variant color roles, state wiring and Expressive motion. It
 * lives in one file so the chip and its set (and any future sibling) draw
 * exactly the same chip.
 *
 * Sources (they agree unless noted):
 *
 * - m3.material.io/components/chips (specs, guidelines, accessibility): four
 *   variants (assist / filter / input / suggestion), a 32dp container,
 *   `label-large` text, 18dp icons, a 24dp round avatar, 16dp side padding
 *   without an icon and 8dp with one, 8dp between elements and between chips,
 *   a 48dp minimum target, and a remove action labelled "Remove {label}".
 * - Compose `material3/tokens/{Assist,Filter,Input,Suggestion}ChipTokens.kt`
 *   (v7_0_1) and Material Web tokens v34 (`md-comp-*-chip`): the color roles per
 *   state, per-state elevations (incl. the flat filter chip's level-1 hover
 *   **when selected**), the 1dp `outline-variant` outline, its focus color, and
 *   the disabled 38% / 12% treatments.
 * - Compose `material3/Chip.kt`: the exact padding math. Content padding is 8dp
 *   (input chips 4dp on the start side unless a plain icon leads, and 4dp at the
 *   end without a trailing icon) and the 8dp element spacing applies even
 *   around an empty slot. That gives 16 | label | 16 for a bare chip, 8 | icon |
 *   8 | label | 16 with a leading icon, and 4 | avatar | 8 | … for an avatar.
 * - Compose **M3 Expressive** (`ChipsTokens.kt` v37 and the
 *   `@material3expressive` `FilterChip` / `InputChip(shapes = …)` overloads):
 *   the container **morphs**. It rests at `corner-medium` (12dp), becomes a
 *   full pill when selected and `corner-small` (8dp) while pressed, on the
 *   **fast spatial** spring. The leading checkmark expands in from the start
 *   edge on the same spring and fades on **default effects**. Filter and input
 *   chips tighten the icon ⇄ label spacing to 4dp (`CompactHorizontalSpacing`),
 *   and the unselected leading icon becomes `on-surface-variant` (the "tonal"
 *   colors: `ChipsTokens.UnselectedLeadingIconColor`).
 *
 * Every painted role resolves through a **priority chain of locals**: each
 * state only sets its own local and the chain picks the strongest. The result
 * never depends on stylesheet order, so Prettier's class sorting is safe.
 * Every local is prefixed `--_ch-` so it can't collide with a host component's
 * locals (input chips often sit inside a text field or a card).
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full. In arbitrary `calc()` values the
 * operators are written `_-_` / `_*_` / `_+_` (Tailwind rewrites a bare
 * `-var(--_x)` / `*var(--_x)` as `var(-- x)`).
 */

/** The four MD3 chip variants. Pick by purpose (action / filter) and author. */
export type ChipVariant = "assist" | "filter" | "input" | "suggestion";

/**
 * M3 **Expressive** motion as CSS `linear()` easings, sampled from the real
 * springs in Compose's `ExpressiveMotionTokens` (mass 1, solved analytically,
 * sampled to a 0.2% settle threshold):
 *
 * - `--_ch-spatial`: **fast spatial**, `spring(dampingRatio = 0.6, stiffness =
 *   800)`, 348ms, ~9.5% overshoot. Compose drives the chip's shape morph
 *   (`shapeByInteraction`) and the leading icon's `expandHorizontally` /
 *   `shrinkHorizontally` with it.
 * - `--_ch-fx`: **default effects**, `spring(1, 1600)`, 212ms. The checkmark's
 *   fade in / out and the color changes.
 * - `--_ch-fx-fast`: **fast effects**, `spring(1, 3800)`, 137ms. State-layer
 *   feedback (hover / focus / press).
 *
 * Reduced motion drops the spatial durations to 0s (`--_ch-sd`) and keeps the
 * fades, so nothing slides or bounces but state changes stay legible.
 */
export const MOTION =
  "[--_ch-spatial:var(--md-comp-chip-spatial-easing,linear(0,0.027,0.098,0.198,0.315,0.437,0.557,0.67,0.771,0.858,0.931,0.988,1.031,1.062,1.082,1.092,1.095,1.092,1.085,1.076,1.064,1.053,1.042,1.031,1.021,1.013,1.006,1.001,0.997,0.994,0.992,0.991,0.991,0.991,0.992,0.993,0.994,0.995,0.996,0.997,1))] [--_ch-sd:var(--md-comp-chip-spatial-duration,348ms)] motion-reduce:[--_ch-sd:0s] [--_ch-fx:var(--md-comp-chip-effects-easing,linear(0,0.081,0.242,0.412,0.561,0.681,0.772,0.84,0.889,0.924,0.948,0.965,0.976,0.984,0.989,0.993,0.995,0.997,1))] [--_ch-fx-fast:linear(0,0.099,0.285,0.47,0.623,0.74,0.824,0.883,0.923,0.95,0.968,0.98,0.987,0.992,0.995,0.997,1)]";

/**
 * Geometry. Every size reads a `--md-comp-chip-*` token and falls back to the
 * spec value in `rem`, so chips scale with the user's font size:
 *
 * - `--_ch-h`: container height, 32dp. MD3 asks apps **not** to shrink it by
 *   default (density lowers targets below 48dp); override the token only behind
 *   a user-chosen "compact" setting.
 * - `--_ch-is`: icon size, 18dp. `--_ch-as`: avatar size, 24dp.
 * - `--_ch-ps`: start padding (8dp; input chips 4dp, Compose
 *   `InputChipDefaults.contentPadding`). `--_ch-pe`: end padding without a
 *   trailing element (8dp padding + 8dp spacing = 16dp; input 4 + 8 = 12dp).
 * - `--_ch-lw` / `--_ch-lg`: the leading slot's width and its spacing to the
 *   label. An empty slot is 0 wide but keeps the 8dp spacing (Compose's
 *   arrangement spaces empty slots too), so a bare chip reads 16 | label.
 * - `--_ch-tg`: spacing before a trailing icon / the remove action.
 */
export const GEOMETRY =
  "[--_ch-h:var(--md-comp-chip-container-height,2rem)] [--_ch-is:var(--md-comp-chip-icon-size,1.125rem)] [--_ch-as:var(--md-comp-chip-avatar-size,1.5rem)] [--_ch-ps:0.5rem] [--_ch-pe:1rem] [--_ch-lw:0px] [--_ch-sel:0] data-[leading=icon]:[--_ch-ps-l:0.5rem] data-[leading=icon]:[--_ch-lw:var(--_ch-is)] data-[leading=avatar]:[--_ch-ps-l:0.25rem] data-[leading=avatar]:[--_ch-lw:var(--_ch-as)] data-[trailing=icon]:[--_ch-pe-t:0.5rem]";

/**
 * Per-variant **static** color roles (every variant sets every one): label
 * (`--_ch-fg`), leading icon (`--_ch-li`), the leading icon while hovered /
 * focused / pressed (`--_ch-li-int`, input chips turn it `primary`), trailing
 * icon (`--_ch-ti`), and the same three when selected (`*-sel`), plus the
 * outline's focus color (`--_ch-ol-focus`). Values are the Compose / Material
 * Web tokens; suggestion and assist chips never select.
 */
export const VARIANT: Record<ChipVariant, string> = {
  assist:
    "[--_ch-fg:var(--md-comp-chip-label-text-color,var(--md-sys-color-on-surface))] [--_ch-li:var(--md-comp-chip-leading-icon-color,var(--md-sys-color-primary))] [--_ch-li-int:var(--_ch-li)] [--_ch-ti:var(--md-comp-chip-trailing-icon-color,var(--md-sys-color-primary))] [--_ch-fg-sel:var(--_ch-fg)] [--_ch-li-sel:var(--_ch-li)] [--_ch-ti-sel:var(--_ch-ti)] [--_ch-ol-focus:var(--md-sys-color-on-surface)]",
  suggestion:
    "[--_ch-fg:var(--md-comp-chip-label-text-color,var(--md-sys-color-on-surface-variant))] [--_ch-li:var(--md-comp-chip-leading-icon-color,var(--md-sys-color-primary))] [--_ch-li-int:var(--_ch-li)] [--_ch-ti:var(--md-comp-chip-trailing-icon-color,var(--md-sys-color-primary))] [--_ch-fg-sel:var(--_ch-fg)] [--_ch-li-sel:var(--_ch-li)] [--_ch-ti-sel:var(--_ch-ti)] [--_ch-ol-focus:var(--md-sys-color-on-surface-variant)]",
  filter:
    "[--_ch-fg:var(--md-comp-chip-label-text-color,var(--md-sys-color-on-surface-variant))] [--_ch-li:var(--md-comp-chip-leading-icon-color,var(--md-sys-color-primary))] data-expressive:[--_ch-li:var(--md-comp-chip-leading-icon-color,var(--md-sys-color-on-surface-variant))] [--_ch-li-int:var(--_ch-li)] [--_ch-ti:var(--md-comp-chip-trailing-icon-color,var(--md-sys-color-on-surface-variant))] [--_ch-fg-sel:var(--md-comp-chip-selected-label-text-color,var(--md-sys-color-on-secondary-container))] [--_ch-li-sel:var(--md-comp-chip-selected-leading-icon-color,var(--md-sys-color-on-secondary-container))] [--_ch-ti-sel:var(--md-comp-chip-selected-trailing-icon-color,var(--md-sys-color-on-secondary-container))] [--_ch-ol-focus:var(--md-sys-color-on-surface-variant)]",
  input:
    "[--_ch-ps:0.25rem] [--_ch-pe:0.75rem] [--_ch-fg:var(--md-comp-chip-label-text-color,var(--md-sys-color-on-surface-variant))] [--_ch-li:var(--md-comp-chip-leading-icon-color,var(--md-sys-color-on-surface-variant))] [--_ch-li-int:var(--md-sys-color-primary)] [--_ch-ti:var(--md-comp-chip-trailing-icon-color,var(--md-sys-color-on-surface-variant))] [--_ch-fg-sel:var(--md-comp-chip-selected-label-text-color,var(--md-sys-color-on-secondary-container))] [--_ch-li-sel:var(--md-comp-chip-selected-leading-icon-color,var(--md-sys-color-primary))] [--_ch-ti-sel:var(--md-comp-chip-selected-trailing-icon-color,var(--md-sys-color-on-secondary-container))] [--_ch-ol-focus:var(--md-sys-color-on-surface-variant)]",
};

/**
 * Container fill, outline and elevation per **style**. A flat chip is
 * transparent with a 1dp `outline-variant` outline and no shadow; an
 * **elevated** chip (`data-elevated`, for chips over images or busy
 * backgrounds) is `surface-container-low` with no outline and the elevated
 * levels: rest 1, hover 2, focus 1, pressed 1, disabled 0 (`on-surface` 12%
 * fill). Any chip that is dragged rises to level 4. Selected chips fill with
 * `secondary-container` and drop the outline; a flat **filter** chip that is
 * selected rises to level 1 on hover (`FlatSelectedHoverContainerElevation`).
 * MD3 accessibility: swap `--md-comp-chip-outline-color` to `outline` when the
 * chips need a 3:1 boundary to read as interactive.
 */
export const STYLE =
  "[--_ch-bg:var(--md-comp-chip-container-color,transparent)] [--_ch-bg-dis:transparent] [--_ch-ol:var(--md-comp-chip-outline-color,var(--md-sys-color-outline-variant))] [--_ch-ol-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent)] [--_ch-e0:var(--md-sys-elevation-0)] [--_ch-eh:var(--md-sys-elevation-0)] [--_ch-ef:var(--md-sys-elevation-0)] [--_ch-ep:var(--md-sys-elevation-0)] data-elevated:[--_ch-bg:var(--md-comp-chip-elevated-container-color,var(--md-sys-color-surface-container-low))] data-elevated:[--_ch-bg-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent)] data-elevated:[--_ch-ol:transparent] data-elevated:[--_ch-ol-focus:transparent] data-elevated:[--_ch-ol-dis:transparent] data-elevated:[--_ch-e0:var(--md-sys-elevation-1)] data-elevated:[--_ch-eh:var(--md-sys-elevation-2)] data-elevated:[--_ch-ef:var(--md-sys-elevation-1)] data-elevated:[--_ch-ep:var(--md-sys-elevation-1)] [&[data-variant=filter]:not([data-elevated]):has(>[data-slot=chip-primary][data-selected])]:[--_ch-eh-sel:var(--md-sys-elevation-1)]";

/**
 * Shape. The baseline chip is a static `corner-small` (8dp) rounded rectangle.
 * With `data-expressive` it follows Compose's `ChipShapes` from `ChipsTokens`:
 * rest `corner-medium` (12dp), selected `corner-full` (a finite half-height
 * radius, so it morphs smoothly instead of snapping from `9999px`), pressed
 * `corner-small` (8dp). Chain: pressed › selected › rest.
 */
export const SHAPE =
  "[--_ch-shape:var(--md-comp-chip-container-shape,var(--md-sys-shape-corner-small,0.5rem))] data-expressive:[--_ch-shape:var(--md-comp-chip-container-shape,var(--md-sys-shape-corner-medium,0.75rem))] [&[data-expressive]:has(>[data-slot=chip-primary][data-selected])]:[--_ch-shape-sel:var(--md-comp-chip-selected-container-shape,calc(var(--_ch-h)_/_2))] [&[data-expressive]:active]:[--_ch-shape-press:var(--md-comp-chip-pressed-container-shape,var(--md-sys-shape-corner-small,0.5rem))] rounded-[var(--_ch-shape-press,var(--_ch-shape-sel,var(--_ch-shape)))]";

/**
 * Spacing that changes with state: the leading slot widens 0 → 18dp when a
 * filter chip's checkmark appears (`data-leading=check` + selected), and
 * Expressive filter / input chips use 4dp (`CompactHorizontalSpacing`) next to
 * a visible leading element and before a trailing one.
 */
export const SPACING =
  "[&[data-leading=check]:has(>[data-slot=chip-primary][data-selected])]:[--_ch-lw-on:var(--_ch-is)] [&[data-expressive]:is([data-variant=filter],[data-variant=input]):is([data-leading=icon],[data-leading=avatar])]:[--_ch-lg-c:0.25rem] [&[data-expressive][data-leading=check]:has(>[data-slot=chip-primary][data-selected])]:[--_ch-lg-c:0.25rem] [&[data-expressive]:is([data-variant=filter],[data-variant=input])]:[--_ch-tg-c:0.25rem] [&:has(>[data-slot=chip-remove])]:[--_ch-pe-rm:0px]";

/**
 * Interaction states, each setting only its own locals. Hover is wrapped in
 * `(hover: hover)` so a tap never leaves a stuck highlight. The **primary
 * action** drives them; so does a remove-only chip's single action
 * (`[data-only]`), since MD3 makes that whole chip one focusable element. The
 * remove button of a two-action chip has its own small state layer instead.
 */
export const STATES =
  "[@media(hover:hover)]:[&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):hover)]:[--_ch-sl-hover:calc(var(--md-sys-state-hover-opacity,0.08)_*_100%)] [@media(hover:hover)]:[&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):hover)]:[--_ch-e-hover:var(--_ch-eh-sel,var(--_ch-eh))] [@media(hover:hover)]:[&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):hover)]:[--_ch-li-now-int:var(--_ch-li-int)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):focus-visible)]:[--_ch-sl-focus:calc(var(--md-sys-state-focus-opacity,0.1)_*_100%)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):focus-visible)]:[--_ch-e-focus:var(--_ch-ef)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):focus-visible)]:[--_ch-ol-f:var(--_ch-ol-focus)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):focus-visible)]:[--_ch-li-now-int:var(--_ch-li-int)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):focus-visible)]:outline-[length:var(--md-comp-chip-focus-indicator-thickness,3px)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):active)]:[--_ch-sl-press:calc(var(--md-sys-state-pressed-opacity,0.1)_*_100%)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):active)]:[--_ch-e-press:var(--_ch-ep)] [&:has(>:is([data-slot=chip-primary],[data-slot=chip-remove][data-only]):active)]:[--_ch-li-now-int:var(--_ch-li-int)] data-[dragged=true]:z-[1] data-[dragged=true]:cursor-grabbing data-[dragged=true]:[--_ch-sl-drag:calc(var(--md-sys-state-dragged-opacity,0.16)_*_100%)] data-[dragged=true]:[--_ch-e-drag:var(--md-sys-elevation-4)]";

/**
 * **Selected** (filter / input chips, read from the primary action's
 * `data-selected`): `secondary-container` fill, no outline, the selected label /
 * icon colors, and `--_ch-sel: 1` for the checkmark ⇄ icon swap.
 */
export const SELECTED =
  "[&:has(>[data-slot=chip-primary][data-selected])]:[--_ch-sel:1] [&:has(>[data-slot=chip-primary][data-selected])]:[--_ch-bg-on:var(--md-comp-chip-selected-container-color,var(--md-sys-color-secondary-container))] [&:has(>[data-slot=chip-primary][data-selected])]:[--_ch-ol-on:transparent] [&:has(>[data-slot=chip-primary][data-selected])]:[--_ch-fg-on:var(--_ch-fg-sel)] [&:has(>[data-slot=chip-primary][data-selected])]:[--_ch-li-on:var(--_ch-li-sel)] [&:has(>[data-slot=chip-primary][data-selected])]:[--_ch-ti-on:var(--_ch-ti-sel)]";

/**
 * **Disabled** (an action carries `data-disabled`: native `disabled`,
 * `softDisabled`, or a disabled `ChipSet`): non-interactive, label and icons
 * `on-surface` 38%, avatar 38%, the outline `on-surface` 12%, no state layer
 * or shadow, and a selected or elevated chip fills with `on-surface` 12%. A
 * **loading** chip (`data-loading`) is non-interactive too but keeps its colors,
 * like a loading button.
 */
export const DISABLED =
  "[&:has(>[data-disabled])]:pointer-events-none [&:has(>[data-disabled])]:[--_ch-fg-off:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>[data-disabled])]:[--_ch-li-off:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>[data-disabled])]:[--_ch-ti-off:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>[data-disabled])]:[--_ch-av-o:0.38] [&:has(>[data-disabled])]:[--_ch-bg-off:var(--_ch-bg-dis)] [&:has(>[data-disabled]):has(>[data-slot=chip-primary][data-selected])]:[--_ch-bg-off:color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent)] [&:has(>[data-disabled])]:[--_ch-ol-off:var(--_ch-ol-dis)] [&:has(>[data-disabled])]:[--_ch-sl-off:0%] [&:has(>[data-disabled])]:[--_ch-e-off:var(--md-sys-elevation-0)] data-loading:pointer-events-none";

/**
 * The container: an inline-flex row holding the primary action (and the remove
 * action), sized by the geometry locals. Painted roles are the chains:
 *
 * - fill: disabled › selected › rest
 * - label / icons: disabled › selected › interacting (input icon) › rest
 * - outline (`::after`, 1dp, above the fill): selected (none) › disabled ›
 *   focused › rest; Windows High Contrast repaints it, so every chip keeps a
 *   visible boundary there
 * - elevation: disabled › dragged › pressed › hovered › focused › rest
 * - state layer (`::before`, `color-mix` of the label color): disabled ›
 *   dragged › pressed › focused › hovered › none
 *
 * The focus indicator is the container's own `outline`: 3dp `secondary`, 2dp
 * outside (`md-sys-state-focus-indicator`). The fill, label and outline fade on
 * default effects, the shadow on Compose's elevation tween, the state layer on
 * fast effects and the corners morph on the fast spatial spring.
 */
export const CONTAINER =
  "relative isolate inline-flex h-[var(--_ch-h)] max-w-full min-w-0 shrink-0 items-stretch align-middle text-start text-label-large whitespace-nowrap select-none [--_state:var(--_ch-fg-on,var(--_ch-fg))] bg-[var(--_ch-bg-off,var(--_ch-bg-on,var(--_ch-bg)))] text-[color:var(--_ch-fg-off,var(--_ch-fg-on,var(--_ch-fg)))] [box-shadow:var(--_ch-e-off,var(--_ch-e-drag,var(--_ch-e-press,var(--_ch-e-hover,var(--_ch-e-focus,var(--_ch-e0))))))] outline-0 outline-offset-[var(--md-comp-chip-focus-indicator-outline-offset,2px)] outline-[color:var(--md-comp-chip-focus-indicator-color,var(--md-sys-color-secondary))] outline-solid [-webkit-tap-highlight-color:transparent] [transition:background-color_212ms_var(--_ch-fx),color_212ms_var(--_ch-fx),box-shadow_150ms_cubic-bezier(0.4,0,0.2,1),border-radius_var(--_ch-sd)_var(--_ch-spatial)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[color-mix(in_srgb,var(--_state)_var(--_ch-sl-off,var(--_ch-sl-drag,var(--_ch-sl-press,var(--_ch-sl-focus,var(--_ch-sl-hover,0%))))),transparent)] before:[transition:background-color_137ms_var(--_ch-fx-fast)] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-[length:var(--md-comp-chip-outline-width,1px)] after:border-solid after:border-[color:var(--_ch-ol-on,var(--_ch-ol-off,var(--_ch-ol-f,var(--_ch-ol))))] after:[transition:border-color_212ms_var(--_ch-fx)] after:content-[''] forced-colors:outline-[color:Highlight] forced-colors:after:border-[color:ButtonText] [&:has(>[data-disabled])]:forced-colors:after:border-[color:GrayText]";

/**
 * The primary action (`<button>`, `<a>`, or a remove-only chip's `<span>`). It
 * stays **unpositioned** so its `::after` (the 48dp-tall touch target MD3
 * requires) and the press ripple span the whole container. Its padding comes
 * from the chains: start = leading-kind padding › variant padding; end =
 * 0 beside a remove action › 8dp before a trailing icon › variant padding.
 */
export const ACTION =
  "static flex min-w-0 flex-1 cursor-pointer appearance-none items-center rounded-[inherit] border-0 bg-transparent py-0 ps-[var(--_ch-ps-l,var(--_ch-ps))] pe-[var(--_ch-pe-rm,var(--_ch-pe-t,var(--_ch-pe)))] text-inherit [font:inherit] [letter-spacing:inherit] no-underline outline-none [-webkit-tap-highlight-color:transparent] after:absolute after:inset-x-0 after:top-1/2 after:h-[max(100%,3rem)] after:-translate-y-1/2 after:content-[''] disabled:cursor-default aria-disabled:cursor-default data-[only]:cursor-default";

/**
 * The leading slot: a clipping box whose width (`--_ch-lw`, or `--_ch-lw-on`
 * when the checkmark shows) and end spacing spring on fast spatial, so the
 * checkmark is **revealed from the start edge** exactly like Compose's
 * `expandHorizontally(expandFrom = Start)`. Children stack in one grid cell so
 * an icon and the checkmark can cross-fade in place.
 */
export const LEADING =
  "grid shrink-0 items-center justify-items-start self-stretch overflow-hidden w-[var(--_ch-lw-on,var(--_ch-lw))] me-[var(--_ch-lg-c,0.5rem)] text-[color:var(--_ch-li-off,var(--_ch-li-on,var(--_ch-li-now-int,var(--_ch-li))))] [transition:width_var(--_ch-sd)_var(--_ch-spatial),margin_var(--_ch-sd)_var(--_ch-spatial),color_212ms_var(--_ch-fx)] [&>*]:col-start-1 [&>*]:row-start-1";

/** A leading icon: 18dp, decorative (the label names the chip). */
export const ICON =
  "grid size-[var(--_ch-is)] shrink-0 place-items-center [&>svg]:size-full";

/**
 * A leading icon that a filter chip's checkmark **replaces** when selected: it
 * fades and shrinks out while the check pops in (scale on fast spatial,
 * opacity on default effects).
 */
export const ICON_SWAP =
  "opacity-[calc(1_-_var(--_ch-sel))] [scale:calc(1_-_0.4_*_var(--_ch-sel))] [transition:opacity_212ms_var(--_ch-fx),scale_var(--_ch-sd)_var(--_ch-spatial)]";

/** The checkmark when it is revealed by the slot growing (no icon to swap). */
export const CHECK_REVEAL =
  "opacity-[var(--_ch-sel)] [transition:opacity_212ms_var(--_ch-fx)]";

/** The checkmark when it swaps in over a leading icon. */
export const CHECK_SWAP =
  "opacity-[var(--_ch-sel)] [scale:calc(0.6_+_0.4_*_var(--_ch-sel))] [transition:opacity_212ms_var(--_ch-fx),scale_var(--_ch-sd)_var(--_ch-spatial)]";

/** A 24dp avatar (input chips): round by default, 38% when disabled. */
export const AVATAR =
  "grid size-[var(--_ch-as)] shrink-0 place-items-center overflow-hidden rounded-[var(--md-comp-chip-avatar-shape,9999px)] opacity-[var(--_ch-av-o,1)] [&>img]:size-full [&>img]:object-cover [&>svg]:size-full";

/** The loading spinner, in the leading icon's place and color. */
export const SPINNER = "size-[var(--_ch-is)] border-2";

/** The label: start-aligned, truncated with an ellipsis when space runs out. */
export const LABEL = "min-w-0 truncate";

/** A decorative trailing icon inside the primary action (e.g. a menu arrow). */
export const TRAILING =
  "ms-[var(--_ch-tg-c,0.5rem)] grid size-[var(--_ch-is)] shrink-0 place-items-center text-[color:var(--_ch-ti-off,var(--_ch-ti-on,var(--_ch-ti)))] [transition:color_212ms_var(--_ch-fx)] [&>svg]:size-full";

/**
 * The remove action of a **two-action** chip: a separate `<button>` after the
 * primary one, from the trailing spacing to the container's end (8dp end
 * padding), raised above the primary's touch target. Its own `::after` is a
 * 48 × 48dp target centred on the 18dp icon (MD3: "Min 48dp" for the close
 * icon), and its focus ring + state layer is a 24dp circle (Material Web's
 * `4/3 × icon size`) drawn by the icon box.
 */
export const REMOVE =
  "group/chip-remove relative z-[1] flex shrink-0 cursor-pointer appearance-none items-center border-0 bg-transparent py-0 ps-[var(--_ch-tg-c,0.5rem)] pe-2 text-[color:var(--_ch-ti-off,var(--_ch-ti-on,var(--_ch-ti)))] [--_state:currentColor] outline-none [transition:color_212ms_var(--_ch-fx)] [-webkit-tap-highlight-color:transparent] after:absolute after:end-[calc(0.5rem_+_var(--_ch-is)_/_2_-_1.5rem)] after:top-1/2 after:size-12 after:-translate-y-1/2 after:content-[''] disabled:cursor-default aria-disabled:cursor-default";

/**
 * The remove action of a **remove-only** chip (`removeOnly`): the chip's single
 * focusable element (MD3), so it stays unpositioned and its `::after` covers the
 * whole container (48dp tall) while the container shows the hover / focus /
 * press states.
 */
export const REMOVE_ONLY =
  "static flex shrink-0 cursor-pointer appearance-none items-center rounded-[inherit] border-0 bg-transparent py-0 ps-[var(--_ch-tg-c,0.5rem)] pe-2 text-[color:var(--_ch-ti-off,var(--_ch-ti-on,var(--_ch-ti)))] outline-none [transition:color_212ms_var(--_ch-fx)] [-webkit-tap-highlight-color:transparent] after:absolute after:inset-x-0 after:top-1/2 after:h-[max(100%,3rem)] after:-translate-y-1/2 after:content-[''] disabled:cursor-default aria-disabled:cursor-default";

/**
 * The remove icon box. For a two-action chip its `::before` is the 24dp
 * circular state layer (hover 8%, focus 10%, press 10%, chained) and carries
 * the 3dp focus ring.
 */
export const REMOVE_ICON =
  "relative grid size-[var(--_ch-is)] shrink-0 place-items-center [&>svg]:size-full before:pointer-events-none before:absolute before:-inset-[calc(var(--_ch-is)_/_6)] before:rounded-full before:bg-[color-mix(in_srgb,currentColor_var(--_ch-rsl,0%),transparent)] before:outline-0 before:outline-offset-2 before:outline-[color:var(--md-comp-chip-focus-indicator-color,var(--md-sys-color-secondary))] before:outline-solid before:[transition:background-color_137ms_var(--_ch-fx-fast)] before:content-[''] [--_ch-rsl:var(--_ch-rsl-p,var(--_ch-rsl-f,var(--_ch-rsl-h,0%)))] group-hover/chip-remove:[--_ch-rsl-h:calc(var(--md-sys-state-hover-opacity,0.08)_*_100%)] group-focus-visible/chip-remove:[--_ch-rsl-f:calc(var(--md-sys-state-focus-opacity,0.1)_*_100%)] group-active/chip-remove:[--_ch-rsl-p:calc(var(--md-sys-state-pressed-opacity,0.1)_*_100%)] group-focus-visible/chip-remove:before:outline-[length:var(--md-comp-chip-focus-indicator-thickness,3px)] forced-colors:before:outline-[color:Highlight]";

/** The remove-only chip's icon box: no circle of its own (the chip is the target). */
export const REMOVE_ONLY_ICON =
  "grid size-[var(--_ch-is)] shrink-0 place-items-center [&>svg]:size-full";

/**
 * The remove button's ripple: a centred 24dp circle over the icon (the shared
 * ripple layer is repositioned by `cn` over its `inset-0`).
 */
export const REMOVE_RIPPLE =
  "inset-auto end-[calc(0.5rem_-_var(--_ch-is)_/_6)] top-1/2 size-[calc(var(--_ch-is)_*_4_/_3)] -translate-y-1/2 rounded-full";
