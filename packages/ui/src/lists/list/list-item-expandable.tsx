import type * as React from "react";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import { type ListItemExpandableProps } from "./list.types";
import {
  LIST_ITEM_CLAMP,
  LIST_ITEM_DETAILS,
  LIST_ITEM_EXPANDABLE,
  LIST_ITEM_EXPAND_ICON,
  LIST_ITEM_GROUP,
  LIST_ITEM_HEADLINE,
  LIST_ITEM_LEADING,
  LIST_ITEM_OVERLINE,
  LIST_ITEM_RIPPLE,
  LIST_ITEM_SUPPORTING_TEXT,
  LIST_ITEM_TEXT,
  LIST_ITEM_TRAILING,
  LIST_ITEM_TRAILING_TEXT,
  listItemVariants,
} from "./list.variants";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

const clampStyle = (lines: number | undefined) =>
  lines === undefined
    ? undefined
    : ({ "--_li-clamp": String(lines) } as React.CSSProperties);

/** Material Symbols `expand_more` (Rounded weight 400, 960 grid). */
const EXPAND_MORE = "M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z";

/**
 * MD3 Expressive **expand & collapse** — "list items containing other list
 * items can expand and collapse in a folder-like manner". Built on a native
 * `<details>` / `<summary>`, so it's a **Server Component** that works with
 * zero JS: the browser owns the open state, the keyboard (Enter / Space on the
 * row) and the semantics (a disclosure button with its expanded state).
 *
 * The row is the `<summary>` (painted exactly like a `ListItem`, so the shape
 * morph, state layer and ripple all match) with Material Web's expressive
 * expand indicator — a chevron in a `corner-full` container, `surface` while
 * collapsed and `surface-container` once open, turning over on the fast
 * spatial spring. The children sit in a nested `<ul>` whose height springs
 * open (Compose's `expandVertically(fastSpatialSpec)`, here `::details-content`
 * + `interpolate-size`; older browsers open instantly). In a **segmented**
 * list the outer corners continue through the children, as in Compose's
 * `segmentedShapes(index, count)` sample.
 */
const ListItemExpandable = ({
  className,
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
  children,
  open,
  defaultOpen,
  onOpenChange,
  expandIcon,
  disabled = false,
  textValue,
  value,
  ...props
}: ListItemExpandableProps) => {
  const hasOverline = isRenderable(overline);
  const hasSupporting = isRenderable(supportingText);
  const hasTrailingText = isRenderable(trailingSupportingText);
  const lineCount =
    lines ??
    ((hasOverline && hasSupporting) ||
    (hasSupporting && (supportingTextLines ?? 0) >= 2)
      ? 3
      : hasOverline || hasSupporting
        ? 2
        : 1);

  return (
    <li
      data-slot="list-item-expandable"
      data-list-item=""
      data-value={value}
      data-text-value={textValue}
      className={cn(LIST_ITEM_EXPANDABLE, className)}
      {...props}
    >
      <details
        data-slot="list-item-details"
        className={LIST_ITEM_DETAILS}
        open={open ?? defaultOpen}
        onToggle={
          onOpenChange
            ? (event) => onOpenChange(event.currentTarget.open)
            : undefined
        }
      >
        <summary
          data-slot="list-item"
          data-kind="expandable"
          data-lines={lineCount}
          data-align={align === "auto" ? undefined : align}
          data-disabled={disabled || undefined}
          data-interactive={disabled ? undefined : ""}
          aria-disabled={disabled || undefined}
          // A disabled row can't toggle or take focus (a `<summary>` has no
          // native `disabled`).
          inert={disabled || undefined}
          className={cn(
            listItemVariants({ part: "summary" }),
            classNames?.content,
          )}
        >
          <Ripple className={LIST_ITEM_RIPPLE} />
          {isRenderable(leading) ? (
            <span
              data-slot="list-item-leading"
              className={cn(LIST_ITEM_LEADING, classNames?.leading)}
            >
              {leading}
            </span>
          ) : null}
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
              {headline}
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
            {expandIcon === false
              ? null
              : (expandIcon ?? (
                  <span
                    data-slot="list-item-expand-icon"
                    aria-hidden
                    className={LIST_ITEM_EXPAND_ICON}
                  >
                    <svg
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                      focusable="false"
                    >
                      <path d={EXPAND_MORE} />
                    </svg>
                  </span>
                ))}
          </span>
        </summary>
        <ul data-slot="list-item-group" className={LIST_ITEM_GROUP}>
          {children}
        </ul>
      </details>
    </li>
  );
};

export default ListItemExpandable;
