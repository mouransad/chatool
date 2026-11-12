"use client";

import { useState } from "react";
import Tooltip, { type TooltipOpenChangeReason } from "@chatool/ui/tooltip";
import Button from "@chatool/ui/button";

/**
 * Controlled: `open` + `onOpenChange(open, { reason })`. The callback is a
 * function prop, so it lives in a client island; the tooltips in the page
 * around it are used straight from the Server Component.
 */
export function TooltipControlled() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<TooltipOpenChangeReason | "none">(
    "none",
  );

  return (
    <div className="gap-3 flex flex-wrap items-center">
      <Tooltip
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next);
          setReason(details.reason);
        }}
        content="Controlled tooltip"
      >
        <Button variant="outlined">Hover, focus or long-press</Button>
      </Tooltip>
      <Button variant="text" size="xs" onClick={() => setOpen((v) => !v)}>
        Toggle
      </Button>
      <span className="text-body-small text-on-surface-variant">
        open = {String(open)} · reason = {reason}
      </span>
    </div>
  );
}
