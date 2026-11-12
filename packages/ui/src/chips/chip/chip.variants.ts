import { cva } from "class-variance-authority";

import {
  CONTAINER,
  DISABLED,
  GEOMETRY,
  MOTION,
  SELECTED,
  SHAPE,
  SPACING,
  STATES,
  STYLE,
  VARIANT,
} from "../config";

/*
 * Material Design 3 chip container (see `../config.ts` for every value and its
 * source). `variant` picks the static color roles; `elevated` and
 * `expressive` are mirrored to `data-elevated` / `data-expressive` on the
 * container by the view, and the shared fragments key off those attributes
 * (attribute selectors out-specify the base locals, so the result never
 * depends on class order). They're cva axes too, so `VariantProps` types them
 * and `chipVariants({ … })` documents the full surface.
 */
export const chipVariants = cva(
  `${CONTAINER} ${MOTION} ${GEOMETRY} ${STYLE} ${SHAPE} ${SPACING} ${STATES} ${SELECTED} ${DISABLED}`,
  {
    variants: {
      variant: VARIANT,
      elevated: {
        true: "",
        false: "",
      },
      expressive: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "assist",
      elevated: false,
      expressive: true,
    },
  },
);

export {
  ACTION,
  AVATAR,
  CHECK_REVEAL,
  CHECK_SWAP,
  ICON,
  ICON_SWAP,
  LABEL,
  LEADING,
  REMOVE,
  REMOVE_ICON,
  REMOVE_ONLY,
  REMOVE_ONLY_ICON,
  REMOVE_RIPPLE,
  SPINNER,
  TRAILING,
} from "../config";
