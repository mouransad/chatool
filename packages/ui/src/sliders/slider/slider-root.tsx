"use client";

import { useMemo } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import {
  createFormatter,
  defaultLargeStep,
  normalizeAllowed,
  snap,
  stopPx,
  stopValues,
  toFraction,
  type SliderScale,
} from "./slider-math";
import { type SliderIcon, type SliderRootProps } from "./slider.types";
import {
  END_STOP,
  HANDLE,
  ICON,
  ICON_GLYPH,
  INPUT,
  SEGMENT,
  STOP,
  THUMB,
  TRACK,
  VALUE_INDICATOR,
  VALUE_INDICATOR_ANCHOR,
  sliderVariants,
} from "./slider.variants";
import { useLogic } from "./use-logic";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

const renderIcon = (icon: SliderIcon, value: number) =>
  typeof icon === "function" ? icon(value) : icon;

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * The shared slider engine behind `Slider` and `RangeSlider` (internal). It
 * renders the MD3 Expressive anatomy — tracks split around each handle by a
 * 6dp gap, stop indicators, inset icons, the bar handle(s), the value
 * indicator — over **one native `<input type="range">` per handle**.
 *
 * The inputs are invisible and pointer-inert but carry focus, the keyboard,
 * `name` / `form` submission, `aria-valuetext` and the accessibility tree, so
 * screen readers (incl. mobile swipe-to-adjust) get the real control. The
 * pointer is handled on the root (see `useLogic`) so the whole slider is one
 * big, forgiving target.
 */
