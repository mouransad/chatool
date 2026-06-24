# @chatool/utils

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Packages](README.md) → **utils**

Shared utilities and React hooks.

- **Deps:** `clsx`, `tailwind-merge`
- **Peer:** `react` ^19
- **Source:** [`packages/utils/src`](../../packages/utils/src)
- **Package README:** [`packages/utils/README.md`](../../packages/utils/README.md)
- **Agent rules:** [`packages/utils/AGENTS.md`](../../packages/utils/AGENTS.md)

## Exports

| Subpath | Exports | Directive |
| --- | --- | --- |
| `@chatool/utils` | `cn`, `ClassValue` | none (server-safe) |
| `@chatool/utils/hooks` | `useBoolean`, `useDelayVisibility`, `endPointUrlNormalizer` | `"use client"` |

The root entry is kept pure so `cn` can be imported into Server Components. The
hooks entry carries the `"use client"` boundary.

## API

### `cn(...inputs)`

`clsx` + `tailwind-merge` — merge class names and de-duplicate conflicting
Tailwind utilities.

```ts
import { cn } from "@chatool/utils";
cn("px-2", condition && "px-4"); // -> "px-4"
```

### `useBoolean(initial?)`

Boolean state with stable `setTrue` / `setFalse` / `toggle` and `setValue`.

```ts
import { useBoolean } from "@chatool/utils/hooks";
const { value, toggle, setTrue, setFalse } = useBoolean(false);
```

### `useDelayVisibility(visible, delayMs?)`

Keeps an element mounted for `delayMs` after `visible` flips to `false`, so exit
transitions can play before unmount. Returns whether to render.

### `endPointUrlNormalizer(base, path?)`

Pure (no React) — joins a base URL and path, collapsing duplicate slashes at the
join. Safe on server or client.

## Related

- [@chatool/ui](ui.md) — consumes `cn`.
- [Conventions](../conventions.md) — the `"use client"` rules.

---

Up: [Packages](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
