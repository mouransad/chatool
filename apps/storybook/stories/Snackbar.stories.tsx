import { useRef, useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Snackbar, {
  SnackbarAction,
  SnackbarHost,
  createSnackbarQueue,
  type SnackbarCloseReason,
  type SnackbarHostProps,
  type SnackbarQueue,
} from "@chatool/ui/snackbar";
import Button from "@chatool/ui/button";
import Fab from "@chatool/ui/fab";
import EditFilled from "@chatool/icons/EditFilled";

/*
 * Every host story owns its own queue (`createSnackbarQueue`), so the many
 * hosts on the autodocs page never show each other's snackbars. In an app you
 * render one `<SnackbarHost />` and call `snackbar(…)`.
 */
const useQueue = () => useState<SnackbarQueue>(() => createSnackbarQueue())[0];

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-3 flex flex-wrap items-center">{children}</div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <p className="text-body-small text-on-surface-variant">{children}</p>
);

const meta = {
  title: "UI/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    children: "Message archived",
    action: "Undo",
    withDismissAction: false,
    actionOnNewLine: "auto",
  },
  argTypes: {
    children: { control: "text" },
    action: { control: "text" },
    withDismissAction: { control: "boolean" },
    actionOnNewLine: {
      control: "inline-radio",
      options: ["auto", true, false],
    },
    maxLines: { control: { type: "number", min: 0, max: 4 } },
    dismissLabel: { control: "text" },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The surface alone, with every control. */
export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Snackbar {...args} />
    </div>
  ),
};

/**
 * The five MD3 configurations (m3.material.io/components/snackbar/specs):
 * 48dp for one line, 68dp for two, and a long action moved to its own line.
 */
export const Configurations: Story = {
  render: () => (
    <div className="max-w-xl gap-4 flex flex-col">
      <Snackbar>Single-line snackbar</Snackbar>
      <Snackbar action="Action">Single-line snackbar with action</Snackbar>
      <Snackbar action="Action" withDismissAction>
        Single-line snackbar with action and close affordance
      </Snackbar>
      <Snackbar>
        Two-line snackbar: supporting text that runs long enough to wrap onto a
        second line of text.
      </Snackbar>
      <Snackbar action="Action">
        Two-line snackbar with action: supporting text that runs long enough to
        wrap onto a second line.
      </Snackbar>
      <Snackbar action="Longer action" actionOnNewLine>
        Two-line snackbar with a longer action, which moves to its own line
        under the text.
      </Snackbar>
      <Snackbar action="Retry" maxLines={1}>
        maxLines=1 clamps a message that would otherwise wrap to several lines
        with an ellipsis at the end.
      </Snackbar>
    </div>
  ),
};

/**
 * The full system: a host plus the imperative API. Press "Show" several times
 * to see the queue; the result promise tells you whether "Undo" was pressed.
 */
export const HostAndQueue: Story = {
  render: () => {
    const queue = useQueue();
    const [log, setLog] = useState<string[]>([]);
    const record = (line: string) =>
      setLog((previous) => [line, ...previous].slice(0, 5));
    const count = useRef(0);

    return (
      <div className="gap-4 flex flex-col">
        <Row>
          <Button
            variant="filled"
            onClick={() => {
              count.current += 1;
              queue.show(`Message ${count.current} sent`);
            }}
          >
            Show
          </Button>
          <Button
            variant="tonal"
            onClick={async () => {
              const { result } = queue.show({
                message: "Conversation archived",
                action: "Undo",
              });
              const reason = await result;
              record(`Archive → ${reason}`);
            }}
          >
            With action (waits for you)
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              queue.show({
                message: "Photo saved to album",
                replace: true,
              })
            }
          >
            Replace current
          </Button>
          <Button variant="text" onClick={() => queue.clear()}>
            Clear
          </Button>
        </Row>
        <Caption>Results: {log.length === 0 ? "—" : log.join(" · ")}</Caption>
        <SnackbarHost queue={queue} />
      </div>
    );
  },
};

