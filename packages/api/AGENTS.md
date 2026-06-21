# AGENTS.md — @karnameh/api

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/api.md](../../docs/packages/api.md).

- **Framework-agnostic, non-negotiable:** no `process.env`, no `"use server"`,
  no Next/Vite/React imports. `baseURL` is **always injected** by the caller.
- Build on a single injectable client: `createHttpClient({ baseURL, ...axios })`
  returns an `AxiosInstance`; `createServices({ baseURL, client? })` groups the
  services on top of it.
- **Types are real exports**, not ambient globals — `GetBannersParams`,
  `GetBannersItem`, `GetBannersResponse`, etc. Each service also exports its
  `*BasePath` and `*EndPoints`.
- Service layout: `src/services/<name>/{index,endpoints,types}.ts`, each
  re-exported from `src/services/index.ts` and the package barrel `src/index.ts`.
  `dealers` and `rest` are scaffolds — replace with real contracts.
- `axios` is the only `dependency`; no peers.
- Single entry/subpath (`.`). If you split entries later, update `exports` +
  `tsdown.config.ts` together.
