"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useFrameLoop } from "../use-frame-loop";
import { useReducedMotion } from "../use-reduced-motion";
import { CircularEngine, type CircularOptions } from "./circular-engine";

const setAttribute = (
  element: SVGElement | null,
  name: string,
  value: string | number | undefined,
) => {
  if (value === undefined) element?.removeAttribute(name);
  else element?.setAttribute(name, String(value));
};

/** `d` is long and re-parsed on every write, so it's only touched on a change. */
const setPath = (element: SVGPathElement | null, d: string | undefined) => {
  if (element?.getAttribute("d") !== d) setAttribute(element, "d", d);
};

/**
 * Keeps the JSX on the first frame — what the server sends — and paints later
 * frames directly onto the SVG nodes, so a moving wave never re-renders React.
 */
export const useLogic = (options: Omit<CircularOptions, "reducedMotion">) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const activeRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();
  const [engine] = useState(
    () => new CircularEngine({ ...options, reducedMotion }),
  );
  const [initialFrame] = useState(() => engine.draw());

  const repaint = useCallback(() => {
    const frame = engine.draw();
    const track = trackRef.current;
    const active = activeRef.current;
    setAttribute(groupRef.current, "transform", frame.rotation);
    setPath(track, frame.trackHidden ? undefined : frame.trackD);
    setAttribute(track, "stroke-dasharray", frame.trackDashArray);
    setAttribute(track, "stroke-dashoffset", frame.trackDashOffset);
    setPath(active, frame.activeHidden ? undefined : frame.activeD);
    setAttribute(active, "transform", frame.activeTransform);
    setAttribute(active, "stroke-dasharray", frame.activeDashArray);
    setAttribute(active, "stroke-dashoffset", frame.activeDashOffset);
  }, [engine]);

  const wake = useFrameLoop(svgRef, (dt) => {
    const running = engine.step(dt);
    repaint();
    return running;
  });

  // Renders only come from prop changes, and `update` is idempotent.
  useLayoutEffect(() => {
    engine.update({ ...options, reducedMotion });
    repaint();
    wake();
  });

  return { svgRef, groupRef, trackRef, activeRef, initialFrame };
};
