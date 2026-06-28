"use client";

import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Spinner from "../internal/spinner";
import { fabVariants } from "./fab.variants";
import { type FabProps } from "./fab.types";

const Fab = ({
  className,
  color,
  size,
  extended,
  lowered,
  asChild = false,
  loading = false,
  loadingIndicator,
  disabled,
  children,
  ...props
}: FabProps) => {
  const Comp = asChild ? Slot.Root : "button";
  const content = loading ? (loadingIndicator ?? <Spinner />) : children;

  return (
    <Comp
      data-slot="fab"
      aria-busy={loading || undefined}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      disabled={asChild ? undefined : disabled}
      className={cn(
        fabVariants({ color, size, extended, lowered }),
        loading && "pointer-events-none",
        className,
      )}
      {...props}
    >
      {content}
    </Comp>
  );
};

export default Fab;
