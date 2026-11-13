import { TIMING } from "../config";
import { type SnackbarData, type SnackbarDuration } from "./snackbar.types";

const isRenderable = (node: unknown) =>
  node !== undefined && node !== null && node !== false && node !== "";

/** The duration a snackbar actually uses, before converting to ms. */
export const resolveDuration = (
  data: SnackbarData,
  hostDuration: SnackbarDuration,
): SnackbarDuration =>
  data.duration ??
  // MD3: "Snackbars with actions should remain on the screen until the user
  // takes an action on the snackbar, or dismisses it." (Compose's default.)
  (isRenderable(data.action) ? "indefinite" : hostDuration);

/**
 * Milliseconds for a duration, or `null` for `"indefinite"`. `"auto"` scales
 * with the length of `text` (the rendered message), clamped to MD3's 4–10s.
 */
export const toMilliseconds = (
  duration: SnackbarDuration,
  text: string,
): number | null => {
  if (duration === "indefinite") return null;
  if (duration === "short") return TIMING.short;
  if (duration === "long") return TIMING.long;
  if (duration === "auto") {
    const reading =
      TIMING.autoBase + text.trim().length * TIMING.autoPerCharacter;
    return Math.min(TIMING.max, Math.max(TIMING.min, reading));
  }
  return Number.isFinite(duration) && duration > 0 ? duration : null;
};

const MODIFIERS: Record<string, string> = {
  altKey: "Alt",
  ctrlKey: "Ctrl",
  metaKey: "Meta",
  shiftKey: "Shift",
};

/** `["altKey", "KeyG"]` → `"Alt+G"`, for the landmark's name. */
export const hotkeyLabel = (keys: readonly string[]) =>
  keys
    .map(
      (key) =>
        MODIFIERS[key] ??
        key.replace(/^Key(?=[A-Z]$)/, "").replace(/^Digit(?=\d$)/, ""),
    )
    .join("+");

/**
 * Whether a keydown is exactly the hotkey: every listed modifier held, no
 * other modifier, and the listed `code` pressed (`code`, so Alt+G still
 * matches on macOS where Option+G types "©").
 */
export const matchesHotkey = (
  event: KeyboardEvent,
  keys: readonly string[],
) => {
  const modifiers = Object.keys(MODIFIERS);
  for (const modifier of modifiers) {
    const wanted = keys.includes(modifier);
    if (event[modifier as keyof KeyboardEvent] !== wanted) return false;
  }
  const codes = keys.filter((key) => !modifiers.includes(key));
  return codes.length > 0 && codes.every((code) => event.code === code);
};
