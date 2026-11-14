/*
 * Shared configuration for the `@chatool/ui` **list** family — the Material 3
 * **Expressive** list, ported value-for-value from:
 *
 * - m3.material.io/components/lists (specs, guidelines, accessibility): the
 *   expressive list replaces the baseline one; two **styles** (standard /
 *   segmented — "a visual choice, they don't affect behavior"); selection modes
 *   (single-action, multi-action, single-select, multi-select, non-interactive);
 *   expand & collapse; the **shape morph** ("unselected corner radius: 4dp
 *   inner, 16dp outer; selected corner radius: 16dp"); "the selected state
 *   applies to the entire list item — when an item with a checkbox is selected,
 *   both the list item and the checkbox show a selected state"; the keyboard
 *   table (one Tab stop, ↑↓←→ move and **wrap**, Space / Enter activate); on
 *   the web a selection list is a `listbox` of `option`s.
 * - Compose `material3` `ListItem.kt` / `ListItemDefaults.kt` (the
 *   `@material3expressive` overloads) and `tokens/ListTokens.kt` v29 +
 *   `ReorderListTokens.kt`: 16dp leading / trailing space, 12dp between the
 *   slots, 10dp top / bottom; 56 / 72 / 88dp min height for one / two / three
 *   lines; body-large label, body-medium supporting, label-small overline and
 *   trailing text; 20dp expressive icons, 40dp `primary-container` avatar, 56dp
 *   image (8dp corners), 100×56 / 114×64 video; shapes rest 4dp (`corner-extra-
 *   small`), hovered 12dp (`corner-medium`), focused / pressed / selected /
 *   dragged 16dp (`corner-large`), picked in Compose's order **pressed ›
 *   dragged › selected › focused › hovered**; colors **disabled › dragged ›
 *   selected › rest**: selected `secondary-container` / `on-secondary-
 *   container`, dragged `tertiary-container` / `on-tertiary-container` at
 *   elevation 4, disabled content `on-surface` 38%; segmented gap 2dp with
 *   `corner-large` outer corners (`segmentedShapes(index, count)`); shapes and
 *   elevation on the **fast spatial** spring, colors on **default effects**.
 * - Compose `ListSamples.kt` + the m3.material.io spec art: segmented items sit
 *   on `surface` in `surface-container` (the token default is `surface`, but
 *   every sample and spec image fills them with `surface-container`, so that's
 *   the default here — re-theme with `--md-comp-list-item-segmented-container-
 *   color`).
 * - MDC-Android `listitem/` (`ListItemLayout`, `m3_list_item_*` selectors,
 *   `tokens.xml`): standard items are **transparent** at rest (so a list drops
 *   onto any surface — a card, a sheet); the state layer is `on-surface`
 *   (hover 8%, focus 10%, pressed 10%); controls inside an item are not
 *   separately clickable — the whole row is their target.
 * - Material Web `md-comp-list-reorder` (`drop-zone-color` =
 *   `surface-container-low`, dragged layer `on-tertiary-container`) and
 *   `md-comp-list-expand` (trailing icon in a `corner-full` container:
 *   `surface` collapsed, `surface-container` expanded; the expanded item is
 *   `surface`).
 * - Sampled from the spec art: the **selected + disabled** container is
 *   `on-surface` ≈ 8% (light `#E7E1E9` over `#F7F2FA`); the dragged item is
 *   `tertiary-container` + a 16% `on-tertiary-container` layer (`#E6BFCB`).
 *
 * Every value reads a `--md-comp-list-*` token first and falls back to the spec
 * value (in `rem`, so lists scale with the user's font size). Item locals are
 * prefixed `--_li-` and list locals `--_ls-` so they never collide with nested
 * controls (a checkbox in a row has its own `--_sl-*` chain). Painted roles
 * resolve through **priority chains of locals** — each state only *sets its
 * own* local and the chain picks the strongest — so overlapping states never
 * depend on stylesheet order, and Prettier's class sorting is safe.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full — never compose a variant prefix with a
 * utility. In arbitrary `calc()` values the operator is written `_-_` / `_*_`
 * (Tailwind turns a bare `-var(--_x)` / `*var(--_x)` into `var(-- x)`).
 */

/** The two MD3 Expressive list styles (visual only — behavior is the same). */
export type ListVariant = "standard" | "segmented";

/**
 * MD3 density steps (foundations › layout › density): each step below `0`
 * takes 4dp off the item height. The rows keep their 16dp side padding.
 */
