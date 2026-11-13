"use client";

import { createContext, use } from "react";
import type * as React from "react";

import { type PresenceStatus } from "../use-presence";
import { type TooltipOpenChangeReason } from "../tooltip/tooltip.types";
import { type RichTooltipApi } from "./rich-tooltip.types";

/** Where the tooltip renders and which way its text runs. */
export interface RichTooltipEnvironment {
  root: HTMLElement;
  dir: "ltr" | "rtl";
}

/** What a `RichTooltip` shares with its parts. Internal. */
export interface RichTooltipContextValue {
  open: boolean;
  mounted: boolean;
  status: PresenceStatus;
  environment: RichTooltipEnvironment | null;
  interactive: boolean;
  hoverable: boolean;
  /** Caret drawn, and its size as CSS lengths (`undefined` = token default). */
  caret: { width?: string; height?: string } | null;
  /** The surface's id (`aria-controls` / `aria-describedby`). */
  surfaceId: string;
  /** Hidden description node's id, when the shorthand text is plain. */
  descriptionId: string | undefined;
  /** Ids the surface is labelled / described by. */
  subheadId: string | undefined;
  supportingTextId: string | undefined;
  attachTrigger: (node: HTMLElement | null) => (() => void) | undefined;
  attachPositioner: (node: HTMLDivElement | null) => (() => void) | undefined;
  popupRef: React.RefObject<HTMLDivElement | null>;
  caretRef: React.RefObject<HTMLSpanElement | null>;
  registerSubhead: (id: string) => () => void;
  registerSupportingText: (id: string) => () => void;
  /** The content turned out to hold controls: become interactive. */
  registerInteractive: () => void;
  close: (reason: TooltipOpenChangeReason, event?: Event) => void;
  hold: () => () => void;
}

/** The rich tooltip context; `null` outside a `RichTooltip`. Internal. */
const RichTooltipContext = createContext<RichTooltipContextValue | null>(null);

/** Reads the context, failing loudly when a part is used on its own. */
export const useRichTooltipContext = (part: string) => {
  const context = use(RichTooltipContext);
  if (!context) {
    throw new Error(`<${part}> must be used inside a <RichTooltip>.`);
  }
  return context;
};

/**
 * The nearest rich tooltip, for custom parts inside it: a close button of
 * your own, a form that keeps the tooltip open while it saves, …
 */
export const useRichTooltip = (): RichTooltipApi => {
  const context = useRichTooltipContext("useRichTooltip");
  return {
    open: context.open,
    interactive: context.interactive,
    dismiss: (event) => context.close("action", event),
    hold: context.hold,
  };
};

export default RichTooltipContext;
