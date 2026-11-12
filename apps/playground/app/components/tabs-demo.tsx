"use client";

import { useState } from "react";
import Tabs, { Tab, TabList, TabPanel, TabPanels } from "@chatool/ui/tabs";
import ImageOutlined from "@chatool/icons/ImageOutlined";
import FolderOutlined from "@chatool/icons/FolderOutlined";
import StarOutlined from "@chatool/icons/StarOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";
import MailFilled from "@chatool/icons/MailFilled";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import ChatFilled from "@chatool/icons/ChatFilled";
import HomeOutlined from "@chatool/icons/HomeOutlined";
import HomeFilled from "@chatool/icons/HomeFilled";

/**
 * Controlled tabs whose badges clear once a tab has been seen (MD3), with the
 * change `reason` reported by `onValueChange`.
 */
export function TabsBadgeInbox() {
  const [value, setValue] = useState("home");
  const [reason, setReason] = useState("—");
  const [unread, setUnread] = useState<Record<string, number | boolean>>({
    mail: 12,
    chat: true,
  });

  return (
    <div className="max-w-xl gap-2 flex w-full flex-col">
      <Tabs
        value={value}
        onValueChange={(next, details) => {
          setValue(next);
          setReason(details.reason);
          setUnread(({ [next]: _seen, ...rest }) => rest);
        }}
      >
        <TabList aria-label="Inbox">
          <Tab
            value="home"
            icon={<HomeOutlined />}
            selectedIcon={<HomeFilled />}
          >
            Home
          </Tab>
          <Tab
            value="mail"
            icon={<MailOutlined />}
            selectedIcon={<MailFilled />}
            badge={unread.mail}
          >
            Mail
          </Tab>
          <Tab
            value="chat"
            icon={<ChatOutlined />}
            selectedIcon={<ChatFilled />}
            badge={unread.chat}
          >
            Chat
          </Tab>
        </TabList>
      </Tabs>
      <span className="text-body-small text-on-surface-variant">
        value {value} · reason {reason}
      </span>
    </div>
  );
}

/**
 * MD3 swipeable content area: swipe the panels (touch / trackpad) and the
 * indicator follows; tapping a tab springs the pager to its panel.
 */
export function TabsSwipeable() {
  return (
    <div className="max-w-xl w-full">
      <Tabs defaultValue="photos">
        <TabList aria-label="Library" iconPosition="start">
          <Tab value="photos" icon={<ImageOutlined />}>
            Photos
          </Tab>
          <Tab value="albums" icon={<FolderOutlined />}>
            Albums
          </Tab>
          <Tab value="favorites" icon={<StarOutlined />}>
            Favorites
          </Tab>
        </TabList>
        <TabPanels swipeable>
          {["Photos", "Albums", "Favorites"].map((title) => (
            <TabPanel key={title} value={title.toLowerCase()}>
              <div className="m-4 h-40 gap-2 grid grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-md bg-surface-container-high text-label-medium text-on-surface-variant"
                  >
                    {title} {i + 1}
                  </div>
                ))}
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
}
