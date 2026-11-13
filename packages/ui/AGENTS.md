# AGENTS.md — @chatool/ui

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/ui.md](../../docs/packages/ui.md).

- **Component structure (canonical spec:
  [docs/conventions/component-structure.md](../../docs/conventions/component-structure.md)).**
  Each component is its **own kebab-case directory** (grouped in a family dir like
  `src/buttons/`) whose `index.tsx` is both the public barrel and the `tsdown`
  entry:
  ```
  src/buttons/          # the button family directory
    button/
      index.tsx         # entry + barrel (no directive — button is server-safe)
      button.tsx        # one arrow component, default-exported (the view)
      button.types.ts   # ButtonProps + types
      button.variants.ts# buttonVariants (cva)
    config.ts           # shared family config (sizes, shape, class fragments)
    spinner.tsx         # shared loading spinner (pure)
    ripple.tsx          # "use client" press-ripple island (own INTERNAL entry)
  ```
  Components are **arrow functions, one per file, default-exported**; types and
  cva variants go in separate `*.types.ts` / `*.variants.ts`; non-trivial logic
  moves to a `useLogic` hook (skip when trivial — `button` has none). Files are
  kebab-case. Enforced by ESLint (`react/function-component-definition`,
  `react/no-multi-comp`, `unicorn/filename-case`) scoped to `packages/ui/src/**`.
- **Prefer Server Components; the `"use client";` directive is conditional** (see
  [Client vs Server Components](../../docs/conventions/client-server-components.md)).
  A **pure** component (props → JSX) has **no directive anywhere** in its directory.
  A **client** component (hooks/context/event-wiring/browser APIs/client-only
  _interactive_ `radix-ui` primitives) carries `"use client";` on **both** the view
  file **and** the `index.tsx` entry barrel — tsdown only preserves the directive at
  the top of the entry's own source (a re-export barrel doesn't inherit it; same
  rule as `packages/utils/src/hooks/index.ts`). **`button` is a Server Component**
  (no directive on its view or barrel): `radix-ui`'s `Slot` is server-safe and it
  only spreads consumer props. Its sole client piece is the press **ripple**, a
  `"use client"` island (`src/buttons/ripple.tsx`) given its **own internal `tsdown`
  entry** so the directive survives bundling (it is **not** a public subpath). Pure
  files (`*.types.ts`, `*.variants.ts`) never carry the directive.
- **No root barrel / no `.` export.** There is no `src/index.ts`; each component
  is reachable only through its own subpath so the IDE auto-imports the subpath
  (e.g. `import Button from "@chatool/ui/button"`) instead of a root
  `@chatool/ui` barrel. Don't re-add `src/index.ts` or a `.` export.
- **Icons live in [`@chatool/icons`](../icons/AGENTS.md)**, not here. Don't add
  an `src/icons/` back to this package.
- All components import `cn` from `@chatool/utils` (a `dependency`,
  `workspace:^`). Don't reimplement `cn`.
- Use the `radix-ui` **umbrella** package: `import { Slot } from "radix-ui"`
  (`Slot.Root`), `import { Dialog } from "radix-ui"`, etc. Don't add individual
  `@radix-ui/react-*` packages.
- `react` / `react-dom` are `peerDependencies`; tsdown externalizes them (and all
  deps, incl. `react/jsx-runtime`) automatically — no `external` list needed.
