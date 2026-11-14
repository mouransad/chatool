# Accessibility

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Accessibility**

`@chatool/ui` components follow the **[W3C WAI-ARIA Authoring Practices Guide
(APG)](https://www.w3.org/WAI/ARIA/apg/patterns/)** patterns. This page is the
single source of truth for the a11y rules every component must honor and the
responsibilities it leaves to the consumer. **AI agents and humans: follow these
when building or changing any component.**

The guiding rule from the APG: **prefer native semantic HTML.** A native element
gives you the role, keyboard behavior, and focus management for free — reach for
ARIA only to fill a genuine gap, because "[no ARIA is better than bad
ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)."

## Button — [APG button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

What `@chatool/ui/button` guarantees:

- **Native `<button>`.** Provides `role="button"`, Tab focusability, and
  **Space + Enter** activation with no JS.
- **`type="button"` by default.** HTML defaults a button to `type="submit"`, which
  silently submits any enclosing `<form>`. The component defaults to `"button"`;
  pass `type="submit"` explicitly when that's the intent.
- **Disabled / loading conveyed to assistive tech.** A disabled button uses native
  `disabled` (or `aria-disabled` in the `asChild` path); a **loading** button sets
  `aria-busy` and is **non-actionable** by mouse _and_ keyboard while keeping its
  color + spinner.
- **`aria-*` pass through** via `{...props}` — `aria-pressed`, `aria-haspopup`,
  `aria-expanded`, `aria-controls`, `aria-describedby`, `aria-label` /
  `aria-labelledby`.

What the **consumer** is responsible for:

- **Accessible name.** Comes from visible text content. An **icon-only** button
  (no text) has _no_ accessible name — you **must** pass `aria-label` (or
  `aria-labelledby`):
  ```tsx
  <Button aria-label="Close" startIcon={<CloseOutlined />} />
  ```
- **Toggle buttons** — set `aria-pressed={true|false}` and **keep the label
  constant** when it flips (don't swap "Mute" ⇄ "Unmute"; that defeats
  `aria-pressed`). The label being stable is what makes the state, not the text, the
  source of truth.
- **Menu / disclosure buttons** — set `aria-haspopup` (`"menu"` / `true`) and
  `aria-expanded`, plus `aria-controls` pointing at the popup.
- **`asChild`** renders _your_ element through Radix `Slot`. Pass a **natively
  interactive** element (`<a href>`, `<button>`) so you keep role + keyboard for
  free. A non-interactive element (`<div>`, `<span>`) is **not** a button — per the
  APG you must add `role="button"`, `tabindex="0"`, and **Enter + Space** key
  handling yourself. Prefer the native element instead.

## Loading & progress indicators

What `@chatool/ui/loading-indicator`, `/linear-progress` and `/circular-progress`
guarantee:

- **`role="progressbar"`**, with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
  when determinate. They're omitted when indeterminate, which is how it's announced.
- **`prefers-reduced-motion`** is honored live: morphs, waves and rotation stop, and
  indeterminate indicators pulse their opacity so they still read as active.

What the **consumer** is responsible for:

- **Accessible name.** Pass `aria-label` or `aria-labelledby` naming the process and
  the content ("Loading news article"). The fallback is a generic "Loading".
- **3:1 contrast** for the active indicator. Inside a component, use
  `color="inherit"`, and `track={false}` on `CircularProgress`.
- **The stop indicator** on `LinearProgress` may only be removed (`stop={false}`) if
  the track has 3:1 contrast with its surroundings.

## Dividers

MD3 treats dividers as **decorative**. What `@chatool/ui/divider` guarantees:

- **Decorative by default** (`role="none"`), so assistive tech skips the line; a
  label stays readable plain text, and the lines are pseudo-elements.
- **`decorative={false}`** exposes a real separator: a native `<hr>` for the plain
  horizontal case, otherwise `role="separator"` (+ `aria-orientation="vertical"`).
  A string label becomes its `aria-label`, since a separator's children are
  presentational.
- Never focusable. A draggable splitter is the APG window-splitter pattern, a
  different component.

What the **consumer** is responsible for:

- **Choosing the semantics.** Keep the default between list rows and inside cards;
  use `decorative={false}` for a topic change in prose and between groups in a
  `role="menu"`.
- **Valid markup.** In `<ul>` / `<ol>` / `role="menu"`, render it as an `<li>` with
  `asChild`.
- **Contrast**, when a divider is the only cue for a boundary that matters: switch
  `--md-comp-divider-color` to `outline` (3:1).

## Badges

