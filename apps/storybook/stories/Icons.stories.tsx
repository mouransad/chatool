import type { ComponentType, SVGProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckIcon from "@chatool/icons/CheckIcon";
import ChevronDownIcon from "@chatool/icons/ChevronDownIcon";
import ChevronRightIcon from "@chatool/icons/ChevronRightIcon";
import SpinnerIcon from "@chatool/icons/SpinnerIcon";
import ChatoolLogoIcon from "@chatool/icons/ChatoolLogoIcon";

// `@chatool/icons` ships no published barrel — each icon is a `./<Name>`
// subpath — so the gallery enumerates them explicitly.
const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  ChatoolLogoIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SpinnerIcon,
};

function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-4 text-foreground sm:grid-cols-3 md:grid-cols-4">
      {Object.entries(icons).map(([name, Icon]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground"
        >
          <Icon className="size-8" />
          <code className="text-xs text-muted-foreground">{name}</code>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Icons/Gallery",
  component: Gallery,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {};

/** Icons scale with `size-*` (they render at `1em`, so font-size drives them). */
export const Sizing: Story = {
  render: () => (
    <div className="flex items-end gap-4 text-foreground">
      <CheckIcon className="size-4" />
      <CheckIcon className="size-6" />
      <CheckIcon className="size-8" />
      <CheckIcon className="size-12" />
    </div>
  ),
};

/** Color comes from `currentColor` — set it with any text-color utility. */
export const Color: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CheckIcon className="size-8 text-primary" />
      <CheckIcon className="size-8 text-destructive" />
      <CheckIcon className="size-8 text-muted-foreground" />
    </div>
  ),
};
