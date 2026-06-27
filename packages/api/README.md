# @chatool/api

Framework-agnostic, fully injectable HTTP client and typed services for Chatool
apps. **No `process.env`, no `"use server"`, no framework imports** — the caller
always injects `baseURL`. That's what lets one package serve Next.js App Router,
Pages Router, and Vite unchanged.

- **Dependencies:** `axios`
- **Peers:** none

## Install

```bash
pnpm add @chatool/api
```

## Exports

Everything is exported from the single root entry `@chatool/api`:

- **Client:** `createHttpClient`, `CreateHttpClientOptions`
- **Service factory:** `createServices`, `CreateServicesOptions`, `Services`
- **Re-exported axios types:** `AxiosInstance`, `AxiosRequestConfig`
- **Per-service** factories, endpoints (`*BasePath`, `*EndPoints`), and types

## Usage

### `createHttpClient(options)`

```ts
import { createHttpClient } from "@chatool/api";

const client = createHttpClient({
  baseURL: "https://api.example.com",
  // ...any axios config: headers, timeout, interceptors via the instance, etc.
});
```

Returns a configured `AxiosInstance`. `baseURL` is required and injected.

### `createServices(options)`

```ts
import { createServices } from "@chatool/api";

const services = createServices({ baseURL: "https://api.example.com" });
//   services.client   -> the AxiosInstance
//   services.clutch   -> ClutchService
//   services.dealers  -> DealersService
//   services.rest     -> RestService
```

`CreateServicesOptions` is `{ baseURL: string; client?: AxiosInstance }` — pass a
pre-configured `client` to reuse interceptors, otherwise one is built from
`baseURL`.

### Calling a service

```ts
import type { GetBannersResponse } from "@chatool/api";

const { items } = await services.clutch.getBanners({ placement: "home" });
```

`GetBannersParams` / `GetBannersItem` / `GetBannersResponse` are **real exported
types**. `dealers` (`list`, `detail`) and `rest` (`ping`) are scaffolds — fork and
replace with your real contracts.

## Where to call it (per framework)

The package is identical everywhere; only **where you call it and where `baseURL`
comes from** differs:

- **Next.js App Router** — in a Server Component / server action / route handler;
  read the base URL from `process.env` _in your app_ and pass it in:
  ```ts
  const services = createServices({ baseURL: process.env.API_BASE_URL! });
  ```
- **Next.js Pages Router** — in `getServerSideProps` / an API route; same
  `process.env` injection.
- **Vite SPA** — client-side; inject from `import.meta.env`:
  ```ts
  const services = createServices({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });
  ```

## For AI agents

- **Never** add `process.env`, `import.meta.env`, `"use server"`, or any
  Next/Vite/React import inside code that uses this package's internals — this
  package is framework-agnostic. Read env in _your app_ and pass `baseURL` in.
- Build everything on `createHttpClient({ baseURL, ...axios })` →
  `createServices({ baseURL, client? })`. Reuse one `client` to share interceptors.
- All request/response shapes are **real exported types** (e.g. `GetBannersResponse`),
  not ambient globals — import them with `import type`.
- Single root entry: import everything from `@chatool/api` (no subpaths).
- `axios` is the only dependency; there are no peers.

## Related

- `@chatool/utils` — `endPointUrlNormalizer` for joining base URL + path.
