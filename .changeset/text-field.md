---
"@chatool/ui": minor
---

Add `@chatool/ui/text-field`, the Material 3 text field (filled and outlined)
with M3 Expressive motion.

- A native `<input>` (or `<textarea>` with `multiline`) under an MD3 skin, so
  forms, constraint validation, `<fieldset disabled>`, server actions, autofill,
  IME and assistive tech get the real control. Every native prop goes to it;
  `className` / `style` go to the root.
- MD3 tokens throughout (Compose `FilledTextFieldTokens` /
  `OutlinedTextFieldTokens` v0_210, `TextFieldImpl.kt`, Material Web): 56dp
  container, 8 / 16dp paddings, 48dp icon targets, 4dp corners (top only when
  filled), 1 → 2dp indicator / outline, 8% filled hover state layer, the newer
  `on-error-container` error-hover colors, 38% / 4% / 12% disabled treatment.
- Expressive motion in CSS: the label moves and really resizes (body-large →
  body-small) on Compose's fast-spatial spring, the indicator / outline thickens
  on it and the outlined notch opens from its centre; colors on the fast-effects
  spring, the placeholder on slow effects. Reduced motion keeps only the fades.
- A CSS-only outline notch (an invisible floated-label copy sizes it), label
  inside or `labelPosition="above"`, `alwaysFloatLabel`, placeholder shown on
  focus, `prefix` / `suffix`, leading / trailing icons, `required` asterisk.
- Validation: `error` (`true` / `false` / auto via native `:user-invalid`),
  `errorText` that replaces the supporting text and is announced
  (`role="alert"`), and MD3's trailing error icon.
- Built-ins: `clearable` (clear icon button + Escape, fires `onChange`), a
  password show / hide toggle for `type="password"`, a character counter with
  `maxLength` (spoken "n of max characters"), growing multi-line fields
  (`minRows` / `maxRows`, `field-sizing: content` with a JS fallback) and fixed
  text areas (`rows`).
- Customization: `density` 0…−4 (MD3, 56 → 40dp), `color`, `labels` (i18n),
  `classNames` per part, `asChild` for masked / third-party inputs, and
  `--md-comp-text-field-*` tokens for every color, space, shape and spring.
- Server Component: every state is CSS on the native control, so uncontrolled
  fields float, validate and animate before hydration. One small client island
  adds click-to-focus, clear, the password toggle, the live counter and the
  auto-grow fallback. RTL and `forced-colors` are supported.
