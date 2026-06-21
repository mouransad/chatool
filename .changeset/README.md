# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

- Run `pnpm changeset` to record a change (pick the packages + bump type, write a summary).
- Run `pnpm version-packages` to consume changesets and bump versions + changelogs.
- Run `pnpm release` to build all packages and `changeset publish` to the configured registry.

`access` is `public`; override per-package with `publishConfig.access` in each `package.json`.
