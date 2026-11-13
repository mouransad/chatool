import { SWIPE } from "../config";
import { type SnackbarSwipeDirection } from "./snackbar.types";

/*
 * Swipe-to-dismiss for one snackbar: a framework-free port of MDC-Android's
 * `SwipeDismissBehavior` as the snackbar configures it. It writes `translate`,
 * `opacity` and `transition` straight onto the element (no React state per
 * pointer move) and reports the outcome.
 *
 * - A press becomes a swipe only past an 8dp slop along an allowed axis, so
 *   taps still click and the page still scrolls on the other axis.
 * - Movement in a disallowed direction is clamped at 0 (ViewDragHelper's
 *   `clampViewPositionHorizontal`).
 * - Opacity stays 1 until 10% of the width, then falls linearly to 0 at 60%.
 * - Release: a fling in an allowed direction, or a drag past 50% of the
 *   width, throws it off that edge; anything else springs back.
 */

export interface SwipeOptions {
  directions: readonly SnackbarSwipeDirection[];
  /** Pointer went down and a swipe started (pause the timer). */
  onStart: () => void;
  /** Released without dismissing (resume the timer). */
  onCancel: () => void;
  /** Thrown off; called once the fling-out finishes. */
  onDismiss: () => void;
}

interface Sample {
  t: number;
  v: number;
}

const settleEasing = "cubic-bezier(0.05, 0.7, 0.1, 1)"; // MD3 emphasized decelerate
const springBack = "var(--_ov-spatial, ease-out)"; // Expressive fast spatial

export const attachSwipe = (element: HTMLElement, options: SwipeOptions) => {
  const { directions } = options;
  const horizontal = directions.some((d) => d === "start" || d === "end");
  const vertical = directions.some((d) => d === "up" || d === "down");
  if (!horizontal && !vertical) return () => {};

  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let axis: "x" | "y" | null = null;
  let offset = 0;
  let samples: Sample[] = [];
  let suppressClick = false;
  let settling = false;

  const rtl = () => getComputedStyle(element).direction === "rtl";

  /** Allowed sign of movement along the active axis (+1 / −1). */
  const allowed = (sign: 1 | -1) => {
    if (axis === "x") {
      const towardEnd = rtl() ? sign < 0 : sign > 0;
      return directions.includes(towardEnd ? "end" : "start");
    }
    return directions.includes(sign > 0 ? "down" : "up");
  };

  const size = () =>
    axis === "x" ? element.offsetWidth : element.offsetHeight;

  const paint = (value: number) => {
    offset = value;
    element.style.translate = axis === "x" ? `${value}px 0` : `0 ${value}px`;
    const extent = size() || 1;
    const distance = Math.abs(value);
    const start = extent * SWIPE.alphaStart;
    const end = extent * SWIPE.alphaEnd;
    const alpha =
      distance <= start
        ? 1
        : distance >= end
          ? 0
          : 1 - (distance - start) / (end - start);
    element.style.opacity = String(alpha);
  };

  const reset = () => {
    element.style.removeProperty("translate");
    element.style.removeProperty("opacity");
    element.style.removeProperty("transition");
    delete element.dataset.swiping;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (
      pointerId !== null ||
      settling ||
      !event.isPrimary ||
      event.button !== 0
    ) {
      return;
    }
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    axis = null;
    offset = 0;
    samples = [];
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (axis === null) {
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) < SWIPE.slop) return;
      const candidate = ax >= ay ? "x" : "y";
      if (
        (candidate === "x" && !horizontal) ||
        (candidate === "y" && !vertical)
      ) {
        // Moving along an axis we don't swipe on: it's a scroll, let it go.
        pointerId = null;
        return;
      }
      axis = candidate;
      try {
        element.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already be gone.
      }
      element.dataset.swiping = "";
      element.style.transition = "none";
      suppressClick = true;
      options.onStart();
    }

    const raw = axis === "x" ? dx : dy;
    const sign: 1 | -1 = raw >= 0 ? 1 : -1;
    const value = allowed(sign) ? raw : 0;
    samples.push({ t: event.timeStamp, v: value });
    if (samples.length > 6) samples.shift();
    paint(value);
  };

  const velocity = () => {
    // Over the last ~100ms of movement, in px/ms.
    const last = samples[samples.length - 1];
    if (!last) return 0;
    const first =
      samples.find((sample) => last.t - sample.t <= 100) ?? samples[0]!;
    const dt = last.t - first.t;
    return dt > 0 ? (last.v - first.v) / dt : 0;
  };

  const settle = (target: number, dismiss: boolean) => {
    settling = true;
    const duration = `${SWIPE.settle}ms`;
    const easing = dismiss ? settleEasing : springBack;
    element.style.transition = `translate ${duration} ${easing}, opacity ${duration} ${easing}`;
    // Commit the current position before moving, so the transition runs.
    void element.offsetWidth;
    if (dismiss) {
      paint(target);
    } else {
      element.style.translate = "0 0";
      element.style.opacity = "1";
    }
    window.setTimeout(() => {
      settling = false;
      if (dismiss) {
        options.onDismiss();
      } else {
        reset();
        options.onCancel();
      }
    }, SWIPE.settle);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    if (axis === null) return;
    delete element.dataset.swiping;

    const v = velocity();
    const extent = size();
    const fling = Math.abs(v) >= SWIPE.flingVelocity && allowed(v > 0 ? 1 : -1);
    const far = Math.abs(offset) >= extent * SWIPE.threshold && offset !== 0;
    if (fling || far) {
      const sign = fling ? (v > 0 ? 1 : -1) : offset > 0 ? 1 : -1;
      settle(sign * extent, true);
    } else {
      settle(0, false);
    }
  };

  const onPointerCancel = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    if (axis !== null) settle(0, false);
  };

  // A swipe that started on the action must not also press it.
  const onClick = (event: MouseEvent) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
  const onPointerDownCapture = () => {
    suppressClick = false;
  };

  element.dataset.swipeAxis =
    horizontal && vertical ? "xy" : horizontal ? "x" : "y";
  element.addEventListener("pointerdown", onPointerDownCapture, true);
  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointercancel", onPointerCancel);
  element.addEventListener("click", onClick, true);

  return () => {
    element.removeEventListener("pointerdown", onPointerDownCapture, true);
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", onPointerUp);
    element.removeEventListener("pointercancel", onPointerCancel);
    element.removeEventListener("click", onClick, true);
    delete element.dataset.swipeAxis;
    if (!settling) reset();
  };
};
