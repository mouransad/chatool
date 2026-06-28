"use client";

import { useCallback } from "react";
import { useBoolean } from "@chatool/utils/hooks";

import { type IconButtonProps } from "./icon-button.types";

type ToggleProps = Pick<
  IconButtonProps,
  "selected" | "defaultSelected" | "onSelectedChange"
>;

/**
 * Resolves the optional toggle behaviour: an IconButton becomes a toggle when
 * any of `selected` / `defaultSelected` / `onSelectedChange` is provided.
 * Supports controlled (`selected`) and uncontrolled (`defaultSelected`) usage.
 */
export const useLogic = ({
  selected,
  defaultSelected,
  onSelectedChange,
}: ToggleProps) => {
  const isControlled = selected !== undefined;
  const { value, setValue } = useBoolean(defaultSelected ?? false);
  const isToggle =
    isControlled || defaultSelected !== undefined || Boolean(onSelectedChange);

  const onPressedChange = useCallback(
    (next: boolean) => {
      if (!isControlled) setValue(next);
      onSelectedChange?.(next);
    },
    [isControlled, setValue, onSelectedChange],
  );

  return {
    isToggle,
    pressed: isControlled ? Boolean(selected) : value,
    onPressedChange,
  };
};