- **Button family lives in `src/buttons/`.** Published subpaths: `./button`
  (source `src/buttons/button/`), `./icon-button` (source
  `src/buttons/icon-button/`, the icon-only square member — four styles
  standard/filled/tonal/outlined, the XS–XL square scale via
  `iconButtonSize`, round/square shape-morph, and an MD3 `selected` **toggle** that
  sets `aria-pressed` + morphs round→square + swaps `selectedIcon`), and
  `./button-group` (source `src/buttons/button-group/`, the MD3 **Expressive**
  invisible `role="group"` **container** for `Button`/`IconButton` children —
  `standard` (press-squish: pressed child expands + neighbors compress, CSS-only) /
  `connected` (tight 2dp cluster; children keep their own radius, selected child
  morphs via its own smooth round→square animation) variants, horizontal/vertical;
  a pure layout that owns no state, never overrides a child's border-radius, and
  doesn't compose the interactive `BASE`/`STATE_LAYER`/`FOCUS_RING`/`DISABLED`
  fragments), and `./fab` (source `src/buttons/fab/`, the MD3 **Expressive** FAB
  **and** extended FAB as **one morphing element**: `icon` only = FAB, `label` =
  extended FAB, `expanded` collapses it; sizes small/medium/large = 56/80/96dp,
  six color styles, `elevation`, `placement`, `visible`, and **responsive**
  `size`/`expanded` objects keyed by MD3 window classes (literal `min-[600px]:` …
  `min-[1600px]:` class maps in `fab.variants.ts`, so they stay CSS-only). All
  size geometry is local custom properties (`--_h`/`--_ic`/`--_pad`/`--_gap`/
  `--_r`) so size changes morph; collapsed = padding `(h − icon) / 2` + label
  width × `--chatool-fab-expansion` (a `<number>` the container springs 1 ⇄ 0).
  Pure Server Component; client islands are the shared `ripple` and
  `fab/fab-label.tsx` (measures the label, registers `--chatool-fab-expansion`),
  given its own INTERNAL `tsdown` entry. **Keep `fab-label.tsx` importing nothing
  from `fab.variants.ts`** — a shared module makes the bundler hoist both into one
  chunk and the `"use client"` boundary is lost. Never put `_` in a custom
  property named inside an arbitrary `[transition:…]` value (Tailwind turns `_`
  into a space). Segmented is **deferred** (will be added under `src/buttons/`
  later). Each barrel exposes a `default` + named exports (e.g. `Button` +
  `buttonVariants`, `IconButton` + `iconButtonVariants`, `ButtonGroup` +
  `buttonGroupVariants`, `Fab` + `fabVariants`).
  Adding a component = new `src/buttons/<name>/` directory + a `tsdown` entry whose
  **key equals the subpath** (`{ button: "src/buttons/button/index.tsx" }` →
  `dist/button.*`, so the `exports` map stays stable) + the new `exports` subpath
  (ESM + CJS). A `"use client"` island used **internally** (e.g. `ripple`) gets its
  own `tsdown` entry **without** an `exports` subpath, so its directive is preserved
  as a private client chunk.
- **Loading family lives in `src/loading/`.** Published subpaths:
  `./loading-indicator` (source `src/loading/loading-indicator/`, the MD3 Expressive
  seven-shape morph, optionally `contained`, with `value` scrubbing the
  circle → burst morph), `./linear-progress` and `./circular-progress` (flat or
  wavy, determinate or indeterminate, with Android's indeterminate → determinate
  handoff). All three are **client components** (the view + entry barrel carry
  `"use client"`) because they draw per frame, yet still server-render a first frame.
  Each pairs its view with a **pure `*-engine.ts`** (no DOM, no React) holding the
  frame math, and a `useLogic` hook that paints onto SVG refs without re-rendering.
  Shared, inlined modules (not subpaths): `shapes/` (a TypeScript port of
  `androidx.graphics.shapes`: keep its algorithm intact so morphs match Android),
  `motion.ts` (easing, tweens, Compose's timings), `progressbar.ts` (ARIA +
  `value` → fraction), `ticker.ts` + `use-frame-loop.ts` (the one shared
  `requestAnimationFrame` loop, paused off-screen) and `use-reduced-motion.ts`.
- **Divider family lives in `src/dividers/`.** Published subpath: `./divider`
  (source `src/dividers/divider/`), the MD3 1dp `outline-variant` line —
  `orientation` horizontal/vertical, `inset` none/start/end/middle (logical
  margins, 16dp via `--md-comp-divider-inset-*`), `weight` regular (1dp) / heavy
  (8dp, MDC-Android M3), and an optional label (`children` + `labelPosition`) drawn
  between `::before`/`::after` segments. A **pure Server Component** (no directive,
  no island). **Decorative by default** (`role="none"`, per MD3);
  `decorative={false}` renders a native `<hr>` for the plain horizontal case and
  `role="separator"` (+ `aria-orientation`) otherwise; `asChild` puts it on an
  `<li>` in lists/menus. The line is a **border**, not a background, so it survives
  `forced-colors`. Shared line fragments (color + thickness) live in
  `src/dividers/config.ts` for future siblings; keep class strings literal so
  Tailwind can scan them.
- **Badge family lives in `src/badges/`.** Published subpath: `./badge` (source
  `src/badges/badge/`), the MD3 badge — **small** 6dp dot (no `value`) or **large**
  16dp `label-small` pill (`value`, number or string; `max` → `999+`, `maxLength`
  → `…`, `showZero`). Wrapping children makes them the **anchor**: the badge sits
  inside the icon box at the upper trailing corner with the spec offsets (small
  6×6dp, large 14×12dp) via **logical** insets, so RTL mirrors it; no children →
  inline. Also `invisible`, `size`, `color` (error default + primary/secondary/
  tertiary), `placement` (`top-end`/`top-start`), `locale`, `label`,
  `anchorClassName`, `asChild`. A **pure Server Component** (no directive, no
  island): all motion is CSS — `@starting-style` entrance, transitions on spring
  `linear()` easings sampled from Compose's Expressive motion tokens, and a label
  **keyed by its text** so a changed count re-plays its pop. Geometry is driven by
  `--_*` locals swapped per size, so dot ⇄ pill morphs on one element. Visible
  glyphs are `aria-hidden`; a `sr-only` span reads the full value or "New
  notification". Shared geometry/motion fragments live in `src/badges/config.ts`
  and the pure content rules (`max+`, truncation, digits, spoken text) in
  `src/badges/format.ts` — deterministic (never the runtime's default locale) so
  SSR and hydration agree. In arbitrary `calc()` values write the operator as
  `_-_` (Tailwind turns a bare `-var(--_x)` into `var(-- x)`).
- **Selection family lives in `src/selection/`.** Published subpath: `./checkbox`
  (source `src/selection/checkbox/`), the MD3 checkbox with Expressive motion — a
  **Server Component over a native `<input type="checkbox">`** (no directive on the
  view or barrel; `useId` is RSC-safe). The input is invisible but covers the 48dp
  touch target and **all visuals are CSS driven from its state** (`:checked`,
  `:indeterminate`, `:disabled`, `[aria-invalid]` / `:user-invalid`,
  `:focus-visible`), so uncontrolled boxes work before hydration and a disabled
  `<fieldset>` disables them visually. Painted roles resolve through **priority
  chains of locals** (e.g. `--_outline` = forced-colors › disabled › error ›
  interacting › rest): each condition sets only its own local, so the result never
  depends on Tailwind's rule order (Prettier's class sorting is safe). The check is
  **one stroked SVG path** (`M0 -6 V0 H12`, an "L"): a group transform rotates it
  into a check or flat dash and the dash pattern (`--_mg` offset, `--_md` length)
  picks the visible stretch, giving Compose's draw-in and the check ⇄ dash morph
  with plain transitions (no `d` animation, works in Safari). Props: `label`
  (renders a `<label>` row, `group/selection-field`), `supportingText`
  (`aria-describedby` via `useId`), `labelPosition`, `indeterminate`
  (controlled), `error`, `color`, `controlClassName`; everything else goes to the
  input. Client islands: the shared `../../buttons/ripple` (now with `centered` +
  `className`) and `checkbox-indeterminate.tsx`, which syncs the DOM-only
  `input.indeterminate` and has its **own internal `tsdown` entry** (no `exports`
  subpath) like `ripple`. Never set `aria-checked` on the native input (ARIA in
  HTML). Shared Expressive springs (`MOTION`: default spatial 0.8/380, default
  effects 1/1600, fast effects 1/3800 as `linear()`), the state-layer priority
  chain (`STATE`) and the state-layer + focus-indicator pseudo (`STATE_LAYER`)
  live in `src/selection/config.ts` for future radio/switch siblings.
- **Radio lives in the selection family too.** Published subpaths: `./radio`
  (source `src/selection/radio/`) and `./radio-group` (`src/selection/radio-group/`).
  `Radio` is a **Server Component** shell (no directive on the view or barrel) over
  a native `<input type="radio">`, styled exactly like the checkbox (invisible
  input = 48dp target, priority chains of locals, `group/selection-field` label
  row). Its SVG is Compose's geometry: ring `r=9` stroked 2, dot `r=5` scaled by
  `--_dot` (0/1). Motion: dot **enters** on `--_spatial-fast` (Expressive fast
  spatial 0.6/800, `FAST_SPATIAL` in `config.ts`, 348ms, overshoots) and **exits**
  on the same spring clamped at its zero-crossing (98ms) so `scale()` never goes
  negative; colors on `--_fx` (212ms). The native input is a **client island**,
  `radio/radio-input.tsx` (own internal `tsdown` entry), which reads the optional
  `RadioGroupContext` (`radio-group/radio-group-context.ts`, `"use client"`, also its
  own internal entry so both bundles share **one** context instance) for `name`,
  controlled `value`, `defaultValue`, `required`, `form` and `onValueChange`.
  `RadioGroup` is a **client component** (directive on view + barrel): a
  `<fieldset role="radiogroup">` with `<legend>`, supporting text, `aria-required` /
  `aria-invalid`. **Visual group defaults travel by CSS, not context**, so the
  server shell sees them: the group sets inherited locals `--_rg-accent` (color),
  `--_rg-lp` (label side), `--_rg-dir` (orientation) and `--_rg-inset`; radios
  fall back to them (`--_accent-own` / `--_lp` win); group error is the ancestor
  selector `[data-slot=radio-group][aria-invalid=true]`. Keyboard is the
  browser's native radio behavior (= APG + MD3) — never add roving tabindex or key
  handlers, never set `aria-checked`.
- **Switch lives in the selection family too.** Published subpath: `./switch`
  (source `src/selection/switch/`). A **Server Component** (no directive on the view
  or barrel) over a native `<input type="checkbox" role="switch">` (APG / Material
  Web). Never set `aria-checked` on it. Geometry is Compose's `SwitchTokens`: a
  52×32dp track with a 2dp outline, and a handle of 16dp (off), 24dp (on or with an
  icon) or 28dp (pressed). The handle's **centre** only ever sits at `th/2` or
  `tw − th/2` (derived from the track tokens). The 40dp state-layer disc and the
  ripple ride with it via a logical `inset-inline-start` (`--_x`), so RTL needs no
  sign math. Don't use `*var(--_…)` in arbitrary values: Tailwind's math normalizer
  rewrites it as `var(-- …)`. Motion follows Compose's `ThumbNode`: position and
  size share the Expressive **fast-spatial** spring (`FAST_SPATIAL`, 348ms), a press
  **snaps** to 28dp (`--_hd-press: 0s`), colors fade over 67ms linear and icons over
  33ms (Material Web), and a lone check rotates in from −45°. Press sources
  (`:active`, `data-pressed`, `group-active/selection-field`) each set the same
  locals, and disabled resets `--_hs-press` to `initial`. Props: `icons`
  (`false` / `"selected"` / `true`, a cva variant), `selectedIcon` /
  `unselectedIcon`, `onCheckedChange` (wraps `onChange` only when passed, so the RSC
  path has no function prop), `label` / `supportingText` / `labelPosition`
  (default `start`), `color`, `controlClassName`. There is no `error` state (MD3
  defines none). Client islands: the shared `ripple` (centred, following the
  handle) and `switch/switch-interaction.tsx` (own internal `tsdown` entry). The
  interaction island self-attaches to its parent and adds Enter-to-toggle, a
  `data-pressed` for touch and Space, and **drag**. While dragging it sets
  `--_drag-x` and `data-dragging`. On release it lands by fling velocity or the
  nearer half, swallows the browser's follow-up click in a window capture listener,
  and toggles with one real `input.click()` only if the side changed. Never add key
  or drag handlers elsewhere.
- **Slider family lives in `src/sliders/`.** Published subpath: `./slider` (source
  `src/sliders/slider/`), shipping `Slider` (default) **and** `RangeSlider`. A
  **client component**: `"use client"` on `slider.tsx`, `range-slider.tsx`,
  `slider-root.tsx`, `use-logic.ts` and the `index.tsx` barrel (one `tsdown` entry,
  no internal islands). Both wrappers map their public value shape onto the
  internal `SliderRoot` (arrays + `mode` `standard` / `centered` / `range`), whose
  `useLogic` owns state, pointer (nearest handle, grab-without-jump, touch slop),
  APG + MD3 keyboard (Shift / Space + arrows, Page, Home / End), form reset and a
  `ResizeObserver` measurement. Pure math (snapping, stops, formatting, Compose's
  `drawTrack` layout) is `slider-math.ts` — keep it React-free. Sizes / geometry /
  springs / color roles are in `src/sliders/config.ts` (MD3 spec table + MDC
  `m3_comp_slider_*` tokens). **One layout for both orientations:** vertical sets
  `writing-mode: vertical-lr; direction: rtl` on the root and every part uses
  **logical** properties only — never add physical `left`/`top`/`translate` to the
  track parts. Positions are CSS: the view sets `--_f<i>` / `--_k<i>` inline and
  the root derives `--_c<i>`; segments read `--_a` / `--_b` strings built in
  `computeLayout`. Each handle is a hidden native `<input type="range">` (keeps
  iOS VoiceOver / TalkBack adjustable) — don't swap it for `role="slider"`.
  Same Tailwind caveat as the switch: write `_*_var(--_…)`, never `*var(--_…)`.
- **Card family lives in `src/cards/`.** Published subpath: `./card` (source
  `src/cards/card/`): the MD3 card **and its parts** on one subpath — `Card`
  (default) + `CardMedia`, `CardHeader`, `CardContent`, `CardHeadline`,
  `CardSubhead`, `CardSupportingText`, `CardActions`, `CardPrimaryAction` (one
  component per file in the same directory, all prop types in `card.types.ts`, all
  cva/class fragments in `card.variants.ts`; `card-check.tsx` is the internal check
  icon). **All Server Components** (no directive anywhere); the only client piece is
  the shared `../../buttons/ripple`. Tokens are the Compose `*CardTokens` /
  Material Web v34 values (variants elevated / filled _(default)_ / outlined,
  per-state elevations, `on-surface` state layer, 3dp `secondary` focus indicator),
  plus MDC-Android's **checked** card for `selected` and the M3 Expressive corner
  scale for `shape`. Every state is CSS through **priority chains of `--_c-*`
  locals** (`src/cards/config.ts`), set from attributes and pseudo-classes. The card
  reacts to `[data-interactive]` (auto-detected `asChild` `<a>`/`<button>`/`<label>`
  or the `interactive` prop), a stretched `[data-slot=card-primary-action]` via
  `:has()`, a direct `>input` (`<label>` cards: `:checked`, `:focus-visible`,
  `:disabled`), `data-dragged`, `data-selected` and `data-disabled`. Locals are
  `--_c-` prefixed (they must never collide with nested controls' `--_sl-*`), and
  `RESET` re-initialises every conditional local so nested cards start at rest. The
  state layer (`::before`) and outline (`::after`) sit **above** content
  (`z-[1]`, pointer-transparent), and the ripple too (`CARD_RIPPLE`). Decorations
  (ripple, check) render **first** and are `aria-hidden`, so full-bleed
  `CardMedia` finds its edges with `:nth-child(1 of :not([aria-hidden=true],input))`
  / `:last-child` under a **direct** `[data-slot=card][data-orientation=…]` parent.
  `CardPrimaryAction` must stay **unpositioned** with a z-index-less `::after`, so
  positioned controls later in the DOM paint above it. Never set `aria-checked`, and
  never add hover/ripple to container cards (MD3).
- **Overlay family lives in `src/overlays/`.** Published subpath: `./tooltip`
  (source `src/overlays/tooltip/`): `Tooltip` (default) + `TooltipProvider` +
  `TooltipAction`, the MD3 **plain** and **rich** tooltip. A **client component**
  (directive on the view, the entry barrel, `use-logic.ts`, `tooltip-context.ts`
  and `tooltip-provider.tsx`). It wraps one anchor through `Slot` and portals the
  tooltip only while shown. The family's **shared foundation** is built for future
  menus / selects / popovers / dialogs; reuse it, don't fork it:
  `config.ts` (Expressive `MOTION` locals `--_ov-*`, the top-layer `POSITIONER`
  reset, the `HOVER_BRIDGE`, the animated `POPUP` wrapper), `placement.ts`
  (logical `side` / `align` incl. `before` / `after` → Floating UI placements),
  `position.ts` (`positionOverlay`: `@floating-ui/dom` `offset` / `flip` / `shift`
  / `hide`, writes `translate`, `data-side` / `data-align`, `--_ov-origin`,
  `--_ov-gap`, `data-anchor-hidden` and places a caret **straight to the DOM**, no
  React state), `use-position.ts` (`autoUpdate` + `showInTopLayer`), `top-layer.ts`
  (native `popover="manual"` top layer; `getOverlayRoot` = open `<dialog>` ›
  fullscreen element › shadow root › `<body>`), `use-presence.ts` (mount → place →
  `data-state="open"` → exit transitions → unmount, no `@starting-style`),
  `dismiss.ts` (one global **Escape stack**, `preventDefault` so a parent
  `<dialog>` stays open; capture-phase outside press), `focus.ts` (tabbables,
  `getTabbableAfter` for non-modal Tab hand-off) and `describe.ts` (hidden
  `aria-describedby` node, AriaDescriber-style). Tooltip behavior lives in the
  framework-free `tooltip-controller.ts` (DOM listeners reading the latest props
  through a ref; hover / focus-visible / touch long-press / persistent click /
  Escape / outside / focus-outside / action), `tooltip-manager.ts` (one transient
  tooltip at a time + `skipDelay` warmth) and `tooltip-context.ts`
  (`TOOLTIP_TIMING` = MD3's 500 / 1500 / 300 / 500 / 1500ms). Tokens: Material
  Web's `--md-comp-plain-tooltip-*` / `--md-comp-rich-tooltip-*`, plus
  `--md-comp-tooltip-caret-*` and the shared `--md-comp-overlay-*`. Never add a
  `z-index` scale, a second portal mechanism or per-overlay Escape listeners;
  never put `aria-describedby` / `aria-label` on the anchor by hand inside the
  component (the view merges the consumer's `aria-describedby`).
  Second published subpath: `./rich-tooltip` (source
  `src/overlays/rich-tooltip/`): `RichTooltip` (default) + `RichTooltipTrigger`,
  `RichTooltipContent`, `RichTooltipSubhead`, `RichTooltipSupportingText`,
  `RichTooltipActions`, `RichTooltipAction`, `useRichTooltip`,
  `useRichTooltipState`: MD3's rich tooltip with button actions as **composable
  parts** (plus a shorthand: `supportingText` / `subhead` / `actions` props). A
  **client component**: the directive sits on every view, `use-logic.ts`,
  `use-rich-tooltip-state.ts`, `rich-tooltip-context.ts` and the entry barrel
  (`scan.ts`, `*.types.ts`, `*.variants.ts` are pure). It **reuses** the tooltip's
  `tooltip-controller.ts` (which grew `manual` = code-only and `held` = ignore
  soft dismissals while an async action runs), `tooltip-manager.ts`,
  `tooltip-context.ts` (timing / `TooltipProvider`) and `tooltip-caret.tsx`, and
  the shared foundation, which grew `position.ts` `step` (MD3's 8dp dynamic
  positioning; virtual `ReferenceElement` anchors) and `announce.ts` (a shared
  polite / assertive live region per overlay root). The root holds the logic and
  a context; parts register themselves (subhead / text ids for
  `aria-labelledby` / `-describedby`, `registerInteractive` for runtime-detected
  controls), and `scan.ts` detects controls statically so the trigger's
  `aria-haspopup` is right before the first open. The surface's bottom padding
  switches with CSS `:has([data-slot=rich-tooltip-actions])`, not state.
  `RichTooltipAction` is `Button` with `data-tooltip-keep-open` (it closes the
  tooltip itself, after any returned promise, via the context). Tokens: the
  **same** `--md-comp-rich-tooltip-*` as `Tooltip`. Keep `Tooltip variant="rich"`
  working; don't fork the controller or positioning for the rich tooltip.
- **Text-field family lives in `src/text-fields/`.** Published subpath:
  `./text-field` (source `src/text-fields/text-field/`): the MD3 **filled** /
  **outlined** text field (single-line `<input>`, growing multi-line or fixed
  text area `<textarea>` via `multiline` + `minRows`/`maxRows`/`rows`). A
  **Server Component** (no directive on the view or barrel) over the native
  control. **Every state is CSS** derived on the root (`group/text-field`) with
  `:has()` on `[data-slot=text-field-input]` / `[data-slot=text-field-field]`:
  floated (`:focus-within`, `:not(:placeholder-shown)` — the view **always**
  renders a placeholder, `" "` by default, so keep that — `:autofill`,
  `[data-float]`), error (`[aria-invalid=true]` / `:user-invalid`, unless
  `[data-error=false]`), disabled (`:disabled`), hover. Painted roles resolve
  through **priority chains of locals** (disabled › error-hover › error › focus ›
  hover › rest) like the selection family, and the label's geometry is
  `rest + --_f × (floated − rest)` with `--_f` ∈ {0, 1}, so one selector moves
  top / inset-inline-start / max-width / font-size / line-height /
  letter-spacing, each transitioning on the Expressive fast-spatial spring
  (Compose lerps the text style, so the label really resizes). The outlined
  notch is Material Web's CSS-only start / notch / end segments, sized by an
  invisible floated-label copy; the end segment overlaps the notch by 1px to
  hide the sub-pixel seam. In arbitrary values always write `_+_` / `_-_` /
  `_*_` (Tailwind rewrites `+var(--_x)` / `*var(--_x)` as `var(-- x)`). The one
  client island is `text-field-interaction.tsx` (own internal `tsdown` entry, no
  `exports` subpath): container click-to-focus, clear button + Escape (native
  value setter + `input` event so React's `onChange` fires), password toggle
  (flips `type`, relabels, re-hides on submit / reset), the uncontrolled
  counter and the `field-sizing` auto-grow fallback; it is imperative (no React
  state) and self-attaches to the container like `ripple`. The clear / password
  buttons are the shared `IconButton` (server-rendered). Shared motion
  (`MOTION`: fast spatial / fast effects / slow effects springs as `linear()`)
  and `ALWAYS_FLOAT_TYPES` live in `src/text-fields/config.ts`; the inline SVG
  glyphs (`text-field-*-icon.tsx`) keep `@chatool/ui` independent of
  `@chatool/icons`. Tokens: `--md-comp-text-field-*` (one prefix for both
  variants). Never add key handlers or state to the view, never set
  `aria-describedby` for its own texts by hand, and keep `role="alert"` keyed to
  `error` so it re-announces.
- **Chip family lives in `src/chips/`.** Published subpaths: `./chip` (source
  `src/chips/chip/`) and `./chip-set` (`src/chips/chip-set/`). `Chip` is the MD3
  assist / filter / input / suggestion chip (one `variant` axis) with M3
  Expressive shape morph by default (`expressive`: 12dp rest → half-height pill
  when selected → 8dp pressed, from Compose `ChipsTokens` v37, on the fast-spatial
  spring; `false` = baseline static 8dp). It is a **Server Component shell** (no
  directive on the view or barrel): a `<span data-slot=chip>` container plus the
  server-rendered leading slot (icon / avatar / checkmark / spinner), label and
  trailing icon. Every state is CSS through **priority chains of `--_ch-*`
  locals** in `src/chips/config.ts`, keyed off container attributes
  (`data-variant`, `data-elevated`, `data-expressive`, `data-leading`,
  `data-trailing`, `data-dragged`, `data-loading`) and `:has(>…)` on the actions'
  `data-selected` / `data-disabled` / `:hover` / `:focus-visible` / `:active`.
  Geometry is Compose's `Chip.kt` math (8dp content padding + 8dp element
  spacing, input 4dp; Expressive filter / input use 4dp compact spacing); the
  checkmark is revealed by the leading slot's width + margin springing (no
  `@property`). The actions are ONE client island, `chip/chip-actions.tsx` (own
  internal `tsdown` entry): primary `<button>` / `<a>` / `Slot` / remove-only
  `<span>` + the remove `<button>`, `aria-pressed`, uncontrolled
  `defaultSelected`, ←/→ between primary ⇄ remove, Backspace / Delete removal.
  **It must not import `config.ts` or `chip.variants.ts` at runtime** (the view
  passes class strings in `classes`), or the bundler hoists them into a shared
  chunk and the boundary breaks. `ChipSet` is a **client component** (directive
  on view + barrel + `use-logic.ts`): `role="toolbar"` with a DOM-driven roving
  tabindex (MutationObserver; `tabindex` itself isn't observed), APG toolbar keys
  (←/→ walk every action, Home / End, `loop`), selection (`selectionMode`
  single / multiple, controlled or not, `required`, hidden inputs for `name`),
  `onRemove(value)` and `layout` wrap / scroll. `chip-set/chip-set-context.ts`
  (`"use client"`, own internal entry) holds the context **and** the shared DOM
  helpers (`getChipEntry`, `removeChip` focus hand-off, …) so both client chunks
  share one instance. Never set `aria-checked` / roles on chips by hand, never add
  key handlers outside the island / set, and never call `preventDefault()` on a
  removal key **before** running `onRemove` (it cancels the set's `onRemove`).
- **Tabs family lives in `src/tabs/`.** Published subpath: `./tabs` (source
  `src/tabs/tabs/`), shipping `Tabs` (default) + `TabList`, `Tab`, `TabPanels`,
  `TabPanel` — the MD3 primary / secondary tabs with M3 Expressive motion. A
  **client component**: `"use client"` on every view, `use-logic.ts`,
  `use-tab-list.ts`, `use-tab-panels.ts`, `tabs-context.ts`, `tabs-motion.ts` and
  the `index.tsx` barrel (one `tsdown` entry, no internal islands; the shared
  `ripple`, `IconButton` and `Badge` are imported from their families and stay in
  directive-free shared chunks). Geometry / color roles / springs live in
  `src/tabs/config.ts` (Compose `{Primary,Secondary}NavigationTabTokens`, Material
  Web v34, MDC-Android `Widget.Material3.TabLayout`). **Variant roles are
  inherited locals** set on the tab list (`--_tb-active`, `--_tb-sel-state`,
  `--_tb-press-state`, `--_ti-h` / `--_ti-r` / `--_ti-in`), so a tab paints itself
  from CSS; colors and the state layer are priority chains of `--_tb-*` locals.
  **Every tab renders its own indicator** (`data-slot=tab-indicator`, inside the
  content box for primary — `static` content box for secondary so it spans the
  tab); only the selected one is visible, so the first paint is right without JS.
  Motion is imperative in `tabs-motion.ts`: on a selection change `use-tab-list`
  reads the old indicator's live box and animates the new one's **edge offsets**
  (`--chatool-tabs-indicator-start` / `-end`, registered `<length>` properties)
  with WAAPI — leading edge on default spatial, trailing on slow spatial
  (`elastic`), both default spatial (`slide`), or opacity (`fade` / reduced
  motion). Never animate the indicator with `transform: scale` (it distorts the
  3dp corners) or move it with React state. Scrollable rows and the swipeable
  pager scroll with `springScrollBy` (Compose's default-spatial spring via rAF;
  the pager pauses `scroll-snap-type` while driving). Swipe → indicator goes
  through the `TabsSwipeBus` in context (no re-render per frame). The keyboard is
  APG tabs (manual activation default), one Tab stop = focused › selected ›
  first enabled tab via `tabIndex` from context; never add key handlers, roles,
  `aria-selected` or `tabIndex` elsewhere.
- **Snackbar family lives in `src/snackbars/`.** Published subpath:
  `./snackbar` (source `src/snackbars/snackbar/`), shipping `Snackbar` (default,
  the surface = Compose's `Snackbar(…)`), `SnackbarHost`, `SnackbarAction`,
  `SnackbarDismissAction`, the imperative `snackbar()` function,
  `createSnackbarQueue` and `useSnackbar`. A **client component**: `"use client"`
  on every view, hook, `snackbar-context.ts` and the `index.tsx` barrel (one
  `tsdown` entry, no internal islands; `Button` / `IconButton` / `Tooltip`, the
  overlay `MOTION`, `usePresence` and `showInTopLayer` are reused from their
  families). `snackbar-queue.ts` is a **framework-free store** (Compose's
  `SnackbarHostState` + MDC's `SnackbarManager`): immutable snapshots for
  `useSyncExternalStore`, one `current` + FIFO `pending`, same `id` updates in
  place (`version` bump restarts the timer), `key` is per appearance (the React
  key), `replace` / `strategy` swaps, results settle a promise once. Never put
  timers or DOM in the queue: the **timer lives in `use-item-logic.ts`** (pauses on
  hover / focus / swipe / host focus loss; an action ⇒ `"indefinite"`, which also
  defaults the ✕ on). `use-host-logic.ts` owns the leaving-items list (so a
  replacement crossfades in one grid cell), the separate **live region** (text
  set `ANNOUNCE_DELAY` after the change, read from the rendered DOM), the hotkey,
  the anchor offset (`--_sb-anchor`, re-measured on resize / scroll / the anchor's
  `transitionend` / every new snackbar, since a ResizeObserver misses
  transforms), the top layer and the modal-`<dialog>` portal. `swipe.ts` is the
  framework-free MDC `SwipeDismissBehavior` port (writes `translate` / `opacity`
  inline, clamps disallowed directions, swallows the click after a drag).
  `use-logic.ts` resolves `actionOnNewLine="auto"` (MDC: compact + wrapping +
  action > 128dp) against the **inline** geometry so it can't oscillate. Numbers
  live in `src/snackbars/config.ts` (`TIMING`, `SWIPE`, `ANNOUNCE_DELAY`,
  `INLINE_ACTION_MAX_WIDTH`, `DEFAULT_HOTKEY`); classes in `snackbar.variants.ts`
  (the 48 / 68dp heights fall out of 14dp text padding — keep it). Width is a
  **container query** on the host (`@container`, `@min-[600px]:`), so `contained`
  hosts respond to their pane. Never move focus to a snackbar on show, never add
  `aria-live` to the surface (the announcer does it), never render two hosts on
  one queue.
- **Shared family config lives in one file, `src/buttons/config.ts`** (the XS–XL
  size scale, the shape/press-morph corners, and the class fragments — base /
  state layer / focus ring / disabled), plus `src/buttons/spinner.tsx` (the loading
  spinner). tsdown inlines them per entry — they are **not** subpaths. Reuse them;
  don't duplicate the styling wiring.
- **Follow the MD3 spec; style with tokens, never raw hex.** Button **color is
  fixed per style** (no `color` prop) — each `variant` sets the painted role local
  vars (`--_bg` / `--_fg` / `--_state`) directly from the fixed `--md-sys-*` roles;
  painted roles read a `--md-comp-button-*` token with a `--md-sys-*` fallback so
  apps can re-theme. Canonical spec:
  [docs/conventions/material-design.md](../../docs/conventions/material-design.md).
- **Accessibility (WAI-ARIA APG button pattern).** Render a native `<button>`;
  default `type="button"` so forms don't submit by accident; names come from text
  content (an **icon-only** button **must** set `aria-label`); pass `aria-*` through
  (`aria-pressed` for toggles — keep the label constant; `aria-haspopup` /
  `aria-expanded` for menus); `loading` is non-actionable + `aria-busy`; for
  `asChild` require a natively interactive child. Canonical spec:
  [docs/conventions/accessibility.md](../../docs/conventions/accessibility.md).
- **Adding a component also needs a Storybook story** in
  [`apps/storybook`](../../apps/storybook) (stories don't auto-discover new
  subpaths) — run the `/sync-storybook` skill.
- Component bodies are scaffolds; replacing them with the real landing-repo
  sources must preserve the directives and the exports map.
