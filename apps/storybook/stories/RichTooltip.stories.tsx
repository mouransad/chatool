import { useRef, useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import RichTooltip, {
  RichTooltipAction,
  RichTooltipActions,
  RichTooltipContent,
  RichTooltipSubhead,
  RichTooltipSupportingText,
  RichTooltipTrigger,
  useRichTooltip,
  useRichTooltipState,
  type RichTooltipAlign,
  type RichTooltipOpenChangeReason,
  type RichTooltipSide,
  type RichTooltipVirtualAnchor,
} from "@chatool/ui/rich-tooltip";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import BookmarkOutlined from "@chatool/icons/BookmarkOutlined";
import CloseOutlined from "@chatool/icons/CloseOutlined";
import DownloadOutlined from "@chatool/icons/DownloadOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";
import FilterListOutlined from "@chatool/icons/FilterListOutlined";
import HelpOutlined from "@chatool/icons/HelpOutlined";
import InfoOutlined from "@chatool/icons/InfoOutlined";
import LockOutlined from "@chatool/icons/LockOutlined";
import NotificationsOutlined from "@chatool/icons/NotificationsOutlined";
import SearchOutlined from "@chatool/icons/SearchOutlined";
import ShareOutlined from "@chatool/icons/ShareOutlined";

const SIDES: RichTooltipSide[] = [
  "top",
  "bottom",
  "start",
  "end",
  "left",
  "right",
];
const ALIGNS: RichTooltipAlign[] = [
  "start",
  "center",
  "end",
  "before",
  "after",
];

const TEXT =
  "Rich tooltips bring attention to a particular element or feature that warrants a person’s focus.";

const meta = {
  title: "UI/RichTooltip",
  component: RichTooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    subhead: "Paint tool",
    supportingText: "Add annotations and highlights with the paint tool.",
    trigger: "hover",
    caret: false,
    children: (
      <Button variant="tonal" startIcon={<EditOutlined />}>
        Paint
      </Button>
    ),
  },
  argTypes: {
    subhead: { control: "text" },
    supportingText: { control: "text" },
    trigger: {
      control: "inline-radio",
      options: ["hover", "click", "manual"],
    },
    side: { control: "select", options: SIDES },
    align: { control: "select", options: ALIGNS },
    offset: { control: { type: "number", min: 0, max: 32 } },
    positionStep: { control: { type: "number", min: 0, max: 16 } },
    caret: { control: "boolean" },
    flip: { control: "boolean" },
    hoverable: { control: "boolean" },
    disabled: { control: "boolean" },
    interactive: { control: "boolean" },
    announce: {
      control: "inline-radio",
      options: [true, false, "polite", "assertive"],
    },
    showDelay: { control: { type: "number", min: 0, step: 100 } },
    hideDelay: { control: { type: "number", min: 0, step: 100 } },
    children: { table: { disable: true } },
    actions: { table: { disable: true } },
    anchor: { table: { disable: true } },
    state: { table: { disable: true } },
    container: { table: { disable: true } },
    contentProps: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
  },
} satisfies Meta<typeof RichTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="text-label-medium text-on-surface-variant">{children}</span>
);

/**
 * The shorthand form: `subhead` + `supportingText` (+ `actions`) around the
 * anchor. Hover (500ms), Tab to it, or long-press on touch. It shows at the
 * anchor's bottom-right (MD3), lingers 1.5s after the pointer leaves, and
 * Escape dismisses it.
 */
export const Playground: Story = {};

/**
 * MD3's headline use: a rich tooltip with **button actions**. Its trigger
 * announces a popup (`aria-haspopup="dialog"`, `aria-expanded`); Tab from the
 * trigger moves into the tooltip, Tab past the last action continues with the
 * page (never trapped), and an action closes it, returning focus to the
 * trigger.
 */
export const WithActions: Story = {
  render: () => (
    <RichTooltip
      subhead="Paint tool"
      supportingText="Add annotations and highlights with the paint tool. Choose a brush, a color and an opacity."
      actions={
        <>
          <RichTooltipAction>Learn more</RichTooltipAction>
          <RichTooltipAction>Try it</RichTooltipAction>
        </>
      }
    >
      <Button variant="tonal" startIcon={<EditOutlined />}>
        Paint
      </Button>
    </RichTooltip>
  ),
};

