# @chatool/ui

**Material Design 3** React UI components for Chatool apps. Every component
imports `cn` from `@chatool/utils` and is styled with the MD3 design tokens from
`@chatool/core` (`--md-sys-*` → Tailwind utilities).

- **Dependencies:** `@chatool/utils`, `radix-ui`, `class-variance-authority`
- **Peers:** `react` ^19, `react-dom` ^19

> Apps using `@chatool/ui` **must also install `@chatool/core`** and import its
> CSS — without the tokens the components are unstyled. SVG icons live in their own
> package, `@chatool/icons`.

## Install

```bash
pnpm add @chatool/ui @chatool/core @chatool/icons
# react ^19 and react-dom ^19 are peers
```

Then import the styles once in your global CSS (see `@chatool/core`):

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
@source "../node_modules/@chatool/ui/dist";
```

## Exports

**Subpath-only — there is no `@chatool/ui` root barrel.** Each component is
reached through its own path, so editors auto-import the exact subpath and bundles
stay minimal. `Button` is **Server-Component-safe** (it carries no `"use client"`);
its only client part is the press ripple, a separate island (see
[Accessibility & rendering](#accessibility--rendering)).

| Subpath                         | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@chatool/ui/button`            | `Button` (also `default`), `buttonVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `@chatool/ui/icon-button`       | `IconButton` (also `default`), `iconButtonVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `@chatool/ui/button-group`      | `ButtonGroup` (also `default`), `buttonGroupVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `@chatool/ui/fab`               | `Fab` (also `default`), `fabVariants`; types `FabProps`, `FabSize`, `FabColor`, `FabElevation`, `FabPlacement`, `FabWindowClass`, `FabResponsive`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `@chatool/ui/loading-indicator` | `LoadingIndicator` (also `default`), `loadingIndicatorVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `@chatool/ui/linear-progress`   | `LinearProgress` (also `default`), `linearProgressVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `@chatool/ui/circular-progress` | `CircularProgress` (also `default`), `circularProgressVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `@chatool/ui/divider`           | `Divider` (also `default`), `dividerVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `@chatool/ui/badge`             | `Badge` (also `default`), `badgeVariants`, `badgeAnchorVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `@chatool/ui/checkbox`          | `Checkbox` (also `default`), `checkboxVariants`, `checkboxFieldVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `@chatool/ui/radio`             | `Radio` (also `default`), `radioVariants`, `radioFieldVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `@chatool/ui/radio-group`       | `RadioGroup` (also `default`), `radioGroupVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `@chatool/ui/switch`            | `Switch` (also `default`), `switchVariants`, `switchFieldVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `@chatool/ui/slider`            | `Slider` (also `default`), `RangeSlider`, `sliderVariants`; types `SliderProps`, `RangeSliderProps`, `SliderSharedProps`, `SliderClassNames`, `SliderSize`, `SliderOrientation`, `SliderValueIndicator`, `SliderFormat`, `SliderIcon`                                                                                                                                                                                                                                                                                                                                                                                                               |
| `@chatool/ui/card`              | `Card` (also `default`) + `CardMedia`, `CardHeader`, `CardContent`, `CardHeadline`, `CardSubhead`, `CardSupportingText`, `CardActions`, `CardPrimaryAction`; `cardVariants`, `cardMediaVariants`, `cardHeadlineVariants`, `cardActionsVariants`                                                                                                                                                                                                                                                                                                                                                                                                     |
| `@chatool/ui/tooltip`           | `Tooltip` (also `default`) + `TooltipProvider`, `TooltipAction`; `tooltipVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `@chatool/ui/rich-tooltip`      | `RichTooltip` (also `default`) + `RichTooltipTrigger`, `RichTooltipContent`, `RichTooltipSubhead`, `RichTooltipSupportingText`, `RichTooltipActions`, `RichTooltipAction`; `useRichTooltip`, `useRichTooltipState`; `richTooltipVariants`; types `RichTooltipProps`, `RichTooltipTriggerMode`, `RichTooltipAnchor`, `RichTooltipVirtualAnchor`, `RichTooltipCaret`, `RichTooltipState`, `RichTooltipApi`, `RichTooltipOpenChangeReason`, …                                                                                                                                                                                                          |
| `@chatool/ui/text-field`        | `TextField` (also `default`), `textFieldVariants`; types `TextFieldProps`, `TextFieldInputProps`, `TextFieldTextareaProps`, `TextFieldLabels`, `TextFieldClassNames`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `@chatool/ui/chip`              | `Chip` (also `default`), `chipVariants`; types `ChipProps`, `ChipVariant`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@chatool/ui/chip-set`          | `ChipSet` (also `default`), `chipSetVariants`; types `ChipSetProps`, `ChipSetSelectionMode`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `@chatool/ui/tabs`              | `Tabs` (also `default`) + `TabList`, `Tab`, `TabPanels`, `TabPanel`; `tabsVariants`, `tabListVariants`, `tabScrollerVariants`, `tabScrollButtonVariants`, `tabVariants`, `tabContentVariants`, `tabIconVariants`, `tabLabelVariants`, `tabIndicatorVariants`, `tabPanelsVariants`, `tabPanelVariants`; types `TabsProps`, `TabListProps`, `TabProps`, `TabPanelsProps`, `TabPanelProps`, `TabBadge`, `TabsVariant`, `TabsLayout`, `TabsAlignment`, `TabsIconPosition`, `TabsIndicatorMotion`, `TabsActivationMode`, `TabsChangeReason`, `TabsChangeDetails`, `TabPanelsTransition`, `TabListClassNames`, `TabClassNames`                            |
| `@chatool/ui/snackbar`          | `Snackbar` (also `default`) + `SnackbarHost`, `SnackbarAction`, `SnackbarDismissAction`; `snackbar()` (global imperative API: `.update`, `.dismiss`, `.clear`, `.promise`, `.queue`), `createSnackbarQueue`, `useSnackbar`; `snackbarVariants`, `snackbarHostVariants`; types `SnackbarProps`, `SnackbarHostProps`, `SnackbarActionProps`, `SnackbarDismissActionProps`, `SnackbarOptions`, `SnackbarData`, `SnackbarHandle`, `SnackbarQueue`, `SnackbarQueueState`, `SnackbarFunction`, `SnackbarDuration`, `SnackbarCloseReason`, `SnackbarStrategy`, `SnackbarSwipeDirection`, `SnackbarPoliteness`, `SnackbarAnchor`, `SnackbarPromiseMessages` |

> The MD3 button family ships the **common Button**, the **Icon button**, the
> **Button group**, and the **FAB / extended FAB**.

**`Button`** follows the Material 3 spec — **color is fixed per style**, there is
no free color choice:

| Prop                                               | Values                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `variant`                                          | `filled` _(default)_ · `tonal` · `elevated` · `outlined` · `text`                |
| `size`                                             | `xs` · `s` _(default)_ · `m` · `l` · `xl` (32 / 40 / 56 / 96 / 136 dp)           |
| `shape`                                            | `round` _(default, pill)_ · `square` — both morph their corners while pressed    |
| `startIcon` / `endIcon`                            | leading / trailing icon (ignored with `asChild`)                                 |
| `selected` / `selectedIcon`                        | MD3 **toggle**: sets `aria-pressed`, morphs round→square, swaps the leading icon |
| `loading` / `loadingPosition` / `loadingIndicator` | spinner state (`start`·`center`·`end`)                                           |
| `asChild`                                          | render styles onto the child element (e.g. an `<a>`) via Radix `Slot`            |

MD3 press feedback is **built in** and automatic: a pointer **ripple**, the
**state layer** (hover 8% / focus 10% / press 10%), and a **press shape-morph**
(the corner shrinks while pressed, then springs back). No props or setup required.

**`IconButton`** is the **icon-only** family member — a square container holding a
single `@chatool/icons` glyph (passed as `children`). It shares the size scale,
shape-morph, ripple, and state layer with `Button`; **color is fixed per style**:

| Prop                           | Values                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `variant`                      | `standard` _(default)_ · `filled` · `tonal` · `outlined`                       |
| `size`                         | `xs` · `s` _(default)_ · `m` · `l` · `xl` (square; 32 / 40 / 56 / 96 / 136 dp) |
| `shape`                        | `round` _(default, circle)_ · `square` — both morph their corners on press     |
| `selected`                     | MD3 **toggle**: sets `aria-pressed`, morphs round→square, swaps `selectedIcon` |
| `selectedIcon`                 | glyph shown while `selected` (defaults to `children`)                          |
| `loading` / `loadingIndicator` | spinner state (non-actionable + `aria-busy`)                                   |
| `asChild`                      | render styles onto the child element (e.g. an `<a>`) via Radix `Slot`          |

> An icon button has **no visible text**, so you **must** pass `aria-label` (or
> `aria-labelledby`) — for a toggle, keep that label constant when `selected` flips.

**`ButtonGroup`** is the MD3 **Expressive** invisible container that arranges its
`Button` / `IconButton` children and adds the group interaction. It owns no
selection state — each child keeps its own `selected` / `aria-pressed`:

| Prop          | Values                                                         |
| ------------- | -------------------------------------------------------------- |
| `variant`     | `standard` _(default)_ · `connected`                           |
| `orientation` | `horizontal` _(default)_ · `vertical`                          |
| `asChild`     | render the group + `role="group"` onto your element via `Slot` |

- **standard** — children stay flexible (equal share); **pressing one expands it
  and compresses its neighbors** (the Expressive squish). Children keep their own
  shape and per-button press morph. ~12dp gap.
- **connected** — a tight **2dp** cluster (no width interaction between buttons).
  Children keep their **own default radius**; per the spec, selection morphs the
  **selected** child's shape — handled by the button's own smooth round→square
  animation. A single- / multi-select segmented control is just a connected group
  of toggle buttons.

> Pass the group an `aria-label` (or `aria-labelledby`) to name the set. The group
> never overrides a child's `border-radius`, so each button keeps its default
> finite shape and the select/deselect morph stays smooth.

**`Fab`** is the MD3 **Expressive** floating action button — the **FAB** _and_
the **extended FAB** in one element, so one can turn into the other (on scroll,
or across window sizes) with a spring morph. Use it for the screen's single most
important, constructive action (create, compose, start); never for minor or
destructive ones, and only one per screen.

