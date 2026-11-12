import { useRef, useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Tooltip, {
  TooltipAction,
  TooltipProvider,
  type TooltipAlign,
  type TooltipOpenChangeReason,
  type TooltipSide,
} from "@chatool/ui/tooltip";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import ButtonGroup from "@chatool/ui/button-group";
import StarOutlined from "@chatool/icons/StarOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";
import ShareOutlined from "@chatool/icons/ShareOutlined";
import DeleteOutlined from "@chatool/icons/DeleteOutlined";
import ContentCopyOutlined from "@chatool/icons/ContentCopyOutlined";
import UndoOutlined from "@chatool/icons/UndoOutlined";
import RedoOutlined from "@chatool/icons/RedoOutlined";
import InfoOutlined from "@chatool/icons/InfoOutlined";
import HelpOutlined from "@chatool/icons/HelpOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";
import BookmarkOutlined from "@chatool/icons/BookmarkOutlined";

const SIDES: TooltipSide[] = ["top", "bottom", "start", "end", "left", "right"];
const ALIGNS: TooltipAlign[] = ["start", "center", "end", "before", "after"];

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    content: "Add to favorites",
    children: (
      <IconButton aria-label="Add to favorites">
        <StarOutlined />
      </IconButton>
    ),
  },
  argTypes: {
    content: { control: "text" },
    title: { control: "text" },
    variant: { control: "inline-radio", options: ["plain", "rich"] },
    side: { control: "select", options: SIDES },
    align: { control: "select", options: ALIGNS },
    offset: { control: { type: "number", min: 0, max: 32 } },
    caret: { control: "boolean" },
    persistent: { control: "boolean" },
    disabled: { control: "boolean" },
    hoverable: { control: "boolean" },
    flip: { control: "boolean" },
    relationship: {
      control: "inline-radio",
      options: ["description", "label", "none"],
    },
    showDelay: { control: { type: "number", min: 0, step: 100 } },
    hideDelay: { control: { type: "number", min: 0, step: 100 } },
    children: { table: { disable: true } },
    actions: { table: { disable: true } },
    container: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="text-label-medium text-on-surface-variant">{children}</span>
);

/**
 * Hover the star, Tab to it, or long-press it on a touch screen. The tooltip
 * waits 500ms on hover, shows at once on keyboard focus, and lingers 1.5s after
 * the pointer leaves (MD3). Press Escape to dismiss it early.
 */
export const Playground: Story = {};

/**
 * **Plain** tooltips label elements that have no text of their own. Move
 * along the toolbar: once one tooltip is showing, the next appears at once and
 * replaces it, so only one is ever on screen (MD3).
 */
