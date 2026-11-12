"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
  type Ref,
  type RefCallback,
} from "react";

import {
  UNMEASURED,
  computeLayout,
  fromFraction,
  keyStep,
  snap,
  stepBy,
  toFraction,
  type SliderMeasure,
  type SliderMode,
  type SliderScale,
} from "./slider-math";
import { type SliderOrientation } from "./slider.types";

interface UseLogicOptions {
  mode: SliderMode;
  value: readonly number[] | undefined;
  defaultValue: readonly number[];
  onValueChange: ((value: number[]) => void) | undefined;
  onValueCommit: ((value: number[]) => void) | undefined;
  scale: SliderScale;
  /** Stop dots are drawn (→ the stop-aligned handle placement). */
  stopsShown: boolean;
  largeStep: number;
  /** Range only: the minimum handle distance, in steps (or stops). */
  minStepsBetweenThumbs: number;
  disabled: boolean;
  haptics: boolean;
  orientation: SliderOrientation;
  ref: Ref<HTMLDivElement> | undefined;
  inputRefs: readonly (Ref<HTMLInputElement> | undefined)[];
}

/** Touch must travel this far along the track before it counts as a drag. */
const TOUCH_SLOP = 6;
/** Pressing within this distance of a handle grabs it without a jump. */
const GRAB_RADIUS = 20;

const assignRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
};

const sameValues = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

interface DragState {
  pointerId: number;
  thumb: number;
  /** px between the grab point and the handle centre (kept while dragging). */
  offset: number;
  /** Both handles sit on the same spot: the first move picks one. */
  tie: boolean;
  /** Touch that hasn't moved past the slop yet (could still be a scroll). */
  pending: boolean;
  /** The press landed on a handle (a tap there changes nothing). */
  grabbed: boolean;
  start: number;
  startValues: readonly number[];
  moved: boolean;
}

/**
 * Slider behavior, shared by `Slider` and `RangeSlider`:
 *
 * - **State** — controlled (`value`) or uncontrolled (`defaultValue`), with
 *   snapping to `step` / custom stops and range handles that never cross.
 * - **Pointer** (mouse, pen, touch) on the whole slider: press-and-drag
 *   anywhere, the nearest handle follows; pressing a handle grabs it without a
 *   jump; clicking the track jumps there (MD3 "select jump"). Pointer capture
 *   keeps the drag alive outside the slider. Touch waits for a few px of
 *   movement *along* the track first, so a page scroll across the slider never
 *   changes the value (`touch-action` lets the browser have the other axis).
 * - **Keyboard** (WAI-ARIA APG slider + MD3): arrows ±1 step (following what's
 *   on screen in RTL / vertical / inverted), Page Up / Page Down and
 *   Shift+Arrow or Space+Arrow ± the large step, Home / End to the ends.
 * - **Assistive tech** adjusting the native `<input type="range">` (iOS
 *   VoiceOver, TalkBack) lands through its `change` event.
 * - **Measurement** — a `ResizeObserver` reads the track length and the
 *   CSS-token geometry so the view can drop sub-corner track slivers, hide
 *   stops under the handle gap, and place the inset icon.
 */