export type ListDensity = 0 | -1 | -2 | -3;

/**
 * M3 **Expressive** motion as CSS `linear()` easings sampled from the real
 * springs in Compose's `ExpressiveMotionTokens` (mass 1, solved analytically,
 * sampled to a 0.2% settle threshold) — the same curves the selection family
 * uses, so a list and the checkbox inside it move as one:
 *
 * - `--_li-spatial` — **fast spatial**, `spring(0.6, 800)`, 348ms, ~9.5%
 *   overshoot. Compose's `ListItem` morphs its shape and elevation on it
 *   (`MotionSchemeKeyTokens.FastSpatial`); the expand sample opens on it too.
 * - `--_li-fx` — **default effects**, `spring(1, 1600)`, 212ms. Every color.
 * - `--_li-fxf` — **fast effects**, `spring(1, 3800)`, 137ms. The state layer.
 *
 * Reduced motion keeps the color fades and drops every spatial motion.
 */
export const MOTION =
  "[--_li-spatial:var(--md-comp-list-spatial-easing,linear(0,0.027,0.098,0.198,0.315,0.437,0.557,0.67,0.771,0.858,0.931,0.988,1.031,1.062,1.082,1.092,1.095,1.092,1.085,1.076,1.064,1.053,1.042,1.031,1.021,1.013,1.006,1.001,0.997,0.994,0.992,0.991,0.991,0.991,0.992,0.993,0.994,0.995,0.996,0.997,1))] [--_li-sd:var(--md-comp-list-spatial-duration,348ms)] [--_li-fx:var(--md-comp-list-effects-easing,linear(0,0.081,0.242,0.412,0.561,0.681,0.772,0.84,0.889,0.924,0.948,0.965,0.976,0.984,0.989,0.993,0.995,0.997,1))] [--_li-fd:var(--md-comp-list-effects-duration,212ms)] [--_li-fxf:var(--md-comp-list-fast-effects-easing,linear(0,0.099,0.285,0.47,0.623,0.74,0.824,0.883,0.923,0.95,0.968,0.98,0.987,0.992,0.995,0.997,1))] motion-reduce:[--_li-sd:0s]";

/**
 * List-level **inherited** locals, set by the `List` root for its variant and
 * read by every item below it (items are Server Components that never see the
 * list's props — the variant travels by CSS, like `RadioGroup`'s accent):
 *
 * - `--_ls-bg` — the item's resting container.
 * - `--_ls-top` / `--_ls-bot` — the radius of the **outer** corners (the first
 *   item's top, the last item's bottom). Unset = the 4dp inner radius.
 * - `--_ls-gap` — the space between items (2dp segmented, 0 standard).
 */
export const LIST_VARIANT: Record<ListVariant, string> = {
  standard:
    "[--_ls-bg:var(--md-comp-list-item-container-color,transparent)] [--_ls-gap:var(--md-comp-list-gap,0px)] [--_ls-top:initial] [--_ls-bot:initial]",
  segmented:
    "[--_ls-bg:var(--md-comp-list-item-segmented-container-color,var(--md-sys-color-surface-container))] [--_ls-gap:var(--md-comp-list-segmented-gap,0.125rem)] [--_ls-top:var(--md-comp-list-container-shape,var(--md-sys-shape-corner-large,1rem))] [--_ls-bot:var(--md-comp-list-container-shape,var(--md-sys-shape-corner-large,1rem))]",
};

/**
 * Density, inherited by the items: `--_ls-dy` comes off the min height,
 * `--_ls-dp` off the top and the bottom padding (half each).
 */
export const LIST_DENSITY: Record<`${ListDensity}`, string> = {
  "0": "[--_ls-dy:0px] [--_ls-dp:0px]",
  "-1": "[--_ls-dy:0.25rem] [--_ls-dp:0.125rem]",
  "-2": "[--_ls-dy:0.5rem] [--_ls-dp:0.25rem]",
  "-3": "[--_ls-dy:0.75rem] [--_ls-dp:0.375rem]",
};

/**
 * The `List` root: a plain flex column (no bullets, no UA padding) whose
 * `::before` is the **drop zone** while an item is being reordered — Material
 * Web's `drop-zone-color` (`surface-container-low`) in a `corner-large` slot,
 * placed by the reorder engine through `--_dz-y` / `--_dz-h`. It's the first
 * box in the list and unpositioned items never cover it, so the vacated slot
 * shows through.
 */
