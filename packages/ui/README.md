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

| Subpath                         | Exports                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `@chatool/ui/button`            | `Button` (also `default`), `buttonVariants`                     |
| `@chatool/ui/icon-button`       | `IconButton` (also `default`), `iconButtonVariants`             |
| `@chatool/ui/button-group`      | `ButtonGroup` (also `default`), `buttonGroupVariants`           |
| `@chatool/ui/loading-indicator` | `LoadingIndicator` (also `default`), `loadingIndicatorVariants` |
| `@chatool/ui/linear-progress`   | `LinearProgress` (also `default`), `linearProgressVariants`     |
| `@chatool/ui/circular-progress` | `CircularProgress` (also `default`), `circularProgressVariants` |
| `@chatool/ui/divider`           | `Divider` (also `default`), `dividerVariants`                   |

> The MD3 button family (FAB, segmented) is still being built out — this release
> ships the **common Button**, the **Icon button**, and the **Button group**.

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
   children). **`LoadingIndicator`** has
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
