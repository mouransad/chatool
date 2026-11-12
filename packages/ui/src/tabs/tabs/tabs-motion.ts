"use client";

import { type TabsIndicatorMotion } from "./tabs.types";

/*
 * Imperative motion for the tabs family: the travelling indicator, the
 * swipe-following indicator and spring scrolling. Framework-free DOM code —
 * the components call it from effects and event handlers, so no animation
 * frame ever re-renders React.
 */

/** Left-edge offset of an indicator from its resting position (px). */
export const INDICATOR_START = "--chatool-tabs-indicator-start";
/** Right-edge offset of an indicator from its resting position (px). */
export const INDICATOR_END = "--chatool-tabs-indicator-end";

let registered: boolean | null = null;

/**
 * Register the two edge offsets as `<length>` custom properties so the Web
 * Animations API can **interpolate** them (an unregistered custom property
 * only flips discretely). Once per page. Returns `false` when the browser
 * can't register them — the indicator then fades instead of travelling.
 */
export const registerIndicatorProperties = () => {
  if (registered !== null) return registered;
  if (typeof CSS === "undefined" || !("registerProperty" in CSS)) {
    registered = false;
    return registered;
  }
  for (const name of [INDICATOR_START, INDICATOR_END]) {
    try {
      CSS.registerProperty({
        name,
        syntax: "<length>",
        inherits: false,
        initialValue: "0px",
      });
    } catch {
      // Already registered (another copy of the library) — fine.
    }
  }
  registered = true;
  return registered;
};

/** The user asked for reduced motion. */
export const prefersReducedMotion = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** `"412ms"` / `"0.4s"` → milliseconds. */
const toMs = (value: string, fallback: number) => {
  const text = value.trim();
  const number = Number.parseFloat(text);
  if (Number.isNaN(number)) return fallback;
  return text.endsWith("ms")
    ? number
    : text.endsWith("s")
      ? number * 1000
      : number;
};

/**
 * The indicator's springs, read from the CSS locals the tab list resolves from
 * its `--md-comp-tabs-*` tokens (so overriding a token retimes the JS motion).
 */
const readMotion = (element: Element) => {
  const style = getComputedStyle(element);
  const easing = style.getPropertyValue("--_ti-ease").trim() || "ease-out";
  return {
    easing: CSS.supports("transition-timing-function", easing)
      ? easing
      : "cubic-bezier(0.2, 0, 0, 1)",
    lead: toMs(style.getPropertyValue("--_ti-lead"), 412),
    trail: toMs(style.getPropertyValue("--_ti-trail"), 567),
    fade: toMs(style.getPropertyValue("--_tb-fx-d"), 212),
  };
};

/** Every animation this module started on `element`. */
const OWN = "chatool-tabs";

/** Stop the indicator's running motion and drop any swipe offset. */
export const resetIndicator = (indicator: HTMLElement) => {
  for (const animation of indicator.getAnimations()) {
    if (animation.id === OWN) animation.cancel();
  }
  indicator.style.removeProperty(INDICATOR_START);
  indicator.style.removeProperty(INDICATOR_END);
};

/**
 * Move the newly selected tab's indicator in from where the previous one was
 * (`from`, its on-screen box — mid-flight boxes included, so interrupting a
 * motion continues smoothly from wherever it was).
 *
 * The indicator rests in place; we animate its **edge offsets** from the old
 * box to zero. In `elastic` mode the edge on the side of travel leads on the
 * default-spatial spring while the other trails on the slow-spatial spring, so
 * the indicator stretches toward its target and contracts as it lands. `slide`
 * moves both edges together; `fade` (and reduced motion) cross-fades.
 */
export const animateIndicator = (
  indicator: HTMLElement,
  from: DOMRect | null,
  motion: TabsIndicatorMotion,
) => {
  resetIndicator(indicator);
  const timing = readMotion(indicator);
  const to = indicator.getBoundingClientRect();

  const travel =
    motion !== "fade" &&
    !prefersReducedMotion() &&
    registerIndicatorProperties() &&
    from !== null &&
    from.width > 0 &&
    to.width > 0;

  if (!travel) {
    // `fade` mode transitions opacity in CSS already.
    if (motion !== "fade" && from !== null) {
      indicator.animate([{ opacity: 0 }, { opacity: 1 }], {
        id: OWN,
        duration: timing.fade,
        easing: "linear",
      });
    }
    return;
  }

  const dl = from.left - to.left;
  const dr = from.right - to.right;
  if (Math.abs(dl) < 0.5 && Math.abs(dr) < 0.5) return;

  const movingRight = from.left + from.right < to.left + to.right;
  const elastic = motion === "elastic";
  // The edge facing the destination leads; the other trails.
  const leftDuration = elastic && movingRight ? timing.trail : timing.lead;
  const rightDuration = elastic && !movingRight ? timing.trail : timing.lead;

  const options = (duration: number): KeyframeAnimationOptions => ({
    id: OWN,
    duration,
    easing: timing.easing,
    fill: "backwards",
  });
  indicator.animate(
    [{ [INDICATOR_START]: `${dl}px` }, { [INDICATOR_START]: "0px" }],
    options(leftDuration),
  );
  indicator.animate(
    [{ [INDICATOR_END]: `${dr}px` }, { [INDICATOR_END]: "0px" }],
    options(rightDuration),
  );
};

/** Ease-out sine: the leading edge of a swipe (MDC elastic interpolator). */
const decelerate = (f: number) => Math.sin((f * Math.PI) / 2);
/** Ease-in sine: the trailing edge. */
const accelerate = (f: number) => 1 - Math.cos((f * Math.PI) / 2);