MD3 reads a badge **after** its destination: a count reads its number, a dot
reads "New notification". What `@chatool/ui/badge` guarantees:

- The visible glyphs (`999+`) are `aria-hidden`; a visually hidden span carries the
  full value (`"1500"`) or "New notification". Plain text, no role, no live region.
- `invisible` (and a hidden `0`) removes it from the accessibility tree; `label=""`
  makes it decorative.
- Never focusable; when anchored it ignores the pointer so the anchor gets clicks.
- Under `forced-colors: active` it paints itself `CanvasText` / `Canvas` instead of
  vanishing.
- Its motion respects `prefers-reduced-motion` (fade only).

What the **consumer** is responsible for:

- **Ordering the announcement.** An anchor named by `aria-label` ignores its
  content: wire `aria-describedby` to the badge's `id`, or put the count in the
  label. On navigation items whose text follows the icon, put the count in the
  item's `aria-label` and pass `label=""`.
- **Localizing** `label` (`locale` only changes digits).
- **Announcing arrivals** that matter through a separate `role="status"` region.
- **Contrast** of at least 3:1 if you change the default `error` colors.

## Checkbox — [APG checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)

What `@chatool/ui/checkbox` guarantees:

- **Native `<input type="checkbox">`.** Role `checkbox`, Tab focus, **Space**
  toggles, form participation and constraint validation — all native. The input is
  invisible but covers the 48dp touch target.
- **Mixed state via the native `indeterminate` property**, never `aria-checked`
  (ARIA in HTML forbids it on a native checkbox). The dash is server-rendered and a
  client island syncs the property after hydration.
- **`label` wraps the box in a `<label>`**, so the text names it and toggles it;
  `supportingText` is wired to `aria-describedby`.
- **Error** sets `aria-invalid="true"`; **disabled** is the native attribute (or a
  disabled `<fieldset>`), so it leaves the tab order.
- `:focus-visible` shows MD3's 3dp `secondary` indicator; `forced-colors` paints
  with system colors; `prefers-reduced-motion` drops the draw/morph.

What the **consumer** is responsible for:

- **Accessible name** for a bare checkbox: `aria-label`, `aria-labelledby`, or a
  `<label htmlFor>`.
- **Grouping:** related checkboxes go in a `<fieldset>` + `<legend>` (or
  `role="group"` + `aria-labelledby`).
- **Tri-state logic:** a parent is checked when all children are, `indeterminate`
  when some are; activating it checks all (or clears all when all are checked).
  `indeterminate` is controlled — update it in `onChange` — and the parent should
  point `aria-controls` at its children.
- **Explain errors** in `supportingText` (or your own `aria-describedby`).

## Radio — [APG radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

What `@chatool/ui/radio` + `@chatool/ui/radio-group` guarantee:

- **Native `<input type="radio">`.** Role `radio`, checked state, form
  participation and `required` validation are native; the input is invisible but
  covers the 48dp touch target.
- **Native keyboard = the APG / MD3 contract.** One Tab stop per same-`name`
  group (the selected radio; else the first, or the last with Shift+Tab); arrow
  keys move focus **and** selection, wrapping, mirrored in RTL; Space selects.
- **`RadioGroup` is a `<fieldset role="radiogroup">`** labelled by its `<legend>`
  (`aria-labelledby`), described by its supporting text, with `aria-required` /
  `aria-invalid` when set; `disabled` is a native disabled fieldset.
- `label` wraps a radio in a `<label>`; `supportingText` → `aria-describedby`.
  Never `aria-checked` on the native input.
- `:focus-visible` shows MD3's 3dp `secondary` indicator; `forced-colors` paints
  system colors; `prefers-reduced-motion` snaps the dot (colors still fade).

What the **consumer** is responsible for:

- **A group name**: `RadioGroup` `label` (or `aria-label` / `aria-labelledby`); without
  `RadioGroup`, a `role="radiogroup"` container or `<fieldset>` + `<legend>`.
- **A label per radio** (`label`, `aria-label`, `aria-labelledby` or `<label htmlFor>`)
  and a distinct `value`.
- **A way out:** a radio can't be cleared by the user, so add a "None" option or a
  "Clear selection" action when opting out is allowed.
- **Explain errors** in the group's `supportingText`.

## Switch — [APG switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)

What `@chatool/ui/switch` guarantees:

- **Native `<input type="checkbox" role="switch">`.** It is announced as a switch
  that is "on" / "off" from the native `checked` state, never `aria-checked`. Form
  participation and `required` are native. The input is invisible but covers the
  48dp touch target.
