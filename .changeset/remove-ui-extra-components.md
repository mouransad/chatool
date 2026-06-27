---
"@chatool/ui": minor
---

Remove the `dropdown-menu`, `bottom-sheet`, and `bottom-sheet-header` components
to focus the package on `button` for now. Their `exports` subpaths and tsdown
entries are gone, and `@chatool/icons` is no longer a dependency (only `button`
remains, which doesn't use icons).