/**
 * Follow a swipe: place `indicator` (the selected tab's) on the box between
 * the indicators of the two tabs the pager is between (`a` → `b`, fraction
 * `f`). `toward` is the box the swipe is heading to — its side's edge leads,
 * the other trails, like MDC-Android's elastic `TabLayout` on a `ViewPager`.
 */
export const displaceIndicator = (
  indicator: HTMLElement,
  a: DOMRect,
  b: DOMRect,
  f: number,
  motion: TabsIndicatorMotion,
  towardB: boolean,
) => {
  if (!registerIndicatorProperties()) return;
  for (const animation of indicator.getAnimations()) {
    if (animation.id === OWN) animation.cancel();
  }
  indicator.style.removeProperty(INDICATOR_START);
  indicator.style.removeProperty(INDICATOR_END);
  const rest = indicator.getBoundingClientRect();

  const bIsRight = b.left + b.right > a.left + a.right;
  let fl = f;
  let fr = f;
  if (motion === "elastic") {
    // Progress measured from the side the swipe is leaving.
    const p = towardB ? f : 1 - f;
    const lead = decelerate(p);
    const trail = accelerate(p);
    // Which physical edge leads: the one on the destination's side.
    const destinationIsRight = towardB ? bIsRight : !bIsRight;
    const leftP = destinationIsRight ? trail : lead;
    const rightP = destinationIsRight ? lead : trail;
    fl = towardB ? leftP : 1 - leftP;
    fr = towardB ? rightP : 1 - rightP;
  }
  const left = a.left + (b.left - a.left) * fl;
  const right = a.right + (b.right - a.right) * fr;
  indicator.style.setProperty(INDICATOR_START, `${left - rest.left}px`);
  indicator.style.setProperty(INDICATOR_END, `${right - rest.right}px`);
};

/* ---------------------------- spring scrolling --------------------------- */

/**
 * Compose's default-spatial spring (`dampingRatio = 0.8`, `stiffness = 380`,
 * mass 1), evaluated analytically: progress 0 → 1 (with ~1.5% overshoot) at
 * `t` seconds. Compose scrolls a scrollable tab row with it.
 */
const ZETA = 0.8;
const OMEGA = Math.sqrt(380);
const OMEGA_D = OMEGA * Math.sqrt(1 - ZETA * ZETA);
const SPRING_MS = 412;

const spring = (t: number) =>
  1 -
  Math.exp(-ZETA * OMEGA * t) *
    (Math.cos(OMEGA_D * t) +
      ((ZETA * OMEGA) / OMEGA_D) * Math.sin(OMEGA_D * t));

const scrolls = new WeakMap<HTMLElement, () => void>();

/** Stop a running spring scroll on `element`. */
export const cancelSpringScroll = (element: HTMLElement) => {
  scrolls.get(element)?.();
};

/** Largest scroll distance of a horizontal scroller. */
const maxScroll = (element: HTMLElement) =>
  Math.max(0, element.scrollWidth - element.clientWidth);

/**
 * Clamp a `scrollLeft` target to the scroller's range (`[0, max]`, or
 * `[-max, 0]` in RTL, where scrolling toward the end is negative).
 */
const clampScroll = (element: HTMLElement, target: number, rtl: boolean) => {
  const max = maxScroll(element);
  return rtl
    ? Math.min(0, Math.max(-max, target))
    : Math.max(0, Math.min(max, target));
};

/**
 * Scroll `element` horizontally by `delta` px on the default-spatial spring.
 * Cancels on the next user wheel / pointer / touch, and jumps under reduced
 * motion. `onDone` runs when it settles or is cancelled.
 */
export const springScrollBy = (
  element: HTMLElement,
  delta: number,
  {
    rtl,
    instant = false,
    onDone,
  }: {
    rtl: boolean;
    instant?: boolean;
    onDone?: () => void;
  },
) => {
  cancelSpringScroll(element);
  const start = element.scrollLeft;
  const target = clampScroll(element, start + delta, rtl);
  if (Math.abs(target - start) < 0.5) {
    onDone?.();
    return;
  }
  if (instant || prefersReducedMotion()) {
    element.scrollLeft = target;
    onDone?.();
    return;
  }

  let frame = 0;
  let done = false;
  const began = performance.now();
  const stop = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    element.removeEventListener("wheel", stop);
    element.removeEventListener("pointerdown", stop);
    element.removeEventListener("touchstart", stop);
    scrolls.delete(element);
    onDone?.();
  };
  const tick = (now: number) => {
    const elapsed = now - began;
    if (elapsed >= SPRING_MS) {
      element.scrollLeft = target;
      stop();
      return;
    }
    element.scrollLeft = start + (target - start) * spring(elapsed / 1000);
    frame = requestAnimationFrame(tick);
  };
  element.addEventListener("wheel", stop, { passive: true });
  element.addEventListener("pointerdown", stop);
  element.addEventListener("touchstart", stop, { passive: true });
  scrolls.set(element, stop);
  frame = requestAnimationFrame(tick);
};

/**
 * How far to scroll `scroller` so `target` is centered (Compose:
 * `calculateTabOffset` — the clamp happens in `springScrollBy`).
 */
export const centerDelta = (scroller: HTMLElement, target: HTMLElement) => {
  const s = scroller.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  return t.left + t.width / 2 - (s.left + s.width / 2);
};

/**
 * How far to scroll `scroller` so `target` is fully visible with `margin` px
 * to spare (Material Web keeps a focused tab 48px clear of the edges); `0` if
 * it already is.
 */
export const revealDelta = (
  scroller: HTMLElement,
  target: HTMLElement,
  margin: number,
) => {
  const s = scroller.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  if (t.left < s.left + margin) return t.left - (s.left + margin);
  if (t.right > s.right - margin) return t.right - (s.right - margin);
  return 0;
};
