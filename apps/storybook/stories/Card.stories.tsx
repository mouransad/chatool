import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "@chatool/utils";
import Card, {
  CardActions,
  CardContent,
  CardHeader,
  CardHeadline,
  CardMedia,
  CardPrimaryAction,
  CardSubhead,
  CardSupportingText,
} from "@chatool/ui/card";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import MoreVertRounded from "@chatool/icons/MoreVertRounded";
import FavoriteRounded from "@chatool/icons/FavoriteRounded";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import ShareRounded from "@chatool/icons/ShareRounded";
import BookmarkRounded from "@chatool/icons/BookmarkRounded";
import StarRounded from "@chatool/icons/StarRounded";
import PlayArrowRounded from "@chatool/icons/PlayArrowRounded";
import OpenInNewRounded from "@chatool/icons/OpenInNewRounded";

/**
 * A token-colored landscape, so media looks right in light **and** dark themes
 * with no network. `slice` makes it cover whatever box the card gives it.
 */
const Scene = ({
  tone = "primary",
  className,
}: {
  tone?: "primary" | "secondary" | "tertiary";
  className?: string;
}) => (
  <svg
    viewBox="0 0 320 180"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden
    className={cn("block size-full", className)}
  >
    <rect
      width="320"
      height="180"
      fill={`var(--md-sys-color-${tone}-container)`}
    />
    <circle
      cx="236"
      cy="58"
      r="26"
      fill="var(--md-sys-color-tertiary)"
      opacity="0.85"
    />
    <path
      d="M0 130 C60 90 110 100 160 120 S260 80 320 110 V180 H0Z"
      fill={`var(--md-sys-color-${tone})`}
      opacity="0.55"
    />
    <path
      d="M0 150 C80 120 140 140 200 150 S280 130 320 140 V180 H0Z"
      fill={`var(--md-sys-color-${tone})`}
    />
  </svg>
);

const Avatar = ({ children }: { children: React.ReactNode }) => (
  <span
    aria-hidden
    className="size-10 flex items-center justify-center rounded-full bg-primary text-title-medium text-on-primary"
  >
    {children}
  </span>
);

const Overflow = () => (
  <IconButton aria-label="More options">
    <MoreVertRounded />
  </IconButton>
);

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  args: { variant: "filled", shape: "medium", orientation: "vertical" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["elevated", "filled", "outlined"],
    },
    shape: {
      control: "select",
      options: [
        "none",
        "extra-small",
        "small",
        "medium",
        "large",
        "large-increased",
        "extra-large",
        "extra-large-increased",
        "extra-extra-large",
      ],
    },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
    },
    disabled: { control: "boolean" },
    dragged: { control: "boolean" },
    selected: { control: "boolean" },
    interactive: { control: "boolean" },
    asChild: { table: { disable: true } },
    checkIcon: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="p-2 max-w-[min(100%,72rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every control on the canonical MD3 card: full-bleed media, a header with
 * avatar + overflow menu, supporting text and actions. Toggle `dragged`,
 * `selected` and `disabled`, change `variant`, and walk the M3 Expressive
 * `shape` scale — corners morph on the Expressive spatial spring.
 */
export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="w-[22rem] max-w-full">
      <CardHeader leading={<Avatar>A</Avatar>} trailing={<Overflow />}>
        <CardHeadline>Alpine lakes</CardHeadline>
        <CardSubhead>Shared by Ana · 2 days ago</CardSubhead>
      </CardHeader>
      <CardMedia className="aspect-video">
        <Scene />
      </CardMedia>
      <CardContent>
        <CardSupportingText>
          A short guide to the clearest lakes in the Alps — when to go, where to
          stay, and the trails that reach them.
        </CardSupportingText>
      </CardContent>
      <CardActions>
        <Button variant="outlined">Save</Button>
        <Button>Read</Button>
      </CardActions>
    </Card>
  ),
};

/**
 * MD3's three variants — same legibility and function, different separation
 * from the background: **elevated** (shadow), **filled** (subtle,
 * `surface-container-highest`) and **outlined** (a visual boundary).
 */
