---
"@chatool/ui": minor
---

Add `@chatool/ui/snackbar`, the Material 3 snackbar with M3 Expressive motion,
as a full system: the `Snackbar` surface, a `SnackbarHost`, and the imperative
`snackbar()` API.

- **Spec-exact surface** (Compose `SnackbarTokens` / `Snackbar.kt`, MDC-Android):
  `inverse-surface` 4dp container at elevation 3, 48dp single line / 68dp two
  lines, 600dp max width, an `inverse-primary` text-button action, an optional
  48dp ✕ close affordance with a "Dismiss" tooltip, and the action moved to its
  own line automatically (MDC's compact + wrapping + action > 128dp rule) or on
  demand. `maxLines` clamps long text.
- **`snackbar()` from anywhere in client code**, returning a handle whose
  `result` promise settles with why it closed (`"action"`, `"timeout"`,
  `"dismiss"`, `"swipe"`, `"escape"`, `"replaced"`, …), plus `update()` /
  `dismiss()`, `snackbar.promise()` (loading → success / error in place),
  `snackbar.clear()`, `createSnackbarQueue()` for scoped hosts and
  `useSnackbar()`.
- **One at a time** (MD3): a FIFO queue (`strategy="queue"`, Compose) or
  immediate replacement (`"replace"` / `replace: true`, MDC), with the same `id`
  updating in place.
- **Timing**: `short` 4s, `long` 10s, `auto` (reading time clamped to 4–10s),
  ms, `indefinite`; snackbars **with an action never time out** (MD3). Timers
  pause on hover, focus, swipe and a background window.
- **M3 Expressive motion**: scale 0.8 → 1 on the fast-spatial spring with a
  fast-effects fade (Compose's `FadeInFadeOutWithScale`), crossfading
  replacements, fade-only for reduced motion.
- **Swipe to dismiss** ported from MDC's `SwipeDismissBehavior` (start → end by
  default, 50% / fling threshold, 10–60% fade), configurable directions.
- **Placement**: bottom / top, start / center / end on wide layouts, full width,
  `offset`, `anchor` (sits above a FAB or bottom bar and tracks it), `contained`
  in a pane, safe-area aware, the browser top layer, and automatic hand-off into
  an open modal `<dialog>`.
- **Accessibility** (MD3 snackbar accessibility): announced through a polite
  live region (or `assertive`) without moving focus, an `Alt+G` hotkey to reach
  it, Escape to dismiss while focused, focus returned on close, a named
  landmark, and full RTL.
- Customizable through `--md-comp-snackbar-*` tokens, `renderSnackbar`, and
  `className`.
