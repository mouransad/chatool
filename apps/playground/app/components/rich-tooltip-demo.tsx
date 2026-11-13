"use client";

import RichTooltip, {
  RichTooltipAction,
  useRichTooltipState,
} from "@chatool/ui/rich-tooltip";
import Button from "@chatool/ui/button";

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * The rich tooltip's code-driven extras need function props, so they live in
 * this client island: `useRichTooltipState()` (Compose's `TooltipState`) with a
 * `manual` trigger, and an async action that holds the tooltip open behind
 * its spinner until the promise resolves. The rich tooltips in the page
 * around it are used straight from the Server Component.
 */
export function RichTooltipStateDemo() {
  const tip = useRichTooltipState();

  return (
    <div className="gap-3 flex flex-wrap items-center">
      <RichTooltip
        state={tip}
        trigger="manual"
        caret
        align="center"
        subhead="Turn on backups"
        supportingText="Back up this device every night while it charges."
        actions={
          <>
            <RichTooltipAction onClick={() => wait(1200)}>
              Turn on
            </RichTooltipAction>
            <RichTooltipAction>Not now</RichTooltipAction>
          </>
        }
      >
        <Button variant="outlined">Backups</Button>
      </RichTooltip>
      <Button variant="text" size="xs" onClick={tip.toggle}>
        {tip.open ? "Dismiss from code" : "Show from code"}
      </Button>
      <span className="text-body-small text-on-surface-variant">
        open = {String(tip.open)}
      </span>
    </div>
  );
}