const SliderRoot = ({
  mode,
  className,
  style,
  size,
  orientation = "horizontal",
  inverted = false,
  min = 0,
  max = 100,
  step = 1,
  stops = false,
  endStops = true,
  largeStep,
  valueIndicator = false,
  format,
  locale,
  disabled = false,
  haptics = false,
  name,
  form,
  classNames,
  ref,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  minStepsBetweenThumbs = 0,
  icon,
  endIcon,
  thumbs,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  ...props
}: SliderRootProps) => {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const stopsKey = Array.isArray(stops) ? stops.join(",") : "";
  const scale = useMemo<SliderScale>(
    () => ({
      min: lo,
      max: hi,
      step,
      allowed: stopsKey
        ? normalizeAllowed(stopsKey.split(",").map(Number), lo, hi)
        : undefined,
    }),
    [lo, hi, step, stopsKey],
  );
  const stopList = stopValues(scale, stops === true);
  const stopsShown = stopList.length > 0;
  const formatValue = createFormatter(format, locale, scale);

  const initial = useMemo(() => {
    const snapped = defaultValue.map((v) => snap(v, scale));
    return mode === "range" ? [...snapped].sort((a, b) => a - b) : snapped;
    // Only the first render's default matters (uncontrolled).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logic = useLogic({
    mode,
    value,
    defaultValue: initial,
    onValueChange,
    onValueCommit,
    scale,
    stopsShown,
    largeStep: largeStep ?? defaultLargeStep(scale),
    minStepsBetweenThumbs,
    disabled,
    haptics,
    orientation: orientation ?? "horizontal",
    ref,
    inputRefs: thumbs.map((thumb) => thumb.ref),
  });

  const { values, fractions, layout, measure, pressed } = logic;
  const measured = Number.isFinite(measure.length);

  /* -------------------------------------------------- stop indicators -- */

  const hasEndIcon =
    mode === "standard" && isRenderable(renderIcon(endIcon, values[0] ?? lo));
  const centre = (lo + hi) / 2;
  const isActiveValue = (v: number) => {
    const [a = lo, b = a] = values;
    if (mode === "range") return v >= a && v <= b;
    if (mode === "centered")
      return v >= Math.min(a, centre) && v <= Math.max(a, centre);
    return v <= a;
  };
  const dots = stopList.flatMap((v, index) => {
    // A stop that coincides with an end stop isn't drawn twice (Compose).
    const atEnd = endStops && !hasEndIcon && index === stopList.length - 1;
    const atStart = endStops && mode !== "standard" && index === 0;
    if (atEnd || atStart) return [];
    const f = toFraction(v, scale);
    let hidden: boolean;
    if (measured) {
      // Hide stops that fall into a handle's gap (or a centered slider's).
      const px = stopPx(f, measure);
      hidden =
        layout.centers.some((c) => Math.abs(px - c) < measure.edge) ||
        (mode === "centered" &&
          Math.abs(px - measure.length / 2) < measure.gap);
    } else hidden = values.includes(v);
    return [
      <span
        key={v}
        data-slot="slider-stop"
        data-on={isActiveValue(v) ? "active" : "inactive"}
        data-hidden={hidden || undefined}
        aria-hidden
        className={cn(STOP, classNames?.stop)}
        style={{ "--_t": f } as CSSVars}
      />,
    ];
  });

  /* ------------------------------------------------------- inset icons -- */

  const iconNodes: React.ReactNode[] = [];
  if (mode === "standard") {
    const v = values[0] ?? lo;
    const f = fractions[0] ?? 0;
    const active = layout.segments.find((s) => s.kind === "active");
    const inactive = layout.segments.find((s) => s.kind === "inactive");
    const box = measure.iconBox;
    const fits = (length: number | undefined, need: number, guess: boolean) =>
      measured && Number.isFinite(box) && length !== undefined
        ? length >= need
        : guess;
    const start = renderIcon(icon, v);
    const end = renderIcon(endIcon, v);
    const hasStart = isRenderable(start);
    const hasEnd = isRenderable(end);
    const onActive = hasStart && fits(active?.length, box, f >= 0.3);
    const endFits = hasEnd && fits(inactive?.length, box, f <= 0.8);
    const startOnInactive =
      hasStart &&
      !onActive &&
      fits(inactive?.length, hasEnd ? 2 * box : box, f <= (hasEnd ? 0.6 : 0.8));
    const iconBox = (
      key: string,
      on: "active" | "inactive",
      at: string,
      visible: boolean,
      node: React.ReactNode,
    ) => (
      <span
        key={key}
        data-slot="slider-icon"
        data-on={on}
        data-hidden={!visible || undefined}
        aria-hidden
        className={cn(ICON, classNames?.icon)}
        style={{ "--_ia": at } as CSSVars}
      >
        <span className={ICON_GLYPH}>{node}</span>
      </span>
    );
    if (hasStart) {
      iconNodes.push(
        iconBox("start-active", "active", "0px", onActive, start),
        iconBox(
          "start-inactive",
          "inactive",
          "calc(var(--_c0) + var(--_g))",
          startOnInactive,
          start,
        ),
      );
    }
    if (hasEnd) {
      iconNodes.push(
        iconBox(
          "end",
          "inactive",
          "calc(100% - var(--_icon) - 2 * var(--_ipad))",
          endFits,
          end,
        ),
      );
    }
  }

  /* -------------------------------------------------------------- root -- */

  const vars: CSSVars = {};
  fractions.forEach((f, i) => {
    vars[`--_f${i}`] = f;
    vars[`--_k${i}`] = layout.inset[i] ? 1 : 0;
  });

  const indicator =
    disabled || valueIndicator === false
      ? undefined
      : valueIndicator === "always"
        ? "always"
        : "auto";

  const chain =
    <E,>(theirs: ((event: E) => void) | undefined, ours: (event: E) => void) =>
    (event: E) => {
      theirs?.(event);
      if (!(event as { defaultPrevented?: boolean }).defaultPrevented)
        ours(event);
    };

  return (
    <div
      ref={logic.setRootRef}
      data-slot="slider"
      data-mode={mode}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      data-dragging={logic.dragging || undefined}
      className={cn(sliderVariants({ size, orientation, inverted }), className)}
      style={{ ...vars, ...style }}
      onPointerDown={chain(onPointerDown, logic.rootHandlers.onPointerDown)}
      onPointerMove={chain(onPointerMove, logic.rootHandlers.onPointerMove)}
      onPointerUp={chain(onPointerUp, logic.rootHandlers.onPointerUp)}
      onPointerCancel={chain(
        onPointerCancel,
        logic.rootHandlers.onPointerCancel,
      )}
      onLostPointerCapture={chain(
        onLostPointerCapture,
        logic.rootHandlers.onLostPointerCapture,
      )}
      {...props}
    >
      <div
        ref={logic.setTrackRef}
        data-slot="slider-track"
        className={cn(TRACK, classNames?.track)}
      >
        {layout.segments.map((segment, index) => (
          <span
            key={index}
            data-slot={
              segment.kind === "active"
                ? "slider-active-track"
                : "slider-inactive-track"
            }
            data-kind={segment.kind}
            data-outer={segment.outer}
            data-hidden={segment.hidden || undefined}
            aria-hidden
            className={cn(
              SEGMENT,
              segment.kind === "active"
                ? classNames?.activeTrack
                : classNames?.inactiveTrack,
            )}
            style={{ "--_a": segment.start, "--_b": segment.end } as CSSVars}
          >
            {endStops &&
              segment.kind === "inactive" &&
              segment.outer !== "none" &&
              !(segment.outer === "end" && hasEndIcon) && (
                <span
                  data-slot="slider-end-stop"
                  data-at={segment.outer}
                  className={cn(END_STOP, classNames?.stop)}
                />
              )}
          </span>
        ))}
        {dots}
        {iconNodes}
        {values.map((v, index) => {
          const thumb = thumbs[index] ?? {};
          const [thumbMin, thumbMax] = logic.bounds(index, values);
          const text = formatValue(v);
          const valueText =
            thumb.getAriaValueText?.(v) ?? (format ? text : undefined);
          return (
            <span
              key={index}
              data-slot="slider-thumb"
              data-index={index}
              data-pressed={pressed === index || undefined}
              data-indicator={indicator}
              className={cn(THUMB, classNames?.thumb)}
              style={{ "--_c": `var(--_c${index})` } as CSSVars}
            >
              <span
                data-slot="slider-handle"
                aria-hidden
                className={cn(HANDLE, classNames?.handle)}
              />
              <input
                ref={logic.inputRef(index)}
                data-slot="slider-input"
                type="range"
                id={thumb.id}
                autoFocus={thumb.autoFocus}
                name={name}
                form={form}
                disabled={disabled}
                min={thumbMin}
                max={thumbMax}
                step={scale.allowed?.length || step === "any" ? "any" : step}
                value={v}
                aria-label={thumb["aria-label"]}
                aria-labelledby={thumb["aria-labelledby"]}
                aria-describedby={thumb["aria-describedby"]}
                aria-valuetext={valueText}
                aria-orientation={orientation ?? "horizontal"}
                className={cn(INPUT, classNames?.input)}
                {...logic.inputHandlers(index)}
              />
              {indicator && (
                <span
                  data-slot="slider-value-indicator-anchor"
                  aria-hidden
                  className={VALUE_INDICATOR_ANCHOR}
                >
                  <span
                    data-slot="slider-value-indicator"
                    className={cn(VALUE_INDICATOR, classNames?.valueIndicator)}
                  >
                    {text}
                  </span>
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SliderRoot;
