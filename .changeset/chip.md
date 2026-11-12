---
"@chatool/ui": minor
---

Add `@chatool/ui/chip` and `@chatool/ui/chip-set`: the Material 3 chips
(assist, filter, input, suggestion) with M3 Expressive shape morph and motion,
and the chip set that groups them.

- One `Chip` with a `variant` axis, built to the MD3 spec and Compose's
  `*ChipTokens` / `Chip.kt` (Material Web v34 for the web specifics): 32dp,
  `label-large`, 18dp icons, 24dp round avatars, Compose's exact padding math
  (16 | label | 16, 8 | icon | 8 | label | 16, input 4 | avatar | 8), 48dp touch
  targets for the chip and its remove action, flat (`outline-variant`) or
  `elevated` (`surface-container-low`, elevation 1 → 2) styles, per-state
  elevations, 8 / 10 / 10 / 16% state layers, the 3dp `secondary` focus ring and
  MD3's 38% / 12% disabled treatment.
- M3 Expressive by default (`expressive`, from Compose `ChipsTokens` and the
  `@material3expressive` chip overloads): the container morphs 12dp → full pill
  when selected → 8dp while pressed on the fast-spatial spring; a filter chip's
  checkmark is revealed from the start edge (or cross-fades over its icon); 4dp
  compact icon spacing and the tonal unselected icon. `expressive={false}` is
  the baseline static 8dp chip. Reduced motion keeps only the fades.
- Filter / input selection (`selected`, `defaultSelected`, `onSelectedChange`,
  `aria-pressed`), `selectedIcon`, `trailingIcon` (menu arrows), removable input
  chips (`onRemove`, `removable`, `removeOnly`, `removeLabel`, `removeIcon`) with
  Backspace / Delete removal and focus handed to the neighbouring chip, `loading`,
  `softDisabled`, `dragged`, link chips (`href`, `asChild`), and
  `--md-comp-chip-*` tokens for every size, shape, color and spring.
- `ChipSet`: a WAI-ARIA APG toolbar with one Tab stop (roving tabindex), ←/→ in
  reading order (RTL-aware, wrap-around via `loop`), Home / End, single or
  multiple selection (controlled or uncontrolled, `required`), form submission via
  `name`, set-level `onRemove(value)`, `disabled`, and `layout` `wrap` / `scroll`.
- `Chip` is a Server Component; its actions are one small client island.
  `ChipSet` is a client component that still renders on the server.
