"use client";

import { useState } from "react";
import { Button } from "@chatool/ui/button";
import Badge from "@chatool/ui/badge";
import NotificationsOutlined from "@chatool/icons/NotificationsOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";
import MailFilled from "@chatool/icons/MailFilled";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import ChatFilled from "@chatool/icons/ChatFilled";
import HomeOutlined from "@chatool/icons/HomeOutlined";
import HomeFilled from "@chatool/icons/HomeFilled";

/** Live count: enter spring, count pop, dot ⇄ pill morph, exit. */
export function BadgeCounter() {
  const [count, setCount] = useState(3);
  const [dot, setDot] = useState(false);
  return (
    <div className="gap-6 flex flex-wrap items-center">
      <Badge value={dot ? undefined : count}>
        <NotificationsOutlined className="size-6 text-on-surface-variant" />
      </Badge>
      <div className="gap-2 flex flex-wrap">
        <Button
          size="xs"
          variant="tonal"
          onClick={() => setCount((c) => c + 1)}
        >
          +1
        </Button>
        <Button
          size="xs"
          variant="tonal"
          onClick={() => setCount((c) => c + 250)}
        >
          +250
        </Button>
        <Button size="xs" variant="outlined" onClick={() => setCount(0)}>
          Clear
        </Button>
        <Button size="xs" variant="outlined" onClick={() => setDot((d) => !d)}>
          {dot ? "Count" : "Dot"}
        </Button>
      </div>
    </div>
  );
}

const items = [
  { label: "Home", icon: HomeOutlined, active: HomeFilled },
  { label: "Mail", icon: MailOutlined, active: MailFilled, value: 12 },
  { label: "Chat", icon: ChatOutlined, active: ChatFilled, value: 1500 },
];

/** MD3: a navigation badge hides once its destination is selected. */
export function BadgeNavBar() {
  const [selected, setSelected] = useState(0);
  return (
    <nav
      aria-label="Demo"
      className="h-20 w-80 flex rounded-xl bg-surface-container-high"
    >
      {items.map((item, i) => {
        const isSelected = i === selected;
        const IconC = isSelected ? item.active : item.icon;
        return (
          <button
            key={item.label}
            type="button"
            aria-current={isSelected ? "page" : undefined}
            aria-label={
              item.value ? `${item.label}, ${item.value} new` : item.label
            }
            onClick={() => setSelected(i)}
            className="pt-3 pb-4 gap-1 flex flex-1 cursor-pointer flex-col items-center"
          >
            <span
              className={`h-8 w-16 flex items-center justify-center rounded-full transition-colors ${
                isSelected
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant"
              }`}
            >
              <Badge
                value={item.value}
                invisible={isSelected || item.value === undefined}
                label=""
              >
                <IconC className="size-6" />
              </Badge>
            </span>
            <span className="text-label-medium text-on-surface-variant">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
