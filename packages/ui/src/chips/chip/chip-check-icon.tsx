/**
 * The filter chip's selected checkmark: Material Web's 18dp check path
 * (`viewBox 0 0 18 18`), inlined so `@chatool/ui` doesn't depend on
 * `@chatool/icons`. Decorative: the primary action's `aria-pressed` carries
 * the selected state.
 */
const ChipCheckIcon = () => (
  <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden focusable="false">
    <path d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
  </svg>
);

export default ChipCheckIcon;
