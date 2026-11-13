/*
 * Shared configuration for the `@chatool/ui` **snackbar** family. Every number
 * here comes from a real Material source, cited inline:
 *
 * - m3.material.io/components/snackbar (specs, guidelines, accessibility),
 * - Compose `material3` `Snackbar.kt`, `SnackbarHost.kt`, `SnackbarTokens.kt`
 *   (v0_103) and `ExpressiveMotionTokens.kt`,
 * - MDC-Android `snackbar/` (`BaseTransientBottomBar`, `SnackbarManager`,
 *   `SnackbarContentLayout`, `res/values*`) and `behavior/SwipeDismissBehavior`,
 * - MDC-web `mdc-snackbar` (`constants.ts`).
 */

/**
 * Auto-dismiss timings, in ms.
 *
 * - `short` / `long`: Compose's `SnackbarDuration.Short` (4000ms) and
 *   `.Long` (10000ms). They are also the bounds MD3 gives ("auto-dismiss
 *   after 4–10 seconds") and MDC-web enforces (`MIN_/MAX_AUTO_DISMISS_TIMEOUT_MS`).
 * - `auto`: reading time for the message. A base plus a per-character
 *   allowance, clamped to the same 4–10s, so a short "Saved" stays 4s and a
 *   two-line message gets more time (WCAG 2.2.1 Timing Adjustable).
 */
export const TIMING = {
  short: 4000,
  long: 10_000,
  autoBase: 1000,
  autoPerCharacter: 60,
  min: 4000,
  max: 10_000,
} as const;

/**
 * The delay before a new message reaches the live region. A live region only
 * announces **changes**, and some screen readers drop a change made in the
 * same frame the region is inserted or shown (MDC-web waits 1000ms for IE 11,
 * Radix waits a tick). 150ms is enough for current engines and imperceptible.
 */
export const ANNOUNCE_DELAY = 150;

/**
 * Swipe-to-dismiss, from MDC-Android's `SwipeDismissBehavior` as the snackbar
 * configures it (`BaseTransientBottomBar.BehaviorDelegate`):
 *
 * - `threshold`: a release past **50%** of the width dismisses
 *   (`DEFAULT_DRAG_DISMISS_THRESHOLD`).
 * - `alphaStart` / `alphaEnd`: the snackbar is opaque until **10%** of its
 *   width, then fades linearly to transparent at **60%**
 *   (`setStartAlphaSwipeDistance(0.1f)`, `setEndAlphaSwipeDistance(0.6f)`).
 * - `flingVelocity`: a release moving faster than this (px/ms) in an allowed
 *   direction dismisses at any distance. Android uses the platform's minimum
 *   fling velocity (50dp/s), which is too twitchy for a mouse; 0.25px/ms keeps
 *   a deliberate flick working on touch without catching a slow drag.
 * - `slop`: movement before a press turns into a swipe (Android's 8dp touch
 *   slop), so taps on the action still click.
 * - `settle`: the fling-out / snap-back duration (ViewDragHelper settles in
 *   ~250ms for a snackbar-sized distance).
 */
export const SWIPE = {
  threshold: 0.5,
  alphaStart: 0.1,
  alphaEnd: 0.6,
  flingVelocity: 0.25,
  slop: 8,
  settle: 250,
} as const;

/**
 * MDC-Android's `design_snackbar_action_inline_max_width` (128dp): on compact
 * screens a **wrapping** message whose action is wider than this moves the
 * action to its own line (`SnackbarContentLayout.onMeasure`). On `sw600dp`
 * the value is 0 (never), mirrored by {@link COMPACT_MAX_WIDTH}.
 */
export const INLINE_ACTION_MAX_WIDTH = 128;

/** MD3 compact window class: narrower than 600dp. */
export const COMPACT_MAX_WIDTH = 600;

/** MD3 suggests a shortcut "like Alt+G" to reach an actionable snackbar. */
export const DEFAULT_HOTKEY = ["altKey", "KeyG"] as const;