| Prop        | Values                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`      | the glyph (a **filled** `@chatool/icons` icon, per MD3). Required for a FAB; optional for an extended FAB                                      |
| `label`     | visible text — makes it an **extended FAB**. 1–2 words; it never wraps or truncates                                                            |
| `expanded`  | `true` _(default)_ · `false`: an extended FAB (with an icon) collapses into a FAB. Responsive                                                  |
| `size`      | `small` · `medium` _(default, MD3's "most recommended")_ · `large` — 56 / 80 / 96 dp. Responsive                                               |
| `color`     | `primary-container` _(default)_ · `secondary-container` · `tertiary-container` · `primary` · `secondary` · `tertiary`                          |
| `elevation` | `default` _(level 3, 4 on hover)_ · `lowered` _(1, 2 on hover)_ · `none` _(flat, for a FAB nested in a bar or rail)_                           |
| `placement` | `bottom-end` · `bottom-center` · `bottom-start`: `position: fixed`, 16dp margins, clear of the safe area, RTL-aware. Omit to place it yourself |
| `visible`   | `true` _(default)_ · `false`: shrinks to its center and fades out, and becomes `inert`. Use it instead of disabling                            |
| `asChild`   | render onto your link (`<Fab asChild …><a href="/new" /></Fab>`); the FAB fills it with its icon, label and ripple                             |

Measurements are the M3 Expressive spec (m3.material.io, Compose `material3`
tokens):

| `size`   | Container | Corner | Icon | Extended padding | Icon↔label | Label type     |
| -------- | --------- | ------ | ---- | ---------------- | ---------- | -------------- |
| `small`  | 56dp      | 16dp   | 24dp | 16dp             | 8dp        | Title Medium   |
| `medium` | 80dp      | 20dp   | 28dp | 26dp             | 12dp       | Title Large    |
| `large`  | 96dp      | 28dp   | 36dp | 28dp             | 16dp       | Headline Small |

- **`small`** is the 56dp FAB / small extended FAB, not MD3's 40dp "small FAB",
  which M3 Expressive no longer recommends and this library doesn't ship. The
  surface color style is left out for the same reason.
- **Responsive props.** `size` and `expanded` also take one value per MD3
  **window size class**: `compact` (the base), `medium` (≥ 600px), `expanded`
  (≥ 840px), `large` (≥ 1200px) and `extraLarge` (≥ 1600px). Each applies from
  its breakpoint up. They resolve in CSS media queries, so they work in Server
  Components with no hydration flash, and every change morphs:
  `size={{ compact: "medium", expanded: "large" }}`,
  `expanded={{ compact: false, expanded: true }}`.
- **Motion** is M3 Expressive's, sampled from Compose's springs: geometry (the
  extended ⇄ collapsed width, padding, corner, size, show/hide scale) rides the
  **fast spatial** spring (damping 0.6, stiffness 800, ~350ms, slight
  overshoot); fades, colors and elevation ride **fast effects** (1 / 3800,
  ~140ms). On collapse the label folds away and the icon glides to the center.
  A FAB pops in from its center when it first renders; re-key it to replay
  that (MD3 hides and re-shows the FAB when switching tabs).
- **Press feedback** (ripple + state layer in the icon color: hover 8%, focus /
  press 10%) is built in.

**`LoadingIndicator`** is the MD3 Expressive indicator for short waits: a looping
morph through seven Material shapes, with Android's own geometry and motion. Pick
it for waits of roughly 200ms–5s; show nothing under 200ms, and a progress
indicator over 5s. Don't transition it into a progress indicator.

| Prop           | Values                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `contained`    | `false` _(default)_ · `true`: adds the `primary-container` circle; use it over content                |
| `size`         | px, clamped to 24–240; defaults to `48`. Any `size-*` utility works too                               |
| `value`, `max` | omit `value` for the loop; set it to scrub the circle → burst morph (pull-to-refresh). `max` is `100` |
| `color`        | `primary` _(default)_ · `inherit`: takes `currentColor`, for use inside buttons                       |

**`LinearProgress`** and **`CircularProgress`** show a process in real time, flat
or with Android's travelling wave. Omit `value` for indeterminate; when `value`
arrives later, the indeterminate motion hands off smoothly to the real value.

| Prop               | Values                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `shape`            | `wavy` _(default)_ · `flat`. M3 lists flat as its default; use it for very small sizes                   |
| `value`, `max`     | omit `value`, or pass a non-finite one, for indeterminate. `max` is `100`. Changes ease over 500ms       |
| `thickness`        | px; `4` _(default)_, `8` is the M3 thick style. Linear grows to `thickness + 6` tall when wavy           |
| `amplitude`        | `0`–`1`, default `1`. The wave fades in after 10% and out by 95% on its own                              |
| `wavelength`       | px; linear `40` (`20` indeterminate), circular `15`. At large rings try `size / 4` with a thicker stroke |
| `waveSpeed`        | px per second, defaults to `wavelength`; `0` freezes the wave                                            |
| `gap`              | px between the active indicator and the track, default `4`                                               |
| `color`            | `primary` _(default)_ · `inherit`: takes `currentColor`                                                  |
| `animated`         | default `true`; disable when `value` tracks scrubbing or scroll                                          |
| `stop` (linear)    | end-of-track dot, default `true`. M3 requires it unless the track has 3:1 contrast with its surroundings |
| `size` (circular)  | px, clamped to 24–240; defaults to `48` wavy / `40` flat, plus any extra `thickness`                     |
| `track` (circular) | default `true`; set `false` inside buttons                                                               |

`LinearProgress` fills its parent's width and mirrors itself in RTL; `CircularProgress`
never mirrors, per the spec.

**`Divider`** is the MD3 divider: a **1dp `outline-variant` line** that groups
content in lists and containers. MD3 says to use dividers sparingly, only where
open space can't do the grouping, and to group content rather than separate every
item:

| Prop            | Values                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `orientation`   | `horizontal` _(default)_ · `vertical` (fills the height of a flex row; `1em` tall inline)                    |
| `inset`         | `none` _(default, full-width)_ · `start` (MD3 "inset", 16dp leading) · `end` · `middle` (16dp on both sides) |
| `weight`        | `regular` _(default, 1dp)_ · `heavy` (8dp, MDC-Android's M3 heavy divider, for whole sections)               |
| `children`      | optional label drawn between two line segments ("— or —")                                                    |
| `labelPosition` | `center` _(default)_ · `start` · `end`                                                                       |
| `decorative`    | `true` _(default)_: `role="none"`. `false`: a real separator (`<hr>` or `role="separator"`)                  |
| `asChild`       | render onto your element via `Slot`, e.g. an `<li>` in a list or menu                                        |

- **Full-width** separates larger sections of unrelated content, or the
  interactive part of a card from the rest. **Inset** separates related items in a
  section, like rows in an email list. Use both together to show the hierarchy.
- Insets are **logical** (they flip in RTL). To line a divider up with list text
  after a 40dp avatar, set the start inset to 72px:
  `className="[--md-comp-divider-inset-start:72px]"`.
- Space above and below the line is yours to set with Tailwind (`my-2`, `mx-4`).
- A horizontal divider stretches to its container in block, flex-column and grid
  layouts. Inside a flex **row**, give it `w-full` or wrap it in a column.

**`Badge`** is the MD3 badge: a notification, count or status marker on an icon.
**Small** (no `value`) is a 6dp dot meaning "something new". **Large** (with a
`value`) is a 16dp `label-small` pill that is a circle at one digit and grows to
16×34dp at MD3's four-character limit (`999+`). Wrap the anchor and the badge
places itself **inside the icon's box at the upper trailing corner** with the spec
offsets (small: 6×6dp, large: 14×12dp). Without children it renders inline, for
example at the trailing edge of a drawer item.

| Prop              | Values                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `value`           | `number` · `string`. Omit for the small dot                                                                         |
| `max`             | numbers above it show `max+`; default `999` (→ `999+`)                                                              |
| `maxLength`       | strings longer than this are cut with `…`; default `4` (MD3's maximum), `Infinity` to opt out                       |
| `showZero`        | keep a numeric `0` visible; by default `0` hides the badge                                                          |
| `invisible`       | hide it: it shrinks out and leaves the accessibility tree. MD3: hide a nav badge once its destination is selected   |
| `size`            | `small` · `large`; chosen from `value` by default. `small` with a `value` shows a dot but still announces the count |
| `color`           | `error` _(default, MD3)_ · `primary` · `secondary` · `tertiary`                                                     |
| `placement`       | `top-end` _(default)_ · `top-start`; **logical**, so RTL mirrors it                                                 |
| `locale`          | BCP 47 locale for the digits: `"fa"` → `۹۹۹+`, `"ar-EG"` → `٩٩٩+`                                                   |
| `label`           | what screen readers hear; defaults to the full value or `"New notification"`. `""` = decorative                     |
| `children`        | the anchor (usually an icon). Omit for an inline badge                                                              |
| `anchorClassName` | classes for the anchor wrapper (`className` styles the badge itself)                                                |
| `asChild`         | make your single child the anchor (no wrapper `<span>`); it must accept children (not `<img>`/`<svg>`)              |

- **Keep the default color.** MD3 picks `error` so the badge stands out against
  icons and labels. Any custom pair needs at least 3:1 contrast.
- **Small or large?** MD3: use a large badge for counts where there's room (a
  navigation rail); a small one where space is tight (app bars). When an icon with
  a badge is followed by text, put a large badge at the **trailing edge** instead.
- **Don't move it arbitrarily or place it over the icon.** For other anchors
  (avatars), re-tune the offsets with the `--md-comp-badge-*-offset-*` tokens.
- **Expressive motion, CSS-only.** It springs in on mount (`@starting-style`) with
  M3 Expressive's _fast spatial_ spring (damping 0.6, stiffness 800). A changed
  count pops, the dot ⇄ pill change morphs size, radius and offsets together, and
  hiding uses a quick `emphasized-accelerate` exit. `prefers-reduced-motion`
  keeps only the fade.

**`Checkbox`** is the MD3 checkbox with M3 **Expressive** motion, built on a
**native `<input type="checkbox">`**: an 18dp box with 2dp corners and a 2dp
outline, a 40dp circular state layer and a 48dp touch target (the invisible input
covers it). Every visual is driven in CSS from the input's own state (`:checked`,
`:indeterminate`, `:disabled`, `aria-invalid`, `:user-invalid`, `:focus-visible`),
so an uncontrolled checkbox toggles, animates and submits **before hydration and
with no JavaScript**, and `<fieldset disabled>` disables it visually too. Every
prop not listed below (`name`, `value`, `checked`, `defaultChecked`, `onChange`,
`required`, `form`, `aria-*`, `ref`, …) goes straight to the input.

| Prop                                      | Values                                                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checked` / `defaultChecked` / `onChange` | the native input API — controlled or uncontrolled                                                                                                     |
| `indeterminate`                           | MD3 mixed state (dash). Sets the native `input.indeterminate` (announced "mixed"). **Controlled** — update it in `onChange`                           |
| `error`                                   | MD3 error colors + `aria-invalid="true"`. `aria-invalid` alone works too, and a `required` box left unchecked turns error by itself (`:user-invalid`) |
| `disabled`                                | MD3 38% treatment; no state layer, no ripple, no motion. A disabled `<fieldset>` has the same effect                                                  |
| `label`                                   | visible label. Renders a `<label>` row: the text names the box, toggles it, and previews its state layer on hover/press                               |
| `supportingText`                          | secondary text under the label, wired to `aria-describedby`; turns `error` color while invalid. Needs `label`                                         |
| `labelPosition`                           | `end` _(default)_ · `start` — logical, so RTL mirrors it                                                                                              |
| `color`                                   | `primary` _(default, MD3)_ · `secondary` · `tertiary` — fixed, contrast-safe container/check pairs                                                    |
| `className`                               | the outermost element: the label row when `label` is set, otherwise the control                                                                       |
| `controlClassName`                        | the 48dp control (the box's touch target) in both cases                                                                                               |
| `style`                                   | the outermost element (not the invisible input)                                                                                                       |

- **States, per MD3 tokens.** Unselected: `on-surface-variant` outline
  (`on-surface` on hover, focus and press). Selected: `primary` container,
  `on-primary` check. Error: `error` / `on-error`. Disabled: `on-surface` at 38%
  with an opaque `surface` check. The state layer is `on-surface` (unselected) /
  `primary` (selected) at 8% hover, 10% focus; **pressing flips it** (`primary`
  when unselected, `on-surface` when selected) so the ripple previews the state
  you are about to land in. Focus adds MD3's 3dp `secondary` indicator.
- **Expressive motion, CSS-only.** Checking **draws** the check from its short tip,
  through the vertex, to its long tip on M3 Expressive's _default spatial_ spring
  (damping 0.8, stiffness 380), like Compose's Checkbox; colors fade in on the
  _default effects_ spring. Checked ⇄ indeterminate **morphs**: the check rotates
  flat while its short leg retracts into the dash. Unchecking fades colors on the
  _fast effects_ spring and snaps the mark away after 100ms. Initially checked
  boxes render still (no animation on page load). `prefers-reduced-motion` keeps
  only the color fades; disabled boxes never animate.
- **Label it.** Use `label`, or for a bare box (tables, list rows) `aria-label`,
  `aria-labelledby` or your own `<label htmlFor>`.
- **Group related boxes** in a `<fieldset>` with a `<legend>` (or
  `role="group"` + `aria-labelledby`).

**`Radio`** is the MD3 radio button with M3 **Expressive** motion, built on a
**native `<input type="radio">`**: a 20dp icon (a ring stroked 2dp and a 10dp dot,
Compose's exact geometry), a 40dp circular state layer and a 48dp touch target
(the invisible input covers it). Every visual is driven in CSS from the input's own
state (`:checked`, `:disabled`, `aria-invalid`, `:user-invalid`,
`:focus-visible`), so same-`name` radios select, animate, move with the arrow keys
and submit **before hydration**. Every prop not listed below (`name`, `value`,
`checked`, `defaultChecked`, `onChange`, `required`, `form`, `aria-*`, `ref`, …)
goes straight to the input.

| Prop                                      | Values                                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `checked` / `defaultChecked` / `onChange` | the native input API. Inside a `RadioGroup`, use the group's `value` / `defaultValue` / `onValueChange` instead           |
| `value`                                   | what the radio submits and what a `RadioGroup` matches against (native default `"on"`)                                    |
| `error`                                   | `error` ring/dot + `aria-invalid="true"` (an addition — MD3 defines no error radio). `:user-invalid` also triggers it     |
| `disabled`                                | MD3 38% treatment; no state layer, no ripple, no motion. A disabled `<fieldset>` / `RadioGroup` has the same effect       |
| `label`                                   | visible label. Renders a `<label>` row: the text names the radio, selects it, and previews its state layer on hover/press |
| `supportingText`                          | secondary text under the label, wired to `aria-describedby`. Needs `label`                                                |
| `labelPosition`                           | `end` _(default)_ · `start` — logical, so RTL mirrors it. Unset, inherited from the `RadioGroup`                          |
| `color`                                   | `primary` _(default, MD3)_ · `secondary` · `tertiary`. Unset, inherited from the `RadioGroup`                             |
| `className`                               | the outermost element: the label row when `label` is set, otherwise the control                                           |
| `controlClassName`                        | the 48dp control in both cases                                                                                            |

**`RadioGroup`** is the group: a native **`<fieldset role="radiogroup">`** named by its
`<legend>`. It shares a `name` (generated if you don't pass one), the selection and
`required` / `form` with every `Radio` inside it, at any depth.

| Prop                                       | Values                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `value` / `defaultValue` / `onValueChange` | controlled (`string`, or `null` for none) or uncontrolled selection; `onValueChange(value, event)` fires when the user picks |
| `name`                                     | the shared native `name` (what the form submits). Generated with `useId` when omitted                                        |
| `label`                                    | the `<legend>` title and the group's accessible name (or pass `aria-label` / `aria-labelledby`)                              |
| `supportingText`                           | text under the options, wired to the group's `aria-describedby`; `error` color while invalid                                 |
| `required`                                 | native "pick one" validation + `aria-required`; a failed submit turns the group `error` by itself (`:user-invalid`)          |
| `error`                                    | `aria-invalid` on the group + `error` colors on every radio and the supporting text                                          |
| `disabled`                                 | a native `<fieldset disabled>`: every radio is out of the tab order, not submitted, and dimmed                               |
| `orientation`                              | `vertical` _(default — MD3)_ · `horizontal` (wraps; MD3 cautions against it, keep it to a few short options)                 |
| `color` / `labelPosition`                  | defaults for every radio inside (a radio's own prop wins)                                                                    |
| `form`                                     | associates every radio with a `<form>` elsewhere, by id                                                                      |
| `className` / `itemsClassName`             | the fieldset / the element wrapping the radios (a flex column or wrapping row)                                               |

- **States, per MD3 tokens.** Unselected: `on-surface-variant` (`on-surface` on
  hover, focus and press). Selected: `primary` ring and dot in every state.
  Disabled: `on-surface` at 38%. The state layer is `on-surface` (unselected) /
  `primary` (selected) at 8% hover, 10% focus; **pressing flips it** so the ripple
  previews the state you are about to land in. Focus adds MD3's 3dp `secondary`
  indicator. Labels stay `on-surface` whatever the state (MD3).
- **Expressive motion, CSS-only, from Compose's `RadioButton`.** Selecting springs
  the dot open on M3 Expressive's _fast spatial_ spring (damping 0.6, stiffness
  800): it overshoots ~9.5% and settles in 348ms. The radio you leave retracts on
  the same spring, cut at its zero-crossing (98ms) — Compose doesn't draw a dot
  below zero radius, so neither do we. Ring and dot colors fade on the _default
  effects_ spring (212ms). Initially selected radios render still;
  `prefers-reduced-motion` keeps only the color fade; disabled radios never animate.
- **MD3 usage.** Radios are for **one** choice from a list of about **five or
  fewer** visible options (more → a menu). List them **vertically**; pre-select an
  option when you can, and since a radio can't be cleared, offer a "None" option
  (or a "Clear selection" action) if opting out is allowed. Every radio needs a
  label, and the label must select it. Don't nest radios.

**`Switch`** is the MD3 switch with M3 **Expressive** motion, built on a **native
`<input type="checkbox" role="switch">`** (the APG and Material Web approach): a
52×32dp track with a 2dp outline, a circular handle that is **16dp off, 24dp on (or
when it carries an icon) and 28dp while pressed or dragged**, a 16dp icon, a 40dp
state layer that travels with the handle and a 48dp touch target (the invisible
input covers it). Every visual is driven in CSS from the input's own state
(`:checked`, `:disabled`, `:active`, `:focus-visible`), so an uncontrolled switch
toggles, animates and submits **before hydration**. Every prop not listed below
(`name`, `value`, `checked`, `defaultChecked`, `onChange`, `required`, `form`,
`aria-*`, `ref`, …) goes straight to the input.

| Prop                                      | Values                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `checked` / `defaultChecked` / `onChange` | the native input API (`event.target.checked`)                                                                                 |
| `onCheckedChange`                         | `(checked, event) => void` — Compose's API; fires once per user toggle (click, tap, drag, Space, Enter), after `onChange`     |
| `name` / `value`                          | submitted like a checkbox: `value` (default `"on"`) when on, nothing when off                                                 |
| `icons`                                   | `false` _(default)_ · `"selected"` (a check on the selected handle, rotating in) · `true` (check when on, close "×" when off) |
| `selectedIcon` / `unselectedIcon`         | any node replacing the check / close glyph (e.g. an `@chatool/icons` icon); they imply `icons` when it's unset                |
| `disabled`                                | MD3 treatment (track 12%, handle/icon 38%, selected handle opaque `surface`); no press, drag, ripple or motion                |
| `label`                                   | visible label — what the switch turns **on**. Renders a `<label>` row: the text names it, toggles it, previews its state      |
| `supportingText`                          | secondary text under the label, wired to `aria-describedby`. Needs `label`                                                    |
| `labelPosition`                           | `start` _(default — MD3 settings rows: text, then switch)_ · `end` — logical, so RTL mirrors it                               |
| `color`                                   | `primary` _(default, MD3)_ · `secondary` · `tertiary` — swaps the whole role family (track, handle, hovered handle, icon)     |
| `className`                               | the outermost element: the label row when `label` is set, otherwise the control                                               |
| `controlClassName`                        | the switch control (the track box) in both cases                                                                              |

- **States, per MD3 tokens.** Off: `surface-container-highest` track with an
  `outline` border and an `outline` handle that turns `on-surface-variant` on
  hover, focus and press; icon `surface-container-highest`. On: `primary` track (no
  border), `on-primary` handle that turns `primary-container` on hover, focus and
  press; icon `on-primary-container`. The state layer is `on-surface` (off) /
  `primary` (on) at 8% hover, 10% focus and press, and rides on the handle. Focus
  adds MD3's 3dp `secondary` indicator around the **track**. Labels stay
  `on-surface` whatever the state (MD3).
- **Expressive motion, CSS-only, from Compose's `Switch`.** Toggling slides and
  resizes the handle on M3 Expressive's _fast spatial_ spring (damping 0.6,
  stiffness 800): ~9.5% overshoot, settled in 348ms. Pressing **snaps** the handle
  to 28dp (Compose's `SnapSpec`), and releasing springs it to its new side and size.
  Colors fade in 67ms and icons in 33ms (Material Web); a lone check rotates in from
  −45°. `prefers-reduced-motion` keeps only the fades; disabled switches never
  animate.
- **Drag to toggle** (MD3: "Touch: Tap, Drag"). Past a few pixels the handle follows
  the pointer 1:1, then lands on the side you flicked it towards, or the nearer
  side on a slow release. Releasing on the side it started on changes nothing. A
  vertical swipe still scrolls the page. Each toggle reaches `onChange` exactly
  once, as a normal click.
- **MD3 usage.** Switches turn **one standalone setting on or off, and take effect
  immediately**, with no Save step. For several related options use checkboxes; for
  one choice from a list, radios; for opposing options (list / map), a connected
  button group. Always pair a switch with a short inline label that describes what
  it turns on. Never put text inside the switch, and only use icons whose meaning is
  unambiguous (check / close).

**`Slider`** and **`RangeSlider`** are the MD3 **Expressive** sliders
(m3.material.io/components/sliders), ported from Compose `SliderTokens` /
`SliderDefaults.drawTrack` and MDC-Android's `Widget.Material3Expressive.Slider.*`.
The anatomy is the Expressive one: a **4dp bar handle** with a **6dp gap** to each
track segment, **2dp inside corners** facing the handle, the size's corner on the
track ends, and a **4dp stop dot** that anchors the end of the inactive track.
Pressing, dragging or keyboard-focusing **squeezes the handle to 2dp** and (when
enabled) pops the **value indicator**. Each handle is a **native
`<input type="range">`** (invisible, pointer-inert) that carries focus, the
keyboard, form submission and the accessibility tree; the pointer is handled on the
whole slider. Both live on `@chatool/ui/slider`.

| Size (`size`)  | Track | Handle height | Track corner | Inset icon |
| -------------- | ----- | ------------- | ------------ | ---------- |
| `xs` (default) | 16dp  | 44dp          | 8dp          | —          |
| `s`            | 24dp  | 44dp          | 8dp          | —          |
| `m`            | 40dp  | 52dp          | 12dp         | 24dp       |
| `l`            | 56dp  | 68dp          | 16dp         | 24dp       |
| `xl`           | 96dp  | 108dp         | 28dp         | 32dp       |

| Prop (both)                   | Values                                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `min` / `max` / `step`        | defaults `0` / `100` / `1`; `step="any"` is continuous (arrow keys then move 1%)                                                                   |
| `stops`                       | `true` — a stop dot at every step (MD3 "stops" / discrete; handles line up with the dots) · `number[]` — **custom** stops, the only allowed values |
| `endStops`                    | `true` _(default)_ — the 3:1 contrast anchor at the inactive track's end(s); `false` drops it                                                      |
| `largeStep`                   | Page Up / Page Down / Shift+Arrow / Space+Arrow increment; default ≈10% of the range in whole steps                                                |
| `valueIndicator`              | `false` _(default)_ · `true` (while pressed, dragged or keyboard-focused) · `"always"`                                                             |
| `format` / `locale`           | `Intl.NumberFormatOptions` (serializable) or `(value) => string` — the indicator text and `aria-valuetext`                                         |
| `size`                        | `xs` _(default)_ · `s` · `m` · `l` · `xl`                                                                                                          |
| `orientation`                 | `horizontal` _(default)_ · `vertical` (bottom = min; default height 12.5rem, set it with `className="h-64"`)                                       |
| `inverted`                    | max at the start (horizontal) / top (vertical); arrow keys follow the screen                                                                       |
| `disabled`                    | MD3 disabled colors; also disabled inside a `<fieldset disabled>`                                                                                  |
| `haptics`                     | a short vibration per new value while dragging (Vibration API, Android browsers)                                                                   |
| `name` / `form`               | form submission (a range submits both values under `name`); a form reset restores `defaultValue`                                                   |
| `classNames`                  | per-part classes: `track`, `activeTrack`, `inactiveTrack`, `stop`, `thumb`, `handle`, `valueIndicator`, `icon`, `input`                            |
| `className` / `style` / `ref` | the root `<div>` (every other `<div>` prop too)                                                                                                    |

| `Slider` only                                 | Values                                                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` / `defaultValue` / `onValueChange`    | a `number`; default `min` (the midpoint when `centered`)                                                    |
| `onValueCommit`                               | once per gesture — pointer up or key press (Compose's `onValueChangeFinished`)                              |
| `centered`                                    | MD3 **centered** slider: the active track grows from the middle (a 6dp gap marks the centre)                |
| `icon` / `endIcon`                            | MD3 **inset icons** (M/L/XL; not on centered): a node or `(value) => node`; `endIcon` replaces the end stop |
| `getAriaValueText`                            | `(value) => string`                                                                                         |
| `id` / `autoFocus` / `inputRef`               | the native input (`<label htmlFor={id}>` names it)                                                          |
| `aria-label` / `-labelledby` / `-describedby` | go to the native input                                                                                      |

| `RangeSlider` only                         | Values                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `value` / `defaultValue` / `onValueChange` | `[start, end]`; default `[min, max]`                                                                |
| `onValueCommit`                            | once per gesture                                                                                    |
| `minStepsBetweenThumbs`                    | minimum handle distance in steps (stops, for custom stops); default `0` — they meet but never cross |
| `thumbLabels`                              | the two handles' names; default `["Minimum", "Maximum"]`                                            |
| `getAriaValueText`                         | `(value, index) => string`                                                                          |
| `inputRefs`                                | refs to the two native inputs                                                                       |
| `aria-label` / `aria-labelledby`           | name the `role="group"` root                                                                        |

- **Colors (MD3 + MDC tokens).** Active track and handle `primary`, inactive track
  `secondary-container`; stops `on-primary` on the active track and
  `on-secondary-container` on the inactive one (inset icons the same); value
  indicator `inverse-surface` with `inverse-on-surface` `label-large` text in a
  48×44dp pill. Disabled: active track `on-surface` 38%, inactive 12%, handle 38%
  over `surface`, stops `inverse-on-surface` / `on-surface`. Focus: the 3dp
  `secondary` indicator, 2dp around the squeezed handle.
- **Geometry, exactly as Compose draws it.** The track is inset half a handle at
  each end; a segment ends `handle/2 + 6dp` short of a handle; a segment shorter
  than its corner is dropped (no hairline slivers). With stops, interior values sit
  at `corner + f × (length − 2 × corner)` so the handle lines up with the dots, which
  are inset into the rounded caps; dots under the handle gap are hidden, and dots
  on the active track flip to `on-primary`. A centered slider leaves a 6dp gap at
  the centre.
- **Inset icon hand-off.** The icon sits 10dp inside the active track's start; when
  the active track is shorter than the icon + padding it cross-fades onto the
  inactive track, just past the handle (MD3: "the icon moves to the inactive
  track"). Pass a function to swap it, e.g. volume → mute at 0.
- **Expressive motion.** Value jumps (track click, keys, controlled updates) glide
  on the Expressive **default spatial** spring (0.8 / 380, 412ms); dragging follows
  the pointer 1:1. The handle squeeze and value-indicator pop use the **fast
  spatial** spring (0.6 / 800, 348ms); colors and fades use the effects springs.
  All are CSS `linear()` curves sampled from the Compose springs.
  `prefers-reduced-motion` keeps only the fades.
- **Pointer.** Press anywhere: the nearest handle comes to the pointer (MD3 "select
  jump"); pressing _on_ a handle grabs it without a jump; stacked range handles are
  split by the first drag direction. Touch waits for movement along the track, so
  scrolling the page across a slider never changes it.
- **MD3 usage.** Changes take effect **immediately**. Use **standard** when the
  value starts at zero, **centered** when zero / the default is in the middle,
  **range** for a min–max pair (avoid vertical range sliders). Keep stops few;
  reserve **XL** for hero moments. Inset icons only on M/L/XL standard sliders.

**`Card`** is the MD3 card — a container for content and actions about **one
subject** — with the exact Compose / Material Web tokens and M3 **Expressive**
shape and motion. Three variants, same legibility and function, different
separation: **elevated** (`surface-container-low`, level 1 shadow), **filled**
(`surface-container-highest`, subtle, the default — like Compose's `Card()`) and
**outlined** (`surface` + a 1dp `outline-variant` boundary). The container has a
12dp (`corner-medium`) shape and 16dp padding; parts are composed as children, and
the container is the only required one.

| Prop          | Values                                                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`     | `filled` _(default)_ · `elevated` · `outlined`                                                                                                                                                                                                     |
| `shape`       | the M3 Expressive corner scale: `none` · `extra-small` · `small` · `medium` _(default, 12dp)_ · `large` · `large-increased` · `extra-large` · `extra-large-increased` · `extra-extra-large` (48dp). Changes morph on the Expressive spatial spring |
| `orientation` | `vertical` _(default)_ · `horizontal` (media beside the content — MD3's compact layout)                                                                                                                                                            |
| `asChild`     | render onto the child: `<article>`, an `<li>` in a collection, or — for a **directly actionable** card — `<a>` / `<button>` / `<label>` / a router `<Link>`                                                                                        |
| `interactive` | hover / pressed / focus states, ripple, pointer cursor. **Auto-detected** for an `asChild` `<a>`, `<button>`, `<label>`, `<summary>` or a child with `href` / `onClick`; a `CardPrimaryAction` needs neither                                       |
| `disabled`    | `<button>` card → native `disabled`; other actionable cards → `aria-disabled`; a container card → `inert`. MD3's disabled container, elevation and outline, content at 38%                                                                         |
| `dragged`     | picked up: dragged elevation (level 4 elevated, 3 filled/outlined) + the 16% dragged state layer, drawn in front of its siblings                                                                                                                   |
| `selected`    | MDC-Android's checked card: `secondary` 16% tint, `secondary` outline (outlined) and state layer, and a 24dp check-circle at the top-end corner. Sets `aria-pressed` on a `<button>` card                                                          |
| `checkIcon`   | the check shown while selected: `true` (built-in), a node, or `false`. Defaults to `true` whenever `selected` is set; pass it for `<label>` / toggle-action cards                                                                                  |

| Part                 | What it is                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CardMedia`          | thumbnail / image / video. **Full-bleed** by default (cancels the padding on every edge it touches, orientation- and position-aware); `inset` keeps the padding with an **optically round** radius (outer − padding); `placement="first"` moves it to the top visually while the DOM keeps the heading first; `asChild` makes the `<img>` / `<video>` itself the box |
| `CardHeader`         | row of `leading` (avatar / thumbnail) · text column (`children`) · `trailing` (overflow-menu `IconButton`, timestamp)                                                                                                                                                                                                                                                |
| `CardContent`        | the text block; it grows, so the actions of equal-height cards line up at the bottom                                                                                                                                                                                                                                                                                 |
| `CardHeadline`       | an `<h3>` in `title-medium` (`size` `small` · `medium` · `large` → `title-*`); `asChild` picks the level; `maxLines` clamps                                                                                                                                                                                                                                          |
| `CardSubhead`        | `<p>`, `body-medium`, `on-surface-variant`; `maxLines`                                                                                                                                                                                                                                                                                                               |
| `CardSupportingText` | `<p>`, `body-medium`, `on-surface-variant`, 8dp below the text above it; `maxLines`                                                                                                                                                                                                                                                                                  |
| `CardActions`        | buttons / icon buttons / chips, pushed to the bottom, wrapping; `align` `end` _(default)_ · `start` · `between` · `stretch`                                                                                                                                                                                                                                          |
| `CardPrimaryAction`  | the **primary action area**: a real `<a href>` (or `<button>`, or `asChild` for a router link) whose `::after` stretches over the card; `disabled`, and `selected` for a toggle `<button>`                                                                                                                                                                           |

- **States, per tokens.** Hover: elevated 1 → 2, filled / outlined 0 → 1, 8%
  `on-surface` state layer. Focus: 10% layer + MD3's 3dp `secondary` indicator 2dp
  outside the container; an outlined card's outline turns `on-surface`. Pressed:
  10% layer, elevated sinks back to level 1, plus a ripple **across** the card
  (state layer and ripple sit above the content, as in Compose, so they cover
  full-bleed media). Dragged: 16% layer. A **container** card has none of these
  (MD3: non-actionable cards don't hover or ripple).
- **Motion.** Elevation, colors and the outline follow Compose's elevation tweens —
  enter 120ms `FastOutSlowIn`, exit 150ms `(0.4, 0, 0.6, 1)`. Corner changes ride
  the M3 Expressive default spatial spring (412ms); the check icon pops in on the
  fast spatial spring (~9.5% overshoot, 348ms) and leaves on a quick
  emphasized-accelerate fade. `prefers-reduced-motion` keeps only the fades.
- **MD3 usage.** One subject per card; don't force content into cards where
  spacing, headlines or dividers would do. Collections are **coplanar** (same
  resting elevation) in a grid, list or carousel, ≤ 8dp apart; filters and sorting
  sit outside the collection. A card is **either** a container holding actions
  **or** directly actionable — never an action on an actionable surface (the
  stretched `CardPrimaryAction` keeps nested controls above it, never under it).
  Cards don't scroll internally: clamp with `maxLines` and expand / navigate for
  the rest. Avoid text over images, or add a scrim. Swipe and drag need a
  single-pointer alternative (e.g. a menu).

### Tooltip (`@chatool/ui/tooltip`)

The MD3 tooltip, **plain** or **rich**, with M3 Expressive motion. It wraps one
element (the **anchor**) and renders nothing else until it shows.

- **Plain** labels an element with no text of its own (icon buttons): an
  `inverse-surface` container, `body-small` `inverse-on-surface` text, 4dp
  corners, 24dp min height, 8dp side padding, 200dp max width. One line is
  centred; wrapped text is start-aligned. It sits **above** the anchor, 4dp away.
- **Rich** explains: a `surface-container` card at elevation 2 with 12dp corners
  and a 320dp max width, an optional `title-small` subhead, `body-medium`
  supporting text and up to two `primary` text buttons. Padding is 12dp top, 16dp
  sides, 8dp bottom (12dp without actions); 4dp between subhead and text, 12dp
  above the 40dp action row. It sits at the anchor's **bottom corner** (MD3: "the
  bottom right of the parent element").

| Prop                                                                          | Values                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                                                                    | the anchor: **one** element that forwards its props and `ref` to a DOM node (`Button`, `IconButton`, any native element)                                                                                                                |
| `content`                                                                     | the message (plain) or supporting text (rich). Empty (`null`, `""`, `false`) renders nothing                                                                                                                                            |
| `variant`                                                                     | `plain` · `rich`. Defaults to `rich` when `title`, `actions` or `persistent` is set                                                                                                                                                     |
| `title`                                                                       | rich subhead (one line)                                                                                                                                                                                                                 |
| `actions`                                                                     | rich actions: up to two `TooltipAction`s. Clicking one closes the tooltip, unless it has `data-tooltip-keep-open`                                                                                                                       |
| `persistent`                                                                  | MD3 **persistent** rich tooltip: opens on the anchor's **click** (not hover / focus) and stays until Escape, a press elsewhere, focus moving away, or an action. `defaultOpen` shows one on page load                                   |
| `caret`                                                                       | Compose's 16×8dp caret pointing at the anchor's centre; follows flips and shifts                                                                                                                                                        |
| `side`                                                                        | `top` _(plain default)_ · `bottom` _(rich default)_ · `start` · `end` (logical) · `left` · `right`                                                                                                                                      |
| `align`                                                                       | `center` _(plain default)_ · `start` · `end` (edges flush) · `after` _(rich default)_ · `before` (beside the anchor, corners touching)                                                                                                  |
| `offset` / `alignOffset`                                                      | px from the anchor (default `4`, MD3; use `8` for text with no visual boundary) / extra shift along the edge                                                                                                                            |
| `collisionPadding` / `flip`                                                   | minimum distance from the viewport edges (default `8`) / flip to the opposite side or mirrored alignment when out of room (default `true`). It also shifts along the edge to stay on screen                                             |
| `open` / `defaultOpen` / `onOpenChange`                                       | controlled or uncontrolled. `onOpenChange(open, { reason, event })`; `reason` is `hover` · `focus` · `blur` · `long-press` · `click` · `press` · `escape` · `outside-press` · `focus-outside` · `action` · `anchor-hidden` · `replaced` |
| `disabled`                                                                    | never show it (the anchor keeps its name)                                                                                                                                                                                               |
| `relationship`                                                                | `description` _(default)_: `aria-describedby` · `label`: the text **names** the anchor (`aria-label`; string `content` only) · `none`: you wire it                                                                                      |
| `interactive`                                                                 | the tooltip has controls: it becomes a non-modal `dialog`, the anchor gets `aria-haspopup` / `aria-expanded`, Tab moves in and out. Defaults to `true` with `actions` or `persistent`                                                   |
| `hoverable`                                                                   | keep it open while the pointer is over it (default `true`, WCAG 1.4.13); `false` makes it ignore the pointer                                                                                                                            |
| `showDelay` / `hideDelay` / `skipDelay` / `touchShowDelay` / `touchHideDelay` | ms; defaults `500` / `1500` / `300` / `500` / `1500` (see Behavior). Any of them can be set app-wide with `TooltipProvider`                                                                                                             |
| `container`                                                                   | where it renders. Default: the anchor's open `<dialog>`, else `<body>`                                                                                                                                                                  |
| `className` / `style` / other `div` props                                     | the tooltip **surface**                                                                                                                                                                                                                 |

| Export            | What it is                                                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TooltipProvider` | optional defaults for every tooltip below it: the five timings and `container`. A tooltip's own props win; nested providers inherit what they don't set          |
| `TooltipAction`   | a rich tooltip's action: `Button` with `variant="text"` and the padding the action row is built around (labels line up with the text). Every `Button` prop works |

- **Behavior (MD3).** Hover (mouse / pen) shows it after `showDelay`; while a
  tooltip is showing, or within `skipDelay` after one closed, the next shows at
  once, so scanning a toolbar reads fluently. **Keyboard focus** shows it at once
  (`:focus-visible` only, never a mouse click). **Touch:** a long-press shows it
  and swallows the click that would follow; it stays `touchHideDelay` after
  release. Leaving starts `hideDelay` (MD3: "disappear 1.5 seconds after
  navigating away"); moving onto the tooltip itself keeps it. **Only one** shows
  at a time: a new tooltip closes the previous one. Pressing the anchor, a press
  elsewhere, Escape, blur and the anchor scrolling out of view all close it at
  once.
- **Motion.** Compose's `TooltipBox`: scale 0.8 → 1 on the Expressive
  **fast-spatial** spring (350ms, ~9.5% overshoot), growing out of the point
  nearest the anchor, with a **fast-effects** fade (140ms). Exits fade and shrink
  on fast effects only. `prefers-reduced-motion` keeps the fade and drops the
  scale.
- **Placement.** Rendered in the browser's **top layer** (native Popover API):
  above every stacking context, `overflow` clip and modal `<dialog>`, with no
  `z-index` to manage. Positioned with Floating UI: it flips, shifts to stay
  `collisionPadding` inside the viewport, follows its anchor on scroll and resize,
  and mirrors `start` / `end` in RTL.
- **MD3 usage.** Plain tooltips for icon-only buttons, not for elements that
  already show their label. Keep plain text short; use rich for definitions and
  explanations. Never hide critical information in a tooltip (use a dialog).
  Persistent rich tooltips appear on click or on page load for feature discovery
  (give those a subhead); avoid them on icon buttons.

### Rich tooltip (`@chatool/ui/rich-tooltip`)

MD3's **rich tooltip with button actions** as a dedicated, composable component:
longer, explanatory context for an element, with an optional subhead, inline
links and up to two text buttons. It shares the overlay engine with `Tooltip`
(top layer, Expressive motion, the same interaction controller and one-at-a-time
rule) but is built from parts, so every piece takes its own props, `className`
and `asChild`. `Tooltip variant="rich"` still works for the simple prop-based
case.

- **Anatomy & measurements** (m3.material.io specs, Compose `RichTooltip` /
  `RichTooltipTokens`): `surface-container` container, `corner-medium` (12dp),
  elevation level 2, 320dp max width (40dp min width, 24dp min height); padding
  12dp top, 16dp sides, 8dp bottom with actions (12dp without). `title-small`
  subhead and `body-medium` supporting text in `on-surface-variant`, 4dp apart
  (the subhead baseline lands at Compose's 28dp, the text's 24dp below it); a
  40dp row of `label-large` `primary` text buttons 12dp under the text, their
  labels aligned with it. The five MD3 configurations (subhead / text / one or two
  buttons) all fall out of which parts you render.
- **Placement:** MD3's "bottom right of the parent element" by default (`side
"bottom"`, `align "after"`), `center` for MD3's desktop variant. It flips when
  out of room and shifts **in 8dp steps** (MD3: "adjusts in increments of 8dp to
  avoid going off-screen"; `positionStep`). Never covers its anchor.
- **Motion:** Compose's `TooltipBox`: scale 0.8 → 1 on the Expressive
  fast-spatial spring out of the anchor, fast-effects fade; exits are
  effects-only; reduced motion keeps the fade.

| `RichTooltip` prop                                                            | Values                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                                                                    | **composed:** a `RichTooltipTrigger` + a `RichTooltipContent` · **shorthand** (`supportingText` set): the anchor element itself                                                                                                                                                                                                   |
| `supportingText` / `subhead` / `actions`                                      | shorthand content: the text (switches to shorthand mode), the optional one-line subhead, up to two `RichTooltipAction`s                                                                                                                                                                                                           |
| `contentProps`                                                                | shorthand: props for the generated `RichTooltipContent` (`className`, `style`, `elevation`, `maxWidth`, …)                                                                                                                                                                                                                        |
| `trigger`                                                                     | `hover` _(default)_: MD3's **transient** tooltip (hover after `showDelay`, keyboard focus, touch long-press; leaves 1.5s after the pointer) · `click`: **persistent** (click toggles; stays until Escape, a press elsewhere, focus moving away or an action) · `manual`: only code opens it (Compose's `enableUserInput = false`) |
| `open` / `defaultOpen` / `onOpenChange`                                       | controlled or uncontrolled; `onOpenChange(open, { reason, event })` with `Tooltip`'s reasons plus `programmatic`                                                                                                                                                                                                                  |
| `state`                                                                       | a `useRichTooltipState()` object (Compose's `TooltipState`): `show()` / `dismiss()` / `toggle()` from anywhere. Wins over `open`                                                                                                                                                                                                  |
| `anchor`                                                                      | point at something other than the trigger: an element, a ref, or a **virtual anchor** (`{ getBoundingClientRect, contextElement? }`: a text selection, a click point, a canvas hit). An element anchor with no trigger becomes the trigger                                                                                        |
| `side` / `align`                                                              | `bottom` _(default)_ · `top` · `start` · `end` · `left` · `right` / `after` _(default)_ · `before` · `start` · `center` · `end`                                                                                                                                                                                                   |
| `offset` / `alignOffset` / `collisionPadding` / `flip`                        | px from the anchor (`4`) / along the edge (`0`) / from the viewport edges (`8`) / flip when out of room (`true`)                                                                                                                                                                                                                  |
| `positionStep`                                                                | collision shifts in multiples of this many px (`8`, MD3); `0` = exact                                                                                                                                                                                                                                                             |
| `caret`                                                                       | `true` for Compose's 16×8dp caret, or `{ width, height }` (px or any length)                                                                                                                                                                                                                                                      |
| `interactive`                                                                 | override the automatic detection (actions, links or controls in the content, or a `click` / `manual` trigger → non-modal `dialog`)                                                                                                                                                                                                |
| `announce`                                                                    | live-region announcement when it appears without the user asking at its trigger (page load, code, click, long-press): `true` / `polite` _(default)_ · `assertive` · `false`                                                                                                                                                       |
| `hoverable` / `disabled` / `container`                                        | stay open under the pointer (`true`, WCAG 1.4.13; forced on with controls) / never show / where to render                                                                                                                                                                                                                         |
| `showDelay` / `hideDelay` / `skipDelay` / `touchShowDelay` / `touchHideDelay` | ms, `500` / `1500` / `300` / `500` / `1500`; app-wide via `TooltipProvider` from `@chatool/ui/tooltip`                                                                                                                                                                                                                            |

| Part                        | What it is                                                                                                                                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RichTooltipTrigger`        | wraps **one** ref-forwarding element (no DOM of its own) and gives it the listeners and ARIA; its props go to the child                                                                                                                               |
| `RichTooltipContent`        | the surface (portalled, top layer). `elevation` `0`–`5` (default `2`), `maxWidth` (px or length), `className` / `style` / `div` props                                                                                                                 |
| `RichTooltipSubhead`        | `title-small` subhead; labels an interactive tooltip. `asChild` to render your own heading                                                                                                                                                            |
| `RichTooltipSupportingText` | `body-medium` text; inline `<a href>` links are `primary`, underlined, focusable. `asChild` for your own element                                                                                                                                      |
| `RichTooltipActions`        | the action row (start-aligned, 8dp gap, wraps only if it must)                                                                                                                                                                                        |
| `RichTooltipAction`         | MD3's `primary` text button (`Button`, every prop). `closeOnClick` (default `true`; `event.preventDefault()` keeps it open once). **Async:** return a promise from `onClick` → spinner, tooltip held open, closes on resolve, stays on reject (retry) |
| `useRichTooltipState()`     | `{ open, show, dismiss, toggle, setOpen }` for the `state` prop; options `defaultOpen`, `onOpenChange`                                                                                                                                                |
| `useRichTooltip()`          | inside the content: `{ open, interactive, dismiss(event?), hold() }` for custom parts (your own close button, a form that holds the tooltip open while saving)                                                                                        |

- **MD3 usage.** Rich tooltips are for definitions, explanations and feature
  discovery, not critical information (use a dialog). Keep the subhead to one
  line; give one whenever the tooltip opens on its own. At most two short buttons,
  side by side. Avoid persistent (`click`) rich tooltips on icon buttons. One
  transient tooltip at a time; persistent ones stay until the person interacts
  elsewhere.

### Text field (`@chatool/ui/text-field`)

The MD3 text field, **filled** or **outlined**, with M3 Expressive motion. One
component covers MD3's single-line field, growing **multi-line** field and fixed
**text area**, over the real `<input>` / `<textarea>`.

- **Anatomy & sizes** (Compose `FilledTextFieldTokens` / `OutlinedTextFieldTokens`
  v0_210 + `TextFieldImpl.kt`, Material Web `md-*-field`). 56dp tall; 16dp
  top/bottom padding, or 8dp + the 16dp floated-label line + 24dp of input + 8dp
  for a filled field with its label inside. 16dp start/end; an icon is a 24dp
  glyph in a 48dp target flush with the edge (12dp in), 16dp from the text.
  Prefix / suffix sit 2dp from the text. Supporting text and the counter are
  body-small, 4dp below and 16dp in, 16dp apart. Corners: extra-small (4dp), top
  only when filled. Default width 280dp (Compose's `MinWidth`); `className="w-full"`
  to fill. **Density** `-1`…`-4` removes 4dp per step (56 → 40dp).
- **Colors.** Filled: `surface-container-highest` container, `on-surface-variant`
  1dp active indicator, 8% `on-surface` hover state layer (indicator →
  `on-surface`). Outlined: 1dp `outline` (hover `on-surface`), transparent
  container. Focused: 2dp `primary` indicator / outline, `primary` label and
  caret. Error: `error` label, indicator, trailing icon, supporting text and
  caret; hovering an unfocused error field shifts label / indicator / trailing
  icon to `on-error-container`. Disabled: content `on-surface` 38%, filled
  container 4%, outline 12%, no motion. Read-only looks like enabled (MD3).
- **Label.** Rests in the middle (body-large, aligned with the text) and floats on
  focus, once there's a value, on autofill, or always (`alwaysFloatLabel`,
  date/time types): to the top of a filled container, or into a **notch** in the
  outline (4dp padding each side) at 16dp, above a leading icon. The notch is
  CSS-only (an invisible copy of the floated label sizes it), so it's exact for
  any font. An outlined field with a label reserves 8dp above itself so the
  floated label never overlaps what's above (Compose does the same).
  `labelPosition="above"` puts a body-small label above the container instead.
- **Motion (Expressive).** The label moves **and resizes** (body-large →
  body-small — the real font size, as Compose lerps the text style) on the
  fast-spatial spring (0.6 / 800, 348ms, ~9.5% overshoot); the indicator /
  outline thickens on the same spring and the notch opens from its centre with
  it. Colors use fast effects (137ms); the placeholder fades in on slow effects
  (299ms) when an empty field gains focus. `prefers-reduced-motion` keeps the
  fades only.

| Prop                                         | Values                                                                                                                                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`                                    | `filled` _(default)_ · `outlined` — same function, different emphasis; don't mix them in one region                                                                                                              |
| `label`                                      | the label (every field should have one). A real `<label for>`; omit only when an adjacent label names the field (then pass `aria-label` / `aria-labelledby`)                                                     |
| `labelPosition`                              | `attached` _(default: inside / in the outline)_ · `above` (Compose's `TextFieldLabelPosition.Above`)                                                                                                             |
| `alwaysFloatLabel`                           | keep the inside label floated while empty, so `placeholder`, `prefix` and `suffix` stay visible                                                                                                                  |
| `placeholder`                                | hint text; with an inside label it shows only while focused (MD3)                                                                                                                                                |
| `required` / `requiredIndicator`             | native `required` + MD3's asterisk after the label (part of the accessible name). `requiredIndicator` replaces `"*"`; `null` hides it                                                                            |
| `supportingText` / `supportingTextOnFocus`   | helper text under the field (`aria-describedby`), `error`-colored while invalid; optionally only while focused (space stays reserved)                                                                            |
| `error`                                      | `true` forces the error state + `aria-invalid`; `false` suppresses it (a form library owns validation); `undefined` _(default)_ also shows it for native constraint failures after interaction (`:user-invalid`) |
| `errorText`                                  | replaces `supportingText` while invalid (MD3: swap, don't stack); announced with `role="alert"` when `error` turns on                                                                                            |
| `errorIcon`                                  | `true` _(default)_: MD3's trailing error glyph in the error state, only when there's no `trailingIcon`. A node replaces it, `false` turns it off                                                                 |
| `leadingIcon` / `trailingIcon`               | an icon or `IconButton`, each in a 48dp box; mirror in RTL. Decorative SVGs follow the icon colors                                                                                                               |
| `prefix` / `suffix`                          | text before / after the input (`$`, `kg`, `@gmail.com`), shown with the floated label, added to `aria-describedby`                                                                                               |
| `clearable` / `clearIcon`                    | MD3's clear icon button, only while there's editable text; **Escape** clears too. Fires `onChange` like typing, keeps focus, stays out of the Tab order                                                          |
| `passwordToggle`                             | `type="password"` gets a show / hide button by default (`false` to remove); relabels itself and re-hides the password on form submit / reset                                                                     |
| `counter`                                    | MD3 character counter, automatic with `maxLength` (`n/max`, spoken "n of max characters"); `true` without `maxLength` shows a count; `false` hides it                                                            |
| `multiline` / `minRows` / `maxRows` / `rows` | a `<textarea>`: grows from `minRows` _(1)_ to `maxRows` (then scrolls); with `rows`, a fixed-height MD3 **text area**                                                                                            |
| `density`                                    | `"0"` _(default)_ · `"-1"` · `"-2"` · `"-3"` · `"-4"` (−4dp each). MD3: let users opt into density, don't default to it                                                                                          |
| `color`                                      | focus accent: `primary` _(default, MD3)_ · `secondary` · `tertiary`                                                                                                                                              |
| `labels`                                     | localized strings: `clear`, `showPassword`, `hidePassword`, `error`, `characterCount` (`{count}` / `{max}` template)                                                                                             |
| `asChild` + `children`                       | render your own control (masked input, autocomplete input) as the field; it gets the classes, `id`, `placeholder`, `aria-*`                                                                                      |
| `classNames`                                 | extra classes per part: `container`, `input`, `label`, `leadingIcon`, `trailingIcon`, `prefix`, `suffix`, `supportingText`, `counter`                                                                            |
| `className` / `style`                        | the **root** (width, margins, token overrides)                                                                                                                                                                   |
| everything else                              | the native control: `name`, `type`, `value` / `defaultValue`, `onChange`, `maxLength`, `pattern`, `autoComplete`, `inputMode`, `disabled`, `readOnly`, `aria-*`, `ref`, …                                        |

- **MD3 usage.** Every field gets a label (short, never truncated or wrapped).
  Swap supporting text for error text instead of adding a line; describe how to
  fix the error. Mark required fields with `*` and explain it once (supporting
  text or a note at the top of the form). Prefer a fixed-height text area to a
  growing multi-line field on the web. Use clear icons only when there's text.
  Don't span the full width of large screens; don't make dense fields the
  default.

### Chips (`@chatool/ui/chip`, `@chatool/ui/chip-set`)

MD3 chips — **assist**, **filter**, **input** and **suggestion** — with M3
Expressive shape morph and motion, plus `ChipSet`, the keyboard / selection
container MD3 asks for ("chips appear as a group").

- **Variants (pick by purpose and author).** _Assist_: a smart, contextual action
  (start with a verb: "Add to calendar"). _Filter_: a tag that filters a
  collection; selecting it adds a leading checkmark. _Input_: a piece of
  information the person entered (a contact, a tag), with a remove action.
  _Suggestion_: a dynamically generated suggestion (a quick reply). Chips aren't
  buttons: use them for contextual, supplemental options, in a set — never alone
  and never to finish or progress a task.
- **Anatomy & sizes** (m3.material.io specs, Compose `*ChipTokens` v7_0_1 +
  `Chip.kt`, Material Web v34). 32dp tall, `label-large`, 18dp icons, a 24dp round
  avatar. Compose's exact spacing: 16dp | label | 16dp with no icon; 8dp | icon |
  8dp | label | 16dp with a leading icon; input chips 4dp | avatar | 8dp; a
  trailing icon / remove action sits 8dp after the label with 8dp end padding.
  Labels truncate with an ellipsis (MD3: ≤ 20 characters). Every chip has a 48dp
  touch target (the remove action too: 48 × 48dp), even though it's 32dp tall.
- **Colors.** Flat chips are transparent with a 1dp `outline-variant` outline
  (`on-surface` / `on-surface-variant` when focused); `elevated` chips (over
  images or busy backgrounds) are `surface-container-low` with elevation 1 → 2 on
  hover. Labels: assist `on-surface`, the others `on-surface-variant`. Leading
  icons `primary` (an input chip's is `on-surface-variant` and turns `primary` on
  hover / focus / press). Selected filter / input chips fill with
  `secondary-container` and drop the outline (`on-secondary-container` content);
  a selected flat filter chip rises to elevation 1 on hover. State layers 8% /
  10% / 10% / 16% (hover / focus / press / drag) of the label color; 3dp
  `secondary` focus ring 2dp outside. Disabled: content `on-surface` 38%,
  outline 12%, a selected or elevated container `on-surface` 12%.
- **M3 Expressive (default).** From Compose's `ChipsTokens` (v37) and the
  `@material3expressive` `FilterChip` / `InputChip(shapes = …)` overloads: the
  container **morphs** — 12dp corners at rest, a **full pill when selected**,
  8dp **while pressed** — on the fast-spatial spring (0.6 / 800, 348ms, ~9.5%
  overshoot). The checkmark is **revealed from the start edge** on the same
  spring (Compose's `expandHorizontally`) and fades on default effects (212ms);
  a chip with its own icon cross-fades the icon into the check. Filter / input
  chips tighten the icon ⇄ label spacing to 4dp, and an unselected filter chip's
  icon is the tonal `on-surface-variant`. `expressive={false}` gives the
  baseline spec: a static 8dp corner, 8dp spacing, a `primary` icon.
  `prefers-reduced-motion` keeps the fades only.
- **`ChipSet`.** A `role="toolbar"` (WAI-ARIA APG toolbar, like Material Web's
  `md-chip-set`) with a **single Tab stop**, ←/→ (mirrored in RTL) through every
  chip action with wrap-around (`loop`), Home / End, and selection:
  `selectionMode="single"` (an alternative to segmented buttons / radios) or
  `"multiple"`, controlled or uncontrolled, `required`, and `name` to submit the
  selection with a form. `layout="wrap"` _(default)_ breaks onto new lines (8dp
  gaps); `layout="scroll"` is one horizontally scrolling row.

**`Chip` props**

| Prop                                                    | Values                                                                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`                                               | `assist` _(default)_ · `filter` · `input` · `suggestion`                                                                                                                                    |
| `children`                                              | the label (the chip's accessible name)                                                                                                                                                      |
| `icon`                                                  | leading 18dp icon (decorative). A filter chip swaps it for the checkmark while selected                                                                                                     |
| `avatar`                                                | input chips: a 24dp round image or initials (wins over `icon`)                                                                                                                              |
| `trailingIcon`                                          | decorative trailing icon inside the chip (e.g. a menu arrow on a filter chip); ignored when the chip is removable                                                                           |
| `selected` / `defaultSelected` / `onSelectedChange`     | filter / input chips: controlled or uncontrolled selection (`aria-pressed`). Inside a selectable `ChipSet` the set's value wins                                                             |
| `selectedIcon`                                          | filter chips: the selected leading icon (default: a checkmark); `false` for color-only selection                                                                                            |
| `value`                                                 | the chip's identity inside a `ChipSet` (selection and `onRemove`)                                                                                                                           |
| `removable` / `onRemove` / `removeLabel` / `removeIcon` | a remove action ("Remove {label}", 48dp target), also on Backspace / Delete. Implied by `onRemove`, `removeOnly`, or an input chip in a set with `onRemove`. `removeLabel` = localized name |
| `removeOnly`                                            | input chips whose only action is removal: the whole chip is **one** remove button                                                                                                           |
| `elevated`                                              | assist / filter / suggestion chips over images or busy backgrounds                                                                                                                          |
| `expressive`                                            | `true` _(default)_: M3 Expressive shape morph + spacing + tonal icon · `false`: the baseline spec                                                                                           |
| `loading`                                               | a spinner replaces the leading icon; `aria-busy`, keeps its colors, ignores activation                                                                                                      |
| `disabled` / `softDisabled`                             | native `disabled` (skipped by the keyboard) / `aria-disabled` (same look, still focusable)                                                                                                  |
| `dragged`                                               | drag-and-drop feedback: elevation 4 + the 16% dragged layer                                                                                                                                 |
| `href` / `target` / `rel` / `download` / …              | a link chip (`<a>`); links can't be disabled                                                                                                                                                |
| `asChild`                                               | put the chip's primary action on your element (e.g. Next's `<Link>`); its own text becomes the label                                                                                        |
| `className` / `style`                                   | the **container** (layout, `--md-comp-chip-*` overrides)                                                                                                                                    |
| `actionClassName`                                       | the primary action element                                                                                                                                                                  |
| everything else                                         | the primary action: `onClick`, `id`, `type`, `aria-*`, `data-*`, …                                                                                                                          |

**`ChipSet` props**

| Prop                                       | Values                                                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `aria-label` / `aria-labelledby`           | the set's accessible name (always give one)                                                                                   |
| `selectionMode`                            | `none` _(default)_ · `single` · `multiple`                                                                                    |
| `value` / `defaultValue` / `onValueChange` | single: `string \| null`; multiple: `string[]`. Chips join by their `value`                                                   |
| `required`                                 | keep at least one chip selected                                                                                               |
| `name` / `form`                            | submit the selection: one hidden `<input name value>` per selected chip                                                       |
| `onRemove`                                 | `(value) => void`; makes the set's input chips removable                                                                      |
| `disabled`                                 | disables every chip                                                                                                           |
| `layout`                                   | `wrap` _(default)_ · `scroll` (one row that scrolls sideways; focus rings and touch targets aren't clipped, scrollbar hidden) |
| `loop`                                     | arrow keys wrap around (default `true`)                                                                                       |
| `role`                                     | `toolbar` _(default)_; override for a different grouping                                                                      |
| everything else                            | the root `<div>`                                                                                                              |

- **MD3 usage.** Show chips in a set (never one alone). Don't mix single- and
  multi-select sets on one page. Filter chips wrap; past two rows consider
  `layout="scroll"`. Show that chips are interactive (a label like "Select type"
  before the set, page context, or `--md-comp-chip-outline-color: outline` for a
  3:1 boundary). Keep elevated chips for images / busy backgrounds. Don't make
  dense chips the default (let users opt in by overriding
  `--md-comp-chip-container-height`).

### Tabs (`@chatool/ui/tabs`)

MD3 tabs — "organize content across different screens and views" — as five
composable parts on one subpath: `Tabs` (state), `TabList` (the row), `Tab`,
`TabPanels` (the content area) and `TabPanel`.

- **Variants.** _Primary_ tabs (default) are the main destinations, placed under
  the top app bar: selected `primary`, a **3dp** indicator with `3,3,0,0`
  corners that spans the content, **inset 2dp** on each side, **≥ 24dp**.
  _Secondary_ tabs are a second level inside a content area (always below
  primary tabs): selected `on-surface`, a **2dp full-width** indicator.
- **Anatomy & sizes** (m3.material.io specs, Compose
  `{Primary,Secondary}NavigationTabTokens` + `Tab.kt` / `TabRow.kt`, Material Web
  v34, MDC-Android `Widget.Material3.TabLayout`). 48dp container, **64dp** with an
  icon stacked above the label (`iconPosition="top"`, default) or 48dp inline
  (`"start"`, 8dp gap). 24dp icons, `title-small` labels, 16dp side padding,
  `surface` container and a 1dp `outline-variant` divider **inside** the height.
  Unselected labels are `on-surface-variant`, `on-surface` while hovered /
  focused / pressed. State layers 8 / 10 / 10% (`primary` when selected and for
  an unselected primary press, else `on-surface`); the ripple is always the
  selected color (Compose). Focus: 3dp `secondary`, drawn **inward** with 8dp
  corners, stopping 1dp above the indicator.
- **Layouts.** `fixed` (default) divides the row into equal sections (MD3: avoid
  more than four); labels may wrap to two lines, then truncate. On wide windows
  `alignment="center"` / `"start"` sizes every tab to the widest one and aligns
  the group (MD3 responsive layout). `scrollable` sizes tabs to their labels
  (min 90dp), offsets the first tab 52dp from the leading edge, springs the
  selected tab to the center (Compose) and keeps a keyboard-focused tab in view;
  `scrollButtons` (`true` / `"auto"` = fine pointers only) adds chevrons that
  page the row.
- **Badges.** `badge={true}` (small dot), a count (`12`, `999+`) or your own
  `<Badge />`. On stacked and icon-only tabs it overlaps the icon by **6dp**;
  otherwise it follows the label by **4dp** (MD3 specs). Clear it once the tab
  has been seen (MD3).
- **M3 Expressive motion.** The selected indicator **travels** from wherever the
  previous one is (mid-flight included). `indicatorMotion="elastic"` (default)
  runs its two edges on separate Expressive springs — the leading edge on
  **default spatial** (0.8 / 380, 412ms) and the trailing edge on **slow
  spatial** (0.8 / 200, 567ms) — so it stretches toward its target and settles
  with a soft overshoot (MDC-Android's `elastic` mode, on Compose's springs). The
  edges are animated as registered `<length>` properties, so the 3dp corners
  never distort. `"slide"` moves both edges together (Compose `TabRow`),
  `"fade"` cross-fades (MDC). Colors fade **in** on default effects (212ms) and
  **out** on fast effects (137ms) (Compose `TabTransition`); scrolling uses the
  default-spatial spring. Reduced motion fades and jumps.
- **Panels.** `TabPanels` shows the selected panel with MD3's **shared axis X**
  enter (30dp + fade from the side of travel; `transition="fade"` / `"none"`),
  never on first paint. `keepMounted` keeps inactive panels in the DOM. With
  `swipeable` the content area is a scroll-snapping pager (MD3 "swipe within the
  content area"): the indicator follows the finger with the elastic
  interpolation and the tab is selected when the swipe settles; selecting a tab
  springs the pager to its panel.
- **Route tabs.** `<Tab value="/billing" asChild><Link href="/billing">Billing</Link></Tab>`
  renders the tab as your link; drive `value` from the current route.

**`Tabs` props**

| Prop             | Values                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| `value`          | controlled selected tab value                                                       |
| `defaultValue`   | uncontrolled initial value (else the first enabled tab is selected after mount)     |
| `onValueChange`  | `(value, { reason: "pointer" \| "keyboard" \| "swipe" \| "programmatic" }) => void` |
| `activationMode` | `manual` _(default, MD3: arrows focus, Space / Enter select)_ · `automatic` (APG)   |

**`TabList` props** (plus every `<div>` prop — name it with `aria-label` / `aria-labelledby`)

| Prop              | Values                                                                   |
| ----------------- | ------------------------------------------------------------------------ |
| `variant`         | `primary` _(default)_ · `secondary`                                      |
| `layout`          | `fixed` _(default)_ · `scrollable`                                       |
| `alignment`       | `fill` _(default)_ · `center` · `start` (fixed tabs)                     |
| `iconPosition`    | `top` _(default, stacked 64dp)_ · `start` (inline 48dp)                  |
| `indicatorMotion` | `elastic` _(default)_ · `slide` · `fade`                                 |
| `divider`         | `true` _(default)_ · `false`                                             |
| `scrollButtons`   | `false` _(default)_ · `true` · `"auto"` (scrollable; fine pointers only) |
| `loop`            | `true` _(default)_ — arrow keys wrap                                     |
| `classNames`      | `{ scroller, scrollButton }`                                             |

**`Tab` props** (plus every `<button>` prop)

| Prop           | Values                                                             |
| -------------- | ------------------------------------------------------------------ |
| `value`        | required; matches `Tabs.value` and a `TabPanel`                    |
| `children`     | the label                                                          |
| `icon`         | 24dp icon; `selectedIcon` swaps in while selected                  |
| `iconPosition` | per-tab override of the list's                                     |
| `badge`        | `true` · number · string · `<Badge />` · `null`                    |
| `disabled`     | skipped by the arrow keys, can't be selected                       |
| `asChild`      | render as the single child (a link); its children become the label |
| `classNames`   | `{ content, icon, label, indicator, badge }`                       |

**`TabPanels` / `TabPanel` props**: `TabPanels` takes `swipeable` and
`transition` (`slide` _(default)_ · `fade` · `none`); `TabPanel` takes `value`
(required) and `keepMounted`.

### Snackbar (`@chatool/ui/snackbar`)

MD3 snackbars "show short updates about app processes at the bottom of the
screen", built from the live MD3 spec / guidelines / accessibility pages, Compose
`Snackbar.kt` + `SnackbarHost.kt` + `SnackbarTokens` (v0_103), MDC-Android
(`BaseTransientBottomBar`, `SnackbarManager`, `SwipeDismissBehavior`) and
MDC-web. Three layers on one subpath:

- **`snackbar(…)`**: the imperative API, callable from any **client** code (event
  handlers, mutation callbacks, stores, non-React code). Returns a handle whose
  `result` promise settles with why it closed (`"action"` = Compose's
  `ActionPerformed`), plus `update()` / `dismiss()`. `snackbar.promise(p, {
loading, success, error })` updates one snackbar in place;
  `snackbar.update(id, …)`, `snackbar.dismiss(id?)`, `snackbar.clear()`.
- **`SnackbarHost`**: Compose's `SnackbarHost`. Render one near the root; it shows
  its queue **one at a time** (MD3: "Only one snackbar may be displayed at a
  time"), times, animates, announces and positions them.
  `createSnackbarQueue()` + `<SnackbarHost queue>` give independent scoped hosts;
  `useSnackbar()` returns the nearest wrapping host's queue (else the global one).
- **`Snackbar`**: the surface alone (Compose's `Snackbar(…)`), for a host's
  `renderSnackbar` or your own layout, with `SnackbarAction` (the text button) and
  `SnackbarDismissAction` (the ✕ with its "Dismiss" tooltip).

The spec, as implemented:

- **Container.** `inverse-surface`, `corner-extra-small` (4dp), elevation 3;
  **48dp** for one line, **68dp** for two (14dp text padding above and below
  `body-medium` 20dp lines), max **600dp**. Supporting text `inverse-on-surface`;
  16dp before the text, 8dp after it (`TextEndExtraSpacing`), 8dp at the end
  (with the action's own 12dp, the spec's 16dp).
- **Action.** One `inverse-primary` text button (40dp, 12dp padding,
  `label-large`); never filled / elevated (MD3). **Close affordance**: a 48dp
  target with a 24dp ✕ in `inverse-on-surface`, flush at the end.
- **Action on a new line.** `actionOnNewLine` `"auto"` _(default)_ follows
  MDC-Android: on a compact window, a **wrapping** message next to an action wider
  than **128dp** moves the action under the text (aligned end, 4dp from the
  bottom). `true` / `false` force it.
- **Width.** Under 600dp (the host is a size container) snackbars span the width
  minus a 12dp margin (Compose's padding). From 600dp they fit their content
  between 20rem (MDC `sw600dp` 320dp) and 600dp, placed `align` start / center
  _(default)_ / end (MD3: "left-aligned or center-aligned … consistently").
- **Timing.** Without an action: `duration` `"short"` 4s _(default)_ · `"long"`
  10s · `"auto"` (reading time, clamped to MD3's 4–10s) · ms · `"indefinite"`.
  **With an action: `"indefinite"`** (MD3: "Snackbars with actions should remain
  on the screen until the user takes an action … or dismisses it"); an indefinite
  snackbar shows the ✕ by default (Compose's advice). The clock pauses while the
  snackbar is hovered, focused or being swiped, and while the window is blurred or
  hidden (WCAG 2.2.1).
- **Queue.** New snackbars wait (`strategy="queue"`, Compose) or replace the
  current one at once (`"replace"` / per call `replace: true`, MDC; MD3: "a
  snackbar with updated information can immediately replace an outdated
  snackbar"). Showing an existing `id` updates it in place (timer restarts).
- **Motion (M3 Expressive).** Compose's `FadeInFadeOutWithScale`: scale **0.8 → 1**
  on the **fast spatial** spring (0.6 / 800, ~9.5% overshoot) with a **fast
  effects** fade (1 / 3800); leaving reverses both. A replacement **crossfades**
  over the outgoing one in the same spot. Reduced motion: fade only. Other
  components never move with it (MD3).
- **Swipe to dismiss** (MDC `SwipeDismissBehavior`): `swipeDirection` `"end"`
  _(default, start → end, mirrored in RTL)_ · `"start"` · `"up"` · `"down"` · an
  array · `false`. Past **50%** of the width or a flick throws it off; it fades
  from **10%** to **60%** of the width; otherwise it springs back.
- **Placement.** `side` `bottom` _(default)_ · `top`; `fullWidth` (MDC FullWidth:
  edge to edge, square); `offset`; `anchor` (ref / element / selector) keeps it
  **above a FAB, bottom bar or docked toolbar** (MDC `setAnchorView`; MD3:
  "Snackbars should appear above FABs"), tracked as it moves; `contained` pins it
  inside the nearest positioned ancestor; safe-area insets are respected. The
  host renders in the **top layer** (`popover="manual"`) and moves itself into an
  open modal `<dialog>` so snackbars stay usable above it (`container` to choose).

**`snackbar()` / `SnackbarOptions`**

| Option                                                             | Values                                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `message`                                                          | the supporting text (string or node); or call `snackbar("text", opts)`                          |
| `action`                                                           | the action label (or any node); `onAction(event)` runs first                                    |
| `withDismissAction`                                                | show the ✕ (default: only when indefinite)                                                      |
| `duration`                                                         | `short` · `long` · `auto` · `indefinite` · ms                                                   |
| `id`                                                               | same id = update in place                                                                       |
| `replace`                                                          | show now, replacing the current one                                                             |
| `politeness`                                                       | `polite` _(default, MD3)_ · `assertive`                                                         |
| `announcement`                                                     | what screen readers hear (default: message + action text)                                       |
| `onClose(reason)`                                                  | `action` · `dismiss` · `timeout` · `swipe` · `escape` · `replaced` · `programmatic` · `cleared` |
| `render(data)`                                                     | render this one yourself (`data.performAction()`, `data.dismiss()`)                             |
| `actionOnNewLine`, `maxLines`, `dismissLabel`, `className`, `data` | per-snackbar overrides / payload                                                                |

`onAction` may call `event.preventDefault()` to keep the snackbar open.

**`SnackbarHost` props** (plus every `<section>` prop)

| Prop                                            | Values                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `queue`                                         | default: the global queue `snackbar()` uses                           |
| `strategy`                                      | `queue` _(default)_ · `replace`                                       |
| `duration`                                      | default for snackbars without an action (`short`)                     |
| `side` / `align`                                | `bottom` · `top` / `start` · `center` _(default)_ · `end`             |
| `fullWidth` / `contained`                       | edge-to-edge square / inside the positioned parent                    |
| `offset` / `anchor`                             | extra edge distance (px or CSS length) / element to sit above         |
| `container`                                     | portal target (default in place; auto-moves into a modal `<dialog>`)  |
| `label` / `hotkey`                              | landmark name (`Notifications`) / `["altKey", "KeyG"]` · `false`      |
| `swipeDirection`                                | `end` _(default)_ · `start` · `up` · `down` · array · `false`         |
| `pauseOnHover` / `pauseOnFocusLoss`             | `true` _(default)_                                                    |
| `actionOnNewLine` / `maxLines` / `dismissLabel` | defaults for every snackbar                                           |
| `renderSnackbar(data)` / `snackbarClassName`    | custom surface / classes for every surface                            |
| `children`                                      | optional: wraps them so `useSnackbar()` resolves to this host's queue |

**`Snackbar` props** (plus every `<div>` prop): `children` (text), `action`
(label or node) + `onAction`, `withDismissAction` + `onDismiss`, `dismissLabel`,
`actionOnNewLine` (`"auto"` · `true` · `false`), `maxLines` (line clamp with an
ellipsis). `SnackbarAction` is `Button` (text, `s`) with the snackbar colors;
`SnackbarDismissAction` takes `label`, `tooltip` and icon-button props.

## Usage

```tsx
import Button from "@chatool/ui/button";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";

export function Example() {
  return (
    <>
      <Button variant="tonal" endIcon={<ArrowForwardOutlined />}>
        Next
      </Button>
      <Button loading>Saving…</Button>
    </>
  );
}
```

```tsx
import IconButton from "@chatool/ui/icon-button";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import FavoriteFilled from "@chatool/icons/FavoriteFilled";

export function Like({ liked }: { liked: boolean }) {
  return (
    <IconButton
      variant="tonal"
      aria-label="Add to favorites"
      selected={liked}
      selectedIcon={<FavoriteFilled />}
    >
      <FavoriteOutlined />
    </IconButton>
  );
}
```

```tsx
import Fab from "@chatool/ui/fab";
import EditFilled from "@chatool/icons/EditFilled";

// FAB (icon only): name the action.
<Fab icon={<EditFilled />} aria-label="Compose" placement="bottom-end" />;

// Extended FAB that collapses on scroll (`scrolledDown` from your own state).
<Fab
  icon={<EditFilled />}
  label="Compose"
  expanded={!scrolledDown}
  placement="bottom-end"
/>;

// A FAB on phones, a large extended FAB from expanded windows up.
<Fab
  icon={<EditFilled />}
  label="Compose"
  size={{ compact: "medium", expanded: "large" }}
  expanded={{ compact: false, expanded: true }}
/>;
```

```tsx
import ButtonGroup from "@chatool/ui/button-group";
import Button from "@chatool/ui/button";

export function Range({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ButtonGroup variant="connected" aria-label="Range">
      {["Day", "Week", "Month"].map((v) => (
        <Button
          key={v}
          variant={value === v ? "filled" : "tonal"}
          selected={value === v}
          onClick={() => onChange(v)}
        >
          {v}
        </Button>
      ))}
    </ButtonGroup>
  );
}
```

Loading and progress:

```tsx
import Button from "@chatool/ui/button";
import CircularProgress from "@chatool/ui/circular-progress";
import LinearProgress from "@chatool/ui/linear-progress";
import LoadingIndicator from "@chatool/ui/loading-indicator";

export function Example({ uploaded }: { uploaded?: number }) {
  return (
    <>
      <LoadingIndicator aria-label="Loading news article" />
      <LoadingIndicator contained aria-label="Refreshing feed" />

      {/* Indeterminate until `uploaded` is known, then it hands off smoothly. */}
      <LinearProgress value={uploaded} aria-label="Uploading photo" />
      <CircularProgress value={uploaded} aria-label="Uploading photo" />

      {/* Inside a button: flat, no track, and the label's own color. */}
      <Button
        loading
        loadingIndicator={
          <CircularProgress
            shape="flat"
            color="inherit"
            track={false}
            size={24}
            thickness={3}
          />
        }
      >
        Saving
      </Button>
    </>
  );
}
```

Dividers:

```tsx
import { Fragment } from "react";
import Divider from "@chatool/ui/divider";

export function Inbox({ mails }: { mails: { id: string; from: string }[] }) {
  return (
    <ul aria-label="Inbox">
      {mails.map((mail, i) => (
        <Fragment key={mail.id}>
          <li className="px-4 py-3">{mail.from}</li>
          {/* An inset divider, rendered as a valid <li>. */}
          {i < mails.length - 1 && (
            <Divider asChild inset="start">
              <li />
            </Divider>
          )}
        </Fragment>
      ))}
    </ul>
  );
}

// Elsewhere:
<Divider />                                  // full-width, decorative
<Divider inset="middle">or</Divider>         // labelled
<Divider orientation="vertical" />           // between items in a flex row
<Divider decorative={false} />               // a thematic break: native <hr>
```

Badges:

```tsx
import Badge from "@chatool/ui/badge";
import IconButton from "@chatool/ui/icon-button";
import MailOutlined from "@chatool/icons/MailOutlined";
import NotificationsOutlined from "@chatool/icons/NotificationsOutlined";

export function AppBarActions({ unread }: { unread: number }) {
  return (
    // aria-label names the button; aria-describedby adds the badge: "Inbox, button, 12".
    <IconButton aria-label="Inbox" aria-describedby="inbox-badge">
      <Badge id="inbox-badge" value={unread}>
        <MailOutlined />
      </Badge>
    </IconButton>
  );
}

// A navigation destination: the name states the count, the badge is decorative
// and hides once the destination is selected.
<a href="/inbox" aria-label={`Inbox, ${unread} new`} aria-current={selected ? "page" : undefined}>
  <Badge value={unread} invisible={selected} label="">
    <MailOutlined />
  </Badge>
  Inbox
</a>

// Elsewhere:
<Badge><NotificationsOutlined /></Badge>          // small dot: "New notification"
<Badge value={1500}><MailOutlined /></Badge>      // 999+, announced as "1500"
<Badge value={5} size="small">…</Badge>           // a dot that still announces "5"
<Badge value={24} />                              // inline, at a row's trailing edge
<Badge value={7} locale="fa" label="۷ پیام جدید">…</Badge>
```

Checkboxes:

```tsx
import Checkbox from "@chatool/ui/checkbox";

// Uncontrolled — works in a Server Component and submits with the form.
<form action={save}>
  <Checkbox name="updates" label="Send me product updates" defaultChecked />
  <Checkbox
    name="terms"
    required
    label="I agree to the terms"
    supportingText="Required." // turns error color once the user skips it
  />
</form>

// Controlled, with the APG parent/child (tri-state) pattern.
const all = checked.every(Boolean);
const some = checked.some(Boolean);
<Checkbox
  label="All channels"
  checked={all}
  indeterminate={some && !all}
  onChange={() => setChecked(checked.map(() => !all))}
/>

// Bare box: name it yourself.
<Checkbox aria-label="Select row" checked={selected} onChange={toggle} />

// Settings row: text first, box at the end.
<Checkbox label="Wi-Fi only" labelPosition="start" className="w-full justify-between" />
```

Radios:

```tsx
import Radio from "@chatool/ui/radio";
import RadioGroup from "@chatool/ui/radio-group";

// Uncontrolled — works from a Server Component and submits `contact=email|phone`.
<form action={save}>
  <RadioGroup name="contact" label="Preferred contact method" defaultValue="email" required>
    <Radio value="email" label="Email" />
    <Radio value="phone" label="Phone" supportingText="We'll only call about orders." />
  </RadioGroup>
</form>

// Controlled (in a client component).
const [shipping, setShipping] = useState<string | null>("standard");
<RadioGroup label="Shipping" value={shipping} onValueChange={setShipping}>
  <Radio value="standard" label="Standard" supportingText="Free" />
  <Radio value="express" label="Express" supportingText="$9.99" />
</RadioGroup>

// Settings list: text first, full-width rows.
<RadioGroup label="Download quality" defaultValue="high" labelPosition="start">
  <Radio value="high" label="High" className="w-full justify-between" />
  <Radio value="saver" label="Data saver" className="w-full justify-between" />
</RadioGroup>

// No group component: same `name` is a native group (name your container).
<div role="radiogroup" aria-label="Size">
  <Radio name="size" value="s" aria-label="Small" />
  <Radio name="size" value="m" aria-label="Medium" defaultChecked />
</div>
```

Switches:

```tsx
import Switch from "@chatool/ui/switch";

// Uncontrolled, from a Server Component: works (and submits) with no JS.
<Switch name="wifi" label="Wi-Fi" defaultChecked className="w-full justify-between" />
<Switch name="bt" label="Bluetooth" supportingText="Visible to nearby devices." />

// Controlled, Compose-style.
<Switch label="Dark theme" checked={dark} onCheckedChange={setDark} />

// MD3 icon configurations, or your own glyphs.
<Switch label="Airplane mode" icons="selected" />
<Switch label="Sync" icons />
<Switch
  label="Sound"
  selectedIcon={<VolumeUpRounded />}
  unselectedIcon={<VolumeOffRounded />}
/>

// Bare: name it yourself, and keep the name constant.
<Switch aria-label="Photo album access" />
```

Sliders:

```tsx
import Slider, { RangeSlider } from "@chatool/ui/slider";

// Uncontrolled, from a Server Component (it server-renders in place).
<Slider aria-label="Volume" name="volume" defaultValue={40} />

// Controlled; onValueCommit fires once per gesture.
<Slider aria-label="Brightness" value={v} onValueChange={setV} onValueCommit={save} />

// Sizes, stops, value indicator + Intl formatting.
<Slider aria-label="Opacity" size="s" min={0} max={1} step={0.1} stops
  valueIndicator format={{ style: "percent" }} />

// Custom (non-uniform) stops.
<Slider aria-label="Storage" max={256} stops={[0, 16, 32, 64, 128, 256]} format={(v) => `${v} GB`} />

// Centered (zero in the middle).
<Slider aria-label="Exposure" centered min={-50} max={50} />

// Inset icon (M / L / XL), swapping to mute at 0.
<Slider aria-label="Volume" size="m"
  icon={(v) => (v === 0 ? <VolumeOffRounded /> : <VolumeUpRounded />)} />

// Range with named handles.
<RangeSlider aria-label="Price" thumbLabels={["Minimum price", "Maximum price"]}
  min={0} max={1000} step={50} minStepsBetweenThumbs={2} defaultValue={[200, 700]} />

// Vertical (bottom = min).
<Slider aria-label="Level" orientation="vertical" className="h-64" />
```

Cards:

```tsx
import Card, {
  CardActions,
  CardContent,
  CardHeader,
  CardHeadline,
  CardMedia,
  CardPrimaryAction,
  CardSubhead,
  CardSupportingText,
} from "@chatool/ui/card";

// A container card (Server Component). Its buttons are the tab stops.
<Card variant="elevated">
  <CardHeader
    leading={<Avatar />}
    trailing={<IconButton aria-label="More options"><MoreVertRounded /></IconButton>}
  >
    <CardHeadline>Alpine lakes</CardHeadline>
    <CardSubhead>Shared by Ana · 2 days ago</CardSubhead>
  </CardHeader>
  <CardMedia className="aspect-video">
    <img src="/lake.jpg" alt="Turquoise lake below snowy peaks" />
  </CardMedia>
  <CardContent>
    <CardSupportingText maxLines={3}>A short guide to the clearest lakes…</CardSupportingText>
  </CardContent>
  <CardActions>
    <Button variant="outlined">Save</Button>
    <Button>Read</Button>
  </CardActions>
</Card>

// The whole card clickable — the accessible way: a stretched primary action.
// The link's name is just its text; the heart stays its own button.
<Card asChild variant="outlined">
  <li>
    <CardMedia className="aspect-[3/2]"><img src="/lake.jpg" alt="" /></CardMedia>
    <CardHeader trailing={<FavoriteToggle />}>
      <CardHeadline>
        <CardPrimaryAction asChild>
          <Link href="/lakes">Alpine lakes</Link>
        </CardPrimaryAction>
      </CardHeadline>
      <CardSubhead>Travel</CardSubhead>
    </CardHeader>
  </li>
</Card>

// A card that *is* the control (short, phrasing-only content; no nested actions).
<Card asChild variant="filled">
  <a href="/docs">
    <span className="text-title-medium">Documentation</span>
    <span className="text-body-medium">Guides and API reference</span>
  </a>
</Card>

// Selectable cards with zero JS: a <label> over a visually-hidden radio.
<fieldset>
  <legend>Plan</legend>
  <Card asChild variant="outlined" checkIcon>
    <label>
      <input type="radio" name="plan" value="plus" className="sr-only" />
      <CardHeadline asChild><span>Plus</span></CardHeadline>
      <CardSubhead asChild><span>$9 / month</span></CardSubhead>
    </label>
  </Card>
</fieldset>

// Toggle cards, horizontal layout, Expressive shape, inset media.
<Card asChild variant="outlined" selected={on}>
  <button type="button" onClick={toggle}>…</button>
</Card>
<Card orientation="horizontal">
  <CardMedia className="w-32"><img src="/lisbon.jpg" alt="" /></CardMedia>
  <CardContent>…</CardContent>
</Card>
<Card shape="extra-large-increased">
  <CardMedia inset className="aspect-[2/1]">…</CardMedia>
</Card>

// Drag and drop: wire `dragged` from your DnD library.
<Card dragged={isDragging}>…</Card>
```

```tsx
import Tooltip, { TooltipAction, TooltipProvider } from "@chatool/ui/tooltip";

// Plain: the text names an icon button (no separate aria-label needed).
<Tooltip content="Add to favorites" relationship="label">
  <IconButton><StarOutlined /></IconButton>
</Tooltip>

// Plain, describing an element that already has a name.
<Tooltip content="Permanently removes the file for everyone">
  <Button variant="outlined">Delete</Button>
</Tooltip>

// Rich, with a subhead and an action (bottom corner by default).
<Tooltip
  title="Paint tool"
  content="Add annotations and highlights with the paint tool."
  actions={<TooltipAction>Learn more</TooltipAction>}
>
  <IconButton aria-label="Paint tool"><EditOutlined /></IconButton>
</Tooltip>

// Persistent rich tooltip, shown on page load with a caret (feature discovery).
<Tooltip
  persistent
  defaultOpen
  caret
  align="center"
  title="New: collections"
  content="Save anything you find here and get back to it from any device."
  actions={<TooltipAction>Got it</TooltipAction>}
>
  <Button>Collections</Button>
</Tooltip>

// Controlled (in a client component), with the reason for each change.
<Tooltip open={open} onOpenChange={(next, { reason }) => setOpen(next)} content="Saved">
  <Button>Save</Button>
</Tooltip>

// App-wide timing: here a snappier desktop feel than MD3's 500ms / 1.5s.
<TooltipProvider showDelay={200} hideDelay={0}>{children}</TooltipProvider>
```

```tsx
import RichTooltip, {
  RichTooltipAction,
  RichTooltipActions,
  RichTooltipContent,
  RichTooltipSubhead,
  RichTooltipSupportingText,
  RichTooltipTrigger,
  useRichTooltip,
  useRichTooltipState,
} from "@chatool/ui/rich-tooltip";

// Shorthand: transient (hover / focus / long-press) with two button actions.
<RichTooltip
  subhead="Paint tool"
  supportingText="Add annotations and highlights with the paint tool."
  actions={
    <>
      <RichTooltipAction>Learn more</RichTooltipAction>
      <RichTooltipAction>Try it</RichTooltipAction>
    </>
  }
>
  <Button variant="tonal">Paint</Button>
</RichTooltip>

// Composed + persistent (click), every part customizable.
<RichTooltip trigger="click" caret align="center">
  <RichTooltipTrigger>
    <Button startIcon={<ShareOutlined />}>Share</Button>
  </RichTooltipTrigger>
  <RichTooltipContent elevation={3} maxWidth={280}>
    <RichTooltipSubhead asChild><h2>Share links</h2></RichTooltipSubhead>
    <RichTooltipSupportingText>
      Anyone with the link can view. <a href="/help/sharing">Learn more</a>
    </RichTooltipSupportingText>
    <RichTooltipActions>
      <RichTooltipAction onClick={copyLink}>Copy link</RichTooltipAction>
      <RichTooltipAction closeOnClick={false} onClick={openSettings}>Settings</RichTooltipAction>
    </RichTooltipActions>
  </RichTooltipContent>
</RichTooltip>

// Feature discovery on page load (announced politely).
<RichTooltip trigger="click" defaultOpen caret subhead="New: collections"
  supportingText="Save anything and get back to it from any device."
  actions={<RichTooltipAction>Got it</RichTooltipAction>}>
  <Button>Collections</Button>
</RichTooltip>

// Driven from code (a tour, a help button), with an async action.
const tip = useRichTooltipState();
<RichTooltip state={tip} trigger="manual" subhead="Turn on backups" supportingText="…"
  actions={<RichTooltipAction onClick={() => api.enableBackups()}>Turn on</RichTooltipAction>}>
  <Button variant="outlined">Backups</Button>
</RichTooltip>
<Button onClick={tip.show}>What's new?</Button>

// Anchored to a point (virtual anchor), e.g. the last click.
<RichTooltip trigger="manual" open={point !== null}
  onOpenChange={(open) => !open && setPoint(null)}
  anchor={{ getBoundingClientRect: () => new DOMRect(x, y, 0, 0) }}
  supportingText="Anchored to your click." />

// A custom part inside the content.
const CloseButton = () => {
  const { dismiss } = useRichTooltip();
  return <IconButton aria-label="Close" onClick={() => dismiss()}><CloseOutlined /></IconButton>;
};
```

```tsx
import TextField from "@chatool/ui/text-field";
import SearchOutlined from "@chatool/icons/SearchOutlined";

// Uncontrolled, native validation: works in a Server Component, no JS needed.
<TextField
  name="email"
  type="email"
  label="Email"
  autoComplete="email"
  required
  supportingText="We'll never share it"
  errorText="Enter a valid email address"
/>

// Outlined, icons, clear button, counter.
<TextField
  variant="outlined"
  label="Search"
  leadingIcon={<SearchOutlined />}
  clearable
  maxLength={40}
/>

// Controlled (in a client component), with a state-driven error.
<TextField
  label="Handle"
  prefix="@"
  value={handle}
  onChange={(e) => setHandle(e.target.value)}
  error={!valid}
  errorText="Only a–z, 0–9 and _"
/>

// Password with show / hide; growing multi-line; fixed text area.
<TextField label="Password" type="password" autoComplete="current-password" />
<TextField multiline label="Message" maxRows={6} />
<TextField multiline variant="outlined" label="Bio" rows={4} maxLength={280} />
```

```tsx
import Chip from "@chatool/ui/chip";
import ChipSet from "@chatool/ui/chip-set";
import CalendarTodayOutlined from "@chatool/icons/CalendarTodayOutlined";

// Assist chips in a set (works in a Server Component).
<ChipSet aria-label="Suggested actions">
  <Chip icon={<CalendarTodayOutlined />}>Add to calendar</Chip>
  <Chip elevated>Directions</Chip>
</ChipSet>

// Multi-select filter chips, submitted with a form as `cuisine=…`.
<ChipSet aria-label="Cuisine" selectionMode="multiple" name="cuisine" defaultValue={["ramen"]}>
  <Chip variant="filter" value="ramen">Ramen</Chip>
  <Chip variant="filter" value="pizza">Pizza</Chip>
</ChipSet>

// Controlled single select (in a client component).
<ChipSet aria-label="Sort" selectionMode="single" required value={sort} onValueChange={setSort}>
  <Chip variant="filter" value="new">Newest</Chip>
  <Chip variant="filter" value="top">Top rated</Chip>
</ChipSet>

// Removable input chips: × button, Backspace or Delete; focus moves on.
<ChipSet aria-label="Recipients" onRemove={(email) => remove(email)}>
  {emails.map((email) => (
    <Chip key={email} variant="input" value={email} avatar={<img src={avatarOf(email)} alt="" />}>
      {email}
    </Chip>
  ))}
</ChipSet>

// A standalone toggle, a menu chip, a link chip, a loading assist chip.
<Chip variant="filter" defaultSelected>Open now</Chip>
<Chip variant="filter" trailingIcon={<KeyboardArrowDownOutlined />}>Price</Chip>
<Chip asChild><Link href="/help">Help center</Link></Chip>
<Chip loading>Saving…</Chip>
```

Tabs:

```tsx
import Tabs, { Tab, TabList, TabPanel, TabPanels } from "@chatool/ui/tabs";

// Primary tabs with panels (renders on the server with the selection).
<Tabs defaultValue="flights">
  <TabList aria-label="Travel">
    <Tab value="flights" icon={<FlightOutlined />}>Flights</Tab>
    <Tab value="trips" icon={<LuggageOutlined />} badge={3}>Trips</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="flights">…</TabPanel>
    <TabPanel value="trips">…</TabPanel>
  </TabPanels>
</Tabs>

// Controlled, secondary, scrollable with chevrons on desktop.
<Tabs value={tab} onValueChange={(next, { reason }) => setTab(next)}>
  <TabList aria-label="Store" variant="secondary" layout="scrollable" scrollButtons="auto">
    {genres.map((g) => <Tab key={g} value={g}>{g}</Tab>)}
  </TabList>
</Tabs>

// Swipeable content area (MD3): the indicator follows the swipe.
<TabPanels swipeable>…</TabPanels>

// Route tabs (Next.js): the tab is the link.
<Tabs value={pathname}>
  <TabList aria-label="Account">
    <Tab value="/billing" asChild><Link href="/billing">Billing</Link></Tab>
  </TabList>
</Tabs>
```

Snackbar:

```tsx
// app/layout.tsx (a Server Component is fine): one host for the whole app.
import { SnackbarHost } from "@chatool/ui/snackbar";
<body>
  {children}
  <SnackbarHost />
</body>;

// Anywhere in client code:
import { snackbar } from "@chatool/ui/snackbar";
snackbar("Message sent");

const { result } = snackbar({
  message: "Conversation archived",
  action: "Undo",
});
if ((await result) === "action") unarchive();

snackbar.promise(upload(file), {
  loading: "Uploading…",
  success: (photo) => `Uploaded ${photo.name}`,
  error: "Upload failed",
});

// Above a FAB, start-aligned on wide screens, crossfading replacements:
<SnackbarHost anchor={fabRef} align="start" strategy="replace" />;

// A scoped host inside a pane:
const [queue] = useState(() => createSnackbarQueue());
<div className="relative">
  <SnackbarHost queue={queue} contained label="Editor notifications" />
</div>;
```

## Customization

Three layers, increasingly specific:

1. **Global tokens** — override `@chatool/core`'s `--md-sys-*` (re-themes
   everything).
2. **Per-component tokens** — override `--md-comp-button-*` globally or per
   instance, without touching anything else:

   ```tsx
   <Button
     style={{ "--md-comp-button-container-color": "#006971" } as CSSProperties}
   >
     Branded
   </Button>
   ```

   Tokens follow `--md-comp-button-<role>`:
   `--md-comp-button-container-color`, `--md-comp-button-label-text-color`,
   `--md-comp-button-outline-color`, `--md-comp-button-focus-color`. Each falls
   back to the computed `--md-sys-*` value. **`IconButton`** has the parallel set
   `--md-comp-icon-button-container-color`, `--md-comp-icon-button-icon-color`,
   `--md-comp-icon-button-outline-color`, `--md-comp-icon-button-focus-color`.
   **`ButtonGroup`** exposes `--md-comp-button-group-gap` (the gap between
   children). **`Fab`** has `--md-comp-fab-container-color`,
   `--md-comp-fab-icon-color` (also the state layer + ripple),
   `--md-comp-fab-label-text-color`, `--md-comp-fab-container-shape` (every
   size), `--md-comp-fab-focus-color`, `--md-comp-fab-margin` (`placement`
   offset, `16px`), `--md-comp-fab-z-index` (`10`), and the motion overrides
   `--md-comp-fab-spatial-easing` / `-spatial-duration` (`350ms`) /
   `-effects-easing` / `-effects-duration` (`140ms`). The medium corner reads
   `--md-sys-shape-corner-large-increased` (falls back to `20px`). **`LoadingIndicator`** has
   `--md-comp-loading-indicator-active-indicator-color` and
   `--md-comp-loading-indicator-container-color`. **`LinearProgress`** has
   `--md-comp-linear-progress-active-indicator-color`,
   `--md-comp-linear-progress-track-color` and
   `--md-comp-linear-progress-stop-indicator-color`. **`CircularProgress`** has
   `--md-comp-circular-progress-active-indicator-color` and
   `--md-comp-circular-progress-track-color`. **`Divider`** has
   `--md-comp-divider-color` (`outline-variant`), `--md-comp-divider-thickness`
   (`1px`), `--md-comp-divider-heavy-thickness` (`8px`),
   `--md-comp-divider-inset-start` / `--md-comp-divider-inset-end` (`16px`),
   `--md-comp-divider-label-text-color` (`on-surface-variant`) and
   `--md-comp-divider-label-space` (`8px`, between the label and each line).
   **`Badge`** has `--md-comp-badge-color` (`error`),
   `--md-comp-badge-label-text-color` (`on-error`); geometry
   `--md-comp-badge-small-size` (`6px`), `--md-comp-badge-small-shape` (`3px`),
   `--md-comp-badge-large-size` (`16px`), `--md-comp-badge-large-shape` (`8px`),
   `--md-comp-badge-large-padding` (`4px`); anchor offsets
   `--md-comp-badge-small-offset-x` / `-y` (`6px` / `6px`) and
   `--md-comp-badge-large-offset-x` / `-y` (`12px` / `14px`), measured from the
   anchor's top-trailing corner to the badge's bottom-leading corner; and motion
   `--md-comp-badge-spatial-easing` / `-spatial-duration` (the Expressive spring,
   `350ms`) and `--md-comp-badge-effects-easing` / `-effects-duration` (`140ms`).
   Set both durations to `0s` to switch motion off.
   **`Checkbox`** has colors `--md-comp-checkbox-outline-color`
   (`on-surface-variant`), `--md-comp-checkbox-hover-outline-color` (`on-surface`,
   hover/focus/pressed), `--md-comp-checkbox-selected-container-color` (`primary`),
   `--md-comp-checkbox-selected-icon-color` (`on-primary`),
   `--md-comp-checkbox-error-color` (`error`),
   `--md-comp-checkbox-error-icon-color` (`on-error`) and
   `--md-comp-checkbox-focus-indicator-color` (`secondary`); geometry
   `--md-comp-checkbox-container-size` (`18px`), `--md-comp-checkbox-container-shape`
   (`2px`), `--md-comp-checkbox-outline-width` (`2px`),
   `--md-comp-checkbox-state-layer-size` (`40px`) and
   `--md-comp-checkbox-touch-target-size` (`48px`); and motion
   `--md-comp-checkbox-spatial-duration` (`412ms`, the draw/morph),
   `--md-comp-checkbox-effects-duration` (`212ms`, colors when checking) and
   `--md-comp-checkbox-exit-effects-duration` (`137ms`, colors when unchecking).
   `0s` switches a part off. The springs themselves are the selection family's
   `--md-comp-selection-spatial-easing`, `--md-comp-selection-effects-easing` and
   `--md-comp-selection-fast-effects-easing` (CSS `linear()` curves).
   **`Radio`** has colors `--md-comp-radio-icon-color` (`on-surface-variant`),
   `--md-comp-radio-hover-icon-color` (`on-surface`, unselected hover/focus/pressed),
   `--md-comp-radio-selected-icon-color` (`primary`), `--md-comp-radio-error-color`
   (`error`) and `--md-comp-radio-focus-indicator-color` (`secondary`); geometry
   `--md-comp-radio-icon-size` (`20px` — ring and dot scale with it),
   `--md-comp-radio-state-layer-size` (`40px`) and
   `--md-comp-radio-touch-target-size` (`48px`; MD3 advises against shrinking it by
   default); and motion `--md-comp-radio-dot-enter-duration` (`348ms`),
   `--md-comp-radio-dot-exit-duration` (`98ms`), `--md-comp-radio-dot-exit-easing`
   and `--md-comp-radio-effects-duration` (`212ms`, color fades). The dot's entry
   spring is the selection family's `--md-comp-selection-fast-spatial-easing`.
   **`RadioGroup`** paints nothing itself — style its radios with the tokens above
   (set on the group, they cascade to every radio).

   **`Switch`** has colors `--md-comp-switch-unselected-track-color`
   (`surface-container-highest`), `--md-comp-switch-unselected-track-outline-color`
   (`outline`), `--md-comp-switch-unselected-handle-color` (`outline`),
   `--md-comp-switch-unselected-hover-handle-color` (`on-surface-variant`, also
   focus/pressed), `--md-comp-switch-unselected-icon-color`
   (`surface-container-highest`), `--md-comp-switch-unselected-state-layer-color`
   (`on-surface`), `--md-comp-switch-selected-track-color` (`primary`),
   `--md-comp-switch-selected-track-outline-color` (`transparent`),
   `--md-comp-switch-selected-handle-color` (`on-primary`),
   `--md-comp-switch-selected-hover-handle-color` (`primary-container`, also
   focus/pressed), `--md-comp-switch-selected-icon-color` (`on-primary-container`),
   `--md-comp-switch-selected-state-layer-color` (`primary`) and
   `--md-comp-switch-focus-indicator-color` (`secondary`); geometry
   `--md-comp-switch-track-width` (`52px`), `--md-comp-switch-track-height`
   (`32px`), `--md-comp-switch-track-outline-width` (`2px`),
   `--md-comp-switch-track-shape` / `--md-comp-switch-handle-shape` (full),
   `--md-comp-switch-unselected-handle-size` (`16px`),
   `--md-comp-switch-selected-handle-size` (`24px`),
   `--md-comp-switch-with-icon-handle-size` (`24px`),
   `--md-comp-switch-pressed-handle-size` (`28px`), `--md-comp-switch-icon-size`
   (`16px`), `--md-comp-switch-state-layer-size` (`40px`),
   `--md-comp-switch-touch-target-size` (`48px`),
   `--md-comp-switch-focus-indicator-thickness` (`3px`) and
   `--md-comp-switch-label-gap` (`16px`); and motion
   `--md-comp-switch-handle-duration` (`348ms`), `--md-comp-switch-handle-easing`
   (defaults to `--md-comp-selection-fast-spatial-easing`),
   `--md-comp-switch-pressed-handle-duration` (`0s`, Compose snaps),
   `--md-comp-switch-effects-duration` (`67ms`, colors) and
   `--md-comp-switch-icon-fade-duration` (`33ms`). The handle's travel is computed
   from the track tokens, so a resized track keeps the handle in place.

   **`Slider` / `RangeSlider`** have colors `--md-comp-slider-active-track-color`
   (`primary`), `--md-comp-slider-inactive-track-color` (`secondary-container`),
   `--md-comp-slider-handle-color` (`primary`),
   `--md-comp-slider-active-stop-indicator-color` (`on-primary`),
   `--md-comp-slider-inactive-stop-indicator-color` (`on-secondary-container`),
   `--md-comp-slider-active-icon-color` (`on-primary`),
   `--md-comp-slider-inactive-icon-color` (`on-secondary-container`),
   `--md-comp-slider-value-indicator-container-color` (`inverse-surface`),
   `--md-comp-slider-value-indicator-label-text-color` (`inverse-on-surface`),
   `--md-comp-slider-focus-indicator-color` (`secondary`), and the disabled set
   `--md-comp-slider-disabled-{active-track,inactive-track,handle,active-stop-indicator,inactive-stop-indicator,active-icon,inactive-icon}-color`;
   geometry `--md-comp-slider-track-height`, `--md-comp-slider-handle-height`,
   `--md-comp-slider-track-corner`, `--md-comp-slider-icon-size` (all per `size`
   by default), `--md-comp-slider-handle-width` (`4dp`),
   `--md-comp-slider-pressed-handle-width` (`2dp`), `--md-comp-slider-handle-gap`
   (`6dp`), `--md-comp-slider-track-inside-corner` (`2dp`),
   `--md-comp-slider-stop-indicator-size` (`4dp`), `--md-comp-slider-icon-padding`
   (`10dp`), `--md-comp-slider-value-indicator-spacing` (`4dp`),
   `--md-comp-slider-touch-target-size` (`48dp`),
   `--md-comp-slider-focus-indicator-thickness` (`3dp`); and motion
   `--md-comp-slider-spatial-easing`, `--md-comp-slider-fast-spatial-easing`,
   `--md-comp-slider-effects-easing`, `--md-comp-slider-fast-effects-easing`.
   Every part also has a `data-slot` (`slider`, `slider-track`,
   `slider-active-track`, `slider-inactive-track`, `slider-stop`,
   `slider-end-stop`, `slider-icon`, `slider-thumb`, `slider-handle`,
   `slider-input`, `slider-value-indicator`) and state attributes
   (`data-dragging`, `data-pressed`, `data-orientation`, `data-mode`), or use
   `classNames`.

   **`Card`** has `--md-comp-card-container-color` (per variant:
   `surface-container-low` / `-highest` / `surface`), `--md-comp-card-content-color`
   (`on-surface`), `--md-comp-card-outline-color` (`outline-variant`, outlined) and
   `--md-comp-card-outline-width` (`1px`), `--md-comp-card-container-shape` (`12px`;
   the `shape` prop wins), `--md-comp-card-container-elevation` (resting shadow),
   `--md-comp-card-padding` (`16px`), `--md-comp-card-gap` (`16px`),
   `--md-comp-card-content-gap` (`4px`), `--md-comp-card-actions-gap` (`8px`),
   `--md-comp-card-media-shape` (inset media; default optically round),
   `--md-comp-card-state-layer-color` (`on-surface`),
   `--md-comp-card-focus-indicator-color` (`secondary`),
   `--md-comp-card-focus-indicator-thickness` (`3px`),
   `--md-comp-card-focus-indicator-outline-offset` (`2px`),
   `--md-comp-card-headline-color` / `-subhead-color` / `-supporting-text-color`,
   `--md-comp-card-selected-tint-color` (`secondary`),
   `--md-comp-card-checked-icon-color` (`secondary`),
   `--md-comp-card-checked-icon-check-color` (`on-secondary`),
   `--md-comp-card-checked-icon-size` (`24px`), `--md-comp-card-checked-icon-margin`
   (`8px`), and motion `--md-comp-card-enter-duration` (`120ms`),
   `--md-comp-card-exit-duration` (`150ms`), `--md-comp-card-spatial-duration`
   (`412ms`) and `--md-comp-card-spatial-easing`. Expressive corner steps read
   `--md-sys-shape-corner-large-increased` / `-extra-large-increased` /
   `-extra-extra-large` when your theme defines them (20 / 32 / 48dp otherwise).

   **`Tooltip`** uses Material Web's token names. Plain:
   `--md-comp-plain-tooltip-container-color` (`inverse-surface`),
   `--md-comp-plain-tooltip-supporting-text-color` (`inverse-on-surface`),
   `--md-comp-plain-tooltip-container-shape` (`corner-extra-small`) and
   `--md-comp-plain-tooltip-container-max-width` (`12.5rem`). Rich:
   `--md-comp-rich-tooltip-container-color` (`surface-container`),
   `--md-comp-rich-tooltip-subhead-color` / `-supporting-text-color`
   (`on-surface-variant`), `--md-comp-rich-tooltip-action-label-text-color`
   (`primary`, inline links), `--md-comp-rich-tooltip-container-shape`
   (`corner-medium`), `--md-comp-rich-tooltip-container-elevation` (level 2),
   `--md-comp-rich-tooltip-container-max-width` (`20rem`) and
   `--md-comp-rich-tooltip-action-inset` (`0.75rem`, how far the action row hangs
   out so labels align with the text). Caret: `--md-comp-tooltip-caret-width` /
   `-height` (`1rem` / `0.5rem`). Tooltips render outside their anchor (in
   `<body>` or the open `<dialog>`), so set these on `:root` (or `.dark`) for every
   tooltip, or per tooltip with its `style` prop; an anchor's ancestors don't reach
   them.

   **`RichTooltip`** reads the **same** `--md-comp-rich-tooltip-*` tokens (a theme
   that styles `Tooltip variant="rich"` styles it too): `-container-color`,
   `-container-shape`, `-container-elevation` (overrides the `elevation` level),
   `-container-max-width` (also the `maxWidth` prop), `-subhead-color`,
   `-supporting-text-color`, `-action-label-text-color` (actions **and** their
   hover / focus / pressed state layers, plus inline links) and `-action-inset`;
   the caret uses `--md-comp-tooltip-caret-width` / `-height` (also the `caret={{
width, height }}` prop). Set them on `:root`, on the container, or per tooltip
   with `RichTooltipContent`'s `style` (`contentProps.style` in shorthand). Every
   part also takes `className`.

   **Overlays** (tooltip and rich tooltip today; menus, selects and dialogs as they land) share
   `--md-comp-overlay-spatial-easing` / `-spatial-duration` (the fast-spatial
   spring, `350ms`), `--md-comp-overlay-effects-easing` / `-effects-duration` (the
   fast-effects spring, `140ms`), `--md-comp-overlay-enter-scale` (`0.8`) and
   `--md-comp-overlay-z-index` (`1500`, only used where the Popover API is
   missing). Set both durations to `0s` to switch overlay motion off.

   **`TextField`** reads `--md-comp-text-field-*` (one prefix for both variants;
   scope with `[data-variant=filled]` / `[data-variant=outlined]` if they should
   differ). Container: `-container-color` (filled `surface-container-highest`,
   outlined `transparent`), `-container-shape` (`corner-extra-small`; a pill like
   `corner-full` works — the notch moves in to clear the curve). Filled indicator:
   `-active-indicator-color` / `-hover-active-indicator-color` /
   `-focus-active-indicator-color`, `-active-indicator-height` (`1px`) /
   `-focus-active-indicator-height` (`2px`). Outline: `-outline-color` /
   `-hover-outline-color` / `-focus-outline-color`, `-outline-width` (`1px`) /
   `-focus-outline-width` (`2px`), `-outline-label-padding` (`0.25rem`). Text:
   `-label-text-color`, `-hover-label-text-color`, `-focus-label-text-color`,
   `-input-text-color`, `-input-text-placeholder-color`, `-input-text-affix-color`,
   `-caret-color`, `-supporting-text-color`. Icons: `-leading-icon-color`,
   `-trailing-icon-color`, `-icon-size` (`1.5rem`). Error: `-error-color`
   (`error`), `-error-hover-color` (`on-error-container`). State layer:
   `-hover-state-layer-color` / `-hover-state-layer-opacity` (filled). Spacing:
   `-leading-space` / `-trailing-space` / `-top-space` / `-bottom-space`
   (`1rem`), `-with-label-top-space` / `-with-label-bottom-space` (`0.5rem`),
   `-icon-text-space` (`1rem`), `-supporting-text-leading-space` /
   `-trailing-space` (`1rem`) / `-top-space` (`0.25rem`). Motion:
   `-spatial-easing` / `-spatial-duration` (fast spatial, `348ms`),
   `-effects-easing` / `-effects-duration` (fast effects, `137ms`),
   `-slow-effects-easing` / `-slow-effects-duration` (`299ms`). Typography comes
   from `--md-sys-typescale-body-large-*` / `-body-small-*`. Every part also has a
   `data-slot` (`text-field`, `-container`, `-label`, `-input`, `-leading-icon`,
   `-trailing`, `-prefix`, `-suffix`, `-supporting`, `-counter`, …) and
   `classNames` reaches each one.

   **`Chip`** reads `--md-comp-chip-*` (one prefix for every variant; scope with
   `[data-variant=filter]` etc. if they should differ). Size: `-container-height`
   (`2rem`), `-icon-size` (`1.125rem`), `-avatar-size` (`1.5rem`),
   `-avatar-shape` (round). Shape: `-container-shape` (`corner-small`, or
   `corner-medium` when Expressive), `-selected-container-shape` (a half-height
   pill), `-pressed-container-shape` (`corner-small`). Color: `-container-color`
   (flat, `transparent`), `-elevated-container-color` (`surface-container-low`),
   `-selected-container-color` (`secondary-container`), `-outline-color`
   (`outline-variant`; MD3 suggests `outline` for 3:1), `-outline-width` (`1px`),
   `-label-text-color`, `-selected-label-text-color`, `-leading-icon-color`,
   `-selected-leading-icon-color`, `-trailing-icon-color`,
   `-selected-trailing-icon-color`. Focus: `-focus-indicator-color`
   (`secondary`), `-focus-indicator-thickness` (`3px`),
   `-focus-indicator-outline-offset` (`2px`). Motion: `-spatial-easing` /
   `-spatial-duration` (fast spatial, `348ms`; `0s` switches the morph off),
   `-effects-easing` (default effects). **`ChipSet`**: `--md-comp-chip-set-gap` /
   `-row-gap` (`0.5rem`). Parts carry `data-slot` (`chip`, `chip-primary`,
   `chip-leading`, `chip-icon`, `chip-check`, `chip-avatar`, `chip-label`,
   `chip-trailing-icon`, `chip-remove`, `chip-set`) and the chip root exposes
   `data-variant`, `data-elevated`, `data-expressive`, `data-leading`.

   **`Tabs`** read `--md-comp-tabs-*` (one prefix for both variants; scope with
   `[data-variant=secondary]` if they should differ). Container:
   `-container-color` (`surface`), `-divider-color` (`outline-variant`),
   `-divider-height` (`1px`), `-container-height` (`3rem`),
   `-stacked-container-height` (`4rem`), `-padding` (`1rem`), `-icon-size`
   (`1.5rem`), `-icon-gap` (`0.5rem`), `-badge-gap` (`0.25rem`),
   `-scrollable-min-width` (`5.625rem`), `-scrollable-edge-padding` (`3.25rem`).
   Indicator: `-indicator-color` (`primary`), `-primary-indicator-height`
   (`0.1875rem`), `-primary-indicator-shape` (`3,3,0,0`), `-primary-indicator-inset`
   (`0.125rem`), `-indicator-min-width` (`1.5rem`), `-secondary-indicator-height`
   (`0.125rem`), `-secondary-indicator-shape` (`0`). Color:
   `-active-label-text-color` (`primary` / secondary `on-surface`),
   `-label-text-color` (`on-surface-variant`), `-hover-label-text-color`
   (`on-surface`), `-active-state-layer-color`, `-state-layer-color`,
   `-pressed-state-layer-color`; icons follow the label color. Focus:
   `-focus-indicator-color` (`secondary`), `-focus-indicator-shape` (`0.5rem`).
   Motion: `-indicator-easing` (the spatial spring), `-indicator-leading-duration`
   (`412ms`), `-indicator-trailing-duration` (`567ms`), `-effects-easing` /
   `-effects-duration` (`212ms`), `-fast-effects-easing` / `-fast-effects-duration`
   (`137ms`), `-panel-slide-distance` (`1.875rem`). Parts carry `data-slot`
   (`tabs`, `tab-list`, `tab-scroller`, `tab-scroll-button`, `tab`, `tab-content`,
   `tab-icon`, `tab-label`, `tab-indicator`, `tab-badge`, `tab-panels`,
   `tab-panel`); tabs expose `data-value`, `data-selected`, `data-stacked`, the list
   `data-variant`, `data-layout`, `data-overflowing`, `data-at-start`,
   `data-at-end`, and `classNames` reaches each part.

   **`Snackbar`** reads `--md-comp-snackbar-*` (MD3's token names): container
   `-container-color` (`inverse-surface`), `-container-shape`
   (`corner-extra-small`), `-container-elevation` (`elevation-3`),
   `-container-max-width` (`37.5rem`), `-container-min-width` (`20rem`, wide
   layouts), `-supporting-text-color` (`inverse-on-surface`); action
   `-action-label-text-color` / `-action-state-layer-color` (`inverse-primary`);
   close `-icon-color` / `-icon-state-layer-color` (`inverse-on-surface`);
   `-focus-indicator-color` (`inverse-primary` on the controls); motion
   `-enter-scale` (`0.8`) plus the shared `--md-comp-overlay-spatial-*` /
   `-effects-*` springs. The host: `--md-comp-snackbar-host-margin` (`0.75rem`),
   `-host-offset` (`0px`), `-host-z-index` (`1600`, `10` when contained). Parts carry
   `data-slot` (`snackbar-host`, `snackbar-stack`, `snackbar-item`,
   `snackbar-swipe`, `snackbar`, `snackbar-supporting-text`, `snackbar-actions`,
   `snackbar-action`, `snackbar-dismiss-action`, `snackbar-announcer`); the surface
   exposes `data-layout` (`inline` / `stacked`) and `data-dismissible`, items
   `data-state` (`open` / `closed`) and `data-swiped`, the host `data-side` /
   `data-full-width`.

3. **`className`** (cva + `cn` merge) for one-off overrides.

## Accessibility & rendering

`Button` follows the
[WAI-ARIA APG button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/):

- Renders a **native `<button>`** — role `button` + Space/Enter activation for
  free. Defaults to **`type="button"`** so it never submits a form by accident
  (pass `type="submit"` when you want that).
- **Accessible name** comes from your text content. For an **icon-only** button
  (no visible text) you **must** pass `aria-label`.
- `disabled` and `loading` are conveyed to assistive tech (`disabled` /
  `aria-busy`); a **loading** button is non-actionable by mouse **and** keyboard,
  yet keeps its color + spinner.
- **Toggle** — pass `selected` to make it a toggle: it reflects `aria-pressed`,
  morphs round→square, fills `outlined` with inverse-surface, and swaps the leading
  icon to `selectedIcon`. Keep the label constant when `selected` flips (per the
  APG); omit `selected` for a plain button (no `aria-pressed`).
- Other `aria-*` flow through `{...props}`: `aria-haspopup` / `aria-expanded` (menu
  / disclosure), `aria-controls`, `aria-describedby`, `aria-label` /
  `aria-labelledby`.
- **`asChild`** renders _your_ element via Radix `Slot`. Pass a natively
  interactive element (`<a href>`, `<button>`); a non-interactive element
  (`<div>`) needs `role="button"`, `tabIndex={0}`, and Enter/Space handling **you**
  add — prefer a native element.

**Rendering:** the module has **no `"use client"`**, so `Button` renders as a
**React Server Component** in Next App Router (and works in Pages Router / Vite /
webpack). Static buttons and `asChild` links need no client JS; only the press
**ripple** is a tiny `"use client"` island that hydrates on the client.

`IconButton` follows the same APG button pattern and shares the rendering model
(Server Component, ripple island). Two icon-only specifics:

- **`aria-label` is required** — there is no text to name it. Without it the button
  has no accessible name.
- **Toggle** — when you pass `selected`, it becomes a toggle: it reflects
  `aria-pressed`, morphs round→square, and swaps to `selectedIcon`. **Keep the
  `aria-label` constant** across the toggle (per the APG); omit `selected` for a
  plain, non-toggle icon button (no `aria-pressed`).

`ButtonGroup` is a **`role="group"`** container (give it an `aria-label`). It's a
pure **Server Component** — a layout that spaces/shapes its children and owns no
state; each child keeps its own role + `aria-pressed`. Children stay individual Tab
stops (no roving focus). `asChild` forwards the group styles + role onto your
element.

`Fab` follows the APG button pattern too (native `<button>`, Tab to focus,
Enter / Space to activate, `type="button"` by default), plus MD3's FAB guidance:

- **Name the action.** An icon-only FAB has no text, so pass `aria-label`
  describing what it does ("Compose new message"), or wrap it in a
  `<Tooltip content="Compose" relationship="label">`, which MD3 recommends on
  the web anyway (a tooltip on hover and focus). An extended FAB is named by its
  `label`; if you add an `aria-label`, start it with the label's first word.
- **The name never changes on collapse.** The label folds away visually but
  stays in the DOM, so a collapsed extended FAB is still announced by its label.
  The icon is `aria-hidden`.
- **Hide, don't disable.** MD3: if the action isn't available, the FAB
  shouldn't appear. `visible={false}` makes it `inert` (out of the tab order and
  accessibility tree). `disabled` still works but isn't part of the spec.
- **Focus order and placement.** Place it early in the focus order, and don't
  let a floating FAB completely cover another control's focus indicator.
- Focus shows MD3's 3dp `secondary` indicator, 2dp outside the container;
  forced-colors mode draws a `ButtonText` border; under
  `prefers-reduced-motion` spatial motion is instant (fades remain).

**Rendering:** `Fab` has **no `"use client"`** and renders as a **Server
Component**. Size, expansion, the responsive breakpoints, show/hide and the
entrance are all CSS. Its client islands are the shared press ripple and a tiny
label island that measures the label so its width can spring (without JS the
label still shows and collapses, just without the width animation).

`LoadingIndicator`, `LinearProgress` and `CircularProgress` render
**`role="progressbar"`**:

- **Name what's loading.** Pass `aria-label` or `aria-labelledby`, such as "Loading
  news article". The fallback name is a generic "Loading".
- `aria-valuenow` / `aria-valuemin` / `aria-valuemax` are set when determinate and
  omitted when indeterminate, which is what announces it as indeterminate. Pass
  `aria-valuetext` for a friendlier reading.
- **Contrast.** The active indicator needs 3:1 against what's behind it. Inside
  another component, use `color="inherit"`, and remove `CircularProgress`'s track.
- **`prefers-reduced-motion`** is honored live: morphs, travelling waves and
  rotation stop. Indeterminate indicators hold still and pulse their opacity
  instead, so they still read as active. Determinate ones jump straight to their
  value.
- Pull-to-refresh can't be accessible by swiping alone, so also offer a single-pointer
  refresh control, such as a button in the app bar.

**Rendering:** all three are **client components** (`"use client"`), because they
draw every frame. They still work when imported from a Server Component, and the
server sends a first frame at the final size, so nothing shifts on hydration. One
shared `requestAnimationFrame` loop drives every instance and stops when nothing
moves; instances that are off-screen pause and pick up where they left off. Frames
go straight to the SVG nodes, so animation never re-renders React.

`Divider` follows MD3, which treats dividers as **decorative**, and the WAI-ARIA
`separator` role:

- **Decorative by default** (`role="none"`): most dividers, between list rows or
  inside a card, only repeat grouping the markup already gives. A label stays
  readable as plain text; the lines are pseudo-elements that assistive tech never
  sees.
- **`decorative={false}`** exposes a separator. A plain horizontal one renders a
  native **`<hr>`** (implicit `separator` role and orientation). Vertical, labelled
  and `asChild` ones get `role="separator"`, plus `aria-orientation="vertical"`
  when vertical. A separator's children are presentational, so a string label is
  copied to `aria-label`. Use it for a topic change in prose, or between groups in
  a `role="menu"` (`<Divider asChild decorative={false}><li /></Divider>`).
- **Valid markup:** inside `<ul>` / `<ol>` / `role="menu"`, use `asChild` with an
  `<li>` rather than a bare `<div>` or `<hr>`.
- **Contrast:** MD3 sets no minimum for decorative dividers. If a divider is the
  only thing conveying a boundary that matters, use `outline` (3:1) through
  `--md-comp-divider-color`.
- **High contrast:** the line is a border, so it stays visible under
  `forced-colors: active`.
- It is never focusable. A draggable pane splitter is a different pattern (the APG
  window splitter).

**Rendering:** `Divider` is a pure **Server Component** with no `"use client"` and
no client island. It sends no JavaScript to the browser.

`Badge` follows MD3's badge accessibility guidance: it's read **after** its
destination, a count reads its number, and a dot reads "New notification".

- **The visible glyphs are `aria-hidden`.** Otherwise a screen reader would read
  `999+` as "nine nine nine plus". A visually hidden span carries the full value
  (`"1500"`, `"New"`) or "New notification" for a dot. It's plain text, with no
  role and no live region, so it becomes part of whatever contains it.
- **When the anchor has an `aria-label`** (icon-only buttons), the label replaces
  the content, badge included. Point the button's `aria-describedby` at the
  badge's `id` ("Inbox, button, 12"), or put the count in the label.
- **When the destination has visible text after the icon** (navigation bars,
  rails, drawers), DOM order would read the count first. Put the count in the
  destination's `aria-label` (`"Inbox, 12 new"`) and pass `label=""` to make the
  badge decorative.
- **Localize** `label` for non-English apps; `locale` only changes the digits.
- `invisible`, and a hidden `0`, remove the badge from the accessibility tree.
- **Changes aren't announced.** A badge is not a live region; announce important
  arrivals through your own `role="status"` region.
- **Contrast:** the default `error` / `on-error` pair meets MD3's 3:1. Keep any
  custom pair at 3:1 or better.
- **High contrast:** under `forced-colors: active` the badge opts out of the forced
  palette and paints itself `CanvasText` / `Canvas`, so the dot never disappears.
- It is never focusable and ignores the pointer when anchored (`pointer-events:
none`), so clicks and hovers reach the anchor.

**Rendering:** `Badge` is a pure **Server Component** with no `"use client"` and no
client island. All motion is CSS: `@starting-style` for the entrance, transitions
on spring `linear()` easings for morphs, and a label keyed by its text so a new
count re-plays its pop. Browsers without `@starting-style` just show the badge.
Digits never depend on the runtime's default locale, so server and client output
always match.

`Checkbox` follows the
[WAI-ARIA APG checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
on a **native `<input type="checkbox">`**:

- **Role, focus and keys are native:** role `checkbox`, Tab to focus, **Space**
  to toggle. The input is invisible but covers the 48dp touch target, so it gets
  every click and tap; it also takes part in forms (`name`/`value`, `required`,
  `form`, reset, autofill) and constraint validation.
- **Mixed state** uses the native `indeterminate` property, which browsers expose
  as `aria-checked="mixed"`. Per ARIA in HTML, `aria-checked` is never set on the
  native input. The dash is server-rendered from the prop, and a small client
  island sets the property after hydration.
- **Naming:** `label` wraps the box in a `<label>` (implicit association, so the
  text is the name and is clickable). Without it, pass `aria-label`,
  `aria-labelledby` or point a `<label htmlFor>` at the input's `id`.
  `supportingText` becomes the description (`aria-describedby`, merged with yours).
- **Error** sets `aria-invalid="true"`; announce _why_ in `supportingText`.
- **Disabled** uses the native attribute (or a disabled `<fieldset>`), so it
  leaves the tab order and can't be toggled.
- **Parent/child:** for a tri-state parent, follow the APG: checked when all
  children are, `indeterminate` when some are; activating it checks all children
  (or clears them when all are checked). Point `aria-controls` at the children.
- **Visible focus:** MD3's 3dp `secondary` indicator, 2dp outside the state layer,
  on `:focus-visible` only.
- **High contrast:** under `forced-colors: active` it paints itself with system
  colors (`CanvasText` / `Canvas`, `GrayText` when disabled, a `Highlight` focus
  ring) instead of losing its fill.

**Rendering:** `Checkbox` is a **Server Component** (no `"use client"`; its
`useId` is a hook React supports in Server Components). Its client parts are
islands: the centred press ripple (shared with the button family) and, only when
you pass `indeterminate`, the island that syncs `input.indeterminate`. An
uncontrolled checkbox needs no JavaScript at all.

`Radio` / `RadioGroup` follow the
[WAI-ARIA APG radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
and MD3's radio accessibility spec through **native radios**:

- **Keys are the browser's own**, which is exactly the MD3 contract: one Tab stop
  per group — the selected radio, or the first (Tab) / last (Shift+Tab) when none
  is; **arrow keys move focus and selection together** and wrap; Space selects the
  focused radio. In RTL the horizontal arrows mirror.
- **Group semantics:** `RadioGroup` is a `<fieldset role="radiogroup">` (a role ARIA
  in HTML permits on `fieldset`), labelled by its `<legend>` via `aria-labelledby`,
  described by `supportingText`, with `aria-required` / `aria-invalid` when set.
  Without `RadioGroup`, give same-`name` radios a container with
  `role="radiogroup"` + a name, or a `<fieldset>` + `<legend>`.
- **Naming:** `label` wraps the radio in a `<label>` (the text is the name and is
  clickable). Without it, pass `aria-label`, `aria-labelledby` or a `<label htmlFor>`.
  Screen readers still announce "1 of 3" — the input is a real radio.
- **Never `aria-checked`** on the native input (ARIA in HTML); `:checked` is
  exposed natively.
- **Disabled** uses the native attribute or the group's `<fieldset disabled>`, so it
  leaves the tab order and the arrow-key cycle.
- **Visible focus:** MD3's 3dp `secondary` indicator on `:focus-visible` only.
  **High contrast:** under `forced-colors` it paints `CanvasText` (`GrayText` when
  disabled) with a `Highlight` focus ring.

**Rendering:** `Radio` is a **Server Component** (no `"use client"`). Its client
parts are islands: the centred press ripple and the native `<input>` itself, which
reads the optional `RadioGroup` context. Client islands are still server-rendered,
so the group's name and selection are in the first HTML paint. `RadioGroup` is a
**client component** (it provides that context) and is also server-rendered; its
visual defaults (`color`, `labelPosition`, `error`, `disabled`) reach the radios
through CSS, not context.

`Switch` follows the
[WAI-ARIA APG switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) and
MD3's switch accessibility spec:

- **Role and state:** a native checkbox with `role="switch"`, so screen readers
  announce the label, "switch" and "on" / "off" from the native `checked` state.
  It **never sets `aria-checked`**: APG says an HTML checkbox uses `checked`
  instead.
- **Keyboard:** Tab focuses it; **Space or Enter** toggles it. MD3 requires both,
  and APG makes Enter optional. Enter doesn't submit the surrounding form. Holding
  Space shows the 28dp pressed handle.
- **Naming:** `label` wraps the switch in a `<label>` (the text names it and
  toggles it). Without `label`, pass `aria-label`, `aria-labelledby` or a `<label
htmlFor>`. **Don't change the name when the state changes** (APG). When the
  visible text is ambiguous, make it more descriptive: write "Photo album access",
  not "Photo album". Group related switches in a `<fieldset>` + `<legend>`.
- **Touch target:** 48dp tall (52dp wide), the MD3 minimum. MD3 advises against
  shrinking it by default.
- **Disabled** uses the native attribute or an ancestor `<fieldset disabled>`, so it
  leaves the tab order and ignores presses and drags.
- **Visible focus:** MD3's 3dp `secondary` indicator around the track, on
  `:focus-visible` only. **High contrast:** under `forced-colors` it paints
  `Canvas` / `CanvasText` pairs (`GrayText` when disabled) with a `Highlight`
  focus ring, so the state never depends on a color that the system palette would
  erase.

**Rendering:** `Switch` is a **Server Component** (no `"use client"`). Its client
parts are islands: the press ripple, centred on and travelling with the handle, and
an interaction island that adds Enter, touch and keyboard press feedback, and
dragging. Without JavaScript, click, tap and Space still toggle and animate it.

`Slider` follows the
[WAI-ARIA APG slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
and `RangeSlider` the
[multi-thumb slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/),
plus MD3's slider accessibility spec:

- **A native range input per handle.** Screen readers announce the name,
  "slider" and the value (or `aria-valuetext` from `format` /
  `getAriaValueText`); iOS VoiceOver and Android TalkBack can **swipe to
  adjust**, which custom `role="slider"` widgets can't offer on mobile. The
  input's focus outline covers the handle.
- **Keyboard:** Tab lands on the handle (MD3: "initial focus lands directly on
  the handle"). ←/→ and ↑/↓ change by one step (or one stop), following the
  screen in RTL, vertical and `inverted`; **Page Up / Page Down**, **Shift +
  arrows** and **Space + arrows** (MD3) by the large step; **Home / End** to the
  ends. A range slider's handles are separate Tab stops; each one's `min` / `max`
  is bounded by the other.
- **Naming:** name it like its visible text — `aria-label`, `aria-labelledby`, or
  `<label htmlFor={id}>`. Range handles get `thumbLabels` ("Minimum price" /
  "Maximum price") and the group gets `aria-label` / `aria-labelledby`.
- **Contrast:** the end stop gives the inactive track's end a 3:1 anchor; drop it
  (`endStops={false}`) only when the track already has that contrast, or put
  icons / icon buttons (with the button role) outside the track instead.
- **Visible value:** the value indicator appears on press and keyboard focus; for
  a persistent value, add a text field next to the slider (kept in sync) and let
  Tab move to it.
- **Disabled** uses the native attribute (or an ancestor `<fieldset disabled>`):
  out of the tab order, no pointer. **High contrast:** forced-colors maps the
  tracks and handle to `Highlight` / `GrayText`.

**Rendering:** `Slider` and `RangeSlider` are **client components** (`"use
client"`): they track drags, measure the track and update the value live. They
still **server-render** with every handle, segment and stop in place (positions
are CSS `calc()` from the value), so the first paint is exact; dragging starts once
it hydrates. Pass `format` as `Intl.NumberFormatOptions` (not a function) and
`icon` as a node when rendering from a Server Component.

`Card` follows MD3's card accessibility spec. There is no APG "card" pattern,
so it uses the established block-link technique (Heydon Pickering's _Inclusive
Components_, Adrian Roselli's block links):

- **Two kinds of card.** A **container** card has no role and no tab stop; Tab
  visits each of its controls in reading order before the next card. A **directly
  actionable** card is one tab stop with the `link` or `button` role; Space / Enter
  activates it.
- **Don't wrap a rich card in `<a>` / `<button>`.** The whole card becomes one long
  accessible name, headings stop being headings (inside a button they're invalid),
  and nested controls become unreachable. For a clickable card with real content,
  use **`CardPrimaryAction`**: the link's name is its own text, the card's
  heading, list and image semantics survive, and secondary controls stay
  separately clickable and focusable. The card's hover, pressed and focus states
  follow the action through CSS (`:has()`); the focus indicator is drawn on the
  card. Trade-off: text under the overlay can't be drag-selected.
- **Controls inside a stretched card** must be positioned to sit above the overlay.
  Every `@chatool/ui` control already is, and inline links in
  `CardSubhead` / `CardSupportingText` are lifted automatically. Give your own
  controls `relative`, and don't make wrappers between the card and the
  `CardPrimaryAction` positioned (that would shrink the clickable area to them).
- **Headings and order.** `CardHeadline` is an `<h3>` by default; choose the level
  that fits the page (`asChild`), or a non-heading in very long lists. MD3's
  reading order is heading → image → body → actions: keep that DOM order and use
  `CardMedia placement="first"` to show the image on top.
- **Collections** are lists: `<ul>` + `<Card asChild><li>`, so screen readers
  announce the count. Decorative images take `alt=""`; images that carry
  information need real alt text.
- **Selection** is semantic only through real controls: `aria-pressed` (a
  `selected` `<button>` card or toggle `CardPrimaryAction`) or a native
  checkbox / radio in a `<label>` card (arrow keys, forms and `required` all work).
  The check icon is `aria-hidden`.
- **Disabled:** native on `<button>` cards, `aria-disabled` on other actionable
  cards (for a link card, prefer dropping `href`), `inert` on container cards.
- **Drag & swipe** need a single-pointer alternative (MD3), e.g. "Move up / down /
  Delete" in a menu.
- **High contrast:** every variant keeps a 1px boundary that `forced-colors`
  repaints, so even elevated / filled cards stay outlined. The focus indicator
  uses `Highlight`.

**Rendering:** `Card` and all its parts are **Server Components** (no
`"use client"`). Every state is CSS: attributes, `:hover`, `:active`,
`:focus-visible`, `:checked` and `:has()`. So a `<label>` + radio card selects,
animates and submits **before hydration**. The only client piece is the shared
press-ripple island, rendered for actionable cards and inside `CardPrimaryAction`.

`Tooltip` follows the [APG tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/),
MD3's tooltip accessibility spec and WCAG 1.4.13 (content on hover or focus):

- **Role and relationship.** The surface is `role="tooltip"`. By default it
  **describes** its anchor: string content goes into a hidden node that the anchor
  references with `aria-describedby` from the first render, so screen readers
  (including touch ones, which never hover) read it on focus without the tooltip
  opening. Rich content is referenced while it's open. `relationship="label"`
  makes the text the anchor's **name** (`aria-label`) instead. A description that
  only repeats the anchor's own `aria-label` is skipped.
- **Interactive tooltips** (`actions`, `persistent`, or `interactive`) are a
  non-modal `role="dialog"` named by the subhead (or the text) and described by
  the text; the anchor gets `aria-haspopup="dialog"`, `aria-expanded` and
  `aria-controls`. **Tab** from the anchor moves into the tooltip, Tab from its
  last control continues to whatever follows the anchor, Shift+Tab returns to the
  anchor. Focus is never trapped (MD3). Closing with focus inside returns it to
  the anchor.
- **Keyboard.** Focus shows a transient tooltip at once; **Escape** dismisses it
  without moving focus (one Escape closes one layer, so a tooltip inside a
  `<dialog>` closes before the dialog); blur hides it. Persistent tooltips open
  with Enter / Space on the anchor like any click.
- **Hoverable and persistent (WCAG 1.4.13).** The pointer can move from the anchor
  onto the tooltip (a bridge spans the gap) and it stays; it lingers 1.5s after
  the pointer leaves, and never closes from under keyboard focus.
- **Touch.** A long-press shows it without activating the anchor; on links the
  native context menu still wins. iOS's long-press callout is disabled on anchors.
- **High contrast:** under `forced-colors` the surface keeps a `CanvasText`
  outline and the caret stays visible.

What **you** are responsible for: an anchor that is **focusable** (a button,
link or input — wrap plain text in a `<button>` if it needs a tooltip); a name
for icon-only anchors (`aria-label`, or `relationship="label"`); never putting
essential information or the only way to do something in a tooltip; a subhead for
tooltips that open on their own (`defaultOpen`).

**Rendering:** `Tooltip` is a **client component** (it holds the open state),
but you can use it straight from a Server Component: the anchor and content you
pass are still server-rendered, and its ARIA (`aria-label` /
`aria-describedby`) is in the first HTML. The tooltip itself mounts only while
it's shown. `TooltipAction` is a server-safe `Button`.

`RichTooltip` follows the same contract (APG tooltip pattern, MDC's rich-tooltip
ARIA, MD3's tooltip accessibility spec, WCAG 1.4.13), adapted to its parts:

- **Tooltip or dialog.** Without controls it's `role="tooltip"` and **describes**
  its trigger (`aria-describedby`); plain-string shorthand text (subhead + text) is
  mirrored into a hidden node from the first render, so touch screen readers that
  never hover still hear it. With controls (actions, links, form controls, or a
  `click` / `manual` trigger) it's a **non-modal `dialog`** labelled by the subhead
  (else the text) and described by the text; the trigger gets
  `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. Controls are
  detected statically (so the trigger's ARIA is right before the first open) and
  again at runtime (links rendered by your own components); `interactive`
  overrides both.
- **Focus order (MD3):** trigger → inline links → text buttons. Tab from the
  trigger moves in, Tab past the last control continues after the trigger,
  Shift+Tab returns to it; focus is **never trapped**. An action (or
  `useRichTooltip().dismiss()`) returns focus to the trigger. Enter / Space
  activate the focused control (MD3 keyboard table); Escape closes one layer.
- **Announcements.** A tooltip that appears without the user asking at its
  trigger (page load, code, click, long-press) is read out through a polite live
  region (subhead + text), as Compose does with its live-region popup;
  hover / focus opens stay silent because the trigger already describes it.
  `announce` tunes or disables this.
- **Async actions** show the button's spinner (`aria-busy`) and hold the tooltip
  open, so it never disappears mid-task under a wandering pointer or focus.

Your part is the same as for `Tooltip`: a focusable trigger, a name for icon-only
triggers, a subhead for tooltips that open on their own, and nothing essential
hidden in a tooltip. **Rendering:** a client component (it holds the open state
and the parts' context) that renders no element of its own; use it straight from
Server Components. Function props (`onClick`, `onOpenChange`, `state`) need a
client component of yours, as usual.

`TextField` has no APG pattern of its own — the **native** `<input>` /
`<textarea>` is the contract, with MD3's text-field accessibility spec on top:

- **Name.** The label is a real `<label for>` (inside or above the container), so
  clicking it focuses the field and screen readers read it, asterisk included
  (MD3). No visible label → pass `aria-label` / `aria-labelledby`. A lone-space
  `placeholder` is always rendered (CSS uses `:placeholder-shown` to detect an
  empty field); it isn't announced.
- **Description.** `aria-describedby` lists, in order: your own ids, the prefix,
  the suffix, the supporting / error text and the counter ("5 of 20
  characters"; the visible `5/20` is hidden from AT). Hidden parts (the inactive
  supporting / error text) are skipped automatically.
- **Errors.** `error` sets `aria-invalid="true"`; `errorText` is announced
  (`role="alert"`) when `error` turns on, and read as the description after.
  Native constraint failures (`required`, `type`, `pattern`, …) are exposed by
  the browser itself and shown with MD3 error styling after interaction
  (`:user-invalid`). The error icon (`role="img"`, "Error") is a second,
  non-color cue — MD3 strongly recommends it.
- **Keyboard.** Tab focuses the field (disabled fields are skipped; read-only
  ones stay focusable). The clear button is out of the Tab order — **Escape**
  clears instead (and is `preventDefault`ed so an enclosing `<dialog>` stays
  open). The password toggle is a real button, named "Show password" / "Hide
  password" (the name changes, so it has no `aria-pressed`).
- **Pointer.** A press anywhere on the container (padding, decorative icons, the
  prefix) focuses the field, caret at the end. Icon buttons in it keep working.
- **High contrast.** Indicator and outline are borders, so `forced-colors` keeps
  them (2dp when focused); disabled parts turn `GrayText`.

What **you** are responsible for: a label (or `aria-label`) on every field; a
spoken form for symbolic prefixes (`<span aria-hidden>$</span><span
className="sr-only">US dollars</span>`); names for any icon buttons you pass;
explaining the asterisk once; error text that says how to fix the problem.

**Rendering:** `TextField` is a **Server Component** (no `"use client"`). Every
state is CSS on the native control — `:focus-within`, `:placeholder-shown`,
`:autofill`, `:disabled`, `[aria-invalid]`, `:user-invalid` — so an uncontrolled
field floats its label, validates, animates and submits **before hydration**.
One client island (`text-field-interaction`) adds click-to-focus, clear /
Escape, the password toggle, the live counter for uncontrolled fields and an
auto-grow fallback where `field-sizing: content` isn't supported; the built-in
icon buttons bring the shared ripple island. Controlled use (`value` +
`onChange`) works from any client component.

`Chip` follows MD3's chips accessibility spec on native elements:

- **Roles & names.** The primary action is a native `<button type="button">`
  (or `<a href>` / your `asChild` element) named by the label; icons, avatars and
  the checkmark are `aria-hidden` (MD3: "hide image"). Filter chips — and input
  chips that select — are toggle buttons (`aria-pressed`), like Material Web's
  and Compose's selectable chips. The remove action is a separate `<button>`
  named "Remove {label}" (`aria-labelledby` = a hidden "Remove" + the label; pass
  `removeLabel` to localize). A `removeOnly` chip is one button (MD3: "the entire
  chip and icon are one focusable element").
- **Keyboard** (MD3 table + Material Web). Tab reaches the chip (or the set);
  Space / Enter activate, select or deselect; ←/→ move between a chip's primary
  and remove actions and, inside a `ChipSet`, on to the neighbouring chips
  (wrap-around, mirrored in RTL), Home / End jump to the ends; **Backspace /
  Delete remove the focused chip** and focus moves to the next chip (or the
  previous one), even if your app animates the chip out first. Disabled chips
  are skipped; `softDisabled` chips stay focusable (`aria-disabled`).
- **Targets.** 48dp minimum for the chip and for the remove action, beyond the
  32dp container. `ChipSet` keeps 8dp between chips.
- **State.** Loading is `aria-busy`; selection is never color-only (the
  checkmark, or `aria-pressed` for assistive tech). In Windows High Contrast the
  outline, focus ring and disabled state are system colors.

`ChipSet` is a `role="toolbar"` (APG): one Tab stop with a roving tabindex (on
the focused action, else the last focused one, the first selected chip, or the
first enabled chip). What **you** are responsible for: an `aria-label` /
`aria-labelledby` on every set; a visible cue that chips are interactive (MD3);
`removeLabel` translations; removing the chip from your state in `onRemove`.

**Rendering:** `Chip` is a **Server Component** (no `"use client"` on its view or
barrel). The container, colors, shape morph, outline, elevation, icons and
checkmark are server-rendered and every state is CSS (`:has()` on the action's
`data-selected` / `data-disabled`, `:hover`, `:focus-visible`, `:active`). Its
one client island, `chip-actions` (own internal entry), renders the actions: it
reads the optional `ChipSet` context, owns an uncontrolled `defaultSelected` and
wires the keyboard; the shared `ripple` island adds the press ripple. `ChipSet`
is a **client component** (directive on its view and barrel) that still renders
on the server, so the selection is in the first paint; its roving tabindex starts
after hydration (until then every chip is a Tab stop).

`Tabs` follow the WAI-ARIA APG **tabs** pattern and MD3's tabs accessibility
spec:

- **Roles.** `TabList` is `role="tablist"`, each `Tab` a native `<button
role="tab">` with `aria-selected` and `aria-controls` → its `TabPanel`
  (`role="tabpanel"`, `aria-labelledby` → its tab, `tabIndex={0}` so a panel that
  starts with plain text is reachable). Ids are generated with `useId`.
- **Keyboard.** One Tab stop for the row (the selected tab; the focused one while
  focus is inside). ←/→ (mirrored in RTL) move focus with wrap-around (`loop`),
  Home / End jump, disabled tabs are skipped, ↑/↓ are left to page scrolling.
  MD3's **manual** activation by default: Space / Enter select ("Don't use
  Space/Enter for navigating tabs"); `activationMode="automatic"` selects on
  focus (APG, when panels render instantly). A focused tab is scrolled into view
  in scrollable rows.
- **Labels & badges.** Name every tab list (`aria-label` / `aria-labelledby`); an
  icon-only tab needs an `aria-label`. A badge's full value is read as part of the
  tab's name ("Mail 12"); its visible glyphs are hidden.
- **Scroll buttons** are `aria-hidden` and out of the Tab order (a pointer
  affordance); swipeable panels make inactive panels `inert`.
- **Targets.** 48dp minimum height for every tab; MD3 asks not to apply density
  by default.

**Rendering:** the tabs subpath is a **client component** (state, context and the
imperative motion; `"use client"` on every view and the barrel) that still
renders on the server: with `value` / `defaultValue` the selected tab, its
indicator and its panel are in the first paint, and works from Server Components
(pass only serializable props there, e.g. `defaultValue`). The indicator, the
auto-scroll and swipe-following are imperative DOM work (Web Animations on
registered properties, `requestAnimationFrame` springs), so no animation frame
re-renders React. The ripple is the shared `ripple` island.

`Snackbar` follows MD3's snackbar accessibility page (there is no APG pattern;
it is a WCAG 4.1.3 **status message**):

- **Announced, never focused.** Each message goes to a separate, always-present
  live region (`role="status"`, polite; `politeness: "assertive"` for errors that
  can't wait) a beat after it appears, so it is read once without moving focus or
  trapping it. Updates (`promise`, same `id`) are announced again.
- **Reachable.** The host is a named landmark, `Notifications (Alt+G)`; the
  hotkey (MD3: "a shortcut … like Alt+G") moves focus to the snackbar's action (or
  the snackbar). Tab moves between its controls; **Escape** dismisses it while
  focus is inside; when it closes, focus returns to where it came from, else to
  the element that triggered it.
- **Time.** Actionable snackbars never time out; others last 4s by default,
  `"auto"` scales with the text, and every timer pauses on hover, focus, swipe
  and a background window (WCAG 2.2.1). The close button and swipe always work.
- **Your part (MD3, web).** An auto-dismissing snackbar must not be the only
  place the information appears: also say it inline (a "Save" button that
  becomes "Saved"), or make the snackbar actionable. Don't put the only path to a
  core task in one; keep messages short; don't use stylized text or links (use the
  action).
- **Never covers what's in focus**: place the host away from focused controls
  and use `anchor` / `offset` for bottom bars and FABs.

**Rendering:** the snackbar subpath is a **client component** (`"use client"` on
the views and the barrel). `<SnackbarHost />` renders on the server (the landmark
and live regions are in the first HTML) and can sit in a Server Component layout;
`snackbar()` must be called from client code. Timers, swipe and the anchor are
imperative DOM work, so a drag never re-renders React.

## For AI agents

- **Import the subpath** `@chatool/ui/button`. There is **no `@chatool/ui` root
  barrel**. `Button` is both the **default** and a named export.
- `Button` has **no `"use client"`** — it renders as a **Server Component** (only
  the press ripple is a client island). Don't add the directive; passing `onClick`
  just makes the _caller_ a client component, as usual.
- **A11y (APG):** native `<button>`, defaults to **`type="button"`** (pass
  `type="submit"` for forms); give **icon-only** buttons an `aria-label`; `aria-*`
  (`aria-haspopup`/`aria-expanded`/…) pass through; `loading` is non-actionable +
  `aria-busy`. For `asChild`, pass a natively interactive element.
- **Toggle:** pass `selected` (sets `aria-pressed`, morphs round→square, swaps to
  `selectedIcon`) — keep the label constant; omit it for a plain button. Same
  `selected`/`selectedIcon` API as `IconButton`.
- **MD3 spec:** color is **fixed per style** (no `color` prop) — filled→primary,
  tonal→secondary-container, elevated→surface-container-low + primary,
  outlined/text→primary. Style with tokens, not hex; for per-component theming set
  `--md-comp-button-*` (CSS var, globally or via `style`).
- **Press feedback (ripple, state layer, shape-morph) is built in** — don't re-add
  it. The ripple uses the Web Animations API into a React-empty overlay.
- **`IconButton`** (`@chatool/ui/icon-button`): icon-only, square; same Server
  Component + ripple model. The glyph is `children`; **`aria-label` is required**.
  Styles `standard` _(default)_ · `filled` · `tonal` · `outlined`; sizes `xs`–`xl`;
  `shape` `round` _(default, circle)_ · `square`. Pass `selected` to make it an MD3
  **toggle** (reflects `aria-pressed`, morphs round→square, swaps `selectedIcon`) —
  keep the label constant; omit `selected` for a plain button. Per-component tokens
  `--md-comp-icon-button-*`.
- **`ButtonGroup`** (`@chatool/ui/button-group`): the MD3 **Expressive**
  `role="group"` container for `Button`/`IconButton` children — pure **Server
  Component** (CSS-only interaction), owns no state. `variant` `standard`
  _(default)_ presses-squish (pressed child expands, neighbors compress) ·
  `connected` (tight 2dp cluster; children keep their own radius, the selected
  child morphs via its own smooth round→square animation). `orientation`
  `horizontal` _(default)_ · `vertical`. The group never overrides a child's
  border-radius. Give it an `aria-label`; build a segmented control by toggling the
  children's `selected`. Gap token `--md-comp-button-group-gap`.
- **`Fab`** (`@chatool/ui/fab`): MD3 Expressive **FAB + extended FAB in one
  element**, a **Server Component** (client islands: ripple + label measurer).
  `icon` alone = FAB (**`aria-label` required**, or wrap in
  `<Tooltip relationship="label">`); add `label` = extended FAB; `expanded={false}`
  collapses an extended FAB (with an icon) into a FAB on a spring, keeping the
  label as its accessible name. Don't model FAB vs extended FAB as two
  components. `size` `small` (56) · `medium` _(default, 80)_ · `large` (96);
  `color` `primary-container` _(default)_ · `secondary-container` ·
  `tertiary-container` · `primary` · `secondary` · `tertiary`; `elevation`
  `default` · `lowered` · `none`; `placement` `bottom-end` · `bottom-center` ·
  `bottom-start` (fixed, 16dp margins, safe-area aware); `visible={false}` hides
  it (inert); `asChild` for links. `size` / `expanded` accept MD3 window-class
  objects (`{ compact, medium, expanded, large, extraLarge }`, breakpoints
  600 / 840 / 1200 / 1600px), resolved in CSS. One FAB per screen, for a
  constructive action; hide instead of disabling. Tokens `--md-comp-fab-*`.
- **`LoadingIndicator`** (`@chatool/ui/loading-indicator`): the MD3 Expressive
  shape-morphing indicator for ~200ms–5s waits. `contained` adds the
  `primary-container` circle; `size` is px (24–240, default 48); `value` / `max`
  scrub the morph for pull-to-refresh. Tokens `--md-comp-loading-indicator-*`.
- **`LinearProgress`** / **`CircularProgress`** (`@chatool/ui/linear-progress`,
  `@chatool/ui/circular-progress`): for processes over 5s. `shape` is `wavy`
  _(default)_ · `flat`; **omit `value` for indeterminate**, and setting it later
  hands off smoothly, so keep the same element instead of swapping components.
  Don't transition a `LoadingIndicator` into these. `thickness` is px (4 default, 8
  thick); linear's `stop` dot is required unless the track has 3:1 contrast;
  `CircularProgress` takes `size` and `track`. Tokens `--md-comp-linear-progress-*`
  and `--md-comp-circular-progress-*`.
- All three are **client components** that still render a first frame on the
  server, with `role="progressbar"`: give them an `aria-label` naming what's
  loading. Inside a button use `color="inherit"`, and `shape="flat"` +
  `track={false}` for `CircularProgress`. Reduced motion is built in.
- **`Divider`** (`@chatool/ui/divider`): the MD3 1dp `outline-variant` line, a
  pure **Server Component**. `orientation` `horizontal` _(default)_ · `vertical`;
  `inset` `none` _(default)_ · `start` (MD3 "inset", 16dp) · `end` · `middle`
  (16dp both sides); `weight` `regular` _(1dp)_ · `heavy` _(8dp)_; optional label as
  `children` with `labelPosition`. **Decorative by default** (`role="none"`); pass
  `decorative={false}` for a real separator (`<hr>` / `role="separator"`). In lists
  and menus use `asChild` with an `<li>`. Set spacing with `my-*`; align with list
  text via `[--md-comp-divider-inset-start:72px]`. Tokens `--md-comp-divider-*`.
  Prefer open space over dividers where it does the grouping.
- **`Badge`** (`@chatool/ui/badge`): the MD3 badge, a pure **Server Component**
  with CSS-only Expressive motion. **No `value` → small 6dp dot**; `value`
  (number or string) → **large 16dp pill**. **Wrap the icon**
  (`<Badge value={3}><MailOutlined /></Badge>`) and it places itself on the icon's
  upper trailing corner with the spec offsets; with no children it's inline.
  `max` (999 → `999+`), `maxLength` (4, strings cut with `…`), `showZero`,
  `invisible` (animated hide; MD3: hide a nav badge when its destination is
  selected), `size` (`small` with a value = a dot that still announces the count),
  `color` `error` _(default — keep it)_ · `primary` · `secondary` · `tertiary`,
  `placement` `top-end` _(default)_ · `top-start` (logical, mirrors in RTL),
  `locale` (localized digits), `label` (screen-reader text; `""` = decorative),
  `anchorClassName`, `asChild`. **A11y:** visible glyphs are `aria-hidden` and a
  visually hidden span reads the full value or "New notification". In an
  `aria-label`led `IconButton`, wire `aria-describedby` to the badge `id`; on
  navigation items put the count in the item's `aria-label` and pass `label=""`.
  Tokens `--md-comp-badge-*` (color, sizes, shapes, offsets, motion). Don't
  position it by hand or place it over the icon.
- **`Checkbox`** (`@chatool/ui/checkbox`): the MD3 checkbox, a **Server
  Component** over a **native `<input type="checkbox">`** (Expressive motion is
  CSS-only). All input props (`checked`/`defaultChecked`/`onChange`, `name`,
  `value`, `required`, `form`, `aria-*`, `ref`) go to the input — use it exactly
  like a native checkbox (`event.target.checked`); there is no `onCheckedChange`.
  `indeterminate` (MD3 dash, native mixed state) is **controlled**: derive it and
  clear it in `onChange`. `error` (or `aria-invalid`; `:user-invalid` on
  `required`), `disabled`, `color` `primary` _(default — keep it)_ · `secondary` ·
  `tertiary`. `label` renders a `<label>` row (text toggles the box);
  `supportingText` → `aria-describedby`; `labelPosition` `end` _(default)_ ·
  `start`. `className` → outermost element, `controlClassName` → the 48dp control.
  Without `label`, **name it** (`aria-label`/`aria-labelledby`/`<label htmlFor>`).
  Group with `<fieldset>` + `<legend>`. Don't add `"use client"`, don't set
  `aria-checked`, don't re-add ripple/state-layer/focus styling. Tokens
  `--md-comp-checkbox-*`.
- **`Radio`** (`@chatool/ui/radio`) + **`RadioGroup`** (`@chatool/ui/radio-group`):
  the MD3 radio button. `Radio` is a **Server Component** over a **native
  `<input type="radio">`** (Expressive dot spring is CSS-only); all input props go
  to the input. Prefer wrapping radios in `RadioGroup` (a `<fieldset
role="radiogroup">`): give it `label` (legend) and either `defaultValue` or
  `value` + `onValueChange(value, event)` (`null` = none), plus `name` when the form
  submits it; give every `Radio` a `value` and a `label`. Group props `required`,
  `disabled`, `error`, `supportingText`, `orientation` `vertical` _(default)_ ·
  `horizontal`, `color`, `labelPosition`, `form`, `itemsClassName`. `Radio` props
  `label`, `supportingText`, `labelPosition`, `color` (`primary` default — keep it),
  `error`, `controlClassName`. Keyboard is native (don't add key handlers or
  roving tabindex). Don't set `aria-checked`, don't add `"use client"` to `Radio`,
  don't re-add ripple/state-layer/focus styling. MD3: vertical lists, ≤ 5 options,
  pre-select one. Tokens `--md-comp-radio-*`.
- **`Switch`** (`@chatool/ui/switch`): the MD3 switch, a **Server Component** over
  a **native `<input type="checkbox" role="switch">`** (Expressive handle spring is
  CSS-only; Enter / drag / touch press come from a built-in island). All input props
  go to the input; `onCheckedChange(checked, event)` is the Compose-style shortcut
  next to `onChange`. `icons` `false` _(default)_ · `"selected"` · `true`, with
  `selectedIcon` / `unselectedIcon` for custom glyphs (unambiguous on/off only).
  `label` (what it turns **on**, constant across states), `supportingText`,
  `labelPosition` `start` _(default)_ · `end`, `color` `primary` _(default — keep
  it)_ · `secondary` · `tertiary`, `disabled`, `controlClassName`. Settings rows:
  `className="w-full justify-between"`. Without `label`, **name it**. Use a switch
  only for an **immediate** on/off setting (checkboxes for multi-select or
  save-later forms). Don't add `"use client"`, don't set `aria-checked`, don't add
  key or drag handlers. There is no `error` state (MD3 defines none). Tokens
  `--md-comp-switch-*`.
- **`Slider` / `RangeSlider`** (`@chatool/ui/slider`): MD3 Expressive sliders,
  **client components** over one **native `<input type="range">`** per handle.
  `import Slider, { RangeSlider } from "@chatool/ui/slider"`. Values are numbers
  (`Slider`) or `[start, end]` (`RangeSlider`); `value` / `defaultValue` /
  `onValueChange` / `onValueCommit`. `min` / `max` / `step` (default 0 / 100 / 1,
  `"any"` continuous), `stops` (`true` or a custom `number[]`), `endStops`,
  `largeStep`, `valueIndicator` `false` · `true` · `"always"`, `format`
  (`Intl.NumberFormatOptions` or a function), `size` `xs` _(default)_ · `s` · `m` ·
  `l` · `xl`, `orientation`, `inverted`, `disabled`, `haptics`, `name`, `form`,
  `classNames`. `Slider` adds `centered`, `icon` / `endIcon` (M/L/XL standard only),
  `id` / `inputRef`; `RangeSlider` adds `minStepsBetweenThumbs`, `thumbLabels`,
  `inputRefs`. Always **name** it (`aria-label` / `aria-labelledby` / `<label
htmlFor>`). Don't wrap it in your own `role="slider"` or key handlers, don't
  re-style the handle with a circle (the Expressive handle is a 4dp bar), don't
  use inset icons on centered/range or XS/S, and avoid vertical range sliders.
  Tokens `--md-comp-slider-*`.
- **`Card`** (`@chatool/ui/card`): the MD3 card + parts, all **Server Components**
  from one subpath — `Card` (default) with `CardMedia`, `CardHeader`
  (`leading`/`trailing`), `CardContent`, `CardHeadline` (`<h3>`, `size`,
  `maxLines`), `CardSubhead`, `CardSupportingText`, `CardActions` (`align`) and
  `CardPrimaryAction`. `variant` `filled` _(default)_ · `elevated` · `outlined`
  (style only — pick by desired separation); `shape` = the Expressive corner scale
  (`medium` 12dp default); `orientation` `vertical` · `horizontal`; `disabled`,
  `dragged`, `selected` (+ `checkIcon`). **Clickable card → put a
  `CardPrimaryAction href` (or `asChild` + router `Link`) inside the
  `CardHeadline`**; never wrap rich content (headings, buttons) in `<a>` or
  `<button>`. Only short, phrasing-only cards may **be** the control
  (`<Card asChild><a|button>`, auto-detected as interactive); those must not
  contain other actions. Selectable: `selected` on a `<button>` card
  (`aria-pressed`) or `<Card asChild checkIcon><label><input type="radio"
className="sr-only"/>…` (zero JS). Collections: `<ul>` + `<Card asChild><li>`.
  Full-bleed `CardMedia` is the default (`inset` for padded, optically round
  media); give horizontal media a width. Don't add hover / ripple / focus /
  elevation styles, don't add `"use client"`, and don't position wrappers between
  the card and its `CardPrimaryAction`. Tokens `--md-comp-card-*`.
- **`Tooltip`** (`@chatool/ui/tooltip`): wrap **one** ref-forwarding element:
  `<Tooltip content="Save"><IconButton aria-label="Save">…</IconButton></Tooltip>`
  or `relationship="label"` to let the tooltip text be the icon button's name.
  Plain for short labels (`top`, centred); **rich** when you pass `title` /
  `actions` (`<TooltipAction>`, max two) / `persistent` (click to open; `defaultOpen`
  for feature discovery). `side` `top`/`bottom`/`start`/`end`/`left`/`right`,
  `align` `center`/`start`/`end`/`before`/`after`, `caret`, `offset` (4 by default,
  8 for text). Controlled: `open` + `onOpenChange(open, { reason })`. App-wide
  timing: `<TooltipProvider showDelay hideDelay …>`. Usable from Server
  Components (no `"use client"` needed by you). The anchor must be focusable. Don't
  put essential info or the only path to an action in a tooltip; don't wrap a
  plain tooltip around an element whose visible text already says the same thing;
  don't add your own hover/focus handlers, `z-index` or portals. Tokens
  `--md-comp-plain-tooltip-*`, `--md-comp-rich-tooltip-*`, `--md-comp-overlay-*`.
- **`RichTooltip`** (`@chatool/ui/rich-tooltip`): MD3's rich tooltip with button
  actions, composable. Shorthand: `<RichTooltip subhead="…" supportingText="…"
actions={<RichTooltipAction>Got it</RichTooltipAction>}><Button>…</Button></RichTooltip>`.
  Composed: `<RichTooltip><RichTooltipTrigger><Button/></RichTooltipTrigger>
<RichTooltipContent><RichTooltipSubhead/><RichTooltipSupportingText/>
<RichTooltipActions><RichTooltipAction/></RichTooltipActions></RichTooltipContent></RichTooltip>`.
  `trigger` `hover` (default, transient) · `click` (persistent; `defaultOpen` for
  feature discovery) · `manual` (code only: `state={useRichTooltipState()}` +
  `show()` / `dismiss()` / `toggle()`, or `open` + `onOpenChange`). `anchor`
  takes an element, ref or virtual `{ getBoundingClientRect }`. Defaults follow
  MD3 (`side="bottom"`, `align="after"`, 8dp `positionStep`). `RichTooltipAction`
  closes on click (`closeOnClick={false}` to keep it) and awaits a returned
  promise with a spinner. `RichTooltipContent` takes `elevation` (0–5) and
  `maxWidth`; `caret` takes `true` or `{ width, height }`. At most two actions;
  don't use `click` on icon buttons; don't add `role`, `aria-*`, portals,
  `z-index` or your own Escape / outside-click handling — it's all built in.
  Tokens `--md-comp-rich-tooltip-*` (shared with `Tooltip`).
- **`TextField`** (`@chatool/ui/text-field`): `<TextField label="Email"
type="email" name="email" required errorText="…" />`. `variant` `filled`
  _(default)_ · `outlined`; every native input prop (`value`/`onChange`,
  `defaultValue`, `type`, `maxLength`, `pattern`, `autoComplete`, `ref`, …) goes to
  the `<input>`, `className` / `style` to the root (default width 280dp — use
  `className="w-full"` in forms). `multiline` → `<textarea>` (`minRows`/`maxRows`
  grow, `rows` = fixed text area). Parts: `leadingIcon`, `trailingIcon`, `prefix`,
  `suffix`, `supportingText`, `errorText` (swaps in while invalid), `clearable`,
  password toggle (automatic for `type="password"`), counter (automatic with
  `maxLength`), `labelPosition="above"`, `alwaysFloatLabel`, `density`, `color`,
  `labels` (i18n), `classNames`, `asChild` (custom input). Validation: `error`
  `true` / `false` / `undefined` (native `:user-invalid`). Server Component — don't
  add `"use client"`; don't put a `<label>` around it, don't hand-wire
  `aria-describedby` for its own texts, don't set `placeholder` to fake a label.
  Tokens `--md-comp-text-field-*`.
- **`Chip`** (`@chatool/ui/chip`) + **`ChipSet`** (`@chatool/ui/chip-set`):
  `<ChipSet aria-label="Cuisine" selectionMode="multiple" value={v}
onValueChange={setV}><Chip variant="filter" value="ramen">Ramen</Chip></ChipSet>`.
  `variant` `assist` _(default)_ · `filter` · `input` · `suggestion` (pick by
  purpose: action / filter / user-entered / generated). Parts: `icon`, `avatar`
  (input), `trailingIcon`, `selectedIcon` (`false` = no check). Filter / input
  selection: `selected` / `defaultSelected` / `onSelectedChange` standalone, or the
  set's `selectionMode` `single` / `multiple` + `value` / `defaultValue` /
  `onValueChange` + `required` + `name` (form). Removal: `onRemove` on the chip or
  the set (`(value) => …`), `removable`, `removeOnly`, `removeLabel`; Backspace /
  Delete and focus hand-off are built in — remove the chip from your state, don't
  manage focus. Also `elevated`, `expressive` (default `true`: 12dp → pill when
  selected → 8dp pressed; `false` = baseline 8dp), `loading`, `disabled`,
  `softDisabled`, `dragged`, `href` / `asChild` links, `layout="scroll"` on the
  set. `className` / `style` go to the chip container, other props to its primary
  action. `Chip` is a Server Component; `ChipSet` is client but usable from Server
  Components. Always label the set; show chips in a set, never alone; don't use
  chips for primary / final actions (use buttons); don't add your own key handlers,
  `role`s or `aria-pressed`. Tokens `--md-comp-chip-*`, `--md-comp-chip-set-*`.
- **`Tabs`** (`@chatool/ui/tabs`): `<Tabs defaultValue="a"><TabList
aria-label="…"><Tab value="a">A</Tab><Tab value="b">B</Tab></TabList><TabPanels><TabPanel
value="a">…</TabPanel><TabPanel value="b">…</TabPanel></TabPanels></Tabs>`. Every
  `Tab` / `TabPanel` needs a `value`; `Tabs` owns the selection (`value` /
  `defaultValue` / `onValueChange(value, { reason })`, `activationMode` `manual`
  default · `automatic`). `TabList`: `variant` `primary` · `secondary`, `layout`
  `fixed` · `scrollable`, `alignment` `fill` · `center` · `start`, `iconPosition`
  `top` · `start`, `indicatorMotion` `elastic` (default, MD3 Expressive) · `slide`
  · `fade`, `divider`, `scrollButtons`, `loop`. `Tab`: `icon`, `selectedIcon`,
  `badge` (`true` / number / string / `<Badge />`), `disabled`, `asChild` (route
  links), `classNames`. `TabPanels`: `swipeable`, `transition` `slide` · `fade` ·
  `none`; `TabPanel`: `keepMounted`. Client component usable from Server
  Components. Always name the tab list; give icon-only tabs an `aria-label`; use
  secondary tabs only below primary ones; don't add key handlers, roles,
  `aria-selected` or `tabIndex` yourself; don't hand-animate the indicator. Tokens
  `--md-comp-tabs-*`.
- **`Snackbar`** (`@chatool/ui/snackbar`): render **one** `<SnackbarHost />`
  near the app root (Server Component layouts are fine), then call
  `snackbar("Text")` / `snackbar({ message, action: "Undo", onAction })` from
  client code; `await handle.result` → `"action"` · `"timeout"` · `"dismiss"` ·
  `"swipe"` · `"escape"` · `"replaced"` · …; `snackbar.promise(p, { loading,
success, error })`; same `id` updates in place; `replace: true` /
  `strategy="replace"` swaps immediately. Use `createSnackbarQueue()` +
  `<SnackbarHost queue contained>` for scoped hosts and `useSnackbar()` inside a
  wrapping host. Host props: `side`, `align`, `fullWidth`, `offset`, `anchor`
  (sit above a FAB), `duration`, `swipeDirection`, `hotkey`, `renderSnackbar`.
  MD3 rules: one at a time, short text, at most one text action, actionable
  snackbars don't time out, no icons / links / filled buttons, and on the web also
  show the outcome inline. Don't render two hosts on the same queue, don't move
  focus to snackbars yourself, don't add live regions around them. Tokens
  `--md-comp-snackbar-*`.
- Token **colors carry a `color:` hint** (`text-[color:var(--…)]`) so `cn`/
  tailwind-merge keeps them next to the typescale class instead of dropping them.
- **Requires `@chatool/core`**: install it and import its CSS, or it renders
  unstyled.
- **Icons are not here** — import them from `@chatool/icons/<IconName>`.
- `react` / `react-dom` are peers supplied by the app.

## Related

- `@chatool/core` — required design tokens / theme CSS (install + import its CSS).
- `@chatool/utils` — provides `cn`.
- `@chatool/icons` — SVG icons used alongside these components.