export const Plain: Story = {
  render: () => (
    <div className="gap-1 flex">
      {(
        [
          ["Undo", UndoOutlined],
          ["Redo", RedoOutlined],
          ["Copy", ContentCopyOutlined],
          ["Edit", EditOutlined],
          ["Share", ShareOutlined],
          ["Delete", DeleteOutlined],
        ] as const
      ).map(([label, Icon]) => (
        <Tooltip key={label} content={label} relationship="label">
          <IconButton>
            <Icon />
          </IconButton>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Plain text wraps at 200dp. One line is centred in the container; wrapped
 * text is start-aligned. Keep plain tooltips brief; use a rich tooltip for
 * anything longer.
 */
export const PlainMultiline: Story = {
  args: {
    content:
      "Grant value is calculated using the closing stock price from the day before the grant date.",
    children: (
      <IconButton aria-label="About grant value">
        <InfoOutlined />
      </IconButton>
    ),
  },
};

/**
 * **Rich** tooltips explain. They take an optional `title` (subhead) and up to
 * two `actions`. By default they sit at the anchor's bottom corner ("the
 * bottom right of the parent element"); `align="center"` centres them below.
 * A tooltip with actions is a non-modal dialog: Tab moves into it and on to
 * the rest of the page, and an action closes it.
 */
export const Rich: Story = {
  render: () => (
    <div className="gap-12 flex items-start">
      <Tooltip
        title="Paint tool"
        content="Add annotations and highlights with the paint tool."
      >
        <IconButton variant="tonal" aria-label="Paint tool">
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Paint tool"
        content="Add annotations and highlights with the paint tool."
        actions={<TooltipAction>Learn more</TooltipAction>}
      >
        <IconButton variant="tonal" aria-label="Paint tool, with details">
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip
        variant="rich"
        align="center"
        content={
          <>
            Shared with everyone in <a href="#team">Design team</a>.
          </>
        }
      >
        <Button variant="outlined" startIcon={<ShareOutlined />}>
          Shared
        </Button>
      </Tooltip>
    </div>
  ),
};

const RICH_TEXT =
  "Rich tooltips bring attention to a particular element of feature that warrants a person’s focus.";

/**
 * MD3's five rich configurations, pinned open (`open` + `persistent`) so the
 * measurements can be inspected: 16dp sides, 12dp top, 4dp between subhead and
 * text, 12dp above a 40dp action row, 8dp below it (12dp without actions).
 */
export const RichConfigurations: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="gap-x-10 grid min-h-[30rem] grid-cols-5 items-start">
      {(
        [
          ["Subhead, text, two actions", true, 2],
          ["Subhead, text, one action", true, 1],
          ["Subhead and text", true, 0],
          ["Text and one action", false, 1],
          ["Text and two actions", false, 2],
        ] as const
      ).map(([name, title, count]) => (
        <div key={name} className="gap-2 flex flex-col items-start">
          <Caption>{name}</Caption>
          <Tooltip
            open
            persistent
            variant="rich"
            align="start"
            flip={false}
            className="w-56"
            title={title ? "Rich tooltip" : undefined}
            content={RICH_TEXT}
            actions={
              count > 0 ? (
                <>
                  <TooltipAction>Action</TooltipAction>
                  {count > 1 && <TooltipAction>Action</TooltipAction>}
                </>
              ) : undefined
            }
          >
            <IconButton variant="tonal" aria-label={name}>
              <HelpOutlined />
            </IconButton>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

/**
 * A **persistent** rich tooltip opens when its anchor is clicked (hover and
 * focus don't trigger it) and stays until the user presses Escape, presses
 * elsewhere, moves focus to another element or picks an action. MD3: avoid
 * them on icon buttons.
 */
export const Persistent: Story = {
  render: () => (
    <Tooltip
      persistent
      title="Offline access"
      content="Keep this folder on your device so you can open it without a connection."
      actions={
        <>
          <TooltipAction>Turn on</TooltipAction>
          <TooltipAction>Not now</TooltipAction>
        </>
      }
    >
      <Button variant="tonal">What is offline access?</Button>
    </Tooltip>
  ),
};

/**
 * Feature discovery: a persistent tooltip that is already open when the page
 * loads (`defaultOpen`). Give these a subhead (MD3).
 */
export const OnPageLoad: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="min-h-56 flex items-start justify-center">
      <Tooltip
        persistent
        defaultOpen
        caret
        align="center"
        title="New: collections"
        content="Save anything you find here and get back to it from any device."
        actions={<TooltipAction>Got it</TooltipAction>}
      >
        <Button startIcon={<BookmarkOutlined />}>Collections</Button>
      </Tooltip>
    </div>
  ),
};

/**
 * `caret` adds Compose's 16×8dp caret. It points at the anchor's centre and
 * follows the tooltip when it flips or shifts.
 */
export const Caret: Story = {
  render: () => (
    <div className="gap-10 flex items-center">
      {(["top", "end", "bottom", "start"] as const).map((side) => (
        <Tooltip key={side} caret side={side} content={`Caret, ${side}`}>
          <IconButton variant="outlined" aria-label={`Caret, ${side}`}>
            <StarOutlined />
          </IconButton>
        </Tooltip>
      ))}
      <Tooltip
        caret
        align="center"
        title="Rich with a caret"
        content="The caret takes the container color and casts the same shadow."
      >
        <Button variant="outlined">Rich</Button>
      </Tooltip>
    </div>
  ),
};

/**
 * `side` × `align`. `start` / `end` follow the writing direction; `before` /
 * `after` put the tooltip beside the anchor so they only meet at a corner.
 * Every placement flips and shifts to stay on screen.
 */
export const Placement: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="gap-x-6 gap-y-3 grid grid-cols-[auto_repeat(5,minmax(0,1fr))] items-center justify-items-center">
      <span />
      {ALIGNS.map((align) => (
        <Caption key={align}>{align}</Caption>
      ))}
      {(["top", "bottom", "start", "end"] as const).map((side) => (
        <div key={side} className="contents">
          <Caption>{side}</Caption>
          {ALIGNS.map((align) => (
            <Tooltip
              key={align}
              side={side}
              align={align}
              showDelay={0}
              content={`${side} · ${align}`}
            >
              <Button variant="outlined" size="xs">
                Hover
              </Button>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * Scroll the box: the tooltip follows its anchor, flips when it runs out of
 * room, shifts to stay 8dp inside the viewport, and closes once the anchor is
 * scrolled out of sight.
 */
export const Collision: Story = {
  render: () => (
    <div className="h-48 w-80 overflow-auto rounded-lg border border-outline-variant">
      <div className="p-4 flex h-[32rem] w-[40rem] items-center justify-center">
        <Tooltip
          defaultOpen
          persistent
          variant="plain"
          align="center"
          caret
          side="top"
          content="I stay next to my anchor"
        >
          <Button variant="tonal">Scroll me around</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

/**
 * What the tooltip is to its anchor. `relationship="label"` makes the text the
 * anchor's accessible **name** (no separate `aria-label` needed);
 * `description` (the default) adds it as a description, and is skipped when it
 * would only repeat the anchor's `aria-label`.
 */
export const Relationship: Story = {
  render: () => (
    <div className="gap-6 flex items-center">
      <Tooltip relationship="label" content="Settings">
        <IconButton>
          <SettingsOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip content="Permanently removes the file for everyone">
        <Button variant="outlined" startIcon={<DeleteOutlined />}>
          Delete
        </Button>
      </Tooltip>
      <Tooltip content="Share">
        <IconButton aria-label="Share">
          <ShareOutlined />
        </IconButton>
      </Tooltip>
    </div>
  ),
};

const ControlledDemo = () => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<TooltipOpenChangeReason | "none">(
    "none",
  );

  return (
    <div className="gap-4 flex flex-col items-center">
      <Tooltip
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next);
          setReason(details.reason);
        }}
        content="Controlled tooltip"
      >
        <Button variant="outlined">Hover, focus or long-press me</Button>
      </Tooltip>
      <div className="gap-2 flex items-center">
        <Button variant="text" size="xs" onClick={() => setOpen(true)}>
          Show
        </Button>
        <Button variant="text" size="xs" onClick={() => setOpen(false)}>
          Hide
        </Button>
        <Caption>
          open = {String(open)} · last reason = {reason}
        </Caption>
      </div>
    </div>
  );
};

/**
 * Controlled: `open` + `onOpenChange(open, { reason, event })`. The reason
 * says why (`hover`, `focus`, `long-press`, `escape`, `outside-press`, …), so
 * you can veto some changes and accept others.
 */
export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

/**
 * `TooltipProvider` sets timing for every tooltip below it. Here: no show
 * delay and no linger, the snappy desktop feel some products prefer over
 * MD3's defaults (500ms / 1.5s).
 */
export const Provider: Story = {
  render: () => (
    <div className="gap-10 flex items-start">
      <div className="gap-2 flex flex-col items-center">
        <Caption>MD3 defaults</Caption>
        <ButtonGroup>
          <Tooltip content="Undo" relationship="label">
            <IconButton variant="tonal">
              <UndoOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip content="Redo" relationship="label">
            <IconButton variant="tonal">
              <RedoOutlined />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </div>
      <TooltipProvider showDelay={0} hideDelay={0}>
        <div className="gap-2 flex flex-col items-center">
          <Caption>showDelay 0 · hideDelay 0</Caption>
          <ButtonGroup>
            <Tooltip content="Undo" relationship="label">
              <IconButton variant="tonal">
                <UndoOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip content="Redo" relationship="label">
              <IconButton variant="tonal">
                <RedoOutlined />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </div>
      </TooltipProvider>
    </div>
  ),
};

/**
 * Right-to-left: `start` / `end` sides and alignments mirror, and the tooltip
 * takes its anchor's direction.
 */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="gap-8 flex items-center">
      <Tooltip side="start" content="افزودن به علاقه‌مندی‌ها">
        <IconButton aria-label="افزودن به علاقه‌مندی‌ها">
          <StarOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="ابزار نقاشی"
        content="با ابزار نقاشی یادداشت و هایلایت اضافه کنید."
        actions={<TooltipAction>بیشتر بدانید</TooltipAction>}
      >
        <Button variant="tonal">ابزار نقاشی</Button>
      </Tooltip>
    </div>
  ),
};

const DialogDemo = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()}>
        Open a modal dialog
      </Button>
      <dialog
        ref={dialogRef}
        className="p-6 m-auto rounded-xl bg-surface-container-high text-on-surface backdrop:bg-scrim/40"
      >
        <p className="mb-4 text-body-medium">
          Tooltips render in the top layer, inside the dialog.
        </p>
        <div className="gap-2 flex items-center justify-end">
          <Tooltip content="Copy link" relationship="label">
            <IconButton>
              <ContentCopyOutlined />
            </IconButton>
          </Tooltip>
          <Button variant="text" onClick={() => dialogRef.current?.close()}>
            Close
          </Button>
        </div>
      </dialog>
    </>
  );
};

/**
 * Inside a native modal `<dialog>` the tooltip still shows above everything,
 * with no `z-index`: it uses the browser's top layer, and renders inside the
 * dialog so it isn't inert. Escape closes the tooltip first, then the dialog.
 */
export const InsideDialog: Story = {
  render: () => <DialogDemo />,
};

/**
 * Re-theme with component tokens: `--md-comp-plain-tooltip-*` and
 * `--md-comp-rich-tooltip-*` (set them on `:root` or any ancestor of the
 * tooltip's container), or `className` on the surface.
 */
export const Customization: Story = {
  render: () => (
    <div className="gap-8 flex items-center">
      <Tooltip
        caret
        content="Tertiary container"
        style={
          {
            "--md-comp-plain-tooltip-container-color":
              "var(--md-sys-color-tertiary-container)",
            "--md-comp-plain-tooltip-supporting-text-color":
              "var(--md-sys-color-on-tertiary-container)",
            "--md-comp-plain-tooltip-container-shape": "999px",
          } as React.CSSProperties
        }
      >
        <Button variant="outlined">Tokens</Button>
      </Tooltip>
      <Tooltip content="Larger label" className="px-3 py-2 text-label-large">
        <Button variant="outlined">className</Button>
      </Tooltip>
    </div>
  ),
};

/**
 * `disabled` turns a tooltip off without unwrapping its anchor, e.g. to show
 * one only when text is truncated. An empty `content` does the same.
 */
export const Disabled: Story = {
  args: { disabled: true },
};
