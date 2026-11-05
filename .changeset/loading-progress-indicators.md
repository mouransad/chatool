---
"@chatool/ui": minor
---

Add the Material 3 loading family, built on a TypeScript port of Android's
`graphics-shapes` morphing:

- `@chatool/ui/loading-indicator`: the MD3 Expressive seven-shape morph, default or
  `contained`, with `value` to scrub it for pull-to-refresh.
- `@chatool/ui/linear-progress` and `@chatool/ui/circular-progress`: flat or wavy
  (wavy by default), determinate or indeterminate, with Android's handoff from
  indeterminate to determinate.

All three are client components that server-render their first frame, honor
`prefers-reduced-motion`, and pause while off-screen.
