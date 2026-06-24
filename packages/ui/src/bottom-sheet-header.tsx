"use client";

import * as React from "react";
import { cn } from "@chatool/utils";

/**
 * Header region for a BottomSheet — stacks title/description and provides the
 * standard spacing. Compose with `BottomSheetTitle` / `BottomSheetDescription`.
 */
function BottomSheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-header"
      className={cn(
        "flex flex-col gap-1.5 px-4 pb-2 pt-4 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

export { BottomSheetHeader };
