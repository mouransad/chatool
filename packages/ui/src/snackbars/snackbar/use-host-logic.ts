"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { showInTopLayer } from "../../overlays/top-layer";
import { ANNOUNCE_DELAY } from "../config";
import {
  type SnackbarAnchor,
  type SnackbarData,
  type SnackbarPoliteness,
  type SnackbarQueue,
  type SnackbarStrategy,
} from "./snackbar.types";
import { matchesHotkey } from "./timing";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const resolveAnchor = (anchor: SnackbarAnchor | undefined) => {
  if (!anchor) return null;
  if (typeof anchor === "string") {
    return document.querySelector<HTMLElement>(anchor);
  }
  if (anchor instanceof HTMLElement) return anchor;
  return anchor.current;
};

/** The topmost open **modal** `<dialog>`: everything outside it is inert. */
const findModalDialog = (): HTMLDialogElement | null => {
  try {
    const modals = document.querySelectorAll<HTMLDialogElement>("dialog:modal");
    return modals[modals.length - 1] ?? null;
  } catch {
    // `:modal` unsupported: no reliable way to tell, stay put.
    return null;
  }
};

const announcementFor = (data: SnackbarData, item: Element | null) => {
  if (data.announcement !== undefined) return data.announcement;
  const text =
    item?.querySelector("[data-slot=snackbar-supporting-text]")?.textContent ??
    (typeof data.message === "string" || typeof data.message === "number"
      ? String(data.message)
      : "");
  const action =
    item?.querySelector("[data-slot=snackbar-action]")?.textContent ??
    (typeof data.action === "string" ? data.action : "");
  return [text.trim(), action.trim()].filter(Boolean).join(". ");
};

/**
 * Everything a `SnackbarHost` does that isn't drawing: subscribe to the queue,
 * keep leaving snackbars mounted while they animate out, pause on focus loss,
 * announce, the hotkey, the anchor offset, the top layer and the modal-dialog
 * hand-off.
 */
