/** @type {import("lint-staged").Configuration} */
export default {
  // Prettier formats every staged source file, repo-wide (apps included).
  "*.{ts,tsx,js,jsx,mjs,cjs,json,jsonc,md,css,yaml,yml}": "prettier --write",
  // ESLint --fix only where the root config applies; `apps/**` self-lints and is
  // ignored by the root config, so scoping here avoids "ignored file" errors.
  "packages/**/*.{ts,tsx}": "eslint --fix",
};
