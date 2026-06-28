"use client";

import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Spinner from "../internal/spinner";
import { useButtonGroup } from "../internal/group-context";
import { type ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

const Button = ({
  className,
  variant,
  color,
  size,
  shape,
  fullWidth,
  disableElevation,
  asChild = false,
  startIcon,
  endIcon,
  loading = false,
  loadingPosition = "center",
  loadingIndicator,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const group = useButtonGroup();
  const Comp = asChild ? Slot.Root : "button";

  const indicator = loadingIndicator ?? <Spinner />;
  const centerLoading = loading && loadingPosition === "center";

  // `asChild` defers content to the single child (Slot wants one child), so the
  // icon / loading slots only apply to the plain-button form.
  const content = asChild ? (
    children
  ) : centerLoading ? (
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

  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      disabled={asChild ? undefined : disabled}
      className={cn(
        buttonVariants({
          variant: variant ?? group?.variant,
          color: color ?? group?.color,
          size: size ?? group?.size,
          shape,
          fullWidth,
          disableElevation,
        }),
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