/** `strategy="replace"`: every new snackbar crossfades over the current one. */
export const ReplaceStrategy: Story = {
  render: () => {
    const queue = useQueue();
    const [n, setN] = useState(0);
    return (
      <>
        <Button
          onClick={() => {
            setN(n + 1);
            queue.show(`Downloaded file ${n + 1} of 10`);
          }}
        >
          Next file
        </Button>
        <SnackbarHost queue={queue} strategy="replace" />
      </>
    );
  },
};

/**
 * Durations: `short` 4s, `long` 10s, `auto` (reading time, 4–10s), a number,
 * and `indefinite` (which adds the ✕ close affordance by default). Hover,
 * focus or a background tab pause the clock.
 */
export const Durations: Story = {
  render: () => {
    const queue = useQueue();
    return (
      <>
        <Row>
          <Button
            variant="tonal"
            onClick={() =>
              queue.show({
                message: "Short (4s)",
                duration: "short",
                replace: true,
              })
            }
          >
            short
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              queue.show({
                message: "Long (10s)",
                duration: "long",
                replace: true,
              })
            }
          >
            long
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              queue.show({
                message:
                  "Auto: this message is long enough that it gets more reading time than a short one would.",
                duration: "auto",
                replace: true,
              })
            }
          >
            auto
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              queue.show({
                message: "Exactly 2 seconds",
                duration: 2000,
                replace: true,
              })
            }
          >
            2000
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              queue.show({
                message: "Stays until dismissed",
                duration: "indefinite",
                replace: true,
              })
            }
          >
            indefinite
          </Button>
        </Row>
        <SnackbarHost queue={queue} />
      </>
    );
  },
};

/** `promise()`: "Saving…" is updated in place with the outcome. */
export const Promise_: Story = {
  render: () => {
    const queue = useQueue();
    const run = (ok: boolean) =>
      queue.promise(
        new Promise((resolve, reject) =>
          setTimeout(
            () => (ok ? resolve("draft.md") : reject(new Error())),
            1500,
          ),
        ),
        {
          loading: "Saving…",
          success: (name) => `Saved ${String(name)}`,
          error: "Couldn't save. Check your connection.",
        },
      );
    return (
      <>
        <Row>
          <Button onClick={() => run(true)}>Save (succeeds)</Button>
          <Button variant="outlined" onClick={() => run(false)}>
            Save (fails)
          </Button>
        </Row>
        <SnackbarHost queue={queue} />
      </>
    );
  },
};

const PLACEMENTS: Pick<SnackbarHostProps, "side" | "align" | "fullWidth">[] = [
  { side: "bottom", align: "center" },
  { side: "bottom", align: "start" },
  { side: "bottom", align: "end" },
  { side: "top", align: "center" },
  { side: "bottom", fullWidth: true },
];

/**
 * Placement on wide layouts (MD3: left- or center-aligned, consistently), top
 * placement and the full-width variant. Under 600dp snackbars span the width.
 */
export const Placement: Story = {
  render: () => {
    const queue = useQueue();
    const [placement, setPlacement] = useState(0);
    const current = PLACEMENTS[placement]!;
    return (
      <>
        <Row>
          {PLACEMENTS.map((p, i) => (
            <Button
              key={i}
              variant={i === placement ? "filled" : "outlined"}
              size="xs"
              onClick={() => {
                setPlacement(i);
                queue.show({
                  message: `side=${p.side} align=${p.align ?? "center"}${p.fullWidth ? " fullWidth" : ""}`,
                  action: "OK",
                  replace: true,
                });
              }}
            >
              {p.fullWidth ? "full width" : `${p.side} / ${p.align}`}
            </Button>
          ))}
        </Row>
        <SnackbarHost queue={queue} {...current} />
      </>
    );
  },
};

/**
 * `anchor`: the snackbar sits above the FAB instead of covering it (MD3:
 * "Snackbars should appear above FABs"; MDC's `setAnchorView`). The FAB
 * itself doesn't move (MD3: don't animate other components with it).
 */