export const LIST =
  "group/list relative m-0 flex min-w-0 list-none flex-col gap-[var(--_ls-gap)] p-0 before:pointer-events-none before:absolute before:inset-x-0 before:top-[var(--_dz-y,0px)] before:h-[var(--_dz-h,0px)] before:rounded-[var(--md-comp-list-reorder-item-shape,var(--md-sys-shape-corner-large,1rem))] before:bg-[var(--md-comp-list-reorder-drop-zone-color,var(--md-sys-color-surface-container-low))] before:opacity-0 before:content-[''] before:[transition:opacity_var(--md-comp-list-effects-duration,212ms)_linear] data-reordering:before:opacity-100 forced-colors:before:border forced-colors:before:border-dashed forced-colors:before:border-[color:CanvasText]";

/**
 * Auto dividers (`List dividers`): each item but the last draws a 1dp
 * `outline-variant` line on its bottom edge with the Compose divider insets
 * (16dp / 16dp) — the same `--md-comp-divider-*` tokens the `Divider`
 * component reads, so both kinds always match.
 */
export const LIST_DIVIDERS = "[--_ls-div:var(--md-comp-divider-thickness,1px)]";

/**
 * Position locals, on **every** `[data-list-item]` element (a row, or an
 * expandable item's wrapper): the first item's top corners and the last item's
 * bottom corners take the list's outer radius. `:nth-child(… of …)` skips the
 * dividers, so a `ListDivider` never breaks the segmented corners.
 */
export const POSITION =
  "[--_li-rt:initial] [--_li-rb:initial] [&:nth-child(1_of_[data-list-item])]:[--_li-rt:var(--_ls-top)] [&:nth-last-child(1_of_[data-list-item])]:[--_li-rb:var(--_ls-bot)]";

/**
 * Resets every **conditional** item local to the guaranteed-invalid value, so a
 * row nested in a hovered / selected row (a `List` inside an item) starts from
 * rest. The state setters below out-specify these (they carry a pseudo-class or
 * an attribute), so the reset never masks the row's own state.
 */
export const RESET =
  "[--_li-r-press:initial] [--_li-r-drag:initial] [--_li-r-sel:initial] [--_li-r-focus:initial] [--_li-r-hover:initial] [--_li-bg-dis:initial] [--_li-dis-rest:initial] [--_li-bg-drag:initial] [--_li-bg-sel:initial] [--_li-bg-open:initial] [--_li-on-dis:initial] [--_li-on-drag:initial] [--_li-on-sel:initial] [--_li-st-drag:initial] [--_li-sl-off:initial] [--_li-sl-drag:initial] [--_li-sl-press:initial] [--_li-sl-focus:initial] [--_li-sl-hover:initial] [--_li-e-drag:initial] [--_li-ring:initial] [--_li-rd:initial] [--_li-lines:initial]";

/**
 * Geometry. `--_li-min` is the min height for the row's line count (56 / 72 /
 * 88dp minus the density step) and `--_li-align` the cross-axis alignment:
 * centred, except three-line rows whose leading / trailing content hangs from
 * the top — Compose's `verticalAlignment()` switches to `Top` once the row is
 * taller than (88 + 72) / 2dp. The view sets `data-lines` / `data-align`.
 */
export const GEOMETRY =
  "[--_li-r:var(--md-comp-list-item-container-shape,var(--md-sys-shape-corner-extra-small,0.25rem))] [--_li-min:var(--md-comp-list-item-one-line-container-height,3.5rem)] data-[lines=2]:[--_li-min:var(--md-comp-list-item-two-line-container-height,4.5rem)] data-[lines=3]:[--_li-min:var(--md-comp-list-item-three-line-container-height,5.5rem)] [--_li-align:center] data-[lines=3]:[--_li-align:flex-start] data-[align=center]:[--_li-align:center] data-[align=top]:[--_li-align:flex-start]";

/**
 * The painted row — an `<li>` (or the `<summary>` of an expandable item).
 *
 * - **Container** = disabled-selected › disabled (rest) › dragged › selected ›
 *   rest (`--_ls-bg`, or the expanded color while an expandable item is open).
 * - **Corners** = the interaction radius (pressed › dragged › selected ›
 *   focused › hovered, `--_li-ri`) or the resting top / bottom radius.
 * - **Content** roles = disabled › dragged › selected › their rest token.
 * - **State layer** (`::before`, under the content, like Compose's ripple) =
 *   `on-surface` (or `on-tertiary-container` while dragged) at disabled 0 ›
 *   dragged 16% › pressed 10% › focused 10% › hovered 8%.
 * - **Focus indicator** = a 3dp `secondary` outline drawn **inward** (Material
 *   Web's `inward` focus ring), so it never spills into the 2dp segmented gap.
 * - **Elevation** = level 4 while dragged (`ListTokens.ItemDraggedContainer
 *   Elevation`), drawn in front of the siblings like Compose's `zIndex(1f)`.
 */
