// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    // `apps/**` self-lints via its own `next lint`; the root `eslint .` run
    // stays focused on the libraries (and skips Next build output).
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "apps/**",
      "**/.next/**",
      ".claude/**",
      "**/scripts/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  // Last: turn off ESLint's stylistic rules that overlap with Prettier so the
  // two tools never disagree. Prettier owns formatting; ESLint owns code quality.
  eslintConfigPrettier,
);
