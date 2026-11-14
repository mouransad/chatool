import { cloneElement, isValidElement } from "react";
import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import ListItemOption from "./list-item-option";
import { type ListItemProps } from "./list.types";
import {
  LIST_ITEM_CLAMP,
  LIST_ITEM_CONTENT,
  LIST_ITEM_CONTROL,
  LIST_ITEM_HEADLINE,
  LIST_ITEM_LEADING,
  LIST_ITEM_OVERLINE,
  LIST_ITEM_RIPPLE,
  LIST_ITEM_STRETCH,
  LIST_ITEM_SUPPORTING_TEXT,
  LIST_ITEM_TEXT,
  LIST_ITEM_TRAILING,
  LIST_ITEM_TRAILING_TEXT,
  listItemVariants,
} from "./list.variants";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/** `--_li-clamp` for a clamped text part (React accepts custom properties). */
const clampStyle = (lines: number | undefined) =>
  lines === undefined
    ? undefined
    : ({ "--_li-clamp": String(lines) } as React.CSSProperties);

/**
 * MD3 Expressive **list item** — one row of a `List`. A props → JSX **Server
 * Component** (no client directive): every visual state is CSS (attributes on
 * the row + pseudo-classes of its action / control), so it renders in a React
 * Server Component, in the Pages Router, in Vite and before hydration. The
 * client pieces are islands rendered as children: the shared press `Ripple`
 * and, for an item with a `value`, the `list-item-option` root (the listbox
 * `option`).
 *
 * One component covers every MD3 list-item kind, picked from its props:
 *
 * - **Non-interactive** (default) — text / media only. No role beyond
 *   `listitem`, no hover, no ripple.
 * - **Single-action** — `href` (an `<a>`), `onClick` / `type` (a `<button>`),
 *   or `asChild` (your `<Link>`). The action holds the leading element and the
 *   text; its `::after` stretches over the row, so the whole row is the target.
 * - **Multi-action** — a single-action row plus raised secondary actions in
 *   `trailing` (an `IconButton`, a menu button): they paint and hit above the
 *   stretched action, and hovering them un-hovers the row (MD3).
 * - **Selection control** — `control={<Checkbox />}` / `<Radio />` /
 *   `<Switch />`: the row is the control's native `<label>` (the whole row
 *   toggles it, the headline + supporting text name it, it submits with a
 *   form) and a checked control selects the row.
 * - **Option** — a `value` inside a `List selectionMode`: the `option` island.
 *
 * Layout and type follow Compose's expressive `ListItem`: 16dp side padding,
 * 12dp between slots, 10dp top / bottom, 56 / 72 / 88dp per line count, body-
 * large headline, body-medium supporting text, label-small overline and
 * trailing text, 20dp icons.
 */
