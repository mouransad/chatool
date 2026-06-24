# @chatool/api

Framework-agnostic, fully injectable HTTP client and typed services for Chatool
apps. No `process.env`, no `"use server"` — you inject `baseURL`.

- **Dep:** `axios` · **Peers:** none
- **Full docs:** [docs/packages/api.md](../../docs/packages/api.md)
- **Monorepo:** [chatool README](../../README.md)

## Install

```bash
pnpm add @chatool/api
```

## Usage

```ts
import { createServices } from "@chatool/api";
import type { GetBannersResponse } from "@chatool/api";

const services = createServices({ baseURL: "https://api.example.com" });
const banners = await services.clutch.getBanners({ placement: "home" });
```

Per-framework wiring (App Router / Pages Router / Vite):
[consuming guides](../../docs/guides/consuming/README.md). Full API:
[docs/packages/api.md](../../docs/packages/api.md).
