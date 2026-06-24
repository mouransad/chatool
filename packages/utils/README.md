# @chatool/utils

Shared utilities and React hooks for Chatool apps.

- **Deps:** `clsx`, `tailwind-merge` · **Peer:** `react` ^19
- **Full docs:** [docs/packages/utils.md](../../docs/packages/utils.md)
- **Monorepo:** [chatool-kit README](../../README.md)

## Install

```bash
pnpm add @chatool/utils
```

## Usage

```ts
import { cn } from "@chatool/utils";
import { useBoolean, useDelayVisibility, endPointUrlNormalizer } from "@chatool/utils/hooks";
```

- `@chatool/utils` — `cn` (server-safe; no `"use client"`).
- `@chatool/utils/hooks` — `useBoolean`, `useDelayVisibility`,
  `endPointUrlNormalizer` (`"use client"`).

See the [full docs](../../docs/packages/utils.md) for each API.
