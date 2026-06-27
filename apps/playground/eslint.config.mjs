import next from "eslint-config-next";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Flat ESLint config for the playground. `next lint` was removed in Next 16, so
 * the app lints with ESLint directly; `eslint-config-next` ships a native flat
 * config array (core-web-vitals + TypeScript rules). `eslint-config-prettier`
 * is last so Prettier owns formatting.
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**"] },
  ...next,
  eslintConfigPrettier,
];

export default eslintConfig;
