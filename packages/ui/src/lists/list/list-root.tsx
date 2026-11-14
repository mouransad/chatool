"use client";

import { useCallback, useId, useRef, useState } from "react";
import type * as React from "react";
import { Slot } from "radix-ui";

import ListContext from "./list-context";
import { type ListProps } from "./list.types";
import { useLogic } from "./use-logic";
import { useReorder } from "./use-reorder";

type ListRootProps = Omit<ListProps, "density" | "dividers">;

/**
 * The `List` root — a `"use client"` island with its **own internal `tsdown`
 * entry**, so the public `list.mjs` barrel (and every item in it) stays
 * directive-free. `List` (the server wrapper in `list.tsx`) resolves the
 * classes and renders this with them; it must import nothing from
 * `../config.ts` / `list.variants.ts` at runtime, or the bundler hoists them
 * into a shared chunk and the client boundary breaks.
 *
 * It renders the `<ul>` (`role="list"`, or `role="listbox"` for a selection
 * list) with the list context, the roving tabindex + keyboard model
 * (`use-logic`), reordering (`use-reorder`), and — beside the list, so the
 * list markup stays valid — the hidden form inputs, the reorder instructions
 * and a live region.
 */
const ListRoot = (props: ListRootProps) => {
  const {
    className,
    variant = "standard",
    selectionMode = "none",
    value,
    defaultValue,
    onValueChange,
    required = false,
    disabled = false,
    selectionFollowsFocus = false,
    navigation = "roving",
    loop = true,
    reorderable = false,
    onReorder,
    reorderAnnouncements,
    name,
    form,
    asChild = false,
    ref,
    role,
    onKeyDown,
    onFocus,
    onBlur,
    onPointerDown,
    children,
    ...rest
  } = props as ListRootProps & {
    value?: string | string[] | null;
    defaultValue?: string | string[] | null;
    onValueChange?: (value: never) => void;
    required?: boolean;
    selectionFollowsFocus?: boolean;
    name?: string;
    form?: string;
  };

  const selectable = selectionMode !== "none";
  const logic = useLogic({
    selectionMode,
    value,
    defaultValue,
    onValueChange,
    required,
    disabled,
    selectionFollowsFocus,
    navigation,
    loop,
    ref,
  });

  const liveRef = useRef<HTMLSpanElement>(null);
  const announce = useCallback((message: string) => {
    const live = liveRef.current;
    if (!live) return;
    // Clear first so the same sentence is announced again.
    live.textContent = "";
    requestAnimationFrame(() => {
      live.textContent = message;
    });
  }, []);

  const instructionsId = useId();
  const reorder = useReorder({
    enabled: reorderable && !disabled,
    rootRef: logic.rootRef,
    onReorder,
    announcements: reorderAnnouncements,
    announce,
    instructionsId,
  });

  const Comp = (asChild ? Slot.Root : "ul") as React.ElementType;
  const empty = selectable && required && logic.selected.length === 0;
  // Set when a form submission found the required selection empty.
  const [invalid, setInvalid] = useState(false);

  return (
    <ListContext value={logic.context}>
      <Comp
        ref={logic.setRef}
        role={role ?? (selectable ? "listbox" : "list")}
        aria-multiselectable={selectionMode === "multiple" ? true : undefined}
        aria-required={selectable && required ? true : undefined}
        aria-disabled={selectable && disabled ? true : undefined}
        aria-invalid={invalid && empty ? true : undefined}
        inert={!selectable && disabled ? true : undefined}
        data-slot="list"
        data-variant={variant}
        data-selection-mode={selectionMode}
        data-disabled={disabled || undefined}
        data-reorderable={reorderable || undefined}
        className={className}
        onKeyDown={(event: React.KeyboardEvent<HTMLUListElement>) => {
          onKeyDown?.(event);
          if (reorder.onKeyDown(event)) return;
          logic.onKeyDown(event);
        }}
        onFocus={(event: React.FocusEvent<HTMLUListElement>) => {
          onFocus?.(event);
          logic.onFocus(event);
        }}
        onBlur={(event: React.FocusEvent<HTMLUListElement>) => {
          onBlur?.(event);
          reorder.onBlur(event);
        }}
        onPointerDown={(event: React.PointerEvent<HTMLUListElement>) => {
          onPointerDown?.(event);
          if (!event.defaultPrevented) reorder.onPointerDown(event);
        }}
        {...rest}
      >
        {children}
      </Comp>
      {selectable && name !== undefined
        ? logic.selected.map((item) => (
            <input
              key={item}
              type="hidden"
              name={name}
              value={item}
              form={form}
              disabled={disabled}
            />
          ))
        : null}
      {selectable && required && name !== undefined ? (
        // Constraint validation for a required selection: an invisible,
        // unfocusable stand-in that's empty while nothing is selected.
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={empty ? "" : "selected"}
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault();
            setInvalid(true);
            logic.rootRef.current
              ?.querySelector<HTMLElement>("[role=option][tabindex='0']")
              ?.focus();
          }}
          form={form}
          disabled={disabled}
          className="pointer-events-none absolute size-px opacity-0"
        />
      ) : null}
      {reorderable ? (
        <>
          <span id={instructionsId} hidden>
            {reorder.instructions}
          </span>
          <span
            ref={liveRef}
            role="status"
            aria-live="assertive"
            aria-atomic="true"
            className="sr-only"
          />
        </>
      ) : null}
    </ListContext>
  );
};

export default ListRoot;
