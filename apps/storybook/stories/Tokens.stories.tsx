import type { Meta, StoryObj } from "@storybook/react-vite";

// Material Design 3 system color roles, surfaced as the `--color-*` Tailwind
// utilities mapped from `--md-sys-color-*` in `@chatool/core` (theme.css
// `@theme inline`). Use the toolbar theme switch to see the dark scheme.
const PAIRS: { name: string; bg: string; fg: string }[] = [
  { name: "primary", bg: "--color-primary", fg: "--color-on-primary" },
  {
    name: "primary-container",
    bg: "--color-primary-container",
    fg: "--color-on-primary-container",
  },
  { name: "secondary", bg: "--color-secondary", fg: "--color-on-secondary" },
  {
    name: "secondary-container",
    bg: "--color-secondary-container",
    fg: "--color-on-secondary-container",
  },
  { name: "tertiary", bg: "--color-tertiary", fg: "--color-on-tertiary" },
  {
    name: "tertiary-container",
    bg: "--color-tertiary-container",
    fg: "--color-on-tertiary-container",
  },
  { name: "error", bg: "--color-error", fg: "--color-on-error" },
  {
    name: "error-container",
    bg: "--color-error-container",
    fg: "--color-on-error-container",
  },
  { name: "surface", bg: "--color-surface", fg: "--color-on-surface" },
  {
    name: "surface-container",
    bg: "--color-surface-container",
    fg: "--color-on-surface",
  },
  {
    name: "inverse-surface",
    bg: "--color-inverse-surface",
    fg: "--color-inverse-on-surface",
  },
];

const SINGLES = [
  "--color-outline",
  "--color-outline-variant",
  "--color-surface-variant",
  "--color-surface-container-low",
  "--color-surface-container-high",
];

function Swatches() {
  return (
    <div className="gap-6 flex flex-col">
      <div className="gap-3 sm:grid-cols-3 lg:grid-cols-4 grid grid-cols-2">
        {PAIRS.map((t) => (
          <div key={t.name} className="overflow-hidden rounded-lg border">
            <div
              className="h-20 text-sm font-medium flex items-center justify-center capitalize"
              style={{
                backgroundColor: `var(${t.bg})`,
                color: `var(${t.fg})`,
              }}
            >
              {t.name}
            </div>
            <div className="px-3 py-2 font-mono text-xs bg-surface-container text-on-surface-variant">
              {t.bg}
            </div>
          </div>
        ))}
      </div>
      <div className="gap-4 flex flex-wrap">
        {SINGLES.map((v) => (
          <div key={v} className="gap-2 flex items-center">
            <span
              className="size-8 rounded-md border"
              style={{ backgroundColor: `var(${v})` }}
            />
            <code className="font-mono text-xs text-on-surface-variant">
              {v}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Design/Tokens",
  component: Swatches,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Swatches>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {};
