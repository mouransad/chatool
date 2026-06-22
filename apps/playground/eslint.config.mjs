import next from "eslint-config-next";

/**
 * Flat ESLint config for the playground. `next lint` was removed in Next 16, so
 * the app lints with ESLint directly; `eslint-config-next` ships a native flat
 * config array (core-web-vitals + TypeScript rules).
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**"] },
  ...next,
];

export default eslintConfig;
