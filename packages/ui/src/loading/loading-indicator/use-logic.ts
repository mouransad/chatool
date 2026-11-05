"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { useFrameLoop } from "../use-frame-loop";
import { useReducedMotion } from "../use-reduced-motion";
import {
  type LoadingFrame,
  createLoadingState,
  determinateFrame,
  indeterminateFrame,
  stepLoading,
} from "./loading-engine";

const paint = (path: SVGPathElement | null, frame: LoadingFrame) => {
  path?.setAttribute("d", frame.d);
  path?.setAttribute("transform", frame.transform);
};

/**
 * Paints straight onto the `<path>` instead of re-rendering: the JSX only carries
 * the first frame, which is what the server sends. Reduced motion holds the first
 * shape still; the view adds a gentle opacity pulse instead.
 */
export const useLogic = (fraction: number | undefined) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();
  const animates = fraction === undefined && !reducedMotion;

  const [state] = useState(createLoadingState);
  const [initialFrame] = useState(() =>
    fraction === undefined
      ? indeterminateFrame(state)
      : determinateFrame(fraction),
  );

  const wake = useFrameLoop(svgRef, (dt) => {
    if (!animates) return false;
    stepLoading(state, dt);
    paint(pathRef.current, indeterminateFrame(state));
    return true;
  });

  useLayoutEffect(() => {
    if (fraction !== undefined)
      paint(pathRef.current, determinateFrame(fraction));
    else if (reducedMotion) paint(pathRef.current, indeterminateFrame(state));
    else wake();
  }, [fraction, reducedMotion, state, wake]);

  return { svgRef, pathRef, initialFrame };
};
