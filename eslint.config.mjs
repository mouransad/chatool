// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import unicorn from "eslint-plugin-unicorn";
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
  {
    // Component code-style standard — scoped to @chatool/ui source only.
    // core (provider) and utils (hooks) keep their existing function-declaration
    // / camelCase conventions, so these rules deliberately do NOT apply there.
    // Icons live in a separate package (PascalCase, SVGR-generated) and are
    // unaffected. See docs/conventions.md → "Component structure (@chatool/ui)".
    files: ["packages/ui/src/**/*.{ts,tsx}"],
    plugins: { react, unicorn },
    settings: { react: { version: "detect" } },
    rules: {
      // Components are arrow functions.
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      // One component per file.
      "react/no-multi-comp": ["error", { ignoreStateless: false }],
      // Files (and folders) are kebab-case (e.g. button.tsx, button.types.ts,
      // use-logic.ts). Identifiers keep their natural case (Button, useLogic).
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      // Prefer arrow callbacks and concise arrow bodies.
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
    },
  },
  // Last: turn off ESLint's stylistic rules that overlap with Prettier so the
  // two tools never disagree. Prettier owns formatting; ESLint owns code quality.
  eslintConfigPrettier,
);
