"use client";

import { isValidElement, useMemo } from "react";
import type * as React from "react";

import RichTooltipContext, {
  type RichTooltipContextValue,
} from "./rich-tooltip-context";
import RichTooltipContent from "./rich-tooltip-content";
import RichTooltipSubhead from "./rich-tooltip-subhead";
import RichTooltipSupportingText from "./rich-tooltip-supporting-text";
import RichTooltipActions from "./rich-tooltip-actions";
import RichTooltipTrigger from "./rich-tooltip-trigger";
import { containsControls, plainText } from "./scan";
import { type RichTooltipProps } from "./rich-tooltip.types";
import { useLogic } from "./use-logic";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/** "Subhead. Text", without doubling the subhead's own punctuation. */
const joinSentences = (first: string | undefined, second: string) => {
  if (!first) return second;
  return /[.!?:;]$/.test(first.trim())
    ? `${first.trim()} ${second}`
    : `${first.trim()}. ${second}`;
};

/**
 * MD3 **rich tooltip**: longer, explanatory context for an element, with an
 * optional subhead, inline links and up to two text-button actions. M3
 * Expressive motion, MD3 placement (bottom-right of the anchor, flipping and
 * shifting in 8dp steps), the shared overlay top layer, and the APG / MDC
 * tooltip-or-non-modal-dialog semantics.
 *
 * **Composed** (full control over every part):
 *
 * ```tsx
 * <RichTooltip trigger="click">
 *   <RichTooltipTrigger><Button>Share</Button></RichTooltipTrigger>
 *   <RichTooltipContent>
 *     <RichTooltipSubhead>Share links</RichTooltipSubhead>
 *     <RichTooltipSupportingText>Anyone with the link can view.</RichTooltipSupportingText>
 *     <RichTooltipActions>
 *       <RichTooltipAction>Got it</RichTooltipAction>
 *     </RichTooltipActions>
 *   </RichTooltipContent>
 * </RichTooltip>
 * ```
 *
 * **Shorthand** (`supportingText` set): `children` is the anchor itself.
 *
 * ```tsx
 * <RichTooltip subhead="Share links" supportingText="…" actions={<RichTooltipAction>Got it</RichTooltipAction>}>
 *   <Button>Share</Button>
 * </RichTooltip>
 * ```
 *
 * A client component that renders no element of its own; the parts and
 * everything passed to them still render from Server Components.
 */
const RichTooltip = ({
  children,
  supportingText,
  subhead,
  actions,
  contentProps,
  trigger = "hover",
  open,
  defaultOpen,
  onOpenChange,
  state,
  disabled,
  interactive,
  anchor,
  side,
  align,
  offset,
  alignOffset,
  collisionPadding,
  flip,
  positionStep,
  caret,
  hoverable = true,
  announce,
  container,
  showDelay,
  hideDelay,
  skipDelay,
  touchShowDelay,
  touchHideDelay,
}: RichTooltipProps) => {
  const shorthand = supportingText !== undefined;
  const hasSubhead = shorthand && isRenderable(subhead);
  const hasActions = shorthand && isRenderable(actions);

  const staticInteractive = shorthand
    ? hasActions ||
      containsControls(supportingText) ||
      containsControls(subhead)
    : containsControls(children);

  // Plain shorthand text can describe the trigger before the tooltip ever
  // opens (screen readers that never hover still hear it).
  const text = shorthand ? plainText(supportingText) : undefined;
  const willBeInteractive =
    interactive ?? (trigger !== "hover" || staticInteractive);
  const description =
    !willBeInteractive && text !== undefined
      ? joinSentences(hasSubhead ? plainText(subhead) : undefined, text)
      : undefined;

  const logic = useLogic({
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    state,
    disabled,
    interactive,
    anchor,
    side,
    align,
    offset,
    alignOffset,
    collisionPadding,
    flip,
    positionStep,
    caret,
    announce,
    container,
    showDelay,
    hideDelay,
    skipDelay,
    touchShowDelay,
    touchHideDelay,
    staticInteractive,
    description,
  });

  // Transient tooltips are hoverable (WCAG 1.4.13). A tooltip with controls
  // must take the pointer to be usable, and persistent ones ignore its
  // comings and goings anyway.
  const effectiveHoverable =
    trigger === "hover" && !logic.interactive ? hoverable : true;

  const value = useMemo<RichTooltipContextValue>(
    () => ({
      open: logic.open,
      mounted: logic.mounted,
      status: logic.status,
      environment: logic.environment,
      interactive: logic.interactive,
      hoverable: effectiveHoverable,
      caret: logic.caret,
      surfaceId: logic.surfaceId,
      descriptionId: logic.descriptionId,
      subheadId: logic.subheadId,
      supportingTextId: logic.supportingTextId,
      attachTrigger: logic.attachTrigger,
      attachPositioner: logic.attachPositioner,
      popupRef: logic.popupRef,
      caretRef: logic.caretRef,
      registerSubhead: logic.registerSubhead,
      registerSupportingText: logic.registerSupportingText,
      registerInteractive: logic.registerInteractive,
      close: logic.close,
      hold: logic.hold,
    }),
    [
      logic.open,
      logic.mounted,
      logic.status,
      logic.environment,
      logic.interactive,
      effectiveHoverable,
      logic.caret,
      logic.surfaceId,
      logic.descriptionId,
      logic.subheadId,
      logic.supportingTextId,
      logic.attachTrigger,
      logic.attachPositioner,
      logic.popupRef,
      logic.caretRef,
      logic.registerSubhead,
      logic.registerSupportingText,
      logic.registerInteractive,
      logic.close,
      logic.hold,
    ],
  );

  return (
    <RichTooltipContext value={value}>
      {shorthand ? (
        <>
          {isValidElement(children) ? (
            <RichTooltipTrigger>{children}</RichTooltipTrigger>
          ) : (
            children
          )}
          <RichTooltipContent {...contentProps}>
            {hasSubhead && <RichTooltipSubhead>{subhead}</RichTooltipSubhead>}
            <RichTooltipSupportingText>
              {supportingText}
            </RichTooltipSupportingText>
            {hasActions && <RichTooltipActions>{actions}</RichTooltipActions>}
          </RichTooltipContent>
        </>
      ) : (
        children
      )}
    </RichTooltipContext>
  );
};

export default RichTooltip;
