import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Minimal config. The `@karnameh/*` packages are consumed as prebuilt `dist/`
 * (ESM + CJS, with `"use client"` preserved), so no `transpilePackages` is
 * needed. Turbopack is the default bundler in Next 16.
 *
 * `turbopack.root` pins the workspace root to the monorepo root so Next doesn't
 * infer it from an unrelated lockfile higher up the filesystem.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(here, "..", ".."),
  },
};

export default nextConfig;
