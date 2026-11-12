---
"@chatool/ui": minor
---

Add `@chatool/ui/radio` and `@chatool/ui/radio-group`, the Material 3 radio button
with M3 Expressive motion.

- A native `<input type="radio">` under an MD3 skin, with Compose's geometry: a
  20dp ring stroked 2dp, a 10dp dot, a 40dp state layer and a 48dp touch target.
  Forms, `required` validation, `<fieldset disabled>`, server actions and
  assistive tech get the real control. The keyboard is the browser's own, which
  is exactly the APG and MD3 contract: one Tab stop per group, arrow keys that
  move and select with wrap-around (mirrored in RTL), and Space to select.
- Expressive motion in CSS, from Compose's `RadioButton`: the dot springs open on
  the Expressive fast-spatial spring (0.6 / 800, ~9.5% overshoot, 348ms), the
  radio you leave retracts on the same spring cut at its zero-crossing (98ms),
  and colors fade on the default-effects spring. Reduced motion keeps only the
  fade, and disabled radios never animate.
- All MD3 states from the token set (unselected / selected × enabled / hover /
  focus / pressed / disabled, with the pressed state layer previewing the next
  state and the 3dp `secondary` focus indicator), plus an `error` state from
  `error`, `aria-invalid` or `:user-invalid`.
- `Radio`: `label` row (the text selects the radio and previews its state
  layer), `supportingText` wired to `aria-describedby`, `labelPosition`
  start/end, `color` primary/secondary/tertiary, `controlClassName`. It is a
  Server Component: only the ripple and the native input are client islands.
- `RadioGroup`: a `<fieldset role="radiogroup">` with a `<legend>` (`label`),
  `supportingText`, `value` / `defaultValue` / `onValueChange(value, event)`
  (`null` for none), a generated or given `name`, `required` (`aria-required`),
  `disabled`, `error`, `orientation`, `form`, and group-wide `color` /
  `labelPosition` that reach radios through CSS, so the server-rendered first
  paint is already right.
- `--md-comp-radio-*` tokens for colors, sizes and motion, plus a new shared
  `--md-comp-selection-fast-spatial-easing`. High contrast (`forced-colors`) is
  supported.