- **Keyboard:** Tab focuses it, and **Space or Enter** toggles it (MD3 requires
  both; APG makes Enter optional). Enter never submits the surrounding form.
- **Pointer:** tap, click or **drag** the handle (MD3: "Touch: Tap, Drag"). A
  vertical swipe still scrolls the page.
- `label` wraps the switch in a `<label>`; `supportingText` → `aria-describedby`.
- `:focus-visible` shows MD3's 3dp `secondary` indicator around the track;
  `forced-colors` paints system colors; `prefers-reduced-motion` snaps the handle
  (colors still fade).

What the **consumer** is responsible for:

- **A name that doesn't change with the state** (APG): `label`, `aria-label`,
  `aria-labelledby` or `<label htmlFor>`. Describe what the switch turns **on**, and
  make ambiguous text more descriptive ("Photo album access", not "Photo album").
- **Immediate effect.** A switch applies its setting at once. If changes wait for a
  Save button, use checkboxes instead.
- **Grouping:** related switches go in a `<fieldset>` + `<legend>`.

## Cards

MD3: a card is **either** a non-actionable container that holds actions **or**
directly actionable with no actions inside. Never put an action on an actionable
surface. There is no APG card pattern; `@chatool/ui/card` uses the
established block-link technique. What it guarantees:

- **Container cards** (default `<div>`) have no role, no tab stop, no hover and
  no ripple; their controls are the tab stops, in reading order.
- **Directly actionable cards** are one tab stop with the `link` / `button` role:
  `<Card asChild>` on an `<a>` / `<button>` / `<label>` (auto-detected), or, for
  rich content, a **`CardPrimaryAction`** (a real link/button, usually the
  headline text) whose `::after` stretches over the card. Its accessible name is
  just its own text; headings and images keep their semantics; positioned
  controls later in the DOM stay clickable above it. The card draws the 3dp
  `secondary` focus indicator.
- **Selection** only through real semantics: `aria-pressed` on a `<button>` card
  or toggle action, or a native checkbox/radio inside a `<label>` card. The check
  icon is `aria-hidden`.
- **Disabled:** native `disabled` on `<button>` cards, `aria-disabled` on other
  actionable cards, `inert` on container cards.
- `forced-colors` keeps a visible boundary on every variant;
  `prefers-reduced-motion` drops the spatial motion.

What the **consumer** is responsible for:

- **Don't wrap rich content in `<a>` / `<button>`.** Use `CardPrimaryAction`.
  Only short, phrasing-only cards may be the control themselves.
- **Heading level** (`CardHeadline` is an `<h3>`; change it with `asChild`), and
  MD3's reading order: heading → image → body → actions (`CardMedia
