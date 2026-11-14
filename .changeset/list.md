---
"@chatool/ui": minor
---

Add `@chatool/ui/list`, the Material 3 **Expressive** list, built to the live
MD3 spec and Compose's expressive `ListItem` / `ListTokens`.

- Parts on one subpath: `List`, `ListItem`, `ListItemExpandable`, `ListItemIcon`,
  `ListItemAvatar`, `ListItemImage`, `ListItemVideo`, `ListItemDragHandle` and
  `ListDivider`.
- **Two styles.** `standard` rows are flush and transparent, so a list fits on
  any surface. `segmented` rows are filled `surface-container` tiles with 2dp
  gaps and 16dp outer / 4dp inner corners.
- **Expressive shape morph.** Corners go from 4dp at rest to 12dp on hover and
  16dp when focused, pressed, selected or dragged, on the fast-spatial spring;
  colors animate on the default-effects spring.
- **Exact MD3 layout.** 16 / 12 / 10dp spacing, 56 / 72 / 88dp rows for one, two
  and three lines, and three-line rows aligned to the top. Body-large headline,
  body-medium supporting text, label-small overline and trailing text, and 20dp
  icons. Includes a 40dp avatar, a 56dp image and 100×56 / 114×64dp video
  thumbnails.
- **Every MD3 list kind.**
  - Non-interactive rows.
  - Single-action rows: link, button, or `asChild` for a router link.
  - Multi-action rows: trailing `IconButton`s stay separately clickable.
  - **Selection controls**: `control={<Checkbox|Radio|Switch />}` makes the row
    the control's native `<label>`, so it works in forms with no JavaScript, and
    a checked control selects the whole row.
  - **Listbox selection** (`selectionMode` `single` / `multiple`, `role="listbox"`)
    with `value` / `onValueChange`, typeahead, Shift + arrows, Ctrl / ⌘ + A,
    `selectionFollowsFocus`, `required`, and form `name`.
- **MD3 keyboard model.** The list is one Tab stop, landing on the selected item
  when there is one. ↑↓←→ move between items and wrap, mirrored in RTL;
  Home / End jump to the ends; Space / Enter activate.
- **Expand & collapse** (`ListItemExpandable`) over native `<details>`. The
  expressive chevron sits in a circular container, the children spring open,
  and segmented corners continue through them.
- **Drag to reorder** (`reorderable` + `onReorder`):
  - Pointer drag with the MD3 dragged state (`tertiary-container`, elevation 4),
    siblings that slide aside, a drop zone and edge auto-scroll.
  - Keyboard grab / move / drop / cancel, plus Alt + ↑ / ↓.
  - Every step is announced in a live region.
- Also `density` (MD3 −1 to −3), `dividers`, `disabled`, `selected` / `dragged`
  states (including selected + disabled), line clamping, `classNames`, and a full
  set of `--md-comp-list-*` tokens.
- **Server Component by default.** Rows and parts carry no client directive, and
  every state is CSS. Only the list root and the option rows are small client
  islands.

The internal press ripple now carries `data-slot="ripple"`.
