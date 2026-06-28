"use client";

import { createContext, useContext } from "react";
import type { ButtonColor } from "./colors";
import type { ButtonSize } from "./sizes";

export type ButtonVariant =
  | "filled"
  | "tonal"
  | "elevated"
  | "outlined"
  | "text";

/**
 * Props a `ButtonGroup` shares with the Buttons / IconButtons inside it. Each
 * child uses its own prop when set, otherwise inherits from the group.
 */
export interface ButtonGroupContextValue {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(
  null,
);

export const useButtonGroup = () => useContext(ButtonGroupContext);