export const AnchoredAboveFab: Story = {
  render: () => {
    const queue = useQueue();
    const fab = useRef<HTMLButtonElement>(null);
    return (
      <>
        <Button
          onClick={() => queue.show({ message: "Draft saved", replace: true })}
        >
          Show
        </Button>
        <Fab
          ref={fab}
          icon={<EditFilled />}
          aria-label="Compose"
          placement="bottom-end"
        />
        <SnackbarHost queue={queue} anchor={fab} />
      </>
    );
  },
};

/** `contained`: inside a pane instead of the viewport. */
export const Contained: Story = {
  render: () => {
    const queue = useQueue();
    return (
      <div className="h-64 max-w-lg p-4 relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
        <Button
          onClick={() =>
            queue.show({ message: "Filter applied", replace: true })
          }
        >
          Show inside the pane
        </Button>
        <SnackbarHost queue={queue} contained label="Pane notifications" />
      </div>
    );
  },
};

/**
 * Swipe to dismiss: MDC's start → end by default; any of `start` / `end` /
 * `up` / `down`, or `false`. Past 50% of the width, or a flick, throws it
 * away; it fades between 10% and 60%.
 */
export const Swipe: Story = {
  render: () => {
    const queue = useQueue();
    const [both, setBoth] = useState(false);
    return (
      <>
        <Row>
          <Button
            onClick={() =>
              queue.show({
                message: "Swipe me away",
                duration: "indefinite",
                replace: true,
              })
            }
          >
            Show
          </Button>
          <Button variant="outlined" onClick={() => setBoth(!both)}>
            Directions: {both ? "start + end" : "end"}
          </Button>
        </Row>
        <SnackbarHost
          queue={queue}
          swipeDirection={both ? ["start", "end"] : "end"}
        />
      </>
    );
  },
};

/**
 * A custom render (Compose's `SnackbarHost(snackbar = …)`): your own
 * `Snackbar`, still positioned, timed, animated and announced by the host.
 */
export const CustomRender: Story = {
  render: () => {
    const queue = useQueue();
    return (
      <>
        <Button
          onClick={() =>
            queue.show({
              message: "Link copied",
              data: { href: "https://m3.material.io/components/snackbar" },
              replace: true,
            })
          }
        >
          Show
        </Button>
        <SnackbarHost
          queue={queue}
          renderSnackbar={(data) => (
            <Snackbar
              className="[--md-comp-snackbar-container-shape:var(--md-sys-shape-corner-medium)]"
              action={
                <SnackbarAction asChild>
                  <a
                    href={(data.data as { href: string }).href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => data.performAction()}
                  >
                    Open
                  </a>
                </SnackbarAction>
              }
            >
              {data.message}
            </Snackbar>
          )}
        />
      </>
    );
  },
};

/**
 * Accessibility: messages go to a polite live region (or `assertive` for
 * errors), focus never moves on its own, **Alt+G** jumps to the snackbar,
 * Tab moves between its controls, **Escape** dismisses it while focused, and
 * focus returns to where it was. Actionable snackbars never time out.
 */
export const Accessibility: Story = {
  render: () => {
    const queue = useQueue();
    const [reason, setReason] = useState<SnackbarCloseReason | "—">("—");
    return (
      <div className="gap-3 flex flex-col">
        <Row>
          <Button
            onClick={async () => {
              const { result } = queue.show({
                message: "3 items moved to trash",
                action: "Undo",
              });
              setReason(await result);
            }}
          >
            Delete items
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              queue.show({
                message: "Upload failed",
                action: "Retry",
                politeness: "assertive",
                replace: true,
              })
            }
          >
            Assertive error
          </Button>
        </Row>
        <Caption>
          Press Alt+G to reach the snackbar, then Tab / Escape. Last result:{" "}
          {reason}
        </Caption>
        <SnackbarHost queue={queue} />
      </div>
    );
  },
};

/** Right-to-left: padding, actions and swipe direction mirror. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="max-w-xl gap-4 flex flex-col">
      <Snackbar action="تراجع">تمت أرشفة الرسالة</Snackbar>
      <Snackbar action="إجراء" withDismissAction>
        رسالة من سطر واحد مع إجراء وزر إغلاق
      </Snackbar>
    </div>
  ),
};