export const ROW = [
  "relative isolate box-border flex w-full min-w-0 list-none items-[var(--_li-align)] gap-[var(--md-comp-list-item-between-space,0.75rem)] text-start [-webkit-tap-highlight-color:transparent]",
  "min-h-[calc(var(--_li-min)_-_var(--_ls-dy,0px))] ps-[var(--md-comp-list-item-leading-space,1rem)] pe-[var(--md-comp-list-item-trailing-space,1rem)] pt-[calc(var(--md-comp-list-item-top-space,0.625rem)_-_var(--_ls-dp,0px))] pb-[calc(var(--md-comp-list-item-bottom-space,0.625rem)_-_var(--_ls-dp,0px))]",
  // Painted roles (the chains described above).
  "[--_li-bg-rest:var(--_li-bg-open,var(--_ls-bg,var(--md-comp-list-item-container-color,transparent)))] [--_li-ri:var(--_li-r-press,var(--_li-r-drag,var(--_li-r-sel,var(--_li-r-focus,var(--_li-r-hover)))))] [--_li-sl:var(--_li-sl-off,var(--_li-sl-drag,var(--_li-sl-press,var(--_li-sl-focus,var(--_li-sl-hover,0%)))))] [--_state:var(--_li-st-drag,var(--md-comp-list-item-state-layer-color,var(--md-sys-color-on-surface)))]",
  "bg-[var(--_li-bg-dis,var(--_li-dis-rest,var(--_li-bg-drag,var(--_li-bg-sel,var(--_li-bg-rest)))))] rounded-ss-[var(--_li-ri,var(--_li-rt,var(--_li-r)))] rounded-se-[var(--_li-ri,var(--_li-rt,var(--_li-r)))] rounded-es-[var(--_li-ri,var(--_li-rb,var(--_li-r)))] rounded-ee-[var(--_li-ri,var(--_li-rb,var(--_li-r)))] text-body-large text-[color:var(--_li-on-dis,var(--_li-on-drag,var(--_li-on-sel,var(--md-comp-list-item-label-text-color,var(--md-sys-color-on-surface)))))] [box-shadow:var(--_li-e-drag,var(--md-comp-list-item-container-elevation,var(--md-sys-elevation-0,none)))]",
  "outline-[length:var(--_li-ring,0px)] -outline-offset-[var(--_li-ring,0px)] outline-[color:var(--md-comp-list-item-focus-indicator-color,var(--md-sys-color-secondary))] outline-solid",
  "[transition:background-color_var(--_li-fd)_var(--_li-fx),color_var(--_li-fd)_var(--_li-fx),border-radius_var(--_li-sd)_var(--_li-spatial),box-shadow_var(--_li-sd)_var(--_li-spatial),translate_var(--_li-sd)_var(--_li-spatial)] data-dragging:[transition:background-color_var(--_li-fd)_var(--_li-fx),color_var(--_li-fd)_var(--_li-fx),border-radius_var(--_li-sd)_var(--_li-spatial),box-shadow_var(--_li-sd)_var(--_li-spatial)]",
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[color-mix(in_srgb,var(--_state)_var(--_li-sl),transparent)] before:content-[''] before:[transition:background-color_137ms_var(--_li-fxf)]",
  // Auto divider (`List dividers`) on the bottom edge — all but the last item.
  "after:pointer-events-none after:absolute after:start-[var(--md-comp-list-divider-leading-space,1rem)] after:end-[var(--md-comp-list-divider-trailing-space,1rem)] after:bottom-0 after:border-b-[length:var(--_ls-div,0px)] after:border-solid after:border-[color:var(--md-comp-divider-color,var(--md-sys-color-outline-variant))] after:content-[''] [&:nth-last-child(1_of_[data-list-item])]:after:hidden",
  // An option owns its ripple; a `<label>` row inside it keeps quiet.
  "[&[role=option]>[data-slot=list-item-content]>[data-slot=ripple]]:hidden",
  "forced-colors:border forced-colors:border-solid forced-colors:border-transparent forced-colors:outline-[color:Highlight]",
].join(" ");

