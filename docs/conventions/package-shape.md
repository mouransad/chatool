# Package shape

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Package shape**

Every buildable package has:

- `"type": "module"` and `sideEffects: false` (except `@chatool/core`, which
  marks `**/*.css` as side-effectful because it ships theme CSS).
- `"files": ["dist", "llms.txt"]` (core also ships its `.css` files).
  `README.md` is shipped automatically by npm. `llms.txt` is generated — see
  [docs shipped to consumers](../ai-agents.md#docs-shipped-to-consumers-node_modules).
- a `build` (`tsdown`), `dev` (`tsdown --watch`), and `typecheck` (`tsc --noEmit`)
  script, plus `"prepack": "node ../../scripts/gen-llms.mjs ."`.
- `"publishConfig": { "access": "public" }` — **no registry** is hardcoded.

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
