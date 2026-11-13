---
"@chatool/ui": minor
---

Add `@chatool/ui/rich-tooltip`: MD3's **rich tooltip with button actions** as a composable component, built on the shared overlay engine (top layer, M3 Expressive motion, the tooltip controller).

- Parts: `RichTooltip`, `RichTooltipTrigger`, `RichTooltipContent`, `RichTooltipSubhead`, `RichTooltipSupportingText`, `RichTooltipActions`, `RichTooltipAction`, each with its own props, `className` and (subhead / text) `asChild`; plus a shorthand (`subhead` / `supportingText` / `actions` props).
- Exact MD3 / Compose measurements and Material Web `--md-comp-rich-tooltip-*` tokens (shared with `Tooltip variant="rich"`), the five MD3 configurations, `elevation` 0–5, `maxWidth`, custom caret size.
- `trigger`: `hover` (transient), `click` (persistent, feature discovery with `defaultOpen`) or `manual` (code only); `useRichTooltipState()` (`show` / `dismiss` / `toggle`, like Compose's `TooltipState`); `useRichTooltip()` for custom parts.
- MD3 placement: bottom-right by default, flips, and shifts in 8dp steps (`positionStep`); `anchor` accepts an element, a ref or a virtual anchor.
- Async actions: return a promise from `RichTooltipAction`'s `onClick` for a spinner and a held-open tooltip that closes on resolve (stays on reject); `closeOnClick`.
- Accessibility: `role="tooltip"` or a non-modal `dialog` (controls detected statically and at runtime), MDC's `aria-haspopup` / `aria-expanded` trigger contract, untrapped focus order (trigger → links → buttons), focus returned after an action, and polite live-region announcements for tooltips that appear on their own.
- Overlay foundation: stepped collision shifts and virtual anchors in the positioner, a shared live-region announcer, and `manual` / `held` modes in the tooltip controller (no behavior change for `Tooltip`).
