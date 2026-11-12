"use client";

import { useEffect, useRef, useState } from "react";
import Fab from "@chatool/ui/fab";
import Button from "@chatool/ui/button";
import EditFilled from "@chatool/icons/EditFilled";
import AddFilled from "@chatool/icons/AddFilled";

/**
 * MD3: "Extended FABs can collapse into a FAB on scroll and expand on reaching
 * the bottom of the view." `expanded` is driven by scroll direction, so it
 * lives in a client island; `Fab` itself is a Server Component. The frame's
 * `transform` makes it the containing block for `placement` (standing in for
 * the viewport).
 */
export function FabCollapseOnScroll() {
  const scroller = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let last = el.scrollTop;
    const onScroll = () => {
      const top = el.scrollTop;
      const atEnd = top + el.clientHeight >= el.scrollHeight - 8;
      if (atEnd || top < last) setExpanded(true);
      else if (top > last + 4) setExpanded(false);
      last = top;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="h-80 max-w-sm relative w-full [transform:translateZ(0)] overflow-hidden rounded-xl bg-surface-container-low">
      <div ref={scroller} className="gap-3 p-4 grid h-full overflow-y-auto">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-surface-container-highest text-body-large text-on-surface"
          >
            Message {i + 1}
          </div>
        ))}
      </div>
      <Fab
        icon={<EditFilled />}
        label="Compose"
        size="small"
        expanded={expanded}
        placement="bottom-end"
      />
    </div>
  );
}

/**
 * `visible` hides the FAB (shrink + fade, `inert`) — MD3's alternative to
 * disabling it. Remounting with a new `key` replays the entrance, as MD3 asks
 * when switching tabs.
 */
export function FabShowHide() {
  const [visible, setVisible] = useState(true);
  const [tab, setTab] = useState(0);

  return (
    <div className="gap-4 flex flex-wrap items-center">
      <Button variant="tonal" onClick={() => setVisible((v) => !v)}>
        {visible ? "Hide" : "Show"}
      </Button>
      <Button variant="outlined" onClick={() => setTab((t) => t + 1)}>
        Switch tab
      </Button>
      <Fab
        key={tab}
        icon={<AddFilled />}
        aria-label="Create"
        visible={visible}
      />
    </div>
  );
}
