"use client";

import { type PointerEvent } from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Spinner from "../spinner";
import { type ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";
import { useButtonLogic } from "./use-logic";

const Button = ({
  className,
  variant,
  size,
  shape,
  asChild = false,
  startIcon,
  endIcon,
  loading = false,
  loadingPosition = "center",
  loadingIndicator,
  disabled,
  onPointerDown,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  const { rippleLayerRef, spawnRipple } = useButtonLogic();

  const indicator = loadingIndicator ?? <Spinner />;
  const centerLoading = loading && loadingPosition === "center";

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) spawnRipple(event);
    onPointerDown?.(event);
  };

  const label = centerLoading ? (
    <>
      <span className="invisible inline-flex items-center [gap:inherit]">
        {startIcon}
        {children}
        {endIcon}
      </span>
      <span className="inset-0 absolute flex items-center justify-center">
        {indicator}
      </span>
    </>
  ) : (
    <>
      {loading && loadingPosition === "start" ? indicator : startIcon}
      {children}
      {loading && loadingPosition === "end" ? indicator : endIcon}
    </>
  );

  // `asChild` defers content to the single child (Slot wants one child), so the
  // icon / loading slots and the ripple overlay only apply to the plain button.
  const content = asChild ? (
    children
  ) : (
    <>
      {label}
      <span
        ref={rippleLayerRef}
        aria-hidden
        className="inset-0 pointer-events-none absolute -z-10 overflow-hidden rounded-[inherit]"
      />
    </>
  );

  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      disabled={asChild ? undefined : disabled}
      onPointerDown={handlePointerDown}
      className={cn(
        buttonVariants({ variant, size, shape }),
        loading && "pointer-events-none",
        className,
      )}
      {...props}
    >
      {content}
    </Comp>
  );
};

export default Button;
