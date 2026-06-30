import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { iconsSrcDir, sourceAliases } from "../../../dev-aliases.mjs";

/**
 * Vite-powered Storybook for the @chatool/* component packages. `addon-docs`
 * wires the MDX compiler + autodocs; `addon-themes` adds the light/dark toolbar
 * switch. Tailwind v4 is wired through its Vite plugin so `preview.css` (which
 * imports `@chatool/core`) is processed and the component `src` classes are
 * scanned.
 *
 * `resolve.alias` redirects every `@chatool/*` import to package **source** (see
 * `dev-aliases.mjs` at the repo root) so editing a package's `src/` hot-reloads
 * instantly — no `pnpm build` + restart. Bare-package aliases are anchored
 * regexes (`^…$`) so they match the JS entry *exactly* and don't swallow sibling
 * subpaths like `@chatool/core/styles.css` or `@chatool/utils/hooks` (Vite string
 * aliases are prefix matches). Icons map by regex (`@chatool/icons/<Name>` →
 * `src/<Name>.tsx`).
 */
const escapeRegExp = (s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (cfg) => {
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(tailwindcss());

    cfg.resolve = cfg.resolve ?? {};
    const existing = cfg.resolve.alias;
    const existingEntries = Array.isArray(existing)
      ? existing
      : Object.entries(existing ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    cfg.resolve.alias = [
      // More specific @chatool aliases first so they win over any existing ones.
      {
        find: /^@chatool\/icons\/(.+)$/,
        replacement: path.join(iconsSrcDir, "$1.tsx"),
      },
      ...Object.entries(sourceAliases).map(([find, replacement]) => ({
        find: new RegExp(`^${escapeRegExp(find)}$`),
        replacement,
      })),
      ...existingEntries,
    ];

    return cfg;
  },
};

export default config;
