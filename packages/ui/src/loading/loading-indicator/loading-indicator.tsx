"use client";

import { cn } from "@chatool/utils";

import { clamp } from "../motion";
import { progressbarProps, toFraction } from "../progressbar";
import { VIEW_BOX_SIZE } from "./loading-engine";
import { type LoadingIndicatorProps } from "./loading-indicator.types";
import { loadingIndicatorVariants } from "./loading-indicator.variants";
import { useLogic } from "./use-logic";

/**
 * MD3 Expressive loading indicator: a shape-morphing spinner for waits of roughly
 * 200ms–5s. A client component because it animates per frame; the server still
 * renders its first frame, so there's no layout shift or blank state on hydration.
 */
const LoadingIndicator = ({
  className,
  style,
  contained,
  color,
  value,
  max = 100,
  size,
  "aria-label": ariaLabel,
  ...props
}: LoadingIndicatorProps) => {
  const fraction = toFraction(value, max);
  const { svgRef, pathRef, initialFrame } = useLogic(fraction);
  const dimension = size === undefined ? undefined : clamp(size, 24, 240);

  return (
    <div
      data-slot="loading-indicator"
      data-indeterminate={fraction === undefined || undefined}
      {...progressbarProps(fraction, max, ariaLabel, props["aria-labelledby"])}
      className={cn(loadingIndicatorVariants({ contained, color }), className)}
      style={
        dimension === undefined
          ? style
          : { width: dimension, height: dimension, ...style }
      }
      {...props}
    >
      <svg
        ref={svgRef}
        aria-hidden
        focusable={false}
        viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
        className="block size-full"
      >
        <path
          ref={pathRef}
          d={initialFrame.d}
          transform={initialFrame.transform}
          suppressHydrationWarning
        />
      </svg>
    </div>
  );
};

export default LoadingIndicator;
