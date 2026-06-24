import { createServices } from "@chatool/api";

/**
 * `@chatool/api` is framework-agnostic: the caller injects `baseURL`. Here we
 * read it from a server env var, exactly as the consuming guide describes
 * (docs/guides/consuming/nextjs-app-router.md).
 *
 * Wired but not called — the playground has no real backend yet. To exercise a
 * live request, set `API_BASE_URL` and call a service from a Server Component:
 *
 *   // app/page.tsx (runs on the server)
 *   import { getServices } from "./lib/services";
 *   const { items } = await getServices().clutch.getBanners({ placement: "home" });
 */
export function getServices() {
  return createServices({ baseURL: process.env.API_BASE_URL ?? "" });
}
