"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useFrameLoop } from "../use-frame-loop";
import { useReducedMotion } from "../use-reduced-motion";
import { LinearEngine, type LinearOptions } from "./linear-engine";

const setPath = (path: SVGPathElement | null, d: string) => {
  if (d) path?.setAttribute("d", d);
  else path?.removeAttribute("d");
};

/**
 * Sizes the engine to the element and paints its frames onto the SVG nodes. The
 * width only exists in the browser, so `measured` flips once the first frame is
 * drawn — until then the view shows a static, percent-based bar.
 */
export const useLogic = (options: Omit<LinearOptions, "reducedMotion">) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const firstRef = useRef<SVGPathElement>(null);
  const secondRef = useRef<SVGPathElement>(null);
  const stopRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useReducedMotion();
  const [measured, setMeasured] = useState(false);
  const [engine] = useState(
    () => new LinearEngine({ ...options, reducedMotion }),
  );

  const repaint = useCallback(() => {
    const frame = engine.draw();
    if (!frame) return;
    setPath(trackRef.current, frame.track);
    setPath(firstRef.current, frame.first);
    setPath(secondRef.current, frame.second);
    const stopNode = stopRef.current;
    stopNode?.setAttribute("cx", String(frame.stopX));
    stopNode?.setAttribute("cy", String(frame.stopY));
    stopNode?.setAttribute("r", String(frame.stopRadius));
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

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const resize = () => {
      engine.resize(svg.getBoundingClientRect().width);
      repaint();
      setMeasured(true);
      wake();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [engine, repaint, wake]);

  return { svgRef, trackRef, firstRef, secondRef, stopRef, measured };
};
