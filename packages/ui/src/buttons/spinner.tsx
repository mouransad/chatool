import { cn } from "@chatool/utils";

/**
 * Dependency-free indeterminate spinner — the default loading indicator for the
 * button family (avoids pulling `@chatool/icons` in as a dependency). Sizes with
 * the current font (`1.25em`) and inherits the label color via `currentColor`.
 */
const Spinner = ({ className }: { className?: string }) => (
  <span
    role="progressbar"
    aria-label="Loading"
    className={cn(
      "animate-spin inline-block size-[1.25em] shrink-0 rounded-full border-2 border-current border-t-transparent",
      className,
    )}
  />
);

export default Spinner;
