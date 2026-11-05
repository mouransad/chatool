"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** Live `prefers-reduced-motion`; `false` on the server. */
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