/**
 * The composed form: every part is its own component, so each takes its
 * own props, `className` and `asChild` (here the subhead renders as an
 * `<h2>` and the text as a `<p>`).
 */
export const Composed: Story = {
  render: () => (
    <RichTooltip trigger="click">
      <RichTooltipTrigger>
        <Button startIcon={<ShareOutlined />}>Share</Button>
      </RichTooltipTrigger>
      <RichTooltipContent>
        <RichTooltipSubhead asChild>
          <h2>Share links</h2>
        </RichTooltipSubhead>
        <RichTooltipSupportingText asChild>
          <p>
            Anyone with the link can view this file.{" "}
            <a href="#sharing">Sharing settings</a>
          </p>
        </RichTooltipSupportingText>
        <RichTooltipActions>
          <RichTooltipAction>Copy link</RichTooltipAction>
          <RichTooltipAction closeOnClick={false}>Settings</RichTooltipAction>
        </RichTooltipActions>
      </RichTooltipContent>
    </RichTooltip>
  ),
};

/**
 * MD3's five rich-tooltip configurations, pinned open (`trigger="manual"` +
 * `open`) so the measurements can be inspected: 16dp sides, 12dp top, 4dp
 * subhead → text, 12dp above a 40dp action row, 8dp below it (12dp without
 * actions), action labels aligned with the text.
 */
export const Configurations: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="gap-x-10 grid min-h-[30rem] grid-cols-5 items-start">
      {(
        [
          ["Subhead, text, two buttons", true, 2],
          ["Subhead, text, one button", true, 1],
          ["Subhead and text", true, 0],
          ["Text and one button", false, 1],
          ["Text and two buttons", false, 2],
        ] as const
      ).map(([name, withSubhead, count]) => (
        <div key={name} className="gap-2 flex flex-col items-start">
          <Caption>{name}</Caption>
          <RichTooltip
            open
            trigger="manual"
            announce={false}
            align="start"
            flip={false}
            subhead={withSubhead ? "Rich tooltip" : undefined}
            supportingText={TEXT}
            contentProps={{ className: "w-56" }}
            actions={
              count > 0 ? (
                <>
                  <RichTooltipAction>Action</RichTooltipAction>
                  {count > 1 && <RichTooltipAction>Action</RichTooltipAction>}
                </>
              ) : undefined
            }
          >
            <IconButton variant="tonal" aria-label={name}>
              <HelpOutlined />
            </IconButton>
          </RichTooltip>
        </div>
      ))}
    </div>
  ),
};

/**
 * `trigger` picks what opens it: `hover` (transient, MD3's default), `click`
 * (persistent: stays until Escape, a press elsewhere, focus moving away or
 * an action) or `manual` (only code opens it). MD3: avoid persistent rich
 * tooltips on icon buttons.
 */
export const Triggers: Story = {
  render: () => {
    const ManualDemo = () => {
      const tip = useRichTooltipState();
      return (
        <div className="gap-2 flex items-center">
          <RichTooltip
            state={tip}
            trigger="manual"
            subhead="Opened from code"
            supportingText="Only `show()` / `toggle()` open me; Escape or a press elsewhere closes me."
            actions={<RichTooltipAction>OK</RichTooltipAction>}
          >
            <Button variant="outlined">Manual anchor</Button>
          </RichTooltip>
          <Button variant="text" onClick={tip.toggle}>
            {tip.open ? "Dismiss" : "Show"}
          </Button>
        </div>
      );
    };
    return (
      <div className="gap-8 flex items-center">
        <RichTooltip
          subhead="Hover"
          supportingText="Shows on hover, focus and long-press; leaves 1.5s after the pointer."
        >
          <Button variant="tonal">hover</Button>
        </RichTooltip>
        <RichTooltip
          trigger="click"
          subhead="Offline access"
          supportingText="Keep this folder on your device so you can open it without a connection."
          actions={
            <>
              <RichTooltipAction>Turn on</RichTooltipAction>
              <RichTooltipAction>Not now</RichTooltipAction>
            </>
          }
        >
          <Button variant="tonal" startIcon={<DownloadOutlined />}>
            click
          </Button>
        </RichTooltip>
        <ManualDemo />
      </div>
    );
  },
};

/**
 * Feature discovery: a persistent rich tooltip already open on page load
 * (`defaultOpen`), with a caret. MD3: give these a subhead. It's announced
 * politely through a live region, since nothing the person did put it there.
 */
