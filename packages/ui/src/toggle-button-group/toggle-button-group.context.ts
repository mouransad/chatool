"use client";

import { createContext, useContext } from "react";
import type { ButtonColor } from "../internal/colors";
import type { ButtonSize } from "../internal/sizes";

export interface ToggleButtonGroupContextValue {
  color?: ButtonColor;
  size?: ButtonSize;
}

export const ToggleButtonGroupContext =
  createContext<ToggleButtonGroupContextValue>({});

export const useToggleButtonGroup = () => useContext(ToggleButtonGroupContext);
