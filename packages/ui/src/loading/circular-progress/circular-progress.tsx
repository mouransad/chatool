"use client";

import { type CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { MIN_WAVELENGTH, clamp } from "../motion";
import { progressbarProps, toFraction } from "../progressbar";
import { ACTIVE_PATH_LENGTH } from "./circular-engine";
import { type CircularProgressProps } from "./circular-progress.types";
import {
  ACTIVE_STROKE,
  LINE,
  TRACK_STROKE,
  circularProgressVariants,
} from "./circular-progress.variants";
import { useLogic } from "./use-logic";

/**
 * MD3 circular progress indicator, flat or wavy, determinate or indeterminate. A
 * client component because it draws per frame; the server renders the first frame,
 * so it's visible immediately and nothing shifts when it hydrates.
 */
const CircularProgress = ({
  className,
  style,
  shape,
  color,
  value,
  max = 100,
  size,
  thickness = 4,
  amplitude = 1,
  wavelength = 15,
  waveSpeed,
  gap = 4,
  track = true,
  animated = true,
  "aria-label": ariaLabel,
  ...props
}: CircularProgressProps) => {
  const wavy = (shape ?? "wavy") === "wavy";
  const fraction = toFraction(value, max);
  const indeterminate = fraction === undefined;
  // 48 / 40 are the spec's defaults; the thick sample grows by the extra stroke.
  const dimension = clamp(size ?? (wavy ? 44 : 36) + thickness, 24, 240);

  const { svgRef, groupRef, trackRef, activeRef, initialFrame } = useLogic({
    fraction,
    wavy,
    size: dimension,
    thickness,
    amplitude: clamp(amplitude, 0, 1),
    wavelength: Math.max(wavelength, MIN_WAVELENGTH),
    waveSpeed,
    gap,
    animated,
  });

  return (
    <div
      data-slot="circular-progress"
      data-indeterminate={indeterminate || undefined}
      {...progressbarProps(fraction, max, ariaLabel, props["aria-labelledby"])}
      className={cn(circularProgressVariants({ shape, color }), className)}
      style={
        {
          width: dimension,
          height: dimension,
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
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="block size-full overflow-visible"
      >
        <g ref={groupRef} transform={initialFrame.rotation}>
          {track && (
            <path
              ref={trackRef}
              d={initialFrame.trackHidden ? undefined : initialFrame.trackD}
              strokeDasharray={initialFrame.trackDashArray}
              strokeDashoffset={initialFrame.trackDashOffset}
              className={cn(LINE, TRACK_STROKE)}
            />
          )}
          <path
            ref={activeRef}
            d={initialFrame.activeHidden ? undefined : initialFrame.activeD}
            transform={initialFrame.activeTransform}
            pathLength={ACTIVE_PATH_LENGTH}
            strokeDasharray={initialFrame.activeDashArray}
            strokeDashoffset={initialFrame.activeDashOffset}
            className={cn(LINE, ACTIVE_STROKE)}
            suppressHydrationWarning
          />
        </g>
      </svg>
    </div>
  );
};

export default CircularProgress;
