import { defineConfig, type UserConfig, type UserConfigExport } from "tsdown";

/**
 * Shared tsdown preset for every @karnameh/* package.
 *
 * tsdown (Rolldown + Oxc) is directive-aware: it **preserves** top-of-file
 * `"use client"` / `"use server"` directives in the bundled output for both ESM
 * and CJS — no extra plugin and no treeshake caveat. Pure modules stay clean.
 *
 * Output (ESM/CJS resolved by extension, independent of `"type"`):
 * - ESM → `dist/<entry>.mjs` + types `dist/<entry>.d.mts`
 * - CJS → `dist/<entry>.cjs` + types `dist/<entry>.d.cts`
 *
 * Dependencies and peerDependencies (and their subpaths, e.g. `react/jsx-runtime`)
 * are externalized automatically; only the package's own source is bundled.
 */
export function defineKarnamehConfig(options: UserConfig): UserConfigExport {
  return defineConfig({
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    ...options,
  });
}
