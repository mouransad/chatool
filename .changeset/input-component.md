---
"@chatool/ui": minor
---

Add `@chatool/ui/input` — the Material Design 3 Text Field component.

- Supports `filled` (default) and `outlined` variants.
- M3 size scale `s` (default, 56dp) and `xs` (compact, 40dp).
- Pure CSS floating label transitions (using `:placeholder-shown` + peer selectors), keeping it fully Server-Component-safe (no `"use client"`).
- Supports leading icon (`startIcon`), trailing icon (`endIcon`), and helper/error text below the container.
- Renders a native `<input>` element or delegates rendering to custom elements (e.g. `<textarea>`) via `asChild`.
- Exposes component custom properties for customization: `--md-comp-input-{container-color,text-color,label-color,outline-color,focus-color,error-color}`.
