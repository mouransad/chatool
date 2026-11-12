---
"@chatool/ui": minor
---

Add `@chatool/ui/tabs`: `Tabs`, `TabList`, `Tab`, `TabPanels` and `TabPanel`, the
Material 3 tabs with M3 **Expressive** motion.

- **Primary** (3dp content-width indicator, `3,3,0,0`, inset 2dp, min 24dp) and
  **secondary** (2dp full-width) variants from Compose's
  `{Primary,Secondary}NavigationTabTokens` and Material Web v34: 48dp / 64dp
  stacked containers, 24dp icons, `title-small` labels, a 1dp `outline-variant`
  divider, per-state colors, 8/10/10% state layers, the shared ripple and an
  inward 3dp `secondary` focus ring.
- **Elastic indicator**: the leading edge travels on the default-spatial spring
  and the trailing edge on the slow-spatial spring, so it stretches toward its
  target and settles (MDC-Android `elastic` on Expressive springs), with no corner
  distortion; also `slide` and `fade`. Interruptions continue from the live
  position; reduced motion fades.
- **Layouts**: fixed (`fill` / `center` / `start`) and scrollable (90dp min tabs,
  52dp edge offset, spring auto-centering, optional `scrollButtons`).
- **Icons** stacked or inline, `selectedIcon`, and **badges** (dot, count or a
  custom `<Badge />`) placed per MD3 (6dp overlap on icons, 4dp after labels).
- **Panels**: shared-axis X / fade enter transitions, `keepMounted`, and a
  **swipeable** content area whose swipes the indicator follows.
- WAI-ARIA APG tabs with MD3's manual activation (or `automatic`), one Tab stop,
  RTL, `asChild` route links, `onValueChange(value, { reason })`, per-part
  `classNames` and a full `--md-comp-tabs-*` token set.
