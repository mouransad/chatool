"use client";

import { useEffect, useState } from "react";

/**
 * Keep an element mounted for `delayMs` after `visible` flips to `false`, so
 * exit transitions can play before unmount. Returns whether to render.
 */
export function useDelayVisibility(visible: boolean, delayMs = 200): boolean {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => setShouldRender(false), delayMs);
    return () => clearTimeout(timeout);
  }, [visible, delayMs]);

  return shouldRender;
}
