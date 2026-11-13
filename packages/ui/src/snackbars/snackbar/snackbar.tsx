"use client";

import { isValidElement } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import SnackbarAction from "./snackbar-action";
import SnackbarDismissAction from "./snackbar-dismiss-action";
import { type SnackbarProps } from "./snackbar.types";
import {
  ACTIONS,
  ACTIONS_STACKED,
  ACTIONS_STACKED_GAP,
  TEXT,
  TEXT_CLAMP,
  TEXT_INLINE,
  TEXT_INLINE_GAP,
  TEXT_STACKED,
  snackbarVariants,
} from "./snackbar.variants";
import { useLogic } from "./use-logic";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * The MD3 **snackbar** surface, Compose's `Snackbar(…)`: supporting text, an
 * optional action and an optional ✕ close affordance on an `inverse-surface`
 * container. It only draws; `SnackbarHost` shows it at the bottom of the
 * screen, times it, animates it and announces it, and is what you normally
 * use (through `snackbar()`).
 *
 * Render it yourself in a host's `renderSnackbar`, or anywhere in your own
 * layout. Its action comes in two forms: a label (`action="Undo"` +
 * `onAction`), or any node, typically a `SnackbarAction`.
 */
const Snackbar = ({
  children,
  action,
  onAction,
  withDismissAction = false,
  onDismiss,
  dismissLabel = "Dismiss",
  actionOnNewLine = "auto",
  maxLines,
  className,
  style,
  ...props
}: SnackbarProps) => {
  const hasAction = isRenderable(action);
  const logic = useLogic({ actionOnNewLine, hasAction });
  const layout = logic.stacked ? "stacked" : "inline";

  const actionNode =
    hasAction && !isValidElement(action) ? (
      <SnackbarAction onClick={onAction}>{action}</SnackbarAction>
    ) : (
      action
    );

  const clamp = maxLines !== undefined && maxLines > 0;

  return (
    <div
      ref={logic.rootRef}
      data-slot="snackbar"
      data-layout={layout}
      data-dismissible={withDismissAction}
      className={cn(
        snackbarVariants({ layout, dismissible: withDismissAction }),
        className,
      )}
      style={
        clamp
          ? ({ "--_sb-lines": maxLines, ...style } as React.CSSProperties)
          : style
      }
      {...props}
    >
      <div
        ref={logic.textRef}
        data-slot="snackbar-supporting-text"
        className={cn(
          TEXT,
          layout === "inline" ? TEXT_INLINE : TEXT_STACKED,
          layout === "inline" && !withDismissAction && TEXT_INLINE_GAP,
          clamp && TEXT_CLAMP,
        )}
      >
        {children}
      </div>
      {(hasAction || withDismissAction) && (
        <div
          ref={logic.actionsRef}
          data-slot="snackbar-actions"
          className={cn(
            ACTIONS,
            layout === "stacked" && ACTIONS_STACKED,
            layout === "stacked" && !withDismissAction && ACTIONS_STACKED_GAP,
          )}
        >
          {actionNode}
          {withDismissAction && (
            <SnackbarDismissAction label={dismissLabel} onClick={onDismiss} />
          )}
        </div>
      )}
    </div>
  );
};

export default Snackbar;
