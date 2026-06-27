---
"@chatool/ui": patch
---

Adopt the component-directory code-style standard: `button` now lives in
`src/button/` (`index.tsx` barrel + `button.tsx` arrow component + `button.types.ts`
+ `button.variants.ts`). No public API change — `@chatool/ui/button` still default-
exports `Button` and named-exports `Button`/`buttonVariants`/`ButtonProps`, and the
`dist/button.*` filenames are unchanged. The standard (own directory, arrow
components, separate types/variants, `useLogic` for non-trivial logic) is
documented in `docs/conventions/` and ESLint-enforced for `packages/ui/src/**`.
