"use client";

import type * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@chatool/utils";

import { MOTION } from "../../overlays/config";
import { DEFAULT_HOTKEY } from "../config";
import { SnackbarQueueContext } from "./snackbar-context";
import SnackbarItem from "./snackbar-item";
import { snackbar } from "./snackbar-queue";
import { type SnackbarHostProps } from "./snackbar.types";
import { STACK, snackbarHostVariants } from "./snackbar.variants";
import { hotkeyLabel } from "./timing";
import { useHostLogic } from "./use-host-logic";

const NO_DIRECTIONS: readonly never[] = [];

/**
 * Shows a queue's snackbars, **one at a time** (MD3: "Only one snackbar may
 * be displayed at a time"), at the bottom of the screen: Compose's
 * `SnackbarHost`. Render one near the root of the app; then call
 * `snackbar(…)` from anywhere.
 *
 * - **Queue:** a new snackbar waits for the current one (`strategy="queue"`)
 *   or replaces it with a crossfade (`"replace"` / `replace: true`); the same
 *   `id` updates in place.
 * - **Timing:** without an action, `duration` (default 4s); with one, until
 *   acted on or dismissed. Paused while hovered, focused, swiped, or while
 *   the window is in the background (WCAG 2.2.1).
 * - **Accessibility:** a named landmark (`"Notifications (Alt+G)"`); a
 *   polite live region announces each message without moving focus; the
 *   hotkey jumps to the snackbar, Escape dismisses it while focused, and focus
 *   returns where it came from when it closes.
 * - **Placement:** bottom or top, start / center / end on wide layouts, full
 *   width, an `offset`, above an `anchor` (FAB, bottom bar), or `contained`
 *   in a pane. It renders in the top layer and moves into an open modal
 *   `<dialog>` so snackbars stay usable above it.
 *
 * `className` and the remaining props go to the landmark `<section>`.
 */
const SnackbarHost = ({
  children,
  queue = snackbar.queue,
  strategy,
  duration = "short",
  side = "bottom",
  align = "center",
  fullWidth = false,
  contained = false,
  offset,
  anchor,
  container,
  label = "Notifications",
  hotkey = DEFAULT_HOTKEY,
  swipeDirection = "end",
  pauseOnHover = true,
  pauseOnFocusLoss = true,
  actionOnNewLine = "auto",
  maxLines,
  dismissLabel = "Dismiss",
  renderSnackbar,
  snackbarClassName,
  className,
  style,
  ...props
}: SnackbarHostProps) => {
  const resolvedSide = side ?? "bottom";
  const isContained = contained ?? false;
  const logic = useHostLogic({
    queue,
    strategy,
    hotkey,
    anchor,
    side: resolvedSide,
    contained: isContained,
    container,
    pauseOnFocusLoss,
  });

  const swipeDirections =
    swipeDirection === false
      ? NO_DIRECTIONS
      : typeof swipeDirection === "string"
        ? [swipeDirection]
        : swipeDirection;
  const name = hotkey === false ? label : `${label} (${hotkeyLabel(hotkey)})`;
  const offsetValue = typeof offset === "number" ? `${offset}px` : offset;

  const region = (
    <section
      ref={logic.attachRegion}
      popover={isContained ? undefined : "manual"}
      aria-label={name}
      data-slot="snackbar-host"
      data-side={resolvedSide}
      data-full-width={fullWidth ?? false}
      className={cn(
        MOTION,
        snackbarHostVariants({
          side: resolvedSide,
          align,
          fullWidth,
          contained: isContained,
        }),
        className,
      )}
      style={
        offsetValue === undefined
          ? style
          : ({ "--_sb-offset": offsetValue, ...style } as React.CSSProperties)
      }
      {...props}
    >
      <div data-slot="snackbar-stack" className={STACK}>
        {logic.items.map((data) => (
          <SnackbarItem
            key={data.key}
            data={data}
            open={data.key === logic.current?.key}
            hostDuration={duration}
            hostPaused={logic.focusLost}
            pauseOnHover={pauseOnHover}
            swipeDirections={swipeDirections}
            actionOnNewLine={actionOnNewLine}
            maxLines={maxLines}
            dismissLabel={dismissLabel}
            className={snackbarClassName}
            renderSnackbar={renderSnackbar}
            onExited={logic.onExited}
          />
        ))}
      </div>
      <div
        data-slot="snackbar-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {logic.announcement?.politeness === "polite"
          ? logic.announcement.text
          : null}
      </div>
      <div
        data-slot="snackbar-announcer"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {logic.announcement?.politeness === "assertive"
          ? logic.announcement.text
          : null}
      </div>
    </section>
  );

  return (
    <>
      {children !== undefined && (
        <SnackbarQueueContext.Provider value={queue}>
          {children}
        </SnackbarQueueContext.Provider>
      )}
      {logic.target ? createPortal(region, logic.target) : region}
    </>
  );
};

export default SnackbarHost;