/**
 * Interaction state setters (MD3 + Compose's shape order). Hover is wrapped in
 * `(hover: hover)` so a tap never leaves a stuck highlight. A row is hovered /
 * pressed through its **primary action** (`[data-slot=list-item-content]`, an
 * `<a>` / `<button>` / `<label>` whose `::after` stretches over the row), so
 * pointing at a raised secondary action (a trailing `IconButton`) un-hovers
 * the row — MD3's multi-action rule. Options and `<summary>` rows are their
 * own target.
 */
export const STATES = [
  "[@media(hover:hover)]:[&[data-interactive]:not(:has([data-slot=list-item-control]_input:disabled)):is([role=option]:hover,summary:hover,:has(>[data-slot=list-item-content]:not(:disabled):hover))]:[--_li-r-hover:var(--md-comp-list-item-hovered-container-shape,var(--md-sys-shape-corner-medium,0.75rem))] [@media(hover:hover)]:[&[data-interactive]:not(:has([data-slot=list-item-control]_input:disabled)):is([role=option]:hover,summary:hover,:has(>[data-slot=list-item-content]:not(:disabled):hover))]:[--_li-sl-hover:calc(var(--md-sys-state-hover-opacity,0.08)_*_100%)]",
  "[&:is([role=option]:focus-visible,summary:focus-visible,:has(>[data-slot=list-item-content]:focus-visible),:has([data-slot=list-item-control]_input:focus-visible))]:[--_li-r-focus:var(--md-comp-list-item-focused-container-shape,var(--md-sys-shape-corner-large,1rem))] [&:is([role=option]:focus-visible,summary:focus-visible,:has(>[data-slot=list-item-content]:focus-visible),:has([data-slot=list-item-control]_input:focus-visible))]:[--_li-sl-focus:calc(var(--md-sys-state-focus-opacity,0.1)_*_100%)] [&:is([role=option]:focus-visible,summary:focus-visible,:has(>[data-slot=list-item-content]:focus-visible),:has([data-slot=list-item-control]_input:focus-visible))]:[--_li-ring:var(--md-comp-list-item-focus-indicator-thickness,3px)]",
  "[&[data-interactive]:not(:has([data-slot=list-item-control]_input:disabled)):is([role=option]:active,summary:active,:has(>[data-slot=list-item-content]:not(:disabled):active))]:[--_li-r-press:var(--md-comp-list-item-pressed-container-shape,var(--md-sys-shape-corner-large,1rem))] [&[data-interactive]:not(:has([data-slot=list-item-control]_input:disabled)):is([role=option]:active,summary:active,:has(>[data-slot=list-item-content]:not(:disabled):active))]:[--_li-sl-press:calc(var(--md-sys-state-pressed-opacity,0.1)_*_100%)]",
  // Selected — the `selected` prop, a listbox option, or (MD3: "the selected
  // state applies to the entire list item") a checked control in the row.
  "[&:is([data-selected=true],[aria-selected=true],:not([data-selected=false]):has([data-slot=list-item-control]_input:checked))]:[--_li-r-sel:var(--md-comp-list-item-selected-container-shape,var(--md-sys-shape-corner-large,1rem))] [&:is([data-selected=true],[aria-selected=true],:not([data-selected=false]):has([data-slot=list-item-control]_input:checked))]:[--_li-bg-sel:var(--md-comp-list-item-selected-container-color,var(--md-sys-color-secondary-container))] [&:is([data-selected=true],[aria-selected=true],:not([data-selected=false]):has([data-slot=list-item-control]_input:checked))]:[--_li-on-sel:var(--md-comp-list-item-selected-content-color,var(--md-sys-color-on-secondary-container))]",
  // Dragged — the `dragged` prop or the reorder engine (`data-dragged`).
  "data-dragged:z-[2] data-dragged:[--_li-r-drag:var(--md-comp-list-reorder-item-shape,var(--md-sys-shape-corner-large,1rem))] data-dragged:[--_li-bg-drag:var(--md-comp-list-reorder-item-container-color,var(--md-sys-color-tertiary-container))] data-dragged:[--_li-on-drag:var(--md-comp-list-reorder-item-content-color,var(--md-sys-color-on-tertiary-container))] data-dragged:[--_li-st-drag:var(--md-comp-list-reorder-item-state-layer-color,var(--md-sys-color-on-tertiary-container))] data-dragged:[--_li-sl-drag:calc(var(--md-sys-state-dragged-opacity,0.16)_*_100%)] data-dragged:[--_li-e-drag:var(--md-comp-list-item-dragged-container-elevation,var(--md-sys-elevation-4))]",
  // Disabled — the `disabled` prop, a disabled action / option, or a disabled
  // control (incl. an ancestor `<fieldset disabled>`). Content fades to
  // `on-surface` 38%; a selected row keeps an 8% `on-surface` tint (spec art)
  // and its 16dp corners; no state layer, no ripple, no pointer cursor.
  "[&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:[--_li-on-dis:color-mix(in_srgb,var(--md-comp-list-item-disabled-content-color,var(--md-sys-color-on-surface))_38%,transparent)] [&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:[--_li-dis-rest:var(--_li-bg-rest)] [&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:[--_li-sl-off:0%] [&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:[--_li-rd:none] [&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:[--_li-e-drag:initial] [&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:[--_li-r-drag:initial] [&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled))]:cursor-default",
  "[&:is([data-disabled],[aria-disabled=true],:has(>[data-slot=list-item-content]:disabled),:has([data-slot=list-item-control]_input:disabled)):is([data-selected=true],[aria-selected=true],:not([data-selected=false]):has([data-slot=list-item-control]_input:checked))]:[--_li-bg-dis:var(--md-comp-list-item-selected-disabled-container-color,color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent))]",
  // Windows High Contrast: a selected row gets a visible frame; the forced
  // palette would otherwise erase the only difference (its container).
  "forced-colors:[&:is([data-selected=true],[aria-selected=true],:not([data-selected=false]):has([data-slot=list-item-control]_input:checked))]:border-[color:Highlight]",
].join(" ");