export const useHostLogic = ({
  queue,
  strategy,
  hotkey,
  anchor,
  side,
  contained,
  container,
  pauseOnFocusLoss,
}: {
  queue: SnackbarQueue;
  strategy: SnackbarStrategy | undefined;
  hotkey: readonly string[] | false;
  anchor: SnackbarAnchor | undefined;
  side: "bottom" | "top";
  contained: boolean;
  container: HTMLElement | null | undefined;
  pauseOnFocusLoss: boolean;
}) => {
  const state = useSyncExternalStore(
    queue.subscribe,
    queue.getSnapshot,
    queue.getSnapshot,
  );
  const { current } = state;
  const regionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (strategy) queue.setStrategy(strategy);
  }, [queue, strategy]);

  // ---- Items: the current one plus any still animating out --------------
  const [items, setItems] = useState<SnackbarData[]>([]);
  if (current) {
    const index = items.findIndex((item) => item.key === current.key);
    if (index === -1) {
      setItems([...items, current]);
    } else if (items[index] !== current) {
      setItems(items.map((item, i) => (i === index ? current : item)));
    }
  }
  const onExited = useCallback((key: string) => {
    setItems((previous) => previous.filter((item) => item.key !== key));
  }, []);

  // ---- Pause while the page isn't being looked at ------------------------
  const [focusLost, setFocusLost] = useState(false);
  useEffect(() => {
    if (!pauseOnFocusLoss) {
      setFocusLost(false);
      return;
    }
    const sync = () =>
      setFocusLost(
        document.visibilityState === "hidden" || !document.hasFocus(),
      );
    sync();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("blur", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("blur", sync);
      window.removeEventListener("focus", sync);
    };
  }, [pauseOnFocusLoss]);

  // ---- Where to render ---------------------------------------------------
  // A modal `<dialog>` makes the rest of the page inert, top layer included,
  // so while one is open the host renders inside it.
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const currentKey = current?.key;
  useIsomorphicLayoutEffect(() => {
    if (container !== undefined) {
      setTarget(container);
      return;
    }
    if (contained) {
      setTarget(null);
      return;
    }
    const modal = currentKey === undefined ? null : findModalDialog();
    const home = regionRef.current;
    setTarget(modal && !(home && modal.contains(home)) ? modal : null);
    if (!modal) return;
    const onClose = () => setTarget(null);
    modal.addEventListener("close", onClose);
    return () => modal.removeEventListener("close", onClose);
  }, [container, contained, currentKey]);

  // ---- Top layer -----------------------------------------------------------
  const attachRegion = useCallback(
    (node: HTMLElement | null) => {
      regionRef.current = node;
      if (node && !contained) showInTopLayer(node);
    },
    [contained],
  );

  // ---- Anchor ----------------------------------------------------------------
  useIsomorphicLayoutEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    const element = resolveAnchor(anchor);
    if (!element) {
      region.style.removeProperty("--_sb-anchor");
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const frameRect = contained
        ? (
            region.offsetParent ?? document.documentElement
          ).getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      const distance =
        side === "bottom"
          ? frameRect.bottom - rect.top
          : rect.bottom - frameRect.top;
      region.style.setProperty("--_sb-anchor", `${Math.max(0, distance)}px`);
      // The anchor already clears the safe area.
      region.style.setProperty(
        side === "bottom" ? "--_sb-safe-bottom" : "--_sb-safe-top",
        "0px",
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    observer?.observe(element);
    // A ResizeObserver doesn't see transforms: an anchor that scales in or
    // out (a FAB's enter / hide motion) is re-measured once it settles.
    element.addEventListener("transitionend", schedule);
    element.addEventListener("animationend", schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      element.removeEventListener("transitionend", schedule);
      element.removeEventListener("animationend", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, { capture: true });
      region.style.removeProperty("--_sb-anchor");
      region.style.removeProperty("--_sb-safe-bottom");
      region.style.removeProperty("--_sb-safe-top");
    };
    // Re-measured for every new snackbar, so it's right when it matters.
  }, [anchor, side, contained, target, currentKey]);

  // ---- Hotkey: jump to the snackbar (MD3 "like Alt+G") ---------------------
  const hotkeyKey = hotkey === false ? "" : hotkey.join(" ");
  useEffect(() => {
    if (hotkeyKey === "") return;
    const keys = hotkeyKey.split(" ");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !matchesHotkey(event, keys)) return;
      const item = regionRef.current?.querySelector<HTMLElement>(
        "[data-slot=snackbar-item]:not([inert])",
      );
      if (!item) return;
      event.preventDefault();
      const first = item.querySelector<HTMLElement>(
        "button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex='-1'])",
      );
      // A keyboard jump: show the focus ring even if the last input was a
      // mouse click (Chrome / Firefox `focusVisible`, ignored elsewhere).
      (first ?? item).focus({ focusVisible: true } as FocusOptions);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkeyKey]);

  // ---- Announcements -------------------------------------------------------
  // A separate, always-present live region (MD3: "use a live region with a
  // polite (queued) announcement"); the snackbar itself never moves focus.
  const [announcement, setAnnouncement] = useState<{
    text: string;
    politeness: SnackbarPoliteness;
  } | null>(null);
  const version = current?.version;
  useEffect(() => {
    setAnnouncement(null);
    if (!current) return;
    const timer = window.setTimeout(() => {
      const item = regionRef.current?.querySelector(
        "[data-slot=snackbar-item]:not([inert])",
      );
      const text = announcementFor(current, item ?? null);
      if (text) {
        setAnnouncement({ text, politeness: current.politeness ?? "polite" });
      }
    }, ANNOUNCE_DELAY);
    return () => window.clearTimeout(timer);
    // `current` is read fresh; the key + version are what mean "new message".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, version]);

  return {
    current,
    items,
    onExited,
    focusLost,
    target,
    attachRegion,
    announcement,
  };
};
