---
"@chatool/ui": minor
---

Add `@chatool/ui/checkbox`, the Material 3 checkbox with M3 Expressive motion.

- A native `<input type="checkbox">` under an MD3 skin: 18dp box, 2dp corners,
  40dp state layer, 48dp touch target. Forms, `required` validation, `<fieldset
  disabled>`, server actions and assistive tech get the real control, and an
  uncontrolled checkbox works and animates before hydration, with no JavaScript.
- All MD3 states from the token set: unselected, checked, indeterminate, error,
  disabled, plus hover / focus / pressed state layers (pressing previews the next
  state's color) and the 3dp `secondary` focus indicator.
- Expressive motion in CSS, using Compose's Expressive springs: the check draws
  from tip to tip, checked ⇄ indeterminate morphs, colors fade on the effects
  springs, and the mark snaps out after 100ms. Reduced motion keeps only the fades.
- `indeterminate` sets the native mixed state (server-rendered dash plus a small
  client island). `error` also comes from `aria-invalid` or `:user-invalid`.
- An optional built-in `label` row (the text toggles the box and previews its
  state layer), `supportingText` wired to `aria-describedby`, `labelPosition`
  start/end (RTL-aware), `color` primary/secondary/tertiary, and
  `--md-comp-checkbox-*` tokens for colors, geometry and motion.
- Server Component: only the shared ripple and the indeterminate sync run on the
  client. High contrast (`forced-colors`) is supported.

The internal press ripple gains `centered` and `className` options and ignores
presses when its host's native control is disabled.