export const useLogic = ({
  mode,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  scale,
  stopsShown,
  largeStep,
  minStepsBetweenThumbs,
  disabled,
  haptics,
  orientation,
  ref,
  inputRefs,
}: UseLogicOptions) => {
  const [uncontrolled, setUncontrolled] =
    useState<readonly number[]>(defaultValue);
  const values = value ?? uncontrolled;
  const [pressed, setPressed] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [measure, setMeasure] = useState<SliderMeasure>(UNMEASURED);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const drag = useRef<DragState | null>(null);
  const spaceHeld = useRef(false);
  // The latest values for event handlers that fire between renders (several
  // pointer moves can land before React re-renders).
  const latest = useRef(values);
  useEffect(() => {
    latest.current = values;
  }, [values]);
  const defaults = useRef(defaultValue);

  const fractions = values.map((v) => toFraction(v, scale));
  const layout = computeLayout(mode, fractions, stopsShown, measure);

  /* ------------------------------------------------------------- state -- */

  /** Where handle `index` may go, given the other handle (range only). */
  const bounds = useCallback(
    (index: number, current: readonly number[]): [number, number] => {
      if (mode !== "range") return [scale.min, scale.max];
      const other = current[index === 0 ? 1 : 0] ?? scale.min;
      if (scale.allowed?.length) {
        const at = scale.allowed.indexOf(snap(other, scale));
        const shift = Math.max(0, minStepsBetweenThumbs);
        return index === 0
          ? [scale.min, scale.allowed[Math.max(0, at - shift)] ?? other]
          : [
              scale.allowed[Math.min(scale.allowed.length - 1, at + shift)] ??
                other,
              scale.max,
            ];
      }
      const gap = Math.max(0, minStepsBetweenThumbs) * keyStep(scale);
      return index === 0
        ? [scale.min, Math.max(scale.min, other - gap)]
        : [Math.min(scale.max, other + gap), scale.max];
    },
    [mode, scale, minStepsBetweenThumbs],
  );

  /** Sets handle `index` (snapped, bounded); returns the new values. */
  const update = useCallback(
    (index: number, raw: number): readonly number[] => {
      const current = latest.current;
      const [lo, hi] = bounds(index, current);
      const next = snap(raw, scale, lo, hi);
      if (next === current[index]) return current;
      const nextValues = current.map((v, i) => (i === index ? next : v));
      latest.current = nextValues;
      if (value === undefined) setUncontrolled(nextValues);
      onValueChange?.(nextValues);
      if (haptics && drag.current?.moved) navigator.vibrate?.(8);
      return nextValues;
    },
    [bounds, scale, value, onValueChange, haptics],
  );

  const commit = useCallback(
    (before: readonly number[]) => {
      const after = latest.current;
      if (!sameValues(before, after)) onValueCommit?.([...after]);
    },
    [onValueCommit],
  );

  /* ------------------------------------------------------- measurement -- */

  const measureNow = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const vertical = orientation === "vertical";
    const axis = (el: HTMLElement) =>
      vertical ? el.offsetHeight : el.offsetWidth;
    const style = getComputedStyle(track);
    const thumb = track.querySelector<HTMLElement>("[data-slot=slider-thumb]");
    const segment = track.querySelector<HTMLElement>("[data-outer=none]");
    const icon = track.querySelector<HTMLElement>("[data-slot=slider-icon]");
    const gap = Number.parseFloat(style.columnGap) || 0;
    const next: SliderMeasure = {
      length: axis(track),
      corner: Number.parseFloat(style.rowGap) || 0,
      insideCorner: segment
        ? Number.parseFloat(getComputedStyle(segment).borderStartStartRadius) ||
          0
        : 2,
      gap,
      edge: (thumb ? axis(thumb) : 4) / 2 + gap,
      iconBox: icon ? axis(icon) : Number.NaN,
    };
    setMeasure((prev) =>
      (Object.keys(next) as (keyof SliderMeasure)[]).every((k) =>
        Object.is(prev[k], next[k]),
      )
        ? prev
        : next,
    );
  }, [orientation]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measureNow();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measureNow);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measureNow]);

  /* -------------------------------------------------------- form reset -- */

  useEffect(() => {
    const form = inputs.current[0]?.form;
    if (!form || value !== undefined) return;
    const onReset = () => {
      latest.current = defaults.current;
      setUncontrolled(defaults.current);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [value]);

  /* -------------------------------------------------------------- refs -- */

  const setRootRef = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const setTrackRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    trackRef.current = node;
  }, []);

  // Stable per-index callbacks, so React doesn't detach/reattach every render.
  const inputRefCallbacks = useRef<RefCallback<HTMLInputElement>[]>([]);
  const userInputRefs = useRef(inputRefs);
  userInputRefs.current = inputRefs;
  const inputRef = (index: number) =>
    (inputRefCallbacks.current[index] ??= (node) => {
      inputs.current[index] = node;
      assignRef(userInputRefs.current[index], node);
    });

  /* ----------------------------------------------------------- pointer -- */

  const isDisabled = () =>
    disabled ||
    inputs.current.some(
      (input) => input?.disabled || input?.matches(":disabled"),
    );

  /** Track geometry in client px (honours CSS transforms on ancestors). */
  const geometry = (clientX: number, clientY: number) => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root) return null;
    const rect = track.getBoundingClientRect();
    const vertical = orientation === "vertical";
    const rtl = getComputedStyle(root).direction === "rtl";
    const length = vertical ? rect.height : rect.width;
    const position = vertical
      ? rtl
        ? rect.bottom - clientY
        : clientY - rect.top
      : rtl
        ? rect.right - clientX
        : clientX - rect.left;
    // Corner in client px (the layout value scaled by any ancestor transform).
    const scaleFactor =
      Number.isFinite(measure.length) && measure.length > 0
        ? length / measure.length
        : 1;
    const corner =
      (Number.isFinite(measure.corner) ? measure.corner : 0) * scaleFactor;
    return { length, position, corner, cross: vertical ? clientX : clientY };
  };

  const valueAt = (position: number, g: { length: number; corner: number }) => {
    const span = stopsShown ? g.length - 2 * g.corner : g.length;
    const from = stopsShown ? position - g.corner : position;
    return fromFraction(span > 0 ? from / span : 0, scale);
  };

  const centerAt = (index: number, g: { length: number; corner: number }) => {
    const f = toFraction(latest.current[index] ?? scale.min, scale);
    const k = stopsShown && f > 0 && f < 1 ? 1 : 0;
    return k * g.corner + f * (g.length - 2 * k * g.corner);
  };

  const focusThumb = (index: number) => {
    const input = inputs.current[index];
    if (input && document.activeElement !== input)
      input.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
  };

  const begin = (state: DragState, target: Element) => {
    state.pending = false;
    try {
      target.setPointerCapture(state.pointerId);
    } catch {
      // The pointer may already be gone; the drag simply ends on its own.
    }
    focusThumb(state.thumb);
    setPressed(state.thumb);
  };

  const end = () => {
    const state = drag.current;
    drag.current = null;
    setPressed(null);
    setDragging(false);
    if (state) commit(state.startValues);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary || isDisabled()) return;
    const g = geometry(event.clientX, event.clientY);
    if (!g) return;
    const current = latest.current;

    let thumb = 0;
    let tie = false;
    if (current.length > 1) {
      const c0 = centerAt(0, g);
      const c1 = centerAt(1, g);
      if (Math.abs(c1 - c0) < 1) {
        // Stacked handles: pick by side; a press right on them waits for the
        // first move to choose (towards the end → the end handle).
        thumb =
          g.position > c1
            ? 1
            : g.position < c0
              ? 0
              : current[0] === scale.min
                ? 1
                : 0;
        tie = Math.abs(g.position - c0) <= GRAB_RADIUS;
      } else {
        thumb = Math.abs(g.position - c0) <= Math.abs(g.position - c1) ? 0 : 1;
      }
    }
    const center = centerAt(thumb, g);
    const grabbed = Math.abs(g.position - center) <= GRAB_RADIUS;
    const state: DragState = {
      pointerId: event.pointerId,
      thumb,
      offset: grabbed ? center - g.position : 0,
      tie,
      pending: event.pointerType === "touch",
      grabbed,
      start: g.position,
      startValues: current,
      moved: false,
    };
    drag.current = state;

    if (state.pending) {
      // Touch: show the press only when the finger is on a handle; wait for
      // movement before changing anything (it may be a scroll).
      if (grabbed) setPressed(thumb);
      return;
    }
    event.preventDefault(); // no text selection, no focus theft
    begin(state, event.currentTarget);
    if (!grabbed) update(thumb, valueAt(g.position, g));
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const g = geometry(event.clientX, event.clientY);
    if (!g) return;
    if (state.pending) {
      if (Math.abs(g.position - state.start) < TOUCH_SLOP) return;
      begin(state, event.currentTarget);
    }
    if (state.tie) {
      state.tie = false;
      const thumb = g.position > state.start ? 1 : 0;
      if (thumb !== state.thumb) {
        state.thumb = thumb;
        focusThumb(thumb);
        setPressed(thumb);
      }
    }
    if (!state.moved) {
      state.moved = true;
      setDragging(true);
    }
    update(state.thumb, valueAt(g.position + state.offset, g));
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    if (state.pending) {
      // A tap: focus the handle and jump there (unless it was on the handle).
      focusThumb(state.thumb);
      const g = geometry(event.clientX, event.clientY);
      if (g && !state.grabbed) update(state.thumb, valueAt(g.position, g));
    }
    end();
  };

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) end();
  };

  /* ---------------------------------------------------------- keyboard -- */

  const onKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (isDisabled()) return;
      if (event.key === " ") {
        // MD3: "Space & arrows" moves by the larger interval.
        spaceHeld.current = true;
        event.preventDefault();
        return;
      }
      const root = rootRef.current;
      const vertical = orientation === "vertical";
      // +1 when the inline axis runs left→right (horizontal) / bottom→top
      // (vertical, the default); -1 when RTL / inverted flips it.
      const rtl = root ? getComputedStyle(root).direction === "rtl" : false;
      const screen = vertical ? (rtl ? 1 : -1) : rtl ? -1 : 1;
      const large = event.shiftKey || spaceHeld.current;

      let count: number | undefined;
      let target: "lo" | "hi" | undefined;
      switch (event.key) {
        case "ArrowRight":
          count = vertical ? 1 : screen;
          break;
        case "ArrowLeft":
          count = vertical ? -1 : -screen;
          break;
        case "ArrowUp":
          count = vertical ? screen : 1;
          break;
        case "ArrowDown":
          count = vertical ? -screen : -1;
          break;
        case "PageUp":
          count = 1;
          break;
        case "PageDown":
          count = -1;
          break;
        case "Home":
          target = "lo";
          break;
        case "End":
          target = "hi";
          break;
        default:
          return;
      }
      event.preventDefault();
      const before = latest.current;
      const current = before[index] ?? scale.min;
      const [lo, hi] = bounds(index, before);
      let next: number;
      if (target) next = target === "lo" ? lo : hi;
      else {
        const isLarge =
          large || event.key === "PageUp" || event.key === "PageDown";
        const amount = isLarge ? largeStep : keyStep(scale);
        const stopsJump = scale.allowed?.length
          ? isLarge
            ? Math.max(1, Math.round(scale.allowed.length / 10))
            : 1
          : 1;
        next = stepBy(current, (count ?? 0) * stopsJump, amount, scale, lo, hi);
      }
      update(index, next);
      commit(before);
    };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") spaceHeld.current = false;
  };

  const onBlur = () => {
    spaceHeld.current = false;
  };

  /** Assistive tech (and any native adjustment) changing the input. */
  const onInputChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      if (isDisabled()) return;
      const next = Number(event.currentTarget.value);
      if (!Number.isFinite(next)) return;
      const before = latest.current;
      update(index, next);
      commit(before);
    };

  return {
    values,
    fractions,
    layout,
    measure,
    pressed,
    dragging,
    bounds,
    setRootRef,
    setTrackRef,
    inputRef,
    rootHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture: onPointerCancel,
    },
    inputHandlers: (index: number) => ({
      onKeyDown: onKeyDown(index),
      onKeyUp,
      onBlur,
      onChange: onInputChange(index),
    }),
  };
};
