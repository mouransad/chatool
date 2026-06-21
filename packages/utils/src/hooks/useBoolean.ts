"use client";

import { useCallback, useMemo, useState } from "react";

export interface UseBooleanResult {
  value: boolean;
  setValue: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

/**
 * Boolean state with stable `setTrue` / `setFalse` / `toggle` helpers.
 */
export function useBoolean(initial = false): UseBooleanResult {
  const [value, setValue] = useState(initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return useMemo(
    () => ({ value, setValue, setTrue, setFalse, toggle }),
    [value, setTrue, setFalse, toggle],
  );
}