export const Variants: Story = {
  render: () => (
    <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
      {(["elevated", "filled", "outlined"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardContent>
            <CardHeadline className="capitalize">{variant}</CardHeadline>
            <CardSubhead>
              {variant === "elevated"
                ? "surface-container-low · level 1"
                : variant === "filled"
                  ? "surface-container-highest · level 0"
                  : "surface · 1dp outline-variant"}
            </CardSubhead>
            <CardSupportingText>
              Cards hold content and actions about a single subject.
            </CardSupportingText>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

/**
 * The MD3 anatomy — container, media, headline, subhead, supporting text and
 * buttons. The container is the only required part; every other part is
 * optional and composable.
 */
export const Anatomy: Story = {
  render: () => (
    <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] items-start">
      <Card variant="outlined">
        <CardMedia className="aspect-[16/9]">
          <Scene tone="tertiary" />
        </CardMedia>
        <CardContent>
          <CardHeadline>Headline</CardHeadline>
          <CardSubhead>Subhead</CardSubhead>
          <CardSupportingText>
            Supporting text that explains the card’s subject in a sentence or
            two.
          </CardSupportingText>
        </CardContent>
        <CardActions>
          <Button variant="outlined">Secondary</Button>
          <Button>Primary</Button>
        </CardActions>
      </Card>
      <Card variant="elevated">
        <CardHeader leading={<Avatar>M</Avatar>} trailing={<Overflow />}>
          <CardHeadline>Header row</CardHeadline>
          <CardSubhead>Avatar · text · overflow menu</CardSubhead>
        </CardHeader>
        <CardMedia inset className="aspect-square">
          <Scene tone="secondary" />
        </CardMedia>
        <CardActions align="start">
          <IconButton aria-label="Favorite">
            <FavoriteOutlined />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareRounded />
          </IconButton>
          <IconButton aria-label="Bookmark">
            <BookmarkRounded />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  ),
};

/**
 * The M3 Expressive corner scale, from `none` to `extra-extra-large` (48dp).
 * Inset media is **optically round**: its radius is the card's radius minus
 * the padding (MD3 Expressive's "outer − padding = inner"), so nested corners
 * stay concentric at every step.
 */
export const Shapes: Story = {
  render: () => (
    <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]">
      {(
        [
          "none",
          "extra-small",
          "small",
          "medium",
          "large",
          "large-increased",
          "extra-large",
          "extra-large-increased",
          "extra-extra-large",
        ] as const
      ).map((shape) => (
        <Card key={shape} variant="filled" shape={shape}>
          <CardMedia inset className="aspect-[4/3]">
            <Scene />
          </CardMedia>
          <CardContent>
            <CardHeadline size="small">{shape}</CardHeadline>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

/**
 * `orientation="horizontal"` — the compact layout MD3 recommends adapting
 * between: horizontal on narrow screens, vertical on wide ones. Full-bleed
 * media bleeds to the leading edge; give it a width.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="max-w-xl gap-3 flex flex-col">
      <Card orientation="horizontal" variant="outlined">
        <CardMedia className="w-28 sm:w-40">
          <Scene />
        </CardMedia>
        <CardContent>
          <CardHeadline>Weekend in Lisbon</CardHeadline>
          <CardSubhead>3 nights · from $420</CardSubhead>
          <CardSupportingText maxLines={2}>
            Tram 28, pastéis de nata and sunsets over the Tagus from the
            Miradouro da Graça — a long weekend that never stops climbing.
          </CardSupportingText>
          <CardActions align="start" className="pt-2">
            <Button variant="tonal" size="xs">
              Details
            </Button>
          </CardActions>
        </CardContent>
      </Card>
      <Card orientation="horizontal" variant="elevated">
        <CardContent className="justify-center">
          <CardHeadline>Now playing</CardHeadline>
          <CardSubhead>Low tide · The Harbour</CardSubhead>
        </CardContent>
        <IconButton variant="filled" aria-label="Play" className="self-center">
          <PlayArrowRounded />
        </IconButton>
        <CardMedia className="w-24">
          <Scene tone="tertiary" />
        </CardMedia>
      </Card>
    </div>
  ),
};

/**
 * **The recommended clickable card.** A `CardPrimaryAction` (a real link — the
 * headline text) stretches over the card: the whole card hovers, ripples and
 * focuses as one target, the link's name is just "Alpine lakes", the heading is
 * still a heading, and the favorite button stays independently clickable. Tab
 * through it: card (link) → Favorite.
 */
export const ClickableCard: Story = {
  render: () => {
    const Favorite = () => {
      const [on, setOn] = useState(false);
      return (
        <IconButton
          aria-label="Favorite"
          selected={on}
          selectedIcon={<FavoriteRounded />}
          onClick={() => setOn((v) => !v)}
        >
          <FavoriteOutlined />
        </IconButton>
      );
    };
    return (
      <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
        {(["elevated", "filled", "outlined"] as const).map((variant) => (
          <Card key={variant} variant={variant}>
            <CardMedia className="aspect-video">
              <Scene tone="secondary" />
            </CardMedia>
            <CardHeader trailing={<Favorite />}>
              <CardHeadline>
                <CardPrimaryAction href="#alpine-lakes">
                  Alpine lakes
                </CardPrimaryAction>
              </CardHeadline>
              <CardSubhead>{variant} · whole card is a link</CardSubhead>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  },
};

/**
 * A **directly actionable** card: the card *is* the control (`asChild` onto
 * an `<a>` or `<button>`), auto-detected as interactive. MD3: no buttons inside
 * — and keep content short and phrasing-only (`<span>`s), because the whole
 * card becomes the control's accessible name.
 */
export const DirectlyActionable: Story = {
  render: () => (
    <div className="gap-4 flex flex-wrap">
      <Card asChild variant="elevated" className="w-60">
        <a href="#docs">
          <span className="text-title-medium">Documentation</span>
          <span className="text-body-medium text-on-surface-variant">
            Guides and API reference
          </span>
          <OpenInNewRounded className="size-5 text-primary" />
        </a>
      </Card>
      <Card asChild variant="outlined" className="w-60">
        <button type="button" onClick={() => {}}>
          <StarRounded className="size-6 text-primary" />
          <span className="text-title-medium">Rate this app</span>
          <span className="text-body-medium text-on-surface-variant">
            Takes ten seconds
          </span>
        </button>
      </Card>
      <Card asChild variant="filled" className="w-60" disabled>
        <button type="button">
          <span className="text-title-medium">Disabled</span>
          <span className="text-body-medium text-on-surface-variant">
            Native disabled button
          </span>
        </button>
      </Card>
    </div>
  ),
};

/**
 * **Selectable cards** (MDC-Android's checkable card): `secondary` tint,
 * `secondary` outline on outlined cards, and the check icon popping in on the
 * Expressive fast-spatial spring.
 *
 * Left: toggle `<button>` cards (`aria-pressed`). Right: a native radio group
 * — each card is a `<label>` around a visually-hidden `<input type="radio">`,
 * so it submits with a form, arrow keys move the selection, and the card reads
 * `:checked` from CSS with **no state at all**.
 */
export const Selectable: Story = {
  render: () => {
    const Toggles = () => {
      const [picked, setPicked] = useState<string[]>(["Hiking"]);
      return (
        <div className="gap-3 grid grid-cols-2">
          {["Hiking", "Cycling", "Climbing", "Kayaking"].map((name) => {
            const on = picked.includes(name);
            return (
              <Card
                key={name}
                asChild
                variant="outlined"
                selected={on}
                className="min-h-24"
              >
                <button
                  type="button"
                  onClick={() =>
                    setPicked((p) =>
                      on ? p.filter((x) => x !== name) : [...p, name],
                    )
                  }
                >
                  <span className="text-title-medium">{name}</span>
                </button>
              </Card>
            );
          })}
        </div>
      );
    };
    return (
      <div className="gap-8 md:grid-cols-2 grid">
        <Toggles />
        <fieldset className="gap-3 m-0 p-0 grid border-0">
          <legend className="mb-3 text-title-small text-on-surface">
            Choose a plan
          </legend>
          {[
            ["Basic", "$4 / month", "1 project"],
            ["Plus", "$9 / month", "10 projects"],
            ["Pro", "$19 / month", "Unlimited projects"],
          ].map(([name, price, detail], i) => (
            <Card key={name} asChild variant="outlined" checkIcon>
              <label>
                <input
                  type="radio"
                  name="plan"
                  value={name}
                  defaultChecked={i === 1}
                  className="sr-only"
                />
                <CardContent>
                  <CardHeadline asChild>
                    <span>{name}</span>
                  </CardHeadline>
                  <CardSubhead asChild>
                    <span>
                      {price} · {detail}
                    </span>
                  </CardSubhead>
                </CardContent>
              </label>
            </Card>
          ))}
        </fieldset>
      </div>
    );
  },
};

/**
 * Every MD3 state for each variant. Rest and the static states are shown;
 * hover, focus (Tab) and press the interactive row to see the per-state
 * elevations: elevated 1 → 2 (hover) → 1 (pressed), filled/outlined 0 → 1.
 * Dragged lifts to level 4 (elevated) / 3 with the 16% dragged state layer.
 */
export const States: Story = {
  render: () => (
    <div className="gap-x-4 gap-y-3 grid grid-cols-[auto_repeat(3,minmax(9rem,1fr))] items-stretch">
      <span />
      {(["elevated", "filled", "outlined"] as const).map((v) => (
        <span
          key={v}
          className="text-label-large text-on-surface-variant capitalize"
        >
          {v}
        </span>
      ))}
      {(
        [
          ["Interactive", {}],
          ["Dragged", { dragged: true }],
          ["Selected", { selected: true }],
          ["Disabled", { disabled: true }],
        ] as const
      ).map(([label, state]) => (
        <div key={label} className="contents">
          <span className="self-center text-label-large text-on-surface-variant">
            {label}
          </span>
          {(["elevated", "filled", "outlined"] as const).map((variant) => (
            <Card key={variant} asChild variant={variant} {...state}>
              <button type="button">
                <span className="text-title-small">{label}</span>
                <span className="text-body-small text-on-surface-variant">
                  {variant}
                </span>
              </button>
            </Card>
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * **Pick up & move.** Press and hold a card to pick it up — `dragged` raises it
 * to the dragged elevation with the 16% state layer, in front of its
 * neighbors. (Wire `dragged` from your drag-and-drop library; per MD3, also
 * offer a single-pointer alternative such as "Move up / down" in a menu.)
 */
export const Dragged: Story = {
  render: () => {
    const Pickable = ({
      variant,
    }: {
      variant: "elevated" | "filled" | "outlined";
    }) => {
      const [held, setHeld] = useState(false);
      return (
        <Card
          variant={variant}
          dragged={held}
          className="cursor-grab touch-none select-none"
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
        >
          <CardHeadline>Hold me</CardHeadline>
          <CardSubhead>{variant}</CardSubhead>
        </Card>
      );
    };
    return (
      <div className="gap-4 grid grid-cols-3">
        <Pickable variant="elevated" />
        <Pickable variant="filled" />
        <Pickable variant="outlined" />
      </div>
    );
  },
};

/**
 * A **collection** (grid). Cards in a collection are coplanar — same resting
 * elevation — and are list items, so screen readers announce "list, 6 items"
 * and offer list navigation. Equal heights line the actions up at the bottom.
 */
export const Collection: Story = {
  render: () => (
    <ul className="m-0 gap-4 p-0 grid list-none grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      {[
        ["Alpine lakes", "Travel", "primary"],
        ["Night trains of Europe", "Travel · 12 min read", "secondary"],
        ["Bread at home", "Food", "tertiary"],
        ["Cold-water swimming, explained", "Health · 6 min read", "primary"],
        ["Field recording", "Music", "secondary"],
        ["Small gardens", "Home", "tertiary"],
      ].map(([title, sub, tone]) => (
        <Card key={title} asChild variant="elevated">
          <li>
            <CardMedia className="aspect-[3/2]">
              <Scene tone={tone as "primary" | "secondary" | "tertiary"} />
            </CardMedia>
            <CardContent>
              <CardHeadline maxLines={2}>
                <CardPrimaryAction href={`#${title}`}>
                  {title}
                </CardPrimaryAction>
              </CardHeadline>
              <CardSubhead>{sub}</CardSubhead>
            </CardContent>
          </li>
        </Card>
      ))}
    </ul>
  ),
};

/**
 * MD3 reading order puts the **heading before the image**: keep the DOM order
 * heading-first and lift the media visually with `placement="first"` — it
 * still bleeds to the top edge. Screen readers read headline → image → text.
 */
export const ReadingOrder: Story = {
  render: () => (
    <Card variant="outlined" className="w-80 max-w-full">
      <CardContent>
        <CardHeadline>
          <CardPrimaryAction href="#trail">
            Ridge trail at dawn
          </CardPrimaryAction>
        </CardHeadline>
        <CardSubhead>Photo essay</CardSubhead>
      </CardContent>
      <CardMedia placement="first" className="aspect-video">
        <Scene />
      </CardMedia>
      <CardSupportingText>
        Leaving at four to watch the light reach the valley floor.
      </CardSupportingText>
    </Card>
  ),
};

/**
 * Theming with `--md-comp-card-*` tokens — globally in CSS or per instance.
 * Here: a tertiary container, a 20dp corner, 24dp padding and a custom
 * focus / selected color, with no new component code.
 */
export const Theming: Story = {
  render: () => (
    <Card
      asChild
      variant="filled"
      selected
      className="w-72"
      style={
        {
          "--md-comp-card-container-color":
            "var(--md-sys-color-tertiary-container)",
          "--md-comp-card-content-color":
            "var(--md-sys-color-on-tertiary-container)",
          "--md-comp-card-headline-color":
            "var(--md-sys-color-on-tertiary-container)",
          "--md-comp-card-subhead-color":
            "var(--md-sys-color-on-tertiary-container)",
          "--md-comp-card-container-shape": "1.25rem",
          "--md-comp-card-padding": "1.5rem",
          "--md-comp-card-focus-indicator-color":
            "var(--md-sys-color-tertiary)",
          "--md-comp-card-checked-icon-color": "var(--md-sys-color-tertiary)",
          "--md-comp-card-checked-icon-check-color":
            "var(--md-sys-color-on-tertiary)",
          "--md-comp-card-selected-tint-color": "var(--md-sys-color-tertiary)",
        } as React.CSSProperties
      }
    >
      <button type="button">
        <span className="text-title-large">Custom tokens</span>
        <span className="text-body-medium">Tertiary · 20dp · 24dp padding</span>
      </button>
    </Card>
  ),
};
