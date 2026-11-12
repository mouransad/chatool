import { cn } from "@chatool/utils";

import { type CardHeaderProps } from "./card.types";
import {
  CARD_HEADER,
  CARD_HEADER_LEADING,
  CARD_HEADER_TEXT,
  CARD_HEADER_TRAILING,
} from "./card.variants";

/**
 * MD3 card header row: an optional `leading` avatar / thumbnail, the text
 * column (`children` — typically `CardHeadline` + `CardSubhead`), and an
 * optional `trailing` element such as an overflow-menu `IconButton` (MD3 puts
 * overflow menus in the upper or lower end corner).
 */
const CardHeader = ({
  className,
  leading,
  trailing,
  children,
  ...props
}: CardHeaderProps) => (
  <div
    data-slot="card-header"
    className={cn(CARD_HEADER, className)}
    {...props}
  >
    {leading != null && leading !== false && (
      <div data-slot="card-header-leading" className={CARD_HEADER_LEADING}>
        {leading}
      </div>
    )}
    <div data-slot="card-header-text" className={CARD_HEADER_TEXT}>
      {children}
    </div>
    {trailing != null && trailing !== false && (
      <div data-slot="card-header-trailing" className={CARD_HEADER_TRAILING}>
        {trailing}
      </div>
    )}
  </div>
);

export default CardHeader;
