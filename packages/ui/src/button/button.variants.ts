import { cva } from "class-variance-authority";

/*
 * Material Design 3 button. Five emphasis variants (filled → text), pill shape
 * (`rounded-full`), Label Large type, and state-layer hovers built from the MD3
 * state opacities via `color-mix`. Everything resolves to `@chatool/core`
 * `--md-sys-*` tokens, so apps re-theme it by overriding those tokens.
 *
 * Kept intentionally simple — the polished `before:` state-layer overlay,
 * pressed/focus layers, and M3 Expressive sizes/shape-morph come later.
 */
export const buttonVariants = cva(
  "gap-2 inline-flex items-center justify-center rounded-full text-label-large whitespace-nowrap transition-[background-color,box-shadow,border-color] select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-[0.38] [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-on-primary hover:bg-[color-mix(in_oklab,var(--md-sys-color-on-primary)_8%,var(--md-sys-color-primary))] hover:shadow-elevation-1",
        tonal:
          "bg-secondary-container text-on-secondary-container hover:bg-[color-mix(in_oklab,var(--md-sys-color-on-secondary-container)_8%,var(--md-sys-color-secondary-container))] hover:shadow-elevation-1",
        elevated:
          "bg-surface-container-low text-primary shadow-elevation-1 hover:bg-[color-mix(in_oklab,var(--md-sys-color-primary)_8%,var(--md-sys-color-surface-container-low))] hover:shadow-elevation-2",
        outlined:
          "border border-outline bg-transparent text-primary hover:bg-[color-mix(in_oklab,var(--md-sys-color-primary)_8%,transparent)]",
        text: "bg-transparent text-primary hover:bg-[color-mix(in_oklab,var(--md-sys-color-primary)_8%,transparent)]",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 px-4",
        lg: "h-12 px-8",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  },
);
