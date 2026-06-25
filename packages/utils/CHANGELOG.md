# @chatool/utils

## 0.1.0

### Minor Changes

- Ship complete docs inside each package tarball so they're available in consumers'
  `node_modules` for AI tools and humans.

  Each package now bundles a **complete, self-contained `README.md`** (the canonical
  per-package reference) and a generated **`llms.txt`** (an llmstxt.org-style entry
  point listing install, exports, and usage rules). Stale/incorrect import examples
  (e.g. `@chatool/ui` / `@chatool/icons` root-barrel imports) were corrected.
