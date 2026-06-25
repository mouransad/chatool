import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite-powered Storybook for the @chatool/* component packages. `addon-docs`
 * wires the MDX compiler + autodocs; `addon-themes` adds the light/dark toolbar
 * switch. Tailwind v4 is wired through its Vite plugin so `preview.css` (which
 * imports `@chatool/styles`) is processed and the component `dist` classes are
 * scanned.
 */
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
    return cfg;
  },
};

export default config;
