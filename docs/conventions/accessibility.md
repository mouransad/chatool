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
