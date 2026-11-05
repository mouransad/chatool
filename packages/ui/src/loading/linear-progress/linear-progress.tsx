"use client";

import { type CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { MIN_WAVELENGTH, clamp } from "../motion";
import { progressbarProps, toFraction } from "../progressbar";
import { type LinearProgressProps } from "./linear-progress.types";
import {
  ACTIVE_STROKE,
  LINE,
  STOP_FILL,
  TRACK_STROKE,
  linearProgressVariants,
} from "./linear-progress.variants";
import { useLogic } from "./use-logic";

/**
 * MD3 linear progress indicator, flat or wavy, determinate or indeterminate. A
 * client component because it draws per frame; the server sends a static bar at the
 * right height and value, so nothing shifts when it hydrates.
 */
const LinearProgress = ({
  className,
  style,
  shape,
  color,
  value,
  max = 100,
  thickness = 4,
  amplitude = 1,
  wavelength,
  waveSpeed,
  gap = 4,
  stop = true,
  animated = true,
  "aria-label": ariaLabel,
  ...props
}: LinearProgressProps) => {
  const wavy = (shape ?? "wavy") === "wavy";
  const fraction = toFraction(value, max);
  const indeterminate = fraction === undefined;
  const height = wavy ? thickness + 6 : thickness;

  const { svgRef, trackRef, firstRef, secondRef, stopRef, measured } = useLogic(
    {
      fraction,
      wavy,
      thickness,
      amplitude: clamp(amplitude, 0, 1),
      wavelength:
        wavelength === undefined
          ? undefined
          : Math.max(wavelength, MIN_WAVELENGTH),
      waveSpeed,
      gap,
      stop,
      animated,
    },
  );

  const percent = `${(fraction ?? 0) * 100}%`;

  return (
    <div
      data-slot="linear-progress"
      data-indeterminate={indeterminate || undefined}
      {...progressbarProps(fraction, max, ariaLabel, props["aria-labelledby"])}
      className={cn(linearProgressVariants({ shape, color }), className)}
      style={
        {
          height,
          "--_thickness": `${thickness}px`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <svg
        ref={svgRef}
        aria-hidden
        focusable={false}
        className="block size-full overflow-visible rtl:-scale-x-100"
      >
        {!measured && (
          <>
            <line
              x1={percent}
              x2="100%"
              y1="50%"
              y2="50%"
              className={cn(LINE, TRACK_STROKE)}
            />
            {!indeterminate && (
              <line
                x1={thickness / 2}
                x2={percent}
                y1="50%"
                y2="50%"
                className={cn(LINE, ACTIVE_STROKE)}
              />
            )}
          </>
        )}
        <path ref={trackRef} className={cn(LINE, TRACK_STROKE)} />
        <path ref={firstRef} className={cn(LINE, ACTIVE_STROKE)} />
        <path ref={secondRef} className={cn(LINE, ACTIVE_STROKE)} />
        <circle ref={stopRef} r={0} className={STOP_FILL} />
      </svg>
    </div>
  );
};

export default LinearProgress;
