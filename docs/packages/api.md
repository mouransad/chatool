# @karnameh/api

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Packages](README.md) → **api**

Framework-agnostic, fully injectable HTTP client and typed services.

- **Dep:** `axios`
- **Peers:** none
- **Source:** [`packages/api/src`](../../packages/api/src)
- **Package README:** [`packages/api/README.md`](../../packages/api/README.md)
- **Agent rules:** [`packages/api/AGENTS.md`](../../packages/api/AGENTS.md)

> 🔒 **No `process.env`, no `"use server"`, no framework imports.** The caller
> always injects `baseURL`. This is what lets one package serve App Router, Pages
> Router, and Vite unchanged.

## Exports

Everything is exported from the single root entry `@karnameh/api`:

- **Client:** `createHttpClient`, `CreateHttpClientOptions`
- **Service factory:** `createServices`, `CreateServicesOptions`, `Services`
- **Re-exported axios types:** `AxiosInstance`, `AxiosRequestConfig`
- **Per-service** factories, endpoints, and types (below)

## `createHttpClient(options)`

```ts
import { createHttpClient } from "@karnameh/api";

const client = createHttpClient({
  baseURL: "https://api.example.com",
  // ...any axios config: headers, timeout, interceptors via the instance, etc.
});
```

Returns a configured `AxiosInstance`. `baseURL` is required and injected.

## `createServices(options)`

```ts
import { createServices } from "@karnameh/api";

const services = createServices({ baseURL: "https://api.example.com" });
//   services.client   -> the AxiosInstance
//   services.clutch   -> ClutchService
//   services.dealers  -> DealersService
//   services.rest     -> RestService
```

`CreateServicesOptions` is `{ baseURL: string; client?: AxiosInstance }` — pass a
pre-configured `client` to reuse interceptors, otherwise one is built from
`baseURL`.

## Services

### clutch

```ts
import { clutchBasePath, clutchEndPoints } from "@karnameh/api";
import type { GetBannersParams, GetBannersItem, GetBannersResponse } from "@karnameh/api";

const { items } = await services.clutch.getBanners({ placement: "home" });
```

- `clutchBasePath` = `"/clutch"`, `clutchEndPoints.banners` = `"/clutch/banners"`.
- `GetBannersParams` / `GetBannersItem` / `GetBannersResponse` are **real
  exported types** (converted from former ambient globals).

### dealers (scaffold)

`createDealersService` → `list(params?)`, `detail(id)`. Exports
`dealersBasePath`, `dealersEndPoints`, and `DealerItem` / `ListDealersParams`
types. Replace with the real contract.

### rest (scaffold)

`createRestService` → `ping()`. Exports `restBasePath`, `restEndPoints`. Replace
with the real contract.

## Where to call it (per framework)

The package is the same everywhere; only **where you call it and where `baseURL`
comes from** differs:

- [Next.js App Router](../guides/consuming/nextjs-app-router.md) — RSC / server action, `process.env`
- [Next.js Pages Router](../guides/consuming/nextjs-pages-router.md) — `getServerSideProps` / API route, `process.env`
- [Vite SPA](../guides/consuming/vite.md) — client-side, `import.meta.env`

## Related

- [Conventions](../conventions.md) — why this package has no `process.env`.

---

Up: [Packages](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
