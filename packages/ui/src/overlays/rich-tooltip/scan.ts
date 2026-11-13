import { Children, isValidElement } from "react";
import type * as React from "react";

import RichTooltipAction from "./rich-tooltip-action";
import RichTooltipActions from "./rich-tooltip-actions";
import RichTooltipTrigger from "./rich-tooltip-trigger";

/** Native elements that take focus (a link only with an `href`). */
const CONTROLS = new Set(["button", "input", "select", "textarea", "summary"]);

/**
 * Whether a rich tooltip's (not yet rendered) content will hold controls, so
 * the trigger can announce a popup (`aria-haspopup` / `aria-expanded`)
 * **before** the tooltip first opens. It walks the element tree as written
 * (not what your own components render: those are caught at runtime by
 * `RichTooltipContent`), skipping the trigger.
 */
export const containsControls = (node: React.ReactNode): boolean =>
  Children.toArray(node).some((child) => {
    if (!isValidElement(child)) return false;
    const { type } = child;
    const props = child.props as { children?: React.ReactNode; href?: string };
    if (type === RichTooltipTrigger) return false;
    if (type === RichTooltipActions || type === RichTooltipAction) return true;
    if (type === "a") return props.href !== undefined;
    if (typeof type === "string" && CONTROLS.has(type)) return true;
    return containsControls(props.children);
  });

/** The text of a plain string / number node, else `undefined`. */
export const plainText = (node: React.ReactNode) =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : undefined;
