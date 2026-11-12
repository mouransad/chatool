interface TabScrollIconProps {
  /** Which way the chevron points, in **logical** terms (mirrors in RTL). */
  edge: "start" | "end";
}

/** Material Symbols `chevron_left` / `chevron_right` (viewBox 0 -960 960 960). */
const PATH = {
  left: "M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z",
  right: "M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z",
} as const;

/**
 * The scroll buttons' chevron. Inline so `@chatool/ui` stays independent of
 * `@chatool/icons`; it points toward the start / end of the row and flips in
 * RTL.
 */
const TabScrollIcon = ({ edge }: TabScrollIconProps) => (
  <svg
    aria-hidden
    viewBox="0 -960 960 960"
    className="rtl:-scale-x-100"
    fill="currentColor"
  >
    <path d={edge === "start" ? PATH.left : PATH.right} />
  </svg>
);

export default TabScrollIcon;
