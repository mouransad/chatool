# @chatool/utils

Shared utilities and React hooks for Chatool apps: `cn` for class merging, plus a
small set of hooks.

- **Dependencies:** `clsx`, `tailwind-merge`
- **Peers:** `react` ^19

## Install

```bash
pnpm add @chatool/utils
# react ^19 is a peer — install it if your app doesn't already have it
```

## Exports

Two subpaths. The root entry is **server-safe**; the hooks entry is a client
boundary.

| Subpath                | Exports                                                     | Directive          |
| ---------------------- | ----------------------------------------------------------- | ------------------ |
| `@chatool/utils`       | `cn`, `ClassValue`                                          | none (server-safe) |
| `@chatool/utils/hooks` | `useBoolean`, `useDelayVisibility`, `endPointUrlNormalizer` | `"use client"`     |

## Usage

### `cn(...inputs)`

`clsx` + `tailwind-merge`: merge class names and de-duplicate conflicting Tailwind
utilities (the later utility wins).

```ts
import { cn } from "@chatool/utils";

cn("px-2", condition && "px-4"); // -> "px-4"
cn("text-sm", "text-base"); // -> "text-base"
```

`tailwind-merge` is **taught the MD3 typescale** — the `text-*` font-size utilities
from `@chatool/core` (`text-label-large`, `text-title-medium`, …). Otherwise it
would mistake those custom names for text _colors_ and silently drop a real color
that sits next to one, e.g. `cn("text-label-large", "text-[color:var(--fg)]")`. With
the fix, the typescale and a token color coexist and still override correctly.

`cn` has no `"use client"`, so it's safe to import from Server Components.

### `useBoolean(initial?)`

Boolean state with stable `setTrue` / `setFalse` / `toggle` / `setValue`.

```ts
import { useBoolean } from "@chatool/utils/hooks";

const { value, toggle, setTrue, setFalse } = useBoolean(false);
```

### `useDelayVisibility(visible, delayMs?)`

Keeps an element mounted for `delayMs` after `visible` flips to `false`, so exit
transitions can play before unmount. Returns whether to render.

```ts
import { useDelayVisibility } from "@chatool/utils/hooks";

const shouldRender = useDelayVisibility(open, 200);
```

### `endPointUrlNormalizer(base, path?)`

Pure (no React): joins a base URL and path, collapsing duplicate slashes at the
join. Safe on server or client. Exported from `./hooks` by design.

```ts
import { endPointUrlNormalizer } from "@chatool/utils/hooks";

endPointUrlNormalizer("https://api.example.com/", "/v1/users"); // -> ".../v1/users"
```

## For AI agents

- Import `cn` from the **root** `@chatool/utils` — it is server-safe (no
  `"use client"`), so it works in React Server Components.
- Import hooks from `@chatool/utils/hooks`. That entry carries `"use client"`, so
  consuming it pulls the file into the client boundary.
- `endPointUrlNormalizer` is pure but still lives under `./hooks`. Don't expect it
  on the root entry.
- `cn` knows the MD3 typescale `text-*` utilities are font sizes, so combining a
  typescale class with a token color (`text-[color:var(--…)]`) is safe — the color
  isn't dropped. Use the `color:` hint for arbitrary color values.
- `react` is a peer (your app supplies it); `clsx` and `tailwind-merge` are
  bundled dependencies.

## Related

- `@chatool/ui` — consumes `cn` from this package.
