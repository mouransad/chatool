import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Dev-only source map for **Vite-based** internal apps (currently
 * `apps/storybook`): maps each `@chatool/*` import specifier to its package
 * **source** instead of the prebuilt `dist/`, fed into Vite `resolve.alias` so
 * editing a package's `src/` hot-reloads instantly — no `pnpm build` + restart.
 *
 * The Next playground can't use these absolute paths (Turbopack `resolveAlias`
 * only takes module specifiers), so it does the same redirect via `tsconfig.json`
 * `paths` — keep the two in sync when you add a `@chatool/ui` component subpath.
 *
 * This is **never** part of the published packages: their `package.json`
 * `exports` still point at `dist/`, so real npm consumers are unaffected.
 */
const root = path.dirname(fileURLToPath(import.meta.url));
const pkg = (...p) => path.join(root, "packages", ...p);

/** Exact specifier → absolute source entry. */
export const sourceAliases = {
  "@chatool/utils": pkg("utils", "src", "index.ts"),
  "@chatool/utils/hooks": pkg("utils", "src", "hooks", "index.ts"),
  "@chatool/core": pkg("core", "src", "index.ts"),
  "@chatool/ui/button": pkg("ui", "src", "buttons", "button", "index.tsx"),
  "@chatool/ui/icon-button": pkg(
    "ui",
    "src",
    "buttons",
    "icon-button",
    "index.tsx",
  ),
  "@chatool/ui/button-group": pkg(
    "ui",
    "src",
    "buttons",
    "button-group",
    "index.tsx",
  ),
  // add one line per new @chatool/ui component subpath
};

/**
 * Icons are a wildcard subpath (`@chatool/icons/<Name>` → `src/<Name>.tsx`),
 * expressed as a Vite regex alias. (The playground covers this with a
 * `@chatool/icons/*` tsconfig `paths` entry.)
 */
export const iconsSrcDir = pkg("icons", "src");
