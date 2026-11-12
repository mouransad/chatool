---
"@chatool/ui": minor
---

Add `@chatool/ui/tooltip`, the Material 3 tooltip (plain and rich) with M3 Expressive motion, and the shared overlay foundation (`src/overlays/`) that later menus, selects, popovers and dialogs build on.

- **Plain** and **rich** tooltips with the exact Compose / Material Web tokens and the m3.material.io measurements; rich tooltips take a `title`, up to two `actions` (`TooltipAction`) and can be `persistent` (click to open).
- MD3 behavior: hover (500ms, instant while another tooltip is showing), keyboard focus (instant), touch long-press, a 1.5s linger, one tooltip at a time, Escape, optional `caret`, `side` / `align` placement with flip and shift, RTL.
- Rendered in the browser's top layer (native Popover API) and positioned with `@floating-ui/dom` (new dependency).
- `TooltipProvider` for app-wide timing and container; `relationship="label" | "description" | "none"` for the anchor's accessible name or description.
