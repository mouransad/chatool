---
"@chatool/ui": minor
---

Add `@chatool/ui/slider`: `Slider` and `RangeSlider`, the Material 3 **Expressive**
sliders.

- The Expressive anatomy from Compose's `SliderTokens` / `drawTrack` and
  MDC-Android's `Widget.Material3Expressive.Slider.*`: a 4dp bar handle with a 6dp
  gap to each track segment, 2dp inside corners, end stop indicators, and the five
  MD3 sizes (XS 16dp … XL 96dp tracks, 44–108dp handles, 8–28dp corners).
- Standard, **centered** and **range** variants; horizontal or **vertical**;
  `inverted`; RTL mirrors automatically.
- **Stops**: a dot at every step (handles snap and line up with them) or custom,
  non-uniform stop values; dots under the handle gap are hidden.
- **Inset icons** (M/L/XL) that hand off from the active to the inactive track
  when there's no room, and can be a function of the value (volume → mute).
- **Value indicator** (`false` / on interaction / `"always"`) with
  `Intl.NumberFormatOptions` or function formatting, also used for
  `aria-valuetext`.
- Expressive motion: value jumps glide on the default-spatial spring, the handle
  squeezes 4dp → 2dp and the value indicator pops on the fast-spatial spring;
  dragging follows the pointer 1:1; reduced motion respected.
- One native `<input type="range">` per handle: forms (`name`, `form`, reset),
  `<label htmlFor>`, the WAI-ARIA APG (multi-thumb) keyboard incl. MD3's Space +
  arrows, and mobile screen-reader adjusting. `onValueCommit`, `largeStep`,
  `minStepsBetweenThumbs`, `thumbLabels`, opt-in `haptics`, per-part `classNames`
  and a full `--md-comp-slider-*` token set.
