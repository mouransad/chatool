"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

interface CheckboxIndeterminateProps {
  /** The `indeterminate` prop to mirror onto the sibling `<input>`. */
  indeterminate: boolean;
}

const findInput = (marker: HTMLElement | null) =>
  marker?.parentElement?.querySelector<HTMLInputElement>(
    ":scope > input[type=checkbox]",
  ) ?? null;

/**
 * The checkbox's only client island besides the ripple — rendered **only** when
 * the consumer passes `indeterminate`, so a plain checkbox ships no extra JS.
 *
 * `indeterminate` is a DOM *property* with no HTML attribute (and HTML-ARIA
 * forbids `aria-checked` on a native checkbox), so it can't be server-rendered.
 * The visual dash is server-rendered from `data-indeterminate`; this island
 * makes the semantics match: it sets `input.indeterminate` from the prop on
 * every render, and — because the browser clears it on each click — restores
 * the latest prop value one frame after a `change`, once React has re-rendered
 * with whatever the consumer's `onChange` decided. That makes the prop the
 * single source of truth, like a controlled `checked`.
 */
const CheckboxIndeterminate = ({
  indeterminate,
}: CheckboxIndeterminateProps) => {
  const markerRef = useRef<HTMLSpanElement>(null);
  const latest = useRef(indeterminate);

  useLayoutEffect(() => {
    latest.current = indeterminate;
    const input = findInput(markerRef.current);
    if (input) input.indeterminate = indeterminate;
  });

  useEffect(() => {
    const input = findInput(markerRef.current);
    if (!input) return;

    let frame = 0;
    const restore = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        input.indeterminate = latest.current;
      });
    };

    input.addEventListener("change", restore);
    return () => {
      input.removeEventListener("change", restore);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={markerRef} hidden />;
};

export default CheckboxIndeterminate;