const ListItem = ({
  className,
  children,
  headline,
  overline,
  supportingText,
  trailingSupportingText,
  leading,
  trailing,
  lines,
  align = "auto",
  headlineLines,
  supportingTextLines,
  classNames,
  href,
  onClick,
  type,
  asChild = false,
  actionProps,
  control,
  controlPosition = "start",
  selected,
  disabled = false,
  dragged = false,
  value,
  textValue,
  ...props
}: ListItemProps) => {
  const hasControl = isValidElement(control);
  const child =
    asChild && isValidElement<{ children?: React.ReactNode }>(children)
      ? children
      : null;
  const isAction =
    !hasControl &&
    (child !== null ||
      href !== undefined ||
      onClick !== undefined ||
      type !== undefined);
  const kind = hasControl ? "control" : isAction ? "action" : "text";

  const title = headline ?? (child ? child.props.children : children);
  const hasOverline = isRenderable(overline);
  const hasSupporting = isRenderable(supportingText);
  const lineCount =
    lines ??
    ((hasOverline && hasSupporting) ||
    (hasSupporting && (supportingTextLines ?? 0) >= 2)
      ? 3
      : hasOverline || hasSupporting
        ? 2
        : 1);

  const text = (
    <span
      data-slot="list-item-text"
      className={cn(LIST_ITEM_TEXT, classNames?.text)}
    >
      {hasOverline ? (
        <span
          data-slot="list-item-overline"
          className={cn(LIST_ITEM_OVERLINE, classNames?.overline)}
        >
          {overline}
        </span>
      ) : null}
      <span
        data-slot="list-item-headline"
        className={cn(
          LIST_ITEM_HEADLINE,
          headlineLines !== undefined && LIST_ITEM_CLAMP,
          classNames?.headline,
        )}
        style={clampStyle(headlineLines)}
      >
        {title}
      </span>
      {hasSupporting ? (
        <span
          data-slot="list-item-supporting-text"
          className={cn(
            LIST_ITEM_SUPPORTING_TEXT,
            supportingTextLines !== undefined && LIST_ITEM_CLAMP,
            classNames?.supportingText,
          )}
          style={clampStyle(supportingTextLines)}
        >
          {supportingText}
        </span>
      ) : null}
    </span>
  );

  const leadingSlot = isRenderable(leading) ? (
    <span
      data-slot="list-item-leading"
      className={cn(LIST_ITEM_LEADING, classNames?.leading)}
    >
      {leading}
    </span>
  ) : null;

  const hasTrailingText = isRenderable(trailingSupportingText);
  const trailingSlot =
    hasTrailingText || isRenderable(trailing) ? (
      <span
        data-slot="list-item-trailing"
        className={cn(LIST_ITEM_TRAILING, classNames?.trailing)}
      >
        {hasTrailingText ? (
          <span
            data-slot="list-item-trailing-supporting-text"
            className={cn(
              LIST_ITEM_TRAILING_TEXT,
              classNames?.trailingSupportingText,
            )}
          >
            {trailingSupportingText}
          </span>
        ) : null}
        {trailing}
      </span>
    ) : null;

  let content: React.ReactNode;

  if (hasControl) {
    // `disabled` reaches the control itself, so the native input is disabled
    // too (and the row's CSS sees `:disabled`).
    const controlElement = disabled
      ? cloneElement(control as React.ReactElement<{ disabled?: boolean }>, {
          disabled: true,
        })
      : control;
    const controlSlot = (
      <span
        data-slot="list-item-control"
        className={cn(LIST_ITEM_CONTROL, classNames?.control)}
      >
        {controlElement}
      </span>
    );
    content = (
      <label
        data-slot="list-item-content"
        className={cn(
          "group/selection-field",
          LIST_ITEM_CONTENT,
          LIST_ITEM_STRETCH,
          classNames?.content,
        )}
      >
        {controlPosition === "start" ? controlSlot : null}
        {leadingSlot}
        {text}
        {trailingSlot}
        {controlPosition === "end" ? controlSlot : null}
        <Ripple className={LIST_ITEM_RIPPLE} />
      </label>
    );
  } else if (isAction) {
    const isLink = child === null && href !== undefined;
    const isButton = child === null && !isLink;
    const Comp = (
      child ? Slot.Root : isLink ? "a" : "button"
    ) as React.ElementType;
    const current =
      selected === true &&
      (actionProps?.["aria-current"] as unknown) === undefined
        ? isButton
          ? "true"
          : "page"
        : undefined;
    const inner = (
      <>
        {leadingSlot}
        {text}
        <Ripple className={LIST_ITEM_RIPPLE} />
      </>
    );
    content = (
      <>
        <Comp
          data-slot="list-item-content"
          // A disabled link drops its `href` (the standard way to make it
          // inert) and keeps its role, so it's still announced — as disabled.
          href={isLink && !disabled ? href : undefined}
          role={isLink && disabled ? "link" : undefined}
          type={isButton ? (type ?? "button") : undefined}
          disabled={isButton && disabled ? true : undefined}
          aria-disabled={!isButton && disabled ? true : undefined}
          aria-current={current}
          className={cn(
            LIST_ITEM_CONTENT,
            LIST_ITEM_STRETCH,
            classNames?.content,
          )}
          onClick={onClick}
          {...actionProps}
        >
          {child ? cloneElement(child, undefined, inner) : inner}
        </Comp>
        {trailingSlot}
      </>
    );
  } else {
    content = (
      <>
        <div
          data-slot="list-item-content"
          className={cn(LIST_ITEM_CONTENT, classNames?.content)}
        >
          {leadingSlot}
          {text}
        </div>
        {trailingSlot}
      </>
    );
  }

  const rowProps = {
    ...props,
    "data-slot": "list-item",
    "data-list-item": "",
    "data-kind": kind,
    "data-lines": lineCount,
    "data-align": align === "auto" ? undefined : align,
    "data-selected": selected === undefined ? undefined : String(selected),
    "data-disabled": disabled || undefined,
    "data-dragged": dragged || undefined,
    "data-interactive": kind !== "text" && !disabled ? "" : undefined,
    "data-text-value": textValue,
    className: cn(listItemVariants({ part: "item" }), className),
  };

  if (value !== undefined) {
    return (
      <ListItemOption
        {...rowProps}
        value={value}
        disabled={disabled}
        rippleClassName={LIST_ITEM_RIPPLE}
      >
        {content}
      </ListItemOption>
    );
  }

  return <li {...rowProps}>{content}</li>;
};

export default ListItem;
