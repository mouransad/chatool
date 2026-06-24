/**
 * SVGR options for @chatool/icons.
 *
 * Raw SVGs in `svg/` are converted to typed, tree-shakeable React components in
 * `src/` by `pnpm generate`. Icons are **pure presentational** components — no
 * hooks, no `"use client"` — so they are server-safe.
 *
 * - `icon: true`        → width/height = "1em" so the icon scales with font-size;
 *                          `className="size-6"` (Tailwind) overrides it.
 * - `expandProps: "end"`→ forwarded `{...props}` (className, onClick, aria-*) win.
 * - colors use `currentColor` in the source SVGs, so `text-*` utilities tint them.
 *
 * `chevron-down-icon.svg` → `src/chevron-down-icon.tsx` (component `SvgChevronDownIcon`)
 * and the barrel re-exports it PascalCased: `export { ... as ChevronDownIcon }`.
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
