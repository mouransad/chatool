import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "./preview.css";

/**
 * The toolbar theme switch is the single source of truth for the `.dark` class
 * (set on `<html>`). `@chatool/core` defines `:root` / `.dark` tokens and
 * `@custom-variant dark (&:is(.dark *))`, so descendants pick up dark tokens.
 *
 * Note: `@chatool/core`'s ChatoolProvider also manages this class, so it is NOT
 * applied globally — it's showcased in the dedicated `Core/Provider` story with
 * this decorator disabled, to avoid two systems fighting over `.dark`.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    layout: "centered",
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
      parentSelector: "html",
    }),
  ],
};

export default preview;
