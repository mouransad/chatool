---
"@karnameh/icons": minor
"@karnameh/ui": minor
---

Switch `@karnameh/ui` and `@karnameh/icons` to subpath-only exports (no root
barrel) so editors auto-import the specific path instead of a root barrel.

- `@karnameh/ui` drops its `.` export and `src/index.ts` barrel. Import each
  component from its subpath; `./button` now also has a `default` export:
  `import Button from "@karnameh/ui/button"`.
- `@karnameh/icons` drops its `.` barrel export in favor of a `./*` wildcard:
  `import ChevronDownIcon from "@karnameh/icons/ChevronDownIcon"`.

Migration:

```diff
-import { Button } from "@karnameh/ui";
+import Button from "@karnameh/ui/button";

-import { ChevronDownIcon } from "@karnameh/icons";
+import ChevronDownIcon from "@karnameh/icons/ChevronDownIcon";
```
