"use client";

import { useEffect, useRef } from "react";

/** How far (CSS px) a press must travel before it becomes a drag. */
const SLOP_MOUSE = 4;
/** Touch / pen: Android's touch slop is 8dp. */
const SLOP_TOUCH = 8;
/** A release faster than this (px/ms) flings the handle to that side. */
const FLING_VELOCITY = 0.3;
/** Only movement this recent (ms) counts towards the release velocity. */
const VELOCITY_WINDOW = 100;

interface Gesture {
  id: number;
  /** Pointer x at press, in client px. */
  x0: number;
  /** Handle centre at press (off or on point), in the track's own px. */
  from: number;
  min: number;
  max: number;
  /** +1 LTR, −1 RTL: maps pointer movement onto the inline axis. */
  dir: number;
  /** Client px per track px (≠ 1 inside CSS transforms / zoom). */
  scale: number;
  slop: number;
  dragging: boolean;
  /** Current handle centre while dragging. */
  cx: number;
  samples: { x: number; t: number }[];
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * The switch's interaction island — everything the native checkbox can't do
 * by itself, attached to its **parent** (the switch host) on mount so the
 * switch shell needs no event wiring and stays a Server Component:
 *
 * - **Enter toggles** (MD3 accessibility: "Space or Enter"; APG: Enter is
 *   optional). It also stops Enter from implicitly submitting the form.
 * - **Press tracking** for touch and keyboard (`data-pressed`), so the handle
 *   grows to its 28dp pressed size wherever `:active` is unreliable (iOS
 *   Safari, Space in Safari).
 * - **Drag to toggle** (MD3: "Touch: Tap, Drag"). Past a small slop, the
 *   handle follows the pointer 1:1 (`--_drag-x`), clamped to the track; on
 *   release it lands on the side it was flung towards or, if released slowly,
 *   the side it's nearer to. The click the browser fires after a drag is
 *   swallowed and the switch is toggled with a real `input.click()` only if
 *   the side changed — so `onChange`, form state and controlled React all see
 *   exactly one ordinary toggle. A vertical swipe still scrolls the page
 *   (`touch-action: pan-y`), which cancels the gesture.
 *
 * Without JavaScript (before hydration) the switch still toggles on click,
 * tap and Space; this island only adds to it.
 */
const SwitchInteraction = () => {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = markerRef.current?.parentElement;
    const input = host?.querySelector<HTMLInputElement>(":scope > input");
    const track = host?.querySelector<HTMLElement>(
      ":scope > [data-slot=switch-track]",
    );
    if (!host || !input || !track) return;

    const isDisabled = () => input.matches(":disabled");
    const setPressed = (pressed: boolean) => {
      host.toggleAttribute("data-pressed", pressed);
    };

    let gesture: Gesture | null = null;
    let settleTimer = 0;
    let swallowClick: ((event: MouseEvent) => void) | null = null;

    const stopSwallowing = () => {
      if (swallowClick) window.removeEventListener("click", swallowClick, true);
      swallowClick = null;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || isDisabled()) return;
      if (event.key === "Enter") {
        event.preventDefault();
        if (!event.repeat) input.click();
      } else if (event.key === " " && !event.repeat) {
        setPressed(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === " ") setPressed(false);
    };

    const onBlur = () => {
      if (!gesture) setPressed(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || isDisabled()) return;
      if (event.target !== input) return;

      const width = track.offsetWidth;
      const height = track.offsetHeight;
      const rect = track.getBoundingClientRect();
      const min = height / 2;
      const max = width - height / 2;

      gesture = {
        id: event.pointerId,
        x0: event.clientX,
        from: input.checked ? max : min,
        min,
        max,
        dir: getComputedStyle(host).direction === "rtl" ? -1 : 1,
        scale: width > 0 ? rect.width / width : 1,
        slop: event.pointerType === "mouse" ? SLOP_MOUSE : SLOP_TOUCH,
        dragging: false,
        cx: input.checked ? max : min,
        samples: [],
      };
      setPressed(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      const g = gesture;
      if (!g || event.pointerId !== g.id) return;

      const dx = ((event.clientX - g.x0) / g.scale) * g.dir;
      if (!g.dragging) {
        if (Math.abs(dx) < g.slop) return;
        g.dragging = true;
        try {
          input.setPointerCapture(event.pointerId);
        } catch {
          // The pointer may already be gone; the drag still works without it.
        }
        host.setAttribute("data-dragging", "");
      }

      g.cx = clamp(g.from + dx, g.min, g.max);
      g.samples.push({ x: g.cx, t: event.timeStamp });
      g.samples = g.samples.filter(
        (sample) => event.timeStamp - sample.t <= VELOCITY_WINDOW,
      );
      host.style.setProperty("--_drag-x", `${g.cx}px`);
    };

    const endGesture = (event: PointerEvent, commit: boolean) => {
      const g = gesture;
      if (!g || event.pointerId !== g.id) return;
      gesture = null;

      if (!g.dragging) {
        // A plain press: the native click (if any) does the toggling.
        setPressed(false);
        return;
      }

      const recent = g.samples.filter(
        (sample) => event.timeStamp - sample.t <= VELOCITY_WINDOW,
      );
      const first = recent[0];
      const last = recent.at(-1);
      const velocity =
        first && last && last !== first
          ? (last.x - first.x) / Math.max(1, last.t - first.t)
          : 0;
      const on =
        Math.abs(velocity) >= FLING_VELOCITY
          ? velocity > 0
          : g.cx - g.min > (g.max - g.min) / 2;

      // The browser may fire a click for this pointerup (on the input, the
      // label row or a common ancestor). It must not toggle the switch on its
      // own: swallow it before anyone (React included) sees it, then settle.
      stopSwallowing();
      swallowClick = (click: MouseEvent) => {
        click.preventDefault();
        click.stopImmediatePropagation();
      };
      window.addEventListener("click", swallowClick, true);

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        stopSwallowing();
        // Release the handle in the same frame it gets its final side, so it
        // springs from where the finger left it.
        setPressed(false);
        host.removeAttribute("data-dragging");
        host.style.removeProperty("--_drag-x");
        if (commit && on !== input.checked && !isDisabled()) input.click();
      });
    };

    const onPointerUp = (event: PointerEvent) => endGesture(event, true);
    const onPointerCancel = (event: PointerEvent) => endGesture(event, false);

    input.addEventListener("keydown", onKeyDown);
    input.addEventListener("keyup", onKeyUp);
    input.addEventListener("blur", onBlur);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerCancel);

    return () => {
      input.removeEventListener("keydown", onKeyDown);
      input.removeEventListener("keyup", onKeyUp);
      input.removeEventListener("blur", onBlur);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerCancel);
      window.clearTimeout(settleTimer);
      stopSwallowing();
      host.removeAttribute("data-pressed");
      host.removeAttribute("data-dragging");
      host.style.removeProperty("--_drag-x");
    };
  }, []);

  return <span ref={markerRef} hidden />;
};

export default SwitchInteraction;
