import type { Meta, StoryObj } from "@storybook/react-vite";

// Token pairs mirror the `--color-*` variables mapped in `@chatool/styles`
// (theme.css `@theme inline`). Use the toolbar theme switch to see dark values.
const PAIRS: { name: string; bg: string; fg: string }[] = [
  { name: "background", bg: "--color-background", fg: "--color-foreground" },
  { name: "card", bg: "--color-card", fg: "--color-card-foreground" },
  { name: "popover", bg: "--color-popover", fg: "--color-popover-foreground" },
  { name: "primary", bg: "--color-primary", fg: "--color-primary-foreground" },
  {
    name: "secondary",
    bg: "--color-secondary",
    fg: "--color-secondary-foreground",
  },
  { name: "muted", bg: "--color-muted", fg: "--color-muted-foreground" },
  { name: "accent", bg: "--color-accent", fg: "--color-accent-foreground" },
  {
    name: "destructive",
    bg: "--color-destructive",
    fg: "--color-destructive-foreground",
  },
];

const SINGLES = ["--color-border", "--color-input", "--color-ring"];

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
            <div className="px-3 py-2 font-mono text-xs bg-card text-muted-foreground">
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
            <code className="font-mono text-xs text-muted-foreground">{v}</code>
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