export const OnPageLoad: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="min-h-64 flex items-start justify-center">
      <RichTooltip
        trigger="click"
        defaultOpen
        caret
        align="center"
        subhead="New: collections"
        supportingText="Save anything you find here and get back to it from any device."
        actions={<RichTooltipAction>Got it</RichTooltipAction>}
      >
        <Button startIcon={<BookmarkOutlined />}>Collections</Button>
      </RichTooltip>
    </div>
  ),
};

const TOUR = [
  {
    label: "Search",
    icon: SearchOutlined,
    subhead: "Find anything",
    text: "Search across messages, files and people.",
  },
  {
    label: "Filters",
    icon: FilterListOutlined,
    subhead: "Narrow it down",
    text: "Filter by date, sender or attachment type.",
  },
  {
    label: "Alerts",
    icon: NotificationsOutlined,
    subhead: "Stay in the loop",
    text: "Get notified when a saved search has new results.",
  },
] as const;

/**
 * A guided tour driven by state: one step open at a time (`open` +
 * `onOpenChange`), each with "Back" / "Next" actions that keep the tour
 * going (`closeOnClick={false}`).
 */
export const GuidedTour: Story = {
  parameters: { layout: "padded" },
  render: () => {
    const Tour = () => {
      const [step, setStep] = useState<number | null>(null);
      return (
        <div className="min-h-72 gap-6 flex flex-col items-center">
          <Button onClick={() => setStep(0)}>Start tour</Button>
          <div className="gap-6 flex">
            {TOUR.map((item, index) => (
              <RichTooltip
                key={item.label}
                trigger="manual"
                caret
                align="center"
                open={step === index}
                onOpenChange={(next) => {
                  if (!next) setStep(null);
                }}
                subhead={`${item.subhead} (${index + 1}/${TOUR.length})`}
                supportingText={item.text}
                actions={
                  <>
                    {index > 0 && (
                      <RichTooltipAction
                        closeOnClick={false}
                        onClick={() => setStep(index - 1)}
                      >
                        Back
                      </RichTooltipAction>
                    )}
                    {index < TOUR.length - 1 ? (
                      <RichTooltipAction
                        closeOnClick={false}
                        onClick={() => setStep(index + 1)}
                      >
                        Next
                      </RichTooltipAction>
                    ) : (
                      <RichTooltipAction>Done</RichTooltipAction>
                    )}
                  </>
                }
              >
                <IconButton variant="outlined" aria-label={item.label}>
                  <item.icon />
                </IconButton>
              </RichTooltip>
            ))}
          </div>
        </div>
      );
    };
    return <Tour />;
  },
};

/**
 * Async actions: return a promise from `onClick` and the button shows its
 * spinner while the tooltip holds open; it closes when the promise resolves
 * and stays (so the person can retry) when it rejects.
 */
export const AsyncActions: Story = {
  render: () => {
    const wait = (ms: number) =>
      new Promise((resolve) => window.setTimeout(resolve, ms));
    return (
      <div className="gap-8 flex items-center">
        <RichTooltip
          trigger="click"
          subhead="Turn on two-step verification"
          supportingText="Add a second step to sign in, like a code from your phone."
          actions={
            <>
              <RichTooltipAction onClick={() => wait(1500)}>
                Turn on
              </RichTooltipAction>
              <RichTooltipAction>Later</RichTooltipAction>
            </>
          }
        >
          <Button variant="tonal" startIcon={<LockOutlined />}>
            Resolves
          </Button>
        </RichTooltip>
        <RichTooltip
          trigger="click"
          subhead="Sync failed"
          supportingText="The retry below always fails, so the tooltip stays."
          actions={
            <RichTooltipAction
              onClick={() =>
                wait(1200).then(() => Promise.reject(new Error("offline")))
              }
            >
              Retry
            </RichTooltipAction>
          }
        >
          <Button variant="tonal">Rejects</Button>
        </RichTooltip>
      </div>
    );
  },
};

/**
 * Inline links in the supporting text take `primary`, are underlined, and
 * make the tooltip interactive on their own: Tab reaches them in MD3's order
 * (trigger → inline link → text button).
 */