/**
 * A row that a pointer can act on (action, control, option, summary): the
 * pointer cursor (disabled rows reset it above).
 */
export const INTERACTIVE = "data-interactive:cursor-pointer";

/**
 * The row's **primary action / content** element. For an action row it's the
 * `<a>` / `<button>` (or the `asChild` element) and for a control row the
 * `<label>`: their `::after` stretches over the whole row (the row is the
 * nearest positioned ancestor), so the full row is one target while a raised
 * secondary action (positioned, later in the DOM) still paints and hits above
 * it. Keep this element **unpositioned** with a z-index-less `::after`.
 */
export const CONTENT =
  "m-0 flex min-w-0 flex-1 cursor-[inherit] appearance-none rounded-[inherit] items-[var(--_li-align)] gap-[var(--md-comp-list-item-between-space,0.75rem)] self-stretch border-0 bg-transparent p-0 text-start [color:inherit] [font:inherit] [letter-spacing:inherit] no-underline outline-none select-none [-webkit-tap-highlight-color:transparent]";

/** The `::after` that stretches an interactive content element over the row. */
export const STRETCH =
  "after:absolute after:inset-0 after:rounded-[inherit] after:content-['']";

/** The text column: overline / headline / supporting, top to bottom. */
export const TEXT =
  "flex min-w-0 flex-1 flex-col justify-center [overflow-wrap:anywhere]";

/** Overline — label-small, `on-surface-variant`. */
export const OVERLINE =
  "text-label-small text-[color:var(--_li-on-dis,var(--_li-on-drag,var(--_li-on-sel,var(--md-comp-list-item-overline-color,var(--md-sys-color-on-surface-variant)))))] [transition:color_var(--_li-fd)_var(--_li-fx)]";

/** Headline (MD3 "label text") — body-large, `on-surface` (from the row). */
export const HEADLINE = "text-body-large";

/** Supporting text — body-medium, `on-surface-variant`. */
export const SUPPORTING_TEXT =
  "text-body-medium text-[color:var(--_li-on-dis,var(--_li-on-drag,var(--_li-on-sel,var(--md-comp-list-item-supporting-text-color,var(--md-sys-color-on-surface-variant)))))] [transition:color_var(--_li-fd)_var(--_li-fx)]";

/** Line clamping (`headlineLines` / `supportingTextLines`). */
export const CLAMP = "line-clamp-[var(--_li-clamp)]";

/**
 * Leading slot — `on-surface-variant` icons at the expressive 20dp. A bare
 * `<svg>` child is sized for you; avatars / images / videos size themselves.
 */
