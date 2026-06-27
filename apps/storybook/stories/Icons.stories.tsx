import type { ComponentType, SVGProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import CheckRounded from "@chatool/icons/CheckRounded";
import CheckSharp from "@chatool/icons/CheckSharp";
import CheckFilled from "@chatool/icons/CheckFilled";
import HomeOutlined from "@chatool/icons/HomeOutlined";
import SearchOutlined from "@chatool/icons/SearchOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import StarOutlined from "@chatool/icons/StarOutlined";
import DeleteOutlined from "@chatool/icons/DeleteOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import NotificationsOutlined from "@chatool/icons/NotificationsOutlined";
import PersonOutlined from "@chatool/icons/PersonOutlined";
import ChevronRightOutlined from "@chatool/icons/ChevronRightOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import MenuOutlined from "@chatool/icons/MenuOutlined";
import CloseOutlined from "@chatool/icons/CloseOutlined";
import ProgressActivityOutlined from "@chatool/icons/ProgressActivityOutlined";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// `@chatool/icons` ships no published barrel — each icon is a `./<Name>` subpath
// (Material Symbols, weight 400). Every base icon comes in 4 styles: Outlined,
// Rounded, Sharp, Filled. The gallery enumerates a representative sample.
const gallery: Record<string, Icon> = {
  HomeOutlined,
  SearchOutlined,
  SettingsOutlined,
  PersonOutlined,
  ChatOutlined,
  NotificationsOutlined,
  FavoriteOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  MenuOutlined,
  ChevronRightOutlined,
  KeyboardArrowDownOutlined,
  ProgressActivityOutlined,
};

const styles: Record<string, Icon> = {
  CheckOutlined,
  CheckRounded,
  CheckSharp,
  CheckFilled,
};

function Gallery() {
  return (
    <div className="gap-4 sm:grid-cols-3 md:grid-cols-4 grid grid-cols-2 text-foreground">
      {Object.entries(gallery).map(([name, Icon]) => (
        <div
          key={name}
          className="gap-3 p-4 flex flex-col items-center rounded-lg border bg-card text-card-foreground"
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

/**
 * Every icon ships in four styles — import the matching subpath, e.g.
 * `@chatool/icons/CheckRounded`.
 */
export const Styles: Story = {
  render: () => (
    <div className="gap-6 flex items-end text-foreground">
      {Object.entries(styles).map(([name, Icon]) => (
        <div key={name} className="gap-2 flex flex-col items-center">
          <Icon className="size-8" />
          <code className="text-xs text-muted-foreground">{name}</code>
        </div>
      ))}
    </div>
  ),
};

/** Icons scale with `size-*` (they render at `1em`, so font-size drives them). */
export const Sizing: Story = {
  render: () => (
    <div className="gap-4 flex items-end text-foreground">
      <CheckOutlined className="size-4" />
      <CheckOutlined className="size-6" />
      <CheckOutlined className="size-8" />
      <CheckOutlined className="size-12" />
    </div>
  ),
};

/** Color comes from `currentColor` — set it with any text-color utility. */
export const Color: Story = {
  render: () => (
    <div className="gap-4 flex items-center">
      <CheckOutlined className="size-8 text-primary" />
      <CheckOutlined className="size-8 text-destructive" />
      <CheckOutlined className="size-8 text-muted-foreground" />
    </div>
  ),
};
