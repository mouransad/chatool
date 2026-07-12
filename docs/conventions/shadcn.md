# shadcn & Tailwind CSS v4 theming

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **shadcn**

`@chatool/*` implements a **shadcn-compatible design system** mapping CSS variables to Tailwind CSS v4 utility tokens.

## Token tiers (the architecture)

The configuration maps standard semantic CSS variables under `:root` and `.dark` to Tailwind v4 theme variables:

| CSS Variable               | Tailwind Utility              | Purpose                       |
| -------------------------- | ----------------------------- | ----------------------------- |
| `--background`             | `bg-background`               | Default page background       |
| `--foreground`             | `text-foreground`             | Default page text color       |
| `--card`                   | `bg-card`                     | Card background               |
| `--card-foreground`        | `text-card-foreground`        | Card foreground               |
| `--popover`                | `bg-popover`                  | Popovers/Dropdowns background |
| `--popover-foreground`     | `text-popover-foreground`     | Popovers/Dropdowns foreground |
| `--primary`                | `bg-primary`, `text-primary`  | Primary action background     |
| `--primary-foreground`     | `text-primary-foreground`     | Primary action text           |
| `--secondary`              | `bg-secondary`                | Secondary action background   |
| `--secondary-foreground`   | `text-secondary-foreground`   | Secondary action text         |
| `--muted`                  | `bg-muted`                    | Muted background              |
| `--muted-foreground`       | `text-muted-foreground`       | Muted text                    |
| `--accent`                 | `bg-accent`                   | Hover/Selection highlighting  |
| `--accent-foreground`      | `text-accent-foreground`      | Highlighted text              |
| `--destructive`            | `bg-destructive`              | Danger/Destructive background |
| `--destructive-foreground` | `text-destructive-foreground` | Danger/Destructive text       |
| `--border`                 | `border-border`               | Default border colors         |
| `--input`                  | `border-input`                | Form controls border colors   |
| `--ring`                   | `ring-ring`                   | Focus ring outline colors     |
| `--radius`                 | `rounded-*`                   | Corner border radii           |

## Customization

1. **Global Re-theming**: Consumers customize the branding by defining overrides in their global CSS stylesheet under `:root` and `.dark` blocks:

   ```css
   @import "@chatool/core/styles.css";

   :root {
     --primary: oklch(0.5 0.15 250);
     --radius: 0.75rem;
   }
   ```

2. **Component Specific Customization**: Components accept standard `className` strings, merging styling options with Tailwind's utility variables via `cn` from `@chatool/utils`.