export const LEADING =
  "flex shrink-0 items-center justify-center text-[color:var(--_li-on-dis,var(--_li-on-drag,var(--_li-on-sel,var(--md-comp-list-item-leading-icon-color,var(--md-sys-color-on-surface-variant)))))] [transition:color_var(--_li-fd)_var(--_li-fx)] [&>svg]:size-[var(--md-comp-list-item-leading-icon-size,1.25rem)] [&>svg]:shrink-0";

/**
 * Trailing slot — trailing supporting text (label-small) and / or a trailing
 * element (icon 20dp, icon button, badge, control). Interactive descendants
 * are positioned by their own styles, so they paint and hit **above** the
 * stretched primary action; plain icons and text let clicks through to it.
 */
export const TRAILING =
  "flex shrink-0 items-center gap-[var(--md-comp-list-item-between-space,0.75rem)] text-[color:var(--_li-on-dis,var(--_li-on-drag,var(--_li-on-sel,var(--md-comp-list-item-trailing-icon-color,var(--md-sys-color-on-surface-variant)))))] [transition:color_var(--_li-fd)_var(--_li-fx)] [&>svg]:size-[var(--md-comp-list-item-trailing-icon-size,1.25rem)] [&>svg]:shrink-0";

/** Trailing supporting text — label-small, `on-surface-variant`. */
export const TRAILING_TEXT =
  "shrink-0 text-label-small whitespace-nowrap text-[color:var(--_li-on-dis,var(--_li-on-drag,var(--_li-on-sel,var(--md-comp-list-item-trailing-supporting-text-color,var(--md-sys-color-on-surface-variant)))))] [transition:color_var(--_li-fd)_var(--_li-fx)]";

/**
 * The selection-control slot (a `Checkbox` / `Radio` / `Switch` placed with
 * `control`). Compose shrinks a control's 48dp minimum touch target by the
 * row padding inside a list item (the row *is* the target): the checkbox
 * collapses to 20dp, the radio to 24dp, the switch to its 32dp track. Its own
 * state layer, ripple and focus ring are switched off — like MDC-Android's
 * list controls (`focusable` / `clickable` false, no background) — because
 * the row shows those states; the control still shows its **checked** state,
 * and the row's `<label>` is a `group/selection-field`, so pressing the row
 * presses the switch handle.
 */
export const CONTROL =
  "flex shrink-0 items-center [--_sl-off:0%] [--md-comp-checkbox-focus-indicator-color:transparent] [--md-comp-checkbox-touch-target-size:1.25rem] [--md-comp-radio-focus-indicator-color:transparent] [--md-comp-radio-touch-target-size:1.5rem] [--md-comp-switch-focus-indicator-color:transparent] [--md-comp-switch-touch-target-size:2rem] [&_[data-slot=ripple]]:hidden";

/** The row's ripple layer: hidden while the row is disabled. */
export const RIPPLE = "[display:var(--_li-rd,block)]";

/**
 * Leading **avatar** — 40dp `corner-full`, `primary-container` with a
 * title-medium `on-primary-container` monogram (or a cover-fitted image).
 */
export const AVATAR =
  "relative inline-flex size-[var(--md-comp-list-item-leading-avatar-size,2.5rem)] shrink-0 items-center justify-center overflow-hidden rounded-[var(--md-comp-list-item-leading-avatar-shape,var(--md-sys-shape-corner-full,9999px))] bg-[var(--md-comp-list-item-leading-avatar-color,var(--md-sys-color-primary-container))] text-title-medium text-[color:var(--md-comp-list-item-leading-avatar-label-color,var(--md-sys-color-on-primary-container))] select-none [&>img]:size-full [&>img]:object-cover";

/** Leading / trailing **icon** box — 20dp (Expressive), icon fills it. */
export const ICON =
  "inline-flex size-[var(--md-comp-list-item-icon-size,1.25rem)] shrink-0 items-center justify-center [&>svg]:size-full";

/** Leading **image** — 56dp with Expressive `corner-small` (8dp) corners. */
export const IMAGE =
  "relative inline-flex size-[var(--md-comp-list-item-leading-image-size,3.5rem)] shrink-0 overflow-hidden rounded-[var(--md-comp-list-item-leading-image-shape,var(--md-sys-shape-corner-small,0.5rem))] bg-[var(--md-sys-color-surface-container-highest)] [&>*]:size-full [&>*]:object-cover";