export const InlineLinks: Story = {
  render: () => (
    <RichTooltip
      align="center"
      supportingText={
        <>
          Shared with everyone in <a href="#team">Design team</a>. Read the{" "}
          <a href="#policy">sharing policy</a>.
        </>
      }
      actions={<RichTooltipAction>Manage access</RichTooltipAction>}
    >
      <Button variant="outlined" startIcon={<ShareOutlined />}>
        Shared
      </Button>
    </RichTooltip>
  ),
};

/** `caret` draws Compose's 16×8dp caret, or one of your own size. */
export const Caret: Story = {
  render: () => (
    <div className="gap-10 flex items-center">
      {(["top", "end", "bottom", "start"] as const).map((side) => (
        <RichTooltip
          key={side}
          caret
          side={side}
          align="center"
          subhead={`Caret, ${side}`}
          supportingText="The caret takes the container color and its shadow."
        >
          <Button variant="outlined">{side}</Button>
        </RichTooltip>
      ))}
      <RichTooltip
        caret={{ width: 24, height: 12 }}
        align="center"
        supportingText="A 24×12px caret."
      >
        <Button variant="outlined">Custom size</Button>
      </RichTooltip>
    </div>
  ),
};

/**
 * `side` × `align`. `after` (default) is MD3's bottom-right; `center` is the
 * desktop alternative. `start` / `end` follow the writing direction.
 */
export const Placement: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="gap-x-6 gap-y-24 p-24 grid grid-cols-5">
      {(["bottom", "top"] as const).flatMap((side) =>
        ALIGNS.map((align) => (
          <RichTooltip
            key={`${side}-${align}`}
            side={side}
            align={align}
            supportingText={`${side} / ${align}`}
          >
            <Button variant="outlined">
              {side} / {align}
            </Button>
          </RichTooltip>
        )),
      )}
    </div>
  ),
};

/**
 * MD3: "The position of the tooltip adjusts in increments of 8dp to avoid
 * going off-screen." Near an edge the tooltip shifts on the 8dp grid
 * (`positionStep`, default `8`); `0` shifts by the exact overflow.
 */
export const DynamicPositioning: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-80 p-2 flex items-start justify-between">
      <RichTooltip
        align="center"
        subhead="8dp steps"
        supportingText="I shift back on screen in multiples of 8dp."
      >
        <Button variant="outlined">Left edge</Button>
      </RichTooltip>
      <RichTooltip
        positionStep={0}
        align="center"
        subhead="Exact shift"
        supportingText="I shift by exactly the overflow."
      >
        <Button variant="outlined">Right edge, step 0</Button>
      </RichTooltip>
    </div>
  ),
};

/**
 * `anchor` points the tooltip at something other than its trigger: here a
 * **virtual anchor** at the last click inside the canvas.
 */
export const VirtualAnchor: Story = {
  render: () => {
    const Canvas = () => {
      const boxRef = useRef<HTMLDivElement>(null);
      const [point, setPoint] = useState<RichTooltipVirtualAnchor | null>(null);
      return (
        <div
          ref={boxRef}
          className="h-64 w-96 relative flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low text-body-medium text-on-surface-variant select-none"
          onClick={(event) => {
            const { clientX: x, clientY: y } = event;
            setPoint({
              getBoundingClientRect: () => new DOMRect(x, y, 0, 0),
              contextElement: boxRef.current ?? undefined,
            });
          }}
        >
          Click anywhere
          <RichTooltip
            trigger="manual"
            anchor={point}
            open={point !== null}
            onOpenChange={(next) => {
              if (!next) setPoint(null);
            }}
            caret
            align="center"
            subhead="Point of interest"
            supportingText="Anchored to a virtual element at your click."
            actions={<RichTooltipAction>Pin</RichTooltipAction>}
          />
        </div>
      );
    };
    return <Canvas />;
  },
};

/** `elevation` 0–5 on the content (MD3 default: level 2). */
export const Elevation: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="min-h-56 gap-16 p-4 flex items-start">
      {([0, 1, 2, 3, 4, 5] as const).map((level) => (
        <RichTooltip
          key={level}
          open
          trigger="manual"
          announce={false}
          align="start"
          flip={false}
          caret
          supportingText={`Elevation level ${level}`}
          contentProps={{ elevation: level }}
        >
          <Button variant="outlined">{level}</Button>
        </RichTooltip>
      ))}
    </div>
  ),
};

