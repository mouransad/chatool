"use client";

import { Slot, Toggle } from "radix-ui";
import { cn } from "@chatool/utils";

import Spinner from "../internal/spinner";
import { useButtonGroup } from "../internal/group-context";
import { useLogic } from "./use-logic";
import { iconButtonVariants } from "./icon-button.variants";
import { type IconButtonProps } from "./icon-button.types";

const IconButton = ({
  className,
  variant,
  color,
  size,
  width,
  shape,
  asChild = false,
  loading = false,
  loadingIndicator,
  selected,
  defaultSelected,
  onSelectedChange,
  disabled,
  children,
  ...props
}: IconButtonProps) => {
  const group = useButtonGroup();
  const { isToggle, pressed, onPressedChange } = useLogic({
    selected,
    defaultSelected,
    onSelectedChange,
  });

  const classes = cn(
    iconButtonVariants({
      variant,
      color: color ?? group?.color,
      size: size ?? group?.size,
      width,
      shape,
    }),
    loading && "pointer-events-none",
    className,
  );
  const content = loading ? (loadingIndicator ?? <Spinner />) : children;

  if (isToggle) {
    return (
      <Toggle.Root
        data-slot="icon-button"
        pressed={pressed}
        onPressedChange={onPressedChange}
        disabled={disabled}
        aria-busy={loading || undefined}
        className={classes}
        {...props}
      >
        {content}
      </Toggle.Root>
    );
  }

  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="icon-button"
      aria-busy={loading || undefined}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      disabled={asChild ? undefined : disabled}
      className={classes}
      {...props}
    >
      {content}
    </Comp>
  );
};

export default IconButton;
