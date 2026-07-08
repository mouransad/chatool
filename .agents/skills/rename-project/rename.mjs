#!/usr/bin/env node
// Rename engine for the `rename-project` skill.
//
// Re-brands the whole monorepo from one token to another, case-aware, in a
// single pass: package scope (`@old/*`), lowercase slugs, PascalCase identifiers
// (`defineOldConfig`, `OldLogoIcon`), display strings, and
// file/dir names. Designed so a fork can re-brand in one command.
//
// Usage:
//   node .agents/skills/rename-project/rename.mjs <newToken> [--old <oldToken>] [--dry]
//
// - <newToken>          the new brand token, e.g. "chatool"
// - --old <oldToken>    override the detected old token (default: scope of the
//                       root package.json name, falling back to "chatool")
// - --dry               print what would change without writing anything
//
// File set = `git ls-files` (tracked files only → excludes node_modules/, dist/,
// .git/, and anything gitignored), plus a small allowlist of known-untracked
// config files. pnpm-lock.yaml is skipped (regenerate it with `pnpm install`).

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const oldFlag = args.indexOf("--old");
const positional = args.filter(
  (a, i) => !a.startsWith("--") && args[i - 1] !== "--old",
);
const newToken = positional[0];

if (!newToken) {
  console.error("Usage: node rename.mjs <newToken> [--old <oldToken>] [--dry]");
  process.exit(1);
}

// Repo root = top of the git tree.
const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

// Detect the old token from the root package.json scope, else fall back.
function detectOldToken() {
  if (oldFlag !== -1 && args[oldFlag + 1]) return args[oldFlag + 1];
  try {
    const pkg = JSON.parse(
      readFileSync(join(repoRoot, "package.json"), "utf8"),
    );
    const m =
      /^@([^/]+)\//.exec(pkg.name ?? "") ||
      /^([a-z0-9]+)/i.exec(pkg.name ?? "");
    if (m) return m[1];
  } catch {
    /* ignore */
  }
  return "chatool";
}

const oldToken = detectOldToken();
if (oldToken.toLowerCase() === newToken.toLowerCase()) {
  console.error(
    `Old and new tokens are the same ("${oldToken}"). Nothing to do.`,
  );
  process.exit(1);
}

// Case-preserving replacement: match the old token case-insensitively and emit
// the new token in the same case shape as each individual hit.
const matcher = new RegExp(oldToken, "gi");
function casedReplacement(hit) {
  if (hit === hit.toUpperCase()) return newToken.toUpperCase();
  if (hit === hit.toLowerCase()) return newToken.toLowerCase();
  if (hit[0] === hit[0].toUpperCase()) {
    return newToken[0].toUpperCase() + newToken.slice(1).toLowerCase();
  }
  return newToken.toLowerCase();
}
const applyToken = (s) => s.replace(matcher, casedReplacement);

// ---- collect the file set ------------------------------------------------
const tracked = execFileSync("git", ["ls-files"], {
  cwd: repoRoot,
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const extraAllowlist = [".npmrc", ".claude/settings.local.json"];
const files = [
  ...new Set([
    ...tracked,
    ...extraAllowlist.filter((f) => existsSync(join(repoRoot, f))),
  ]),
];

const SKIP_CONTENT = new Set(["pnpm-lock.yaml"]);

function isBinary(buf) {
  // Treat a file as binary if it contains a NUL byte in the first 8KB.
  const len = Math.min(buf.length, 8192);
  for (let i = 0; i < len; i++) if (buf[i] === 0) return true;
  return false;
}

// ---- 1. rewrite file contents -------------------------------------------
let editedCount = 0;
const editedFiles = [];
for (const rel of files) {
  if (SKIP_CONTENT.has(rel)) continue;
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) continue;
  const buf = readFileSync(abs);
  if (isBinary(buf)) continue;
  const text = buf.toString("utf8");
  if (!matcher.test(text)) continue;
  matcher.lastIndex = 0;
  const next = applyToken(text);
  if (next !== text) {
    editedCount++;
    editedFiles.push(rel);
    if (!dry) writeFileSync(abs, next);
  }
}

// ---- 2. rename paths -----------------------------------------------------
// Transform any path component that contains the token (file basename *or* a
// parent directory segment). `git mv` creates intermediate dirs and leaves old
// empty dirs untracked, so per-file moves cover directory renames too.
const renames = [];
for (const rel of tracked) {
  matcher.lastIndex = 0;
  if (!matcher.test(rel)) continue;
  const to = rel.split("/").map(applyToken).join("/");
  if (to !== rel) renames.push({ from: rel, to });
}

for (const r of renames) {
  if (dry) continue;
  try {
    execFileSync("git", ["mv", r.from, r.to], { cwd: repoRoot });
  } catch {
    // Fall back to a plain rename if git mv refuses (e.g. untracked).
    renameSync(join(repoRoot, r.from), join(repoRoot, r.to));
  }
}

// ---- report --------------------------------------------------------------
console.log(`Rename: "${oldToken}" → "${newToken}"${dry ? " (dry run)" : ""}`);
console.log(`  files edited:  ${editedCount}`);
for (const f of editedFiles) console.log(`    ~ ${f}`);
console.log(`  paths renamed: ${renames.length}`);
for (const r of renames) console.log(`    → ${r.from}  ⇒  ${r.to}`);
console.log("");
console.log("Next steps:");
console.log(
  "  1. Adjust the root package.json name if you want a custom root name.",
);
console.log("  2. Update .npmrc / .npmrc.example for your registry/scope.");
console.log(
  "  3. pnpm install   # relink workspace + regenerate pnpm-lock.yaml",
);
console.log("  4. pnpm changeset # record a (major) release note");
console.log("  5. pnpm build && pnpm typecheck && pnpm lint");
console.log(
  `  6. grep -ri ${oldToken} . --exclude-dir={node_modules,dist,.git}  # expect no output`,
);