/**
 * Re-theme with Material Web's `--md-comp-rich-tooltip-*` tokens (on `:root`,
 * an ancestor of the container, or the content's `style`), `maxWidth`, or
 * `className` on any part.
 */
export const Customization: Story = {
  render: () => (
    <div className="gap-8 flex items-center">
      <RichTooltip
        caret
        subhead="Tertiary"
        supportingText="Container, text, subhead and action colors from tokens."
        actions={<RichTooltipAction>Action</RichTooltipAction>}
        contentProps={{
          style: {
            "--md-comp-rich-tooltip-container-color":
              "var(--md-sys-color-tertiary-container)",
            "--md-comp-rich-tooltip-supporting-text-color":
              "var(--md-sys-color-on-tertiary-container)",
            "--md-comp-rich-tooltip-subhead-color":
              "var(--md-sys-color-on-tertiary-container)",
            "--md-comp-rich-tooltip-action-label-text-color":
              "var(--md-sys-color-tertiary)",
            "--md-comp-rich-tooltip-container-shape":
              "var(--md-sys-shape-corner-extra-large)",
          } as React.CSSProperties,
        }}
      >
        <Button variant="outlined">Tokens</Button>
      </RichTooltip>
      <RichTooltip
        supportingText="A narrower tooltip: maxWidth={200}. Long text wraps sooner."
        contentProps={{ maxWidth: 200 }}
      >
        <Button variant="outlined">maxWidth</Button>
      </RichTooltip>
    </div>
  ),
};

/**
 * `useRichTooltip()` gives custom parts inside the content the tooltip's
 * `dismiss()` / `hold()` (here: a close icon button in the subhead row).
 */
export const CustomParts: Story = {
  render: () => {
    const CloseButton = () => {
      const { dismiss } = useRichTooltip();
      return (
        <IconButton
          size="xs"
          aria-label="Close"
          className="-me-2 -mt-1"
          onClick={(event) => dismiss(event.nativeEvent)}
        >
          <CloseOutlined />
        </IconButton>
      );
    };
    return (
      <RichTooltip trigger="click" caret align="center">
        <RichTooltipTrigger>
          <IconButton variant="tonal" aria-label="About storage">
            <InfoOutlined />
          </IconButton>
        </RichTooltipTrigger>
        <RichTooltipContent>
          <div className="gap-2 flex items-start justify-between">
            <RichTooltipSubhead>Storage</RichTooltipSubhead>
            <CloseButton />
          </div>
          <RichTooltipSupportingText>
            You’re using 12.4 GB of 15 GB. Free up space or get more.
          </RichTooltipSupportingText>
          <RichTooltipActions>
            <RichTooltipAction>Get more</RichTooltipAction>
          </RichTooltipActions>
        </RichTooltipContent>
      </RichTooltip>
    );
  },
};

/** `onOpenChange` reports every change with its reason. */
export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      const [log, setLog] = useState<string[]>([]);
      const record = (next: boolean, reason: RichTooltipOpenChangeReason) =>
        setLog((current) =>
          [`${next ? "open" : "close"} · ${reason}`, ...current].slice(0, 6),
        );
      return (
        <div className="gap-8 flex items-start">
          <RichTooltip
            open={open}
            onOpenChange={(next, { reason }) => {
              setOpen(next);
              record(next, reason);
            }}
            subhead="Controlled"
            supportingText="Every open / close goes through onOpenChange."
            actions={<RichTooltipAction>Close</RichTooltipAction>}
          >
            <Button variant="tonal">Hover or focus me</Button>
          </RichTooltip>
          <ul className="min-w-48 text-body-small text-on-surface-variant">
            {log.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      );
    };
    return <Demo />;
  },
};

/** Logical placement and layout follow `dir="rtl"`. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="gap-8 flex items-center">
      <RichTooltip
        caret
        subhead="ابزار نقاشی"
        supportingText="با ابزار نقاشی یادداشت و هایلایت اضافه کنید."
        actions={
          <>
            <RichTooltipAction>بیشتر بدانید</RichTooltipAction>
            <RichTooltipAction>امتحان کنید</RichTooltipAction>
          </>
        }
      >
        <Button variant="tonal">ابزار نقاشی</Button>
      </RichTooltip>
    </div>
  ),
};

/** `disabled` turns the tooltip off without unwrapping its anchor. */
export const Disabled: Story = {
  args: { disabled: true },
};
