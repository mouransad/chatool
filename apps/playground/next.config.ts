import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * The `@chatool/*` packages publish prebuilt `dist/`, but for local development
 * we resolve their import specifiers to package **source** so editing a
 * package's `src/` hot-reloads here instantly — no `pnpm build` + restart. The
 * source mapping lives in `tsconfig.json` `paths` (Turbopack reads tsconfig
 * paths natively, incl. the `@chatool/icons/*` wildcard); `transpilePackages`
 * lets Turbopack compile that TS/JSX source (the `"use client"` directives are
 * preserved).
 *
 * `turbopack.root` pins the workspace root to the monorepo root so Next doesn't
 * infer it from an unrelated lockfile higher up the filesystem.
 */
const nextConfig: NextConfig = {
  transpilePackages: [
    "@chatool/ui",
    "@chatool/utils",
    "@chatool/core",
    "@chatool/icons",
  ],
  turbopack: {
    root: path.join(here, "..", ".."),
  },
};

export default nextConfig;
