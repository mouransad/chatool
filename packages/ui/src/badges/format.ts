/*
 * Pure content rules for the badge family (no React, no DOM): what the badge
 * shows, what it announces, and whether it's shown at all. Deterministic for a
 * given input — it never reads the runtime's default locale — so a badge
 * rendered on the server and hydrated on the client always agree.
 */

/** Spec message for a counterless (dot) badge (MD3 badges › Accessibility). */
export const NEW_NOTIFICATION = "New notification";

export interface BadgeContentOptions {
  /** The count or short text. `undefined` / `null` / `""` → a dot. */
  value?: number | string | null;
  /** Largest number shown before collapsing to `max+`. */
  max: number;
  /** Longest string shown before truncating with `…`. */
  maxLength: number;
  /** Keep a numeric `0` visible. */
  showZero: boolean;
  /** BCP 47 locale for the digits (e.g. `"fa"` → `۹۹۹+`). */
  locale?: string;
}

export interface BadgeContent {
  /** Whether a value was given at all (→ the large badge by default). */
  hasValue: boolean;
  /** `true` when the value hides the badge (a `0` without `showZero`). */
  empty: boolean;
  /** The visible glyphs (`"7"`, `"999+"`, `"New"`), or `undefined` for a dot. */
  text?: string;
  /** The full, untruncated text announced to assistive tech. */
  spoken: string;
}

/** Integer digits only, no grouping: `9999` stays four glyphs, not `9,999`. */
const formatNumber = (n: number, locale?: string) =>
  locale
    ? new Intl.NumberFormat(locale, {
        useGrouping: false,
        maximumFractionDigits: 0,
      }).format(n)
    : String(Math.trunc(n));

/** User-perceived characters, so an emoji or accented letter counts as one. */
const graphemes = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
      (s) => s.segment,
    );
  }
  return Array.from(text);
};

/**
 * Resolves a badge's visible + spoken content per MD3: at most four characters
 * including a `+` (`999+`), longer labels truncated, numbers announced in full.
 */
export const badgeContent = ({
  value,
  max,
  maxLength,
  showZero,
  locale,
}: BadgeContentOptions): BadgeContent => {
  if (value === undefined || value === null || value === "") {
    return { hasValue: false, empty: false, spoken: NEW_NOTIFICATION };
  }

  if (typeof value === "number") {
    // Like MDC-Android: negatives (and NaN) clamp to 0.
    const n = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
    const spoken = formatNumber(n, locale);
    if (n === 0 && !showZero) return { hasValue: true, empty: true, spoken };
    const text = n > max ? `${formatNumber(max, locale)}+` : spoken;
    return { hasValue: true, empty: false, text, spoken };
  }

  const chars = graphemes(value);
  const text =
    chars.length > maxLength
      ? `${chars.slice(0, Math.max(1, maxLength - 1)).join("")}…`
      : value;
  return { hasValue: true, empty: false, text, spoken: value };
};
