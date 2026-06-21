"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@karnameh/utils";

function BottomSheet(
  props: React.ComponentProps<typeof DialogPrimitive.Root>,
) {
  return <DialogPrimitive.Root data-slot="bottom-sheet" {...props} />;
}

function BottomSheetTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />;
}

function BottomSheetClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="bottom-sheet-close" {...props} />;
}

function BottomSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="bottom-sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function BottomSheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <BottomSheetOverlay />
      <DialogPrimitive.Content
        data-slot="bottom-sheet-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[90svh] flex-col rounded-t-2xl border-t bg-background shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden
          className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-muted"
        />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function BottomSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="bottom-sheet-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="bottom-sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function BottomSheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-body"
      className={cn("flex-1 overflow-y-auto px-4 py-2", className)}
      {...props}
    />
  );
}

function BottomSheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-footer"
      className={cn("flex flex-col gap-2 px-4 pb-6 pt-2", className)}
      {...props}
    />
  );
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetOverlay,
  BottomSheetContent,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
};
export { BottomSheetHeader } from "./bottom-sheet-header";
