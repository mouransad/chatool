# @karnameh/utils

Shared utilities and React hooks for Karnameh apps.

- **Deps:** `clsx`, `tailwind-merge` · **Peer:** `react` ^19
- **Full docs:** [docs/packages/utils.md](../../docs/packages/utils.md)
- **Monorepo:** [karnameh-kit README](../../README.md)

## Install

```bash
pnpm add @karnameh/utils
```

## Usage

```ts
import { cn } from "@karnameh/utils";
import { useBoolean, useDelayVisibility, endPointUrlNormalizer } from "@karnameh/utils/hooks";
```

- `@karnameh/utils` — `cn` (server-safe; no `"use client"`).
- `@karnameh/utils/hooks` — `useBoolean`, `useDelayVisibility`,
  `endPointUrlNormalizer` (`"use client"`).

See the [full docs](../../docs/packages/utils.md) for each API.
