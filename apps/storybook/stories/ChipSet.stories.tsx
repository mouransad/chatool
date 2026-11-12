import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ChipSet from "@chatool/ui/chip-set";
import Chip from "@chatool/ui/chip";
import Button from "@chatool/ui/button";
import TextField from "@chatool/ui/text-field";
import CalendarTodayOutlined from "@chatool/icons/CalendarTodayOutlined";
import LocationOnOutlined from "@chatool/icons/LocationOnOutlined";
import ShareOutlined from "@chatool/icons/ShareOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";

const meta = {
  title: "UI/ChipSet",
  component: ChipSet,
  tags: ["autodocs"],
  args: { "aria-label": "Actions" },
  argTypes: {
    layout: { control: "inline-radio", options: ["wrap", "scroll"] },
    loop: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ChipSet>;

export default meta;
type Story = StoryObj<typeof meta>;

const Caption = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-label-medium text-on-surface-variant">{children}</p>
);

const CUISINES = ["Ramen", "Pizza", "Tacos", "Curry", "Dumplings", "Sushi"];

/**
 * A set is **one Tab stop** (APG toolbar). Tab in, then ←/→ (mirrored in RTL)
 * walk the chips with wrap-around, Home / End jump to the ends, and Space /
 * Enter activate.
 */
export const Playground: Story = {
  render: (args) => (
    <ChipSet {...args}>
      <Chip icon={<CalendarTodayOutlined />}>Add to calendar</Chip>
      <Chip icon={<LocationOnOutlined />}>Directions</Chip>
      <Chip icon={<ShareOutlined />}>Share</Chip>
      <Chip disabled>Disabled (skipped)</Chip>
      <Chip softDisabled>Soft-disabled (reachable)</Chip>
    </ChipSet>
  ),
};

/**
 * `selectionMode="single"`: selecting a chip deselects the others — an
 * alternative to segmented buttons or radios. `required` keeps one selected.
 */
export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("Pizza");
    return (
      <div>
        <Caption>Cuisine · {value ?? "none"}</Caption>
        <ChipSet
          aria-label="Cuisine"
          selectionMode="single"
          required
          value={value}
          onValueChange={setValue}
        >
          {CUISINES.map((name) => (
            <Chip key={name} variant="filter" value={name}>
              {name}
            </Chip>
          ))}
        </ChipSet>
      </div>
    );
  },
};

/** `selectionMode="multiple"`, uncontrolled, with a "Clear" reset. */
export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["Ramen", "Curry"]);
    return (
      <div className="gap-3 flex flex-col items-start">
        <Caption>Filter results · {value.join(", ") || "none"}</Caption>
        <ChipSet
          aria-label="Filter results"
          selectionMode="multiple"
          value={value}
          onValueChange={setValue}
        >
          {CUISINES.map((name) => (
            <Chip key={name} variant="filter" value={name}>
              {name}
            </Chip>
          ))}
        </ChipSet>
        <Button variant="text" size="xs" onClick={() => setValue([])}>
          Clear
        </Button>
      </div>
    );
  },
};

const EmailField = () => {
  const [emails, setEmails] = useState(["ada@example.com", "alan@example.com"]);
  const [draft, setDraft] = useState("");
  const add = () => {
    const email = draft.trim();
    if (email && !emails.includes(email)) setEmails([...emails, email]);
    setDraft("");
  };
  return (
    <div className="gap-3 max-w-xl flex flex-col">
      <ChipSet
        aria-label="Recipients"
        onRemove={(email) =>
          setEmails((current) => current.filter((item) => item !== email))
        }
      >
        {emails.map((email) => (
          <Chip
            key={email}
            variant="input"
            value={email}
            icon={<MailOutlined />}
          >
            {email}
          </Chip>
        ))}
      </ChipSet>
      <TextField
        variant="outlined"
        label="Add recipient"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            add();
          }
        }}
        supportingText="Press Enter to turn the text into a chip"
      />
    </div>
  );
};

/**
 * Input chips with a set-level `onRemove(value)`: every input chip gets a
 * remove action. Backspace / Delete removes the focused chip and focus moves
 * to its neighbour, so you can clear the list from the keyboard.
 */
export const InputChips: Story = { render: () => <EmailField /> };

/**
 * `layout="scroll"`: one row that scrolls sideways (MD3 overflow). Arrow keys
 * bring the focused chip into view; focus rings and touch targets aren't
 * clipped.
 */
export const ScrollLayout: Story = {
  render: () => (
    <div className="max-w-sm">
      <ChipSet aria-label="Categories" layout="scroll" selectionMode="multiple">
        {[
          "Electronics",
          "Books",
          "Home & kitchen",
          "Garden",
          "Toys",
          "Fashion",
          "Sports",
          "Beauty",
        ].map((name) => (
          <Chip key={name} variant="filter" value={name}>
            {name}
          </Chip>
        ))}
      </ChipSet>
    </div>
  ),
};

/**
 * `name` submits the selection with a form (one hidden input per selected
 * chip). Submit to see the `FormData`.
 */
export const FormSubmission: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState<string>("");
    return (
      <form
        className="gap-3 flex flex-col items-start"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(JSON.stringify(data.getAll("size")));
        }}
      >
        <ChipSet
          aria-label="Size"
          name="size"
          selectionMode="multiple"
          defaultValue={["M"]}
        >
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <Chip key={size} variant="filter" value={size}>
              {size}
            </Chip>
          ))}
        </ChipSet>
        <Button type="submit" size="xs">
          Submit
        </Button>
        <Caption>{submitted ? `size = ${submitted}` : "Not submitted"}</Caption>
      </form>
    );
  },
};

/** `disabled` disables every chip in the set. */
export const Disabled: Story = {
  render: () => (
    <ChipSet
      aria-label="Filters"
      selectionMode="multiple"
      disabled
      defaultValue={["B"]}
    >
      <Chip variant="filter" value="A">
        Alpha
      </Chip>
      <Chip variant="filter" value="B">
        Beta
      </Chip>
      <Chip variant="filter" value="C">
        Gamma
      </Chip>
    </ChipSet>
  ),
};
