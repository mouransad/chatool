import js from "@eslint/js";
import tseslint from "typescript-eslint";
import storybook from "eslint-plugin-storybook";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Flat ESLint config for the Storybook app. Root `eslint .` ignores `apps/**`,
 * so this app lints itself: TypeScript recommended rules (which provide the TS
 * parser for `.tsx` stories) plus Storybook's recommended story rules.
 * `eslint-config-prettier` is last so Prettier owns formatting.
 */
export default tseslint.config(
  { ignores: ["storybook-static/**", "node_modules/**"] },
  // Pin the TS parser's project root to this app's directory so it isn't
  // ambiguous with the monorepo root config. See tseslint.com/parser-tsconfigrootdir.
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybook.configs["flat/recommended"],
  eslintConfigPrettier,
);