/**
 * Leading **video** thumbnail — small 100×56dp or large 114×64dp, `corner-
 * small`. Holds a `<video>` / `<img>` (cover-fitted) and any overlay.
 */
export const VIDEO =
  "relative inline-flex shrink-0 overflow-hidden rounded-[var(--md-comp-list-item-leading-video-shape,var(--md-sys-shape-corner-small,0.5rem))] bg-[var(--md-sys-color-surface-container-highest)] [&>:is(img,video)]:size-full [&>:is(img,video)]:object-cover";

/**
 * Reorder **drag handle** — a 20dp `drag_handle` glyph in a 40dp round target
 * (negative margins keep the 20dp layout box). Positioned, so it sits above
 * the stretched action; `touch-action: none` so a touch drag never scrolls.
 */
export const DRAG_HANDLE =
  "relative z-[1] -m-2.5 inline-flex size-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-full border-0 bg-transparent p-0 text-[color:inherit] outline-0 outline-offset-0 outline-[color:var(--md-comp-list-item-focus-indicator-color,var(--md-sys-color-secondary))] outline-solid select-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-3 in-data-dragging:cursor-grabbing disabled:cursor-default disabled:opacity-38 [&>svg]:size-5 [&>svg]:shrink-0 forced-colors:outline-[color:Highlight]";

/**
 * Expressive **expand indicator** — Material Web `md-comp-list-expand`: a
 * `corner-full` container (`surface` collapsed, `surface-container` expanded)
 * with an `on-surface` chevron that turns over on the fast spatial spring.
 */
export const EXPAND_ICON =
  "relative inline-flex size-[var(--md-comp-list-expand-trailing-icon-container-size,2rem)] shrink-0 items-center justify-center rounded-[var(--md-comp-list-expand-trailing-icon-shape,var(--md-sys-shape-corner-full,9999px))] bg-[var(--md-comp-list-expand-collapsed-trailing-icon-container-color,var(--md-sys-color-surface))] text-[color:var(--md-comp-list-expand-collapsed-trailing-icon-icon-color,var(--md-sys-color-on-surface))] [transition:background-color_var(--_li-fd)_var(--_li-fx),color_var(--_li-fd)_var(--_li-fx)] group-open/details:bg-[var(--md-comp-list-expand-expanded-trailing-icon-container-color,var(--md-sys-color-surface-container))] group-open/details:text-[color:var(--md-comp-list-expand-expanded-trailing-icon-icon-color,var(--md-sys-color-on-surface))] [&>svg]:size-[var(--md-comp-list-item-trailing-icon-size,1.25rem)] [&>svg]:[transition:rotate_var(--_li-sd)_var(--_li-spatial)] group-open/details:[&>svg]:rotate-180";

/**
 * The expandable item's `<details>`: its content box springs open (height
 * `0` ⇄ `auto` via `interpolate-size`, Compose's `expandVertically` on the fast
 * spatial spring). Browsers without `::details-content` open instantly.
 */
export const DETAILS =
  "group/details m-0 flex flex-col p-0 [interpolate-size:allow-keywords] [&::details-content]:[block-size:0] [&::details-content]:overflow-y-clip [&::details-content]:[transition:block-size_var(--_li-sd)_var(--_li-spatial),content-visibility_var(--_li-sd)_allow-discrete] open:[&::details-content]:[block-size:auto]";

/**
 * The expandable item's `<summary>` row extras: no disclosure marker, and the
 * Material Web **expanded** container while open (both styles: `surface`). An
 * open row keeps its bottom corners inner — its children continue the group.
 */
export const SUMMARY =
  "list-none [&::-webkit-details-marker]:hidden [&::marker]:content-none group-open/details:[--_li-bg-open:var(--md-comp-list-expand-expanded-list-item-container-color,var(--md-sys-color-surface))] group-open/details:[--_li-rb:initial]";

/**
 * The expandable item's children list. The first child is never an outer
 * corner (the summary sits above it); the last child takes the outer bottom
 * corners when the expandable item is the list's last (`--_li-rb` inherited).
 */
export const GROUP =
  "m-0 mt-[var(--_ls-gap)] flex list-none flex-col gap-[var(--_ls-gap)] p-0 [--_ls-top:initial] [--_ls-bot:var(--_li-rb)]";

/** The non-painted wrapper `<li>` of an expandable item. */
export const EXPANDABLE = "m-0 block list-none p-0";

/** A `ListDivider` `<li>`: no bullet, no extra space. */
export const DIVIDER = "list-none";
