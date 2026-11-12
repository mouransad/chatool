---
"@chatool/ui": minor
---

Add `@chatool/ui/switch`, the Material 3 switch with M3 Expressive motion.

- Built on a native `<input type="checkbox" role="switch">`, as the APG and
  Material Web do. Geometry comes from Compose's `SwitchTokens`: a 52×32dp track
  with a 2dp outline, a handle that is 16dp off, 24dp on or with an icon, and 28dp
  while pressed, a 16dp icon, a 40dp state layer that travels with the handle, and
  a 48dp touch target. Forms, `required`, `<fieldset disabled>`, server actions and
  assistive tech get the real control. An uncontrolled switch toggles and animates
  before hydration.
- Expressive motion in CSS, taken from Compose's `Switch`. The handle slides and
  resizes on the Expressive fast-spatial spring (0.6 / 800, ~9.5% overshoot,
  348ms). A press snaps it to 28dp, and releasing springs it to the other side.
  Colors fade in 67ms and icons in 33ms, and a lone check rotates into view.
  Reduced motion keeps only the fades, and disabled switches never animate.
- Every MD3 state from the token set: off and on × enabled, hover, focus, pressed
  and disabled. The handle turns `on-surface-variant` / `primary-container` on
  interaction, and the 3dp `secondary` focus indicator hugs the track.
- Space **or Enter** toggles the switch, as MD3 requires, and Enter never submits
  the form. Holding Space shows the pressed handle. **Drag to toggle**: the handle
  follows the pointer and lands on the side it was flung toward, or the nearer
  side. A vertical swipe still scrolls. Each toggle reaches `onChange` exactly once.
- Props: `icons` (`false` / `"selected"` / `true`, MD3's three configurations),
  `selectedIcon` / `unselectedIcon` for custom glyphs, `onCheckedChange(checked,
  event)`, `label` (a `<label>` row whose text toggles the switch; it sits before
  the switch by default, as in settings rows), `supportingText` wired to
  `aria-describedby`, `labelPosition`, `color` (primary / secondary / tertiary),
  and `controlClassName`.
- `--md-comp-switch-*` tokens cover every color role, the track, handle and icon
  sizes, the shapes and the motion. The handle's travel is derived from the track
  size, so resized tracks just work. High contrast (`forced-colors`) and RTL are
  supported.
- Server Component: only the shared ripple and a small interaction island
  (Enter, press feedback, drag) run on the client.
