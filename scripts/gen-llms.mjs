#!/usr/bin/env node
// Generate `llms.txt` files — the LLM-oriented entry point (llmstxt.org) shipped
// inside each published package so an AI tool working in a consumer's repo finds
// usage guidance in node_modules, not just types.
//
// Two modes:
//   node scripts/gen-llms.mjs            → every packages/*/llms.txt + root llms.txt
//   node scripts/gen-llms.mjs <pkgDir>   → just that one package (used by prepack)
//
// Each package `llms.txt` is DERIVED (no editorial drift): metadata + exports come
// from package.json; the prose is lifted verbatim from the README's
// "## For AI agents" section. Edit the README — never hand-edit llms.txt.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

// Pull a single `## <heading>` section out of a markdown doc (heading text
// returned content excludes the heading line, trimmed; "" if absent).
function extractSection(markdown, heading) {
  const lines = markdown.split("\n");
  const start = lines.findIndex(
    (l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase(),
  );
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n").trim();
}

// Render the exports map into import-path bullets.
function renderExports(name, exportsMap) {
  if (!exportsMap || typeof exportsMap === "string") return [];
  return Object.keys(exportsMap)
    .filter((k) => k !== "./package.json")
    .map((sub) => {
      if (sub === ".") return `- \`${name}\``;
      if (sub.endsWith("*")) {
        const base = sub.replace(/^\.\//, "").replace(/\*$/, "");
        return `- \`${name}/${base}<Name>\` — any ${base || "subpath"} (wildcard)`;
      }
      return `- \`${name}${sub.replace(/^\./, "")}\``;
    });
}

function genPackage(pkgDir) {
  const pkgJsonPath = join(pkgDir, "package.json");
  if (!existsSync(pkgJsonPath)) return null;
  const pkg = readJSON(pkgJsonPath);
  const name = pkg.name;

  const peers = Object.keys(pkg.peerDependencies ?? {});
  const exportsBullets = renderExports(name, pkg.exports);

  const readmePath = join(pkgDir, "README.md");
  const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : "";
  const aiSection = extractSection(readme, "For AI agents");

  const lines = [];
  lines.push(`# ${name}`);
  lines.push("");
  if (pkg.description) {
    lines.push(`> ${pkg.description}`);
    lines.push("");
  }
  lines.push("## Install");
  lines.push("");
  lines.push("```bash");
  lines.push(`pnpm add ${name}`);
  if (peers.length) {
    lines.push(`# peers (install if your app doesn't already have them): ${peers.join(", ")}`);
  }
  lines.push("```");
  lines.push("");
  if (exportsBullets.length) {
    lines.push("## Exports");
    lines.push("");
    lines.push(...exportsBullets);
    lines.push("");
  }
  if (aiSection) {
    lines.push("## Usage rules");
    lines.push("");
    lines.push(aiSection);
    lines.push("");
  }
  lines.push("## Full reference");
  lines.push("");
  lines.push("See `README.md`, shipped alongside this file in the package.");
  lines.push("");

  const out = lines.join("\n");
  writeFileSync(join(pkgDir, "llms.txt"), out);
  return { name, description: pkg.description ?? "", dir: pkgDir };
}

function genRoot(packages) {
  const root = readJSON(join(repoRoot, "package.json"));
  const lines = [];
  lines.push("# Chatool");
  lines.push("");
  lines.push(`> ${root.description ?? "Registry-agnostic @chatool/* UI-kit packages for React apps."}`);
  lines.push("");
  lines.push(
    "Each package ships its own `README.md` (full reference) and `llms.txt` (this format) inside its npm tarball, so the docs are available in `node_modules`.",
  );
  lines.push("");
  lines.push("## Packages");
  lines.push("");
  for (const p of packages) {
    const rel = p.dir.replace(`${repoRoot}/`, "");
    lines.push(`- [${p.name}](${rel}/README.md): ${p.description}`);
  }
  lines.push("");
  lines.push("## Docs");
  lines.push("");
  lines.push("- Architecture, conventions, guides, and per-framework wiring: `docs/`");
  lines.push("- AI-agent instructions for working *in* this repo: `AGENTS.md`");
  lines.push("");
  writeFileSync(join(repoRoot, "llms.txt"), lines.join("\n"));
}

const arg = process.argv[2];
if (arg) {
  const result = genPackage(resolve(arg));
  if (!result) {
    console.error(`No package.json found in ${arg}`);
    process.exit(1);
  }
  console.log(`Generated ${result.name}/llms.txt`);
} else {
  const pkgsDir = join(repoRoot, "packages");
  const packages = readdirSync(pkgsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => genPackage(join(pkgsDir, d.name)))
    .filter(Boolean);
  genRoot(packages);
  console.log(`Generated ${packages.length} package llms.txt + root llms.txt`);
}
