"use client";

import { use, useCallback, useLayoutEffect, useRef } from "react";
import type * as React from "react";

import Ripple from "../../buttons/ripple";
import ListContext, { CONTROL_SELECTOR } from "./list-context";

interface ListItemOptionProps extends React.ComponentProps<"li"> {
  /** The item's identity in the list's selection. */
  value: string;
  /** Disabled by the item itself. */
  disabled?: boolean;
  /** Classes for the option's ripple layer (passed in, never imported). */
  rippleClassName?: string;
}

/**
 * The `<li>` of a `ListItem` that has a `value` — a `"use client"` island with
 * its **own internal `tsdown` entry**, so `list-item.mjs` stays directive-free
 * (Server-Component-safe). Inside a listbox (`List selectionMode`) it becomes
 * the APG **option**: `role="option"`, `aria-selected` from the list, a click
 * toggles it, and a selection control placed in the row (`control`) turns into
 * a decorative indicator — `inert`, hidden from assistive tech, and kept in
 * sync with the selection (MD3: "both the list item and the checkbox show a
 * selected state"). Anywhere else it's a plain `<li data-value>` (the value
 * still identifies the item for `onReorder`).
 *
 * It must import nothing from `../config.ts` / `list.variants.ts` at runtime —
 * the view passes classes in — or the bundler hoists them into a shared chunk
 * and the client boundary breaks.
 */
const ListItemOption = ({
  value,
  disabled = false,
  rippleClassName,
  ref,
  onClick,
  children,
  "data-interactive": interactive,
  ...props
}: ListItemOptionProps & { "data-interactive"?: string }) => {
  const context = use(ListContext);
  const option = context?.selectable === true;
  const selected = option ? context.isSelected(value) : undefined;
  const inactive = disabled || (option && context.disabled);
  const nodeRef = useRef<HTMLLIElement | null>(null);

  const setRef = useCallback(
    (node: HTMLLIElement | null) => {
      nodeRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // A control in an option is an indicator, not a second interaction: take it
  // out of the tab order and the accessibility tree, and mirror the selection
  // onto its native input (that's what its CSS draws from).
  useLayoutEffect(() => {
    const slot = nodeRef.current?.querySelector<HTMLElement>(CONTROL_SELECTOR);
    if (!option || !slot) return;
    slot.inert = true;
    slot.setAttribute("aria-hidden", "true");
    for (const input of slot.querySelectorAll("input")) {
      input.tabIndex = -1;
      input.checked = selected === true;
    }
    return () => {
      slot.inert = false;
      slot.removeAttribute("aria-hidden");
    };
  }, [option, selected]);

  return (
    <li
      {...props}
      ref={setRef}
      role={option ? "option" : props.role}
      aria-selected={option ? selected : undefined}
      aria-disabled={option && inactive ? true : props["aria-disabled"]}
      tabIndex={option ? -1 : props.tabIndex}
      data-value={value}
      data-interactive={option ? (inactive ? undefined : "") : interactive}
      onClick={(event) => {
        onClick?.(event);
        if (!option || inactive || event.defaultPrevented) return;
        // A `<label>` row would also "click" its (inert) input: the option
        // owns the toggle.
        event.preventDefault();
        context.toggle(value);
      }}
    >
      {option ? <Ripple className={rippleClassName} /> : null}
      {children}
    </li>
  );
};

export default ListItemOption;
