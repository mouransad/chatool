"use client";

import { useCallback } from "react";
import type * as React from "react";

import Snackbar from "./snackbar";
import {
  type SnackbarData,
  type SnackbarDuration,
  type SnackbarSwipeDirection,
} from "./snackbar.types";
import { ITEM, SWIPE_LAYER } from "./snackbar.variants";
import { resolveDuration } from "./timing";
import { useItemLogic } from "./use-item-logic";

export interface SnackbarItemProps {
  data: SnackbarData;
  open: boolean;
  hostDuration: SnackbarDuration;
  hostPaused: boolean;
  pauseOnHover: boolean;
  swipeDirections: readonly SnackbarSwipeDirection[];
  actionOnNewLine: boolean | "auto";
  maxLines: number | undefined;
  dismissLabel: string;
  className: string | undefined;
  renderSnackbar: ((data: SnackbarData) => React.ReactNode) | undefined;
  onExited: (key: string) => void;
}

/**
 * One snackbar inside a `SnackbarHost` (internal): the presence wrapper that
 * animates it in and out, the swipe layer, and the surface itself (or the
 * custom render). Every snackbar shares one grid cell, so a replacement
 * crossfades over the one leaving.
 */
const SnackbarItem = ({
  data,
  open,
  hostDuration,
  hostPaused,
  pauseOnHover,
  swipeDirections,
  actionOnNewLine,
  maxLines,
  dismissLabel,
  className,
  renderSnackbar,
  onExited,
}: SnackbarItemProps) => {
  const logic = useItemLogic({
    data,
    open,
    hostDuration,
    hostPaused,
    pauseOnHover,
    swipeDirections,
    onExited,
  });

  const { onAction, performAction } = data;
  const handleAction = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onAction?.(event);
      // `preventDefault()` in `onAction` keeps the snackbar open.
      if (!event.defaultPrevented) performAction();
    },
    [onAction, performAction],
  );

  if (!logic.mounted) return null;

  const render = data.render ?? renderSnackbar;
  // Compose: an indefinite snackbar should offer "an additional close
  // affordance", or a mouse / keyboard user may have no way to clear it.
  const indefinite = resolveDuration(data, hostDuration) === "indefinite";

  return (
    <div
      ref={logic.nodeRef}
      data-slot="snackbar-item"
      data-state={logic.status}
      data-swiped={logic.swiped || undefined}
      tabIndex={-1}
      inert={!open}
      className={ITEM}
      {...logic.handlers}
    >
      <div
        ref={logic.swipeRef}
        data-slot="snackbar-swipe"
        className={SWIPE_LAYER}
      >
        {render ? (
          render(data)
        ) : (
          <Snackbar
            action={data.action}
            onAction={handleAction}
            withDismissAction={data.withDismissAction ?? indefinite}
            onDismiss={() => data.dismiss("dismiss")}
            dismissLabel={data.dismissLabel ?? dismissLabel}
            actionOnNewLine={data.actionOnNewLine ?? actionOnNewLine}
            maxLines={data.maxLines ?? maxLines}
            className={
              [className, data.className].filter(Boolean).join(" ") || undefined
            }
          >
            {data.message}
          </Snackbar>
        )}
      </div>
    </div>
  );
};

export default SnackbarItem;
