/**
 * SVGR options for @chatool/icons.
 *
 * Raw SVGs in `svg/` are converted to typed, tree-shakeable React components in
 * `src/` by `pnpm generate`. Icons are **pure presentational** components — no
 * hooks, no `"use client"` — so they are server-safe.
 *
 * Source SVGs are Material Symbols (weight 400), copied into `svg/` by
 * `pnpm sync:icons` as `<base>-<style>.svg` (styles: outlined/rounded/sharp/filled).
 *
 * - `icon: true`        → width/height = "1em" so the icon scales with font-size;
 *                          `className="size-6"` (Tailwind) overrides it.
 * - `expandProps: "end"`→ forwarded `{...props}` (className, onClick, aria-*) win.
 * - `svgProps.fill: "currentColor"` → Material Symbols ship without a `fill`
 *                          attribute (would default to black); this makes paths
 *                          inherit the text color so `text-*` utilities tint them.
 *
 * `home-outlined.svg` → `src/home-outlined.tsx` (component `SvgHomeOutlined`)
 * and the barrel re-exports it PascalCased: `export { ... as HomeOutlined }`.
 */
const toPascal = (name) =>
  name.replace(/(^|[-_])([a-z0-9])/g, (_, __, c) => c.toUpperCase());

export default {
  typescript: true,
  jsxRuntime: "automatic",
  icon: true,
  expandProps: "end",
  svgProps: {
    "aria-hidden": "true",
    focusable: "false",
    fill: "currentColor",
  },
  // Re-export every generated component under a clean PascalCase name, decoupled
  // from SVGR's default index (which would emit the raw kebab basename).
  indexTemplate(filePaths) {
    return (
      filePaths
        .map((entry) => (typeof entry === "string" ? entry : entry.path))
        .map((p) => {
          const base = p.split("/").pop().replace(/\.[tj]sx?$/, "");
          return `export { default as ${toPascal(base)} } from "./${base}";`;
        })
        .join("\n") + "\n"
    );
  },
};
