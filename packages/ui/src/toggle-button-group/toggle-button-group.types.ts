import type * as React from "react";
import type { ToggleGroup } from "radix-ui";

import { type ButtonColor } from "../internal/colors";
import { type ButtonSize } from "../internal/sizes";

export type ToggleButtonGroupProps = React.ComponentProps<
  typeof ToggleGroup.Root
> & {
  /** Color applied to every item (single / multi select both supported). */
  color?: ButtonColor;
  /** Size applied to every item. */
  size?: ButtonSize;
};

export type ToggleButtonGroupItemProps = React.ComponentProps<
  typeof ToggleGroup.Item
>;