placement="first"` shows the image on top).
- **Collections as lists** (`<ul>` + `<Card asChild><li>`); `alt=""` for
  decorative images, real alt text for informative ones.
- **Own controls inside a stretched card** must be positioned (`relative`).
- **Drag / swipe** needs a single-pointer alternative, such as a menu.

## Tooltip — [APG tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)

What `@chatool/ui/tooltip` guarantees (APG + MD3 + WCAG 1.4.13):

- **`role="tooltip"`**, describing its anchor through `aria-describedby`. String
  content is referenced from a hidden node from the first render, so screen
  readers (touch ones too, which never hover) read it on focus; rich content is
  referenced while open. `relationship="label"` names the anchor (`aria-label`)
  instead. A description that repeats the anchor's own `aria-label` is skipped.
- **Shows on hover, keyboard focus (`:focus-visible`) and touch long-press**; a
  long-press doesn't activate the anchor. **Escape** dismisses without moving
  focus (one layer per press); blur hides it.
- **Hoverable, persistent, dismissible** (WCAG 1.4.13): the pointer can move onto
  it, it lingers 1.5s after the pointer leaves, and never closes from under
  keyboard focus. One tooltip at a time.
- **Interactive tooltips** (actions / `persistent`) are a non-modal
  `role="dialog"` with `aria-haspopup` / `aria-expanded` / `aria-controls` on the
  anchor. Tab moves into them and on to the page; focus is never trapped and
  returns to the anchor when they close with focus inside.
- `forced-colors` keeps a visible outline; `prefers-reduced-motion` keeps only the
  fade.

What the **consumer** is responsible for:

- **A focusable anchor** (button, link, input) — never a bare `<span>` or icon.
- **A name** for icon-only anchors: `aria-label`, or `relationship="label"`.
- **Nothing essential** in a tooltip, and never the only way to perform an action
  (MD3: use a dialog for critical information).
- A **subhead** for persistent tooltips that open on their own (`defaultOpen`).

`@chatool/ui/rich-tooltip` (`RichTooltip` + parts) keeps every guarantee above
and adds:

- **Tooltip or non-modal dialog, detected.** Controls (actions, links, form
  controls) or a `click` / `manual` trigger make it a `dialog` labelled by the
  subhead (else the text) and described by the text; detection runs statically
  (trigger ARIA correct before the first open) and at runtime; `interactive`
  overrides it.
- **MD3 focus order** trigger → inline links → text buttons, untrapped; an
  action returns focus to the trigger.
- **Live-region announcement** (polite) when it appears without the user asking
  at its trigger (page load, code, click, long-press); `announce` tunes it.
- **Async actions** expose `aria-busy` and hold the tooltip open until done.

## Text field

There is no APG textbox pattern: `@chatool/ui/text-field` renders the **native**
`<input>` / `<textarea>` and layers MD3's text-field accessibility spec on top.
What it guarantees:

- **Name** from a real `<label for>` (inside, or above with
  `labelPosition="above"`), including MD3's required asterisk; clicking the label
  or anywhere on the container focuses the field.
- **Description** via `aria-describedby`: the consumer's ids, prefix, suffix,
  supporting / error text (only the visible one is read) and the counter, spoken
  as "n of max characters" (the visual `n/max` is `aria-hidden`).
- **Errors:** `error` sets `aria-invalid`; `errorText` replaces the supporting
  text and is announced with `role="alert"` when `error` turns on (re-mounted so
  it re-announces). Native constraint failures style as errors after interaction
  (`:user-invalid`). The error icon is `role="img"` "Error" — the non-color cue.
- **Built-in controls:** the clear button is out of the Tab order (Escape clears,
  `preventDefault`ed so a parent `<dialog>` stays open); the password toggle is a
  focusable button whose name flips "Show password" / "Hide password" (so no
  `aria-pressed`). All strings are localizable (`labels`).
- `forced-colors` keeps the indicator / outline (borders) and greys disabled
  parts; `prefers-reduced-motion` drops the label movement.

What the **consumer** is responsible for:

- A **label** on every field, or `aria-label` / `aria-labelledby` when an
  adjacent label names it. Never a placeholder as the only label.
- A **spoken form** for symbolic prefixes / suffixes (`sr-only` text) and names
  for any icon buttons passed as `leadingIcon` / `trailingIcon`.
- **Explaining the asterisk** once, and error text that says how to fix the
  problem.

## Focus & motion

- **Focus visibility.** Components show a visible focus ring on
  `:focus-visible` (MD3 focus indicator); never remove focus outlines without an
  equivalent visible replacement.
- **Reduced motion.** The press ripple / shape-morph are short, non-essential
  affordances. When adding new motion, respect `prefers-reduced-motion` for any
  large or looping animation.

## Checklist when adding / changing a component

1. Start from the **native element**; only add ARIA to fill a gap.
2. Find the component's **APG pattern** and implement its **keyboard interaction**
   and **roles/states/properties**.
3. Guarantee an **accessible name** path (text, or document the required
   `aria-label`).
4. Make disabled/busy states **perceivable** (`disabled` / `aria-disabled` /
   `aria-busy`) **and** non-actionable.
5. Keep `aria-*` **passing through** so consumers can wire `aria-pressed` /
   `aria-expanded` / etc.
6. Document the consumer's responsibilities in the package README's
   **Accessibility** section.

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)

`@chatool/ui/list` follows MD3's lists accessibility page and the APG **listbox**
pattern for selection lists:

- **Native first.** A plain list is `<ul role="list">`; a row's action is a real
  `<a>` / `<button>` and a selection control a real `<input>` whose `<label>` is
  the whole row (named by its headline + supporting text, as MD3 specifies).
- **Selection lists** are `role="listbox"` (+ `aria-multiselectable`,
  `aria-required`) of `role="option"` + `aria-selected` rows; a control inside an
  option becomes an inert, hidden indicator synced to the selection, because
  options can't contain interactive content.
- **One Tab stop** (roving tabindex), landing on the selected item first; ↑↓←→
  move and wrap (mirrored in RTL), Home / End, Space / Enter activate; listbox
  typeahead, Shift + arrows and Ctrl / ⌘ + A.
- **Reordering** is fully keyboard-operable (grab / move / drop / cancel, Alt +
  ↑↓), handles are described by instructions, and every step is announced.
- **Consumer:** name the list (describe the selection for a listbox), pair the
  selected color with a second cue (a control, a check icon), and keep options
  free of interactive content.
