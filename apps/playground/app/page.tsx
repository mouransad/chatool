import type { CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { FormDemo } from "./components/form-demo";
import {
  ButtonToggle,
  IconButtonToggle,
} from "./components/icon-button-toggle";
import { ButtonGroupSingleSelect } from "./components/button-group-demo";
import { ProgressDemo } from "./components/progress-demo";
import { BadgeCounter, BadgeNavBar } from "./components/badge-demo";
import { CheckboxParentChild } from "./components/checkbox-demo";
import { RadioControlled } from "./components/radio-demo";
import { SwitchControlled } from "./components/switch-demo";
import { CardToggleGroup } from "./components/card-demo";
import { TooltipControlled } from "./components/tooltip-demo";
import { FabCollapseOnScroll, FabShowHide } from "./components/fab-demo";
import { ChipFilterSet, ChipInputSet } from "./components/chip-demo";
import {
  TextFieldControlled,
  TextFieldSearch,
  TextFieldSignIn,
} from "./components/text-field-demo";
import TextField from "@chatool/ui/text-field";
import Chip from "@chatool/ui/chip";
import ChipSet from "@chatool/ui/chip-set";
import CalendarTodayOutlined from "@chatool/icons/CalendarTodayOutlined";
import LocationOnOutlined from "@chatool/icons/LocationOnOutlined";
import StarOutlined from "@chatool/icons/StarOutlined";
import { Button } from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import ButtonGroup from "@chatool/ui/button-group";
import Fab from "@chatool/ui/fab";
import EditFilled from "@chatool/icons/EditFilled";
import AddFilled from "@chatool/icons/AddFilled";
import LoadingIndicator from "@chatool/ui/loading-indicator";
import LinearProgress from "@chatool/ui/linear-progress";
import CircularProgress from "@chatool/ui/circular-progress";
import Divider from "@chatool/ui/divider";
import Badge from "@chatool/ui/badge";
import Checkbox from "@chatool/ui/checkbox";
import Radio from "@chatool/ui/radio";
import RadioGroup from "@chatool/ui/radio-group";
import Switch from "@chatool/ui/switch";
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
import ChatOutlined from "@chatool/icons/ChatOutlined";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import ProgressActivityOutlined from "@chatool/icons/ProgressActivityOutlined";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import CloseOutlined from "@chatool/icons/CloseOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";
import NotificationsOutlined from "@chatool/icons/NotificationsOutlined";
import MoreVertRounded from "@chatool/icons/MoreVertRounded";
import Tooltip, { TooltipAction, TooltipProvider } from "@chatool/ui/tooltip";
import UndoOutlined from "@chatool/icons/UndoOutlined";
import RedoOutlined from "@chatool/icons/RedoOutlined";
import ContentCopyOutlined from "@chatool/icons/ContentCopyOutlined";
import DeleteOutlined from "@chatool/icons/DeleteOutlined";
import InfoOutlined from "@chatool/icons/InfoOutlined";
import BookmarkOutlined from "@chatool/icons/BookmarkOutlined";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 p-6 rounded-lg border bg-surface-container text-on-surface">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint ? (
          <p className="text-body-medium text-on-surface-variant">{hint}</p>
        ) : null}
      </div>
      <div className="gap-3 flex flex-wrap items-center">{children}</div>
    </section>
  );
}

/** Token-colored placeholder art for card media (themes with light/dark). */
function Art({
  tone = "primary",
}: {
  tone?: "primary" | "secondary" | "tertiary";
}) {
  return (
    <div
      aria-hidden
      className="size-full"
      style={{
        background: `radial-gradient(circle at 75% 30%, var(--md-sys-color-tertiary) 0 12%, transparent 13%), linear-gradient(160deg, var(--md-sys-color-${tone}-container) 55%, var(--md-sys-color-${tone}) 56%)`,
      }}
    />
  );
}

export default function Home() {
  return (
    <main className="max-w-3xl space-y-8 p-8 mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="gap-2 text-2xl font-bold flex items-center">
          <ChatOutlined className="size-7 text-primary" />
          @chatool/* playground
        </h1>
        <ThemeToggle />
      </header>

      <p className="text-body-medium text-on-surface-variant">
        This page is a Server Component — every <code>Button</code> below
        renders on the server; only the press ripple hydrates on the client.
        Click any button to see the ripple + shape-morph.
      </p>

      {/* MD3 common button — the five styles (color is fixed per style) */}
      <Section
        title="Button — styles"
        hint="MD3 fixes color per style; there is no color prop."
      >
        <Button variant="filled">Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Section>

      {/* Sizes (XS–XL) */}
      <Section
        title="Button — sizes"
        hint="XS / S / M / L / XL = 32 / 40 / 56 / 96 / 136 dp."
      >
        <Button size="xs">XS</Button>
        <Button size="s">S</Button>
        <Button size="m">M</Button>
        <Button size="l">L</Button>
        <Button size="xl">XL</Button>
      </Section>

      {/* Shape — round (pill) / square, both morph corners on press */}
      <Section
        title="Button — shape"
        hint="Round (pill) and square; both morph their corners while pressed."
      >
        <Button shape="round">Round</Button>
        <Button shape="round" variant="tonal">
          Round
        </Button>
        <Button shape="square">Square</Button>
        <Button shape="square" variant="outlined">
          Square
        </Button>
      </Section>

      {/* Icons — leading / trailing / icon-only (needs aria-label) / menu */}
      <Section
        title="Button — icons"
        hint="Icon-only buttons must pass aria-label; menu buttons set aria-haspopup/aria-expanded."
      >
        <Button startIcon={<CheckOutlined />}>Leading</Button>
        <Button endIcon={<ArrowForwardOutlined />}>Trailing</Button>
        <Button>No icon</Button>
        <Button aria-label="Open chat" startIcon={<ChatOutlined />} />
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDownOutlined />}
          aria-haspopup="menu"
          aria-expanded={false}
        >
          Menu
        </Button>
      </Section>

      {/* Loading — non-actionable + aria-busy, keeps color + spinner */}
      <Section
        title="Button — loading"
        hint="A loading button is non-actionable (mouse + keyboard) and aria-busy, but keeps its color + spinner."
      >
        <Button loading loadingPosition="start">
          Start
        </Button>
        <Button loading loadingPosition="center">
          Center
        </Button>
        <Button loading loadingPosition="end">
          End
        </Button>
        <Button variant="tonal" loading>
          Tonal
        </Button>
        <Button
          loading
          loadingIndicator={
            <ProgressActivityOutlined className="animate-spin" />
          }
        >
          Custom spinner
        </Button>
      </Section>

      {/* Disabled — across the styles */}
      <Section
        title="Button — disabled"
        hint="Dimmed to 38% and non-interactive."
      >
        <Button disabled>Filled</Button>
        <Button variant="tonal" disabled>
          Tonal
        </Button>
        <Button variant="elevated" disabled>
          Elevated
        </Button>
        <Button variant="outlined" disabled>
          Outlined
        </Button>
        <Button variant="text" disabled>
          Text
        </Button>
      </Section>

      {/* asChild — render the styles onto a real link */}
      <Section
        title="Button — asChild (link)"
        hint="Renders styles onto your element via Radix Slot; pass a natively interactive element."
      >
        <Button asChild variant="text" endIcon={<ArrowForwardOutlined />}>
          <a href="https://m3.material.io" target="_blank" rel="noreferrer">
            Open the M3 spec
          </a>
        </Button>
        <Button asChild variant="outlined">
          <a href="#top">Back to top</a>
        </Button>
      </Section>

      {/* Toggle — selected → aria-pressed + shape morph + leading-icon swap */}
      <Section
        title="Button — toggle"
        hint="Click to select: reflects aria-pressed, morphs round→square, swaps to the filled icon (outlined fills). Keep the label constant."
      >
        <ButtonToggle />
      </Section>

      {/* type=button (default) vs type=submit inside a form */}
      <Section
        title="Button — in a form"
        hint="Default type='button' never submits the form; only type='submit' does."
      >
        <FormDemo />
      </Section>

      {/* Per-instance component-token override (only this button re-themes) */}
      <Section
        title="Button — --md-comp-* override"
        hint="Per-instance theming via CSS vars; only this button re-themes."
      >
        <Button>Default</Button>
        <Button
          style={
            {
              "--md-comp-button-container-color": "#006971",
              "--md-comp-button-label-text-color": "#ffffff",
            } as CSSProperties
          }
        >
          Custom token
        </Button>
      </Section>

      {/* Icon button — the four MD3 styles (icon-only, color fixed per style) */}
      <Section
        title="Icon button — styles"
        hint="Icon-only buttons; each must pass aria-label. Color is fixed per style."
      >
        <IconButton variant="standard" aria-label="Favorite">
          <FavoriteOutlined />
        </IconButton>
        <IconButton variant="filled" aria-label="Settings">
          <SettingsOutlined />
        </IconButton>
        <IconButton variant="tonal" aria-label="Chat">
          <ChatOutlined />
        </IconButton>
        <IconButton variant="outlined" aria-label="Close">
          <CloseOutlined />
        </IconButton>
      </Section>

      {/* Icon button — sizes (square XS–XL) */}
      <Section
        title="Icon button — sizes"
        hint="Square containers on the same XS–XL scale as Button (32–136 dp)."
      >
        {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
          <IconButton key={size} size={size} aria-label={`Favorite ${size}`}>
            <FavoriteOutlined />
          </IconButton>
        ))}
      </Section>

      {/* Icon button — shape (round circle / square, both morph on press) */}
      <Section
        title="Icon button — shape"
        hint="Round (circle) and square; both morph their corners while pressed."
      >
        <IconButton variant="tonal" shape="round" aria-label="Round">
          <FavoriteOutlined />
        </IconButton>
        <IconButton variant="tonal" shape="square" aria-label="Square">
          <FavoriteOutlined />
        </IconButton>
      </Section>

      {/* Icon button — toggle (selected → aria-pressed + shape morph + icon swap) */}
      <Section
        title="Icon button — toggle"
        hint="Click to select: reflects aria-pressed, morphs round→square, swaps to the filled icon. Keep the label constant."
      >
        <IconButtonToggle />
      </Section>

      {/* Icon button — loading / disabled */}
      <Section
        title="Icon button — loading / disabled"
        hint="Loading is non-actionable + aria-busy (keeps color); disabled dims to 38%."
      >
        <IconButton variant="filled" loading aria-label="Saving" />
        <IconButton variant="tonal" disabled aria-label="Favorite">
          <FavoriteOutlined />
        </IconButton>
      </Section>

      {/* Button group — standard (press squish: pressed expands, neighbors compress) */}
      <Section
        title="Button group — standard"
        hint="MD3 Expressive: press a button and it expands while its neighbors compress. Each child keeps its own shape."
      >
        <ButtonGroup aria-label="Document actions">
          <Button variant="filled">Save</Button>
          <Button variant="tonal">Duplicate</Button>
          <Button variant="outlined">Delete</Button>
        </ButtonGroup>
      </Section>

      {/* Button group — connected (tight 2dp cluster; children keep their radius) */}
      <Section
        title="Button group — connected"
        hint="Tight 2dp cluster. Children keep their own radius; the selected child morphs via its own smooth round→square animation."
      >
        <ButtonGroup variant="connected" aria-label="Range">
          <Button variant="tonal">Day</Button>
          <Button variant="tonal">Week</Button>
          <Button variant="tonal">Month</Button>
        </ButtonGroup>
        <ButtonGroup variant="connected" aria-label="Navigation">
          <IconButton variant="tonal" aria-label="Previous">
            <KeyboardArrowDownOutlined className="rotate-90" />
          </IconButton>
          <IconButton variant="tonal" aria-label="Menu">
            <SettingsOutlined />
          </IconButton>
          <IconButton variant="tonal" aria-label="Next">
            <KeyboardArrowDownOutlined className="-rotate-90" />
          </IconButton>
        </ButtonGroup>
      </Section>

      {/* Button group — vertical + single-select segmented (client island) */}
      <Section
        title="Button group — vertical / single-select"
        hint="Orientation flips the track axis. The single-select segmented control is a client island (selected children → aria-pressed)."
      >
        <ButtonGroup
          variant="connected"
          orientation="vertical"
          aria-label="Alignment"
        >
          <Button variant="tonal">Top</Button>
          <Button variant="tonal">Middle</Button>
          <Button variant="tonal">Bottom</Button>
        </ButtonGroup>
        <ButtonGroupSingleSelect />
      </Section>

      {/* MD3 Expressive FAB + extended FAB — one morphing Server Component */}
      <Section
        title="FAB — sizes"
        hint="56 / 80 (most recommended, the default) / 96dp; corners 16 / 20 / 28. Icon-only FABs need an aria-label."
      >
        <Fab icon={<EditFilled />} size="small" aria-label="Compose" />
        <Fab icon={<EditFilled />} aria-label="Compose" />
        <Fab icon={<EditFilled />} size="large" aria-label="Compose" />
      </Section>

      <Section
        title="Extended FAB — sizes"
        hint="Label in Title Medium / Title Large / Headline Small; the icon is optional."
      >
        <Fab icon={<EditFilled />} label="Compose" size="small" />
        <Fab icon={<EditFilled />} label="Compose" />
        <Fab icon={<EditFilled />} label="Compose" size="large" />
        <Fab label="Create" size="small" />
      </Section>

      <Section
        title="FAB — color styles"
        hint="Container styles are the tonal defaults; primary / secondary / tertiary are M3 Expressive's high-emphasis set."
      >
        <Fab icon={<AddFilled />} aria-label="Create" size="small" />
        <Fab
          icon={<AddFilled />}
          aria-label="Create"
          size="small"
          color="secondary-container"
        />
        <Fab
          icon={<AddFilled />}
          aria-label="Create"
          size="small"
          color="tertiary-container"
        />
        <Fab
          icon={<AddFilled />}
          label="Primary"
          size="small"
          color="primary"
        />
        <Fab
          icon={<AddFilled />}
          label="Secondary"
          size="small"
          color="secondary"
        />
        <Fab
          icon={<AddFilled />}
          label="Tertiary"
          size="small"
          color="tertiary"
        />
      </Section>

      <Section
        title="FAB — elevation"
        hint="default (3 → 4 on hover), lowered (1 → 2), none (in a bar or rail)."
      >
        <Fab icon={<EditFilled />} label="Default" size="small" />
        <Fab
          icon={<EditFilled />}
          label="Lowered"
          size="small"
          elevation="lowered"
        />
        <Fab icon={<EditFilled />} label="None" size="small" elevation="none" />
      </Section>

      <Section
        title="FAB — responsive (resize the window)"
        hint="A medium FAB on compact / medium windows; a large extended FAB from the expanded window class (≥ 840px). Pure CSS — rendered here on the server."
      >
        <Fab
          icon={<EditFilled />}
          label="Compose"
          size={{ compact: "medium", expanded: "large" }}
          expanded={{ compact: false, expanded: true }}
        />
      </Section>

      <Section
        title="Extended FAB — collapse on scroll"
        hint="Scroll down to collapse into a FAB, up (or to the end) to expand. placement floats it with 16dp margins."
      >
        <FabCollapseOnScroll />
      </Section>

      <Section
        title="FAB — show / hide"
        hint="Hide it instead of disabling it (MD3); a new key replays the entrance."
      >
        <FabShowHide />
      </Section>

      <Section
        title="FAB — asChild (link)"
        hint="Renders onto your link element; the FAB's icon, label and ripple fill it."
      >
        <Fab asChild icon={<AddFilled />} label="New chat" size="small">
          <a href="#new-chat" />
        </Fab>
      </Section>

      {/* Loading family: rendered from this Server Component */}
      <Section
        title="@chatool/ui/loading-indicator"
        hint="The seven-shape morph for short waits. Server-rendered first frame, animated on the client."
      >
        <LoadingIndicator aria-label="Loading messages" />
        <LoadingIndicator contained aria-label="Refreshing feed" />
        <LoadingIndicator size={72} contained />
        <LoadingIndicator value={70} size={72} aria-label="Pull to refresh" />
        <Button
          loading
          loadingIndicator={<LoadingIndicator color="inherit" size={24} />}
        >
          Saving
        </Button>
      </Section>

      <Section
        title="@chatool/ui/linear-progress"
        hint="Wavy by default, flat on request; omit value for indeterminate."
      >
        <div className="gap-4 flex w-full flex-col">
          <LinearProgress value={65} aria-label="Uploading" />
          <LinearProgress
            value={65}
            shape="flat"
            aria-label="Uploading, flat"
          />
          <LinearProgress aria-label="Connecting" />
          <LinearProgress shape="flat" aria-label="Connecting, flat" />
          <LinearProgress
            value={40}
            thickness={8}
            aria-label="Uploading, thick"
          />
        </div>
      </Section>

      <Section
        title="@chatool/ui/circular-progress"
        hint="Wavy by default, flat on request; omit value for indeterminate."
      >
        <CircularProgress value={65} aria-label="Uploading" />
        <CircularProgress value={65} shape="flat" aria-label="Uploading" />
        <CircularProgress aria-label="Connecting" />
        <CircularProgress shape="flat" aria-label="Connecting" />
        <CircularProgress value={65} thickness={8} aria-label="Uploading" />
      </Section>

      <Section
        title="Indeterminate → determinate"
        hint="The handoff, driven from a client island."
      >
        <ProgressDemo />
      </Section>

      {/* Divider: a pure Server Component (no client code at all) */}
      <Section
        title="@chatool/ui/divider"
        hint="1dp outline-variant line: full-width, inset, middle-inset, vertical, heavy and labelled. Rendered entirely on the server."
      >
        <div className="gap-4 py-4 flex w-full flex-col rounded-lg bg-surface-container-low">
          <Divider />
          <Divider inset="start" />
          <Divider inset="middle" />
          <Divider weight="heavy" />
          <Divider inset="middle">or</Divider>
          <Divider decorative={false} inset="middle" />
        </div>
        <div className="h-12 gap-3 px-3 flex items-center rounded-lg bg-surface-container-low">
          <span className="text-body-medium">Edit</span>
          <Divider orientation="vertical" />
          <span className="text-body-medium">Share</span>
          <Divider orientation="vertical" inset="middle" />
          <span className="text-body-medium">Delete</span>
        </div>
      </Section>

      {/* Badge — the two MD3 variants, server-rendered */}
      <Section
        title="Badge — small / large"
        hint="Server-rendered. No value → 6dp dot; a value → 16dp pill. >999 shows 999+ (4 chars max); long text truncates."
      >
        <Badge>
          <MailOutlined className="size-6 text-on-surface-variant" />
        </Badge>
        <Badge value={3}>
          <MailOutlined className="size-6 text-on-surface-variant" />
        </Badge>
        <Badge value={42}>
          <MailOutlined className="size-6 text-on-surface-variant" />
        </Badge>
        <Badge value={1200}>
          <MailOutlined className="size-6 text-on-surface-variant" />
        </Badge>
        <Badge value="Beta!">
          <MailOutlined className="size-6 text-on-surface-variant" />
        </Badge>
        <Badge value={24} />
      </Section>

      {/* Badge — color, placement, RTL, localized digits */}
      <Section
        title="Badge — color, placement, RTL"
        hint="Error by default; logical placement mirrors in RTL; locale localizes digits."
      >
        {(["error", "primary", "secondary", "tertiary"] as const).map((c) => (
          <Badge key={c} value={8} color={c}>
            <NotificationsOutlined className="size-6 text-on-surface-variant" />
          </Badge>
        ))}
        <Badge value={8} placement="top-start">
          <NotificationsOutlined className="size-6 text-on-surface-variant" />
        </Badge>
        <span dir="rtl" className="gap-6 flex">
          <Badge value={1500} locale="fa" label="۱۵۰۰ اعلان جدید">
            <NotificationsOutlined className="size-6 text-on-surface-variant" />
          </Badge>
          <Badge>
            <NotificationsOutlined className="size-6 text-on-surface-variant" />
          </Badge>
        </span>
      </Section>

      {/* Badge — in an icon button (aria-describedby wiring) */}
      <Section
        title="Badge — in icon buttons"
        hint="aria-label names the button; aria-describedby points at the badge id."
      >
        <IconButton aria-label="Notifications" aria-describedby="pg-notif">
          <Badge id="pg-notif" value={5} size="small">
            <NotificationsOutlined />
          </Badge>
        </IconButton>
        <IconButton
          variant="tonal"
          aria-label="Messages"
          aria-describedby="pg-mail"
        >
          <Badge id="pg-mail" value={24}>
            <MailOutlined />
          </Badge>
        </IconButton>
      </Section>

      {/* Badge — Expressive motion (client island drives the state only) */}
      <Section
        title="Badge — motion"
        hint="CSS-only Expressive spring: enter, count pop, dot⇄pill morph, exit. The island only holds state."
      >
        <BadgeCounter />
      </Section>

      <Section
        title="Badge — navigation bar"
        hint="MD3: hide a destination's badge once it's selected (invisible={selected})."
      >
        <BadgeNavBar />
      </Section>

      {/* Checkbox — rendered on the server; uncontrolled boxes need no JS */}
      <Section
        title="Checkbox — states"
        hint="Server-rendered native inputs: these toggle, animate and submit before (and without) hydration. Tab + Space to use the keyboard."
      >
        <Checkbox aria-label="Unselected" />
        <Checkbox aria-label="Checked" defaultChecked />
        <Checkbox aria-label="Indeterminate" indeterminate />
        <Checkbox aria-label="Error" error />
        <Checkbox aria-label="Checked, error" error defaultChecked />
        <Checkbox aria-label="Disabled" disabled />
        <Checkbox aria-label="Checked, disabled" disabled defaultChecked />
        <Checkbox aria-label="Indeterminate, disabled" disabled indeterminate />
      </Section>

      <Section
        title="Checkbox — labels & forms"
        hint="label wraps the box in a <label> row; supportingText is wired to aria-describedby; a required box left unchecked turns error by itself (:user-invalid)."
      >
        <form className="flex flex-col">
          <Checkbox
            name="updates"
            label="Send me product updates"
            defaultChecked
          />
          <Checkbox
            name="analytics"
            label="Share usage analytics"
            supportingText="Anonymous crash reports and feature usage."
          />
          <Checkbox
            name="terms"
            required
            label="I agree to the terms"
            supportingText="Required."
          />
          <Checkbox color="tertiary" label="Tertiary color" defaultChecked />
          <Button
            type="submit"
            variant="tonal"
            size="xs"
            className="mt-2 self-start"
          >
            Validate
          </Button>
        </form>
      </Section>

      <Section
        title="Checkbox — parent & children"
        hint="APG tri-state: the parent reflects its children and toggles them all (a client island)."
      >
        <CheckboxParentChild />
      </Section>

      {/* Radio — the shell renders on the server; only the input is an island */}
      <Section
        title="Radio — states"
        hint="Native inputs under an MD3 skin. Each pair shares a name. Click to see the dot spring open on M3 Expressive's fast-spatial spring."
      >
        <Radio name="s-enabled" aria-label="Unselected" />
        <Radio name="s-enabled" aria-label="Selected" defaultChecked />
        <Radio name="s-error" aria-label="Unselected, error" error />
        <Radio
          name="s-error"
          aria-label="Selected, error"
          error
          defaultChecked
        />
        <Radio name="s-disabled" aria-label="Unselected, disabled" disabled />
        <Radio
          name="s-disabled"
          aria-label="Selected, disabled"
          disabled
          defaultChecked
        />
        <Radio name="s-tertiary" aria-label="Tertiary" color="tertiary" />
        <Radio
          name="s-tertiary"
          aria-label="Tertiary, selected"
          color="tertiary"
          defaultChecked
        />
      </Section>

      <Section
        title="Radio — group & form"
        hint="RadioGroup is a <fieldset role=radiogroup>. Uncontrolled and required here, rendered from this Server Component: Tab in, arrows move and select (wrapping); submitting empty turns it error (:user-invalid)."
      >
        <form className="gap-2 flex basis-full flex-col items-start">
          <RadioGroup
            name="contact"
            label="Preferred contact method"
            required
            supportingText="Required — pick one."
          >
            <Radio value="email" label="Email" />
            <Radio value="phone" label="Phone" />
            <Radio
              value="sms"
              label="Text message"
              supportingText="Carrier rates may apply."
            />
          </RadioGroup>
          <Button type="submit" variant="tonal" size="xs">
            Validate
          </Button>
        </form>
        <RadioGroup
          label="Download quality"
          defaultValue="high"
          labelPosition="start"
          className="max-w-sm w-full"
        >
          <Radio value="high" label="High" className="w-full justify-between" />
          <Radio
            value="saver"
            label="Data saver"
            className="w-full justify-between"
          />
        </RadioGroup>
      </Section>

      <Section
        title="Radio — controlled"
        hint="value + onValueChange in a client island."
      >
        <RadioControlled />
      </Section>

      {/* Switch — the shell renders on the server; Enter/drag are an island */}
      <Section
        title="Switch — states"
        hint="Native <input role=switch> under an MD3 Expressive skin: these toggle and spring on M3 Expressive's fast-spatial spring before (and without) hydration. Press and hold to see the 28dp pressed handle; drag it after hydration."
      >
        <Switch aria-label="Off" />
        <Switch aria-label="On" defaultChecked />
        <Switch aria-label="Icon on selected, off" icons="selected" />
        <Switch
          aria-label="Icon on selected, on"
          icons="selected"
          defaultChecked
        />
        <Switch aria-label="Icons, off" icons />
        <Switch aria-label="Icons, on" icons defaultChecked />
        <Switch aria-label="Disabled, off" disabled />
        <Switch aria-label="Disabled, on" disabled defaultChecked icons />
        <Switch aria-label="Tertiary" color="tertiary" defaultChecked />
      </Section>

      <Section
        title="Switch — settings & forms"
        hint="label sits before the switch by default (MD3 settings rows) and toggles it; supportingText is wired to aria-describedby; name/value submit like a checkbox, and Enter toggles instead of submitting."
      >
        <form className="max-w-sm flex w-full flex-col">
          <Switch
            name="wifi"
            label="Wi-Fi"
            defaultChecked
            className="w-full justify-between"
          />
          <Switch
            name="bluetooth"
            label="Bluetooth"
            supportingText="Visible to nearby devices while settings are open."
            className="w-full justify-between"
          />
          <Switch
            name="airplane"
            label="Airplane mode"
            icons="selected"
            className="w-full justify-between"
          />
          <Switch
            name="hotspot"
            label="Hotspot"
            supportingText="Not available on this plan."
            disabled
            className="w-full justify-between"
          />
        </form>
      </Section>

      <Section
        title="Switch — controlled"
        hint="checked + onCheckedChange (with custom icons) in a client island."
      >
        <SwitchControlled />
      </Section>

      {/* MD3 card — the three variants (server-rendered containers) */}
      <Section
        title="Card — variants"
        hint="Elevated · filled · outlined. Non-actionable containers: no hover, no ripple; their buttons are the tab stops."
      >
        <div className="gap-4 grid w-full grid-cols-[repeat(auto-fill,minmax(13rem,1fr))]">
          {(["elevated", "filled", "outlined"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <CardMedia className="aspect-video">
                <Art />
              </CardMedia>
              <CardContent>
                <CardHeadline className="capitalize">{variant}</CardHeadline>
                <CardSubhead>Subhead</CardSubhead>
                <CardSupportingText maxLines={2}>
                  Cards display content and actions about a single subject.
                </CardSupportingText>
              </CardContent>
              <CardActions>
                <Button variant="text">Share</Button>
                <Button variant="tonal">Open</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Card — clickable (stretched primary action)"
        hint="The headline is a real link stretched over the card: one target, hover + ripple + focus ring on the card, and the heart stays its own button."
      >
        <div className="gap-4 grid w-full grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
          {(["elevated", "filled", "outlined"] as const).map((variant, i) => (
            <Card key={variant} variant={variant}>
              <CardMedia className="aspect-[16/10]">
                <Art
                  tone={(["primary", "secondary", "tertiary"] as const)[i]}
                />
              </CardMedia>
              <CardHeader
                trailing={
                  <IconButton aria-label="Favorite">
                    <FavoriteOutlined />
                  </IconButton>
                }
              >
                <CardHeadline>
                  <CardPrimaryAction href={`#card-${variant}`}>
                    Alpine lakes
                  </CardPrimaryAction>
                </CardHeadline>
                <CardSubhead>{variant}</CardSubhead>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Card — header, horizontal, Expressive shape"
        hint="Avatar + overflow header, a horizontal card, and the extra-large-increased corner with optically-round inset media."
      >
        <div className="gap-4 sm:grid-cols-2 grid w-full">
          <Card variant="outlined">
            <CardHeader
              leading={
                <span className="size-10 flex items-center justify-center rounded-full bg-primary text-on-primary">
                  A
                </span>
              }
              trailing={
                <IconButton aria-label="More options">
                  <MoreVertRounded />
                </IconButton>
              }
            >
              <CardHeadline>Ana Souza</CardHeadline>
              <CardSubhead>2 days ago</CardSubhead>
            </CardHeader>
            <CardSupportingText>
              Back from the lakes — the water really is that color.
            </CardSupportingText>
          </Card>
          <Card variant="filled" shape="extra-large-increased">
            <CardMedia inset className="aspect-[2/1]">
              <Art tone="tertiary" />
            </CardMedia>
            <CardHeadline size="large">Hero moment</CardHeadline>
          </Card>
          <Card
            variant="elevated"
            orientation="horizontal"
            className="sm:col-span-2"
          >
            <CardMedia className="w-32">
              <Art tone="secondary" />
            </CardMedia>
            <CardContent>
              <CardHeadline>Weekend in Lisbon</CardHeadline>
              <CardSubhead>3 nights · from $420</CardSubhead>
              <CardSupportingText maxLines={2}>
                Tram 28, pastéis de nata and sunsets over the Tagus — a long
                weekend that never stops climbing.
              </CardSupportingText>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Card — selectable, zero JS"
        hint="Each card is a <label> around a visually-hidden radio: works before hydration, submits with a form, arrow keys move the choice."
      >
        <fieldset className="gap-3 m-0 p-0 sm:grid-cols-3 grid w-full border-0">
          <legend className="sr-only">Plan</legend>
          {[
            ["Basic", "$4 / month"],
            ["Plus", "$9 / month"],
            ["Pro", "$19 / month"],
          ].map(([name, price], i) => (
            <Card key={name} asChild variant="outlined" checkIcon>
              <label>
                <input
                  type="radio"
                  name="plan"
                  value={name}
                  defaultChecked={i === 1}
                  className="sr-only"
                />
                <CardHeadline asChild>
                  <span>{name}</span>
                </CardHeadline>
                <CardSubhead asChild>
                  <span>{price}</span>
                </CardSubhead>
              </label>
            </Card>
          ))}
        </fieldset>
      </Section>

      <Section
        title="Card — toggle selection"
        hint="selected on <button> cards (aria-pressed) in a client island."
      >
        <CardToggleGroup />
      </Section>

      <Section
        title="Card — states"
        hint="Dragged (picked up), selected, disabled — per variant."
      >
        <div className="gap-3 grid w-full grid-cols-3">
          {(["elevated", "filled", "outlined"] as const).flatMap((variant) =>
            (
              [
                ["Dragged", { dragged: true }],
                ["Selected", { selected: true }],
                ["Disabled", { disabled: true }],
              ] as const
            ).map(([label, state]) => (
              <Card key={variant + label} asChild variant={variant} {...state}>
                <button type="button">
                  <CardHeadline asChild size="small">
                    <span>{label}</span>
                  </CardHeadline>
                  <CardSubhead asChild>
                    <span>{variant}</span>
                  </CardSubhead>
                </button>
              </Card>
            )),
          )}
        </div>
      </Section>

      {/* @chatool/ui/tooltip — used straight from this Server Component */}
      <Section
        title="Tooltip — plain"
        hint="Hover (500ms, then instant along the row), Tab, or long-press on touch. Lingers 1.5s; Escape dismisses."
      >
        {(
          [
            ["Undo", UndoOutlined],
            ["Redo", RedoOutlined],
            ["Copy", ContentCopyOutlined],
            ["Delete", DeleteOutlined],
          ] as const
        ).map(([label, Icon]) => (
          <Tooltip key={label} content={label} relationship="label">
            <IconButton>
              <Icon />
            </IconButton>
          </Tooltip>
        ))}
        <Tooltip
          caret
          content="Grant value is calculated using the closing stock price from the day before the grant date."
        >
          <IconButton aria-label="About grant value">
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      </Section>

      <Section
        title="Tooltip — rich"
        hint="Subhead, supporting text and up to two actions. Tab moves into the actions."
      >
        <Tooltip
          title="Paint tool"
          content="Add annotations and highlights with the paint tool."
          actions={<TooltipAction>Learn more</TooltipAction>}
        >
          <Button variant="tonal">Rich tooltip</Button>
        </Tooltip>
        <Tooltip
          persistent
          align="center"
          title="Offline access"
          content="Keep this folder on your device so you can open it without a connection."
          actions={
            <>
              <TooltipAction>Turn on</TooltipAction>
              <TooltipAction>Not now</TooltipAction>
            </>
          }
        >
          <Button variant="outlined" startIcon={<BookmarkOutlined />}>
            Persistent (click)
          </Button>
        </Tooltip>
      </Section>

      <Section
        title="Tooltip — provider + controlled"
        hint="TooltipProvider sets app-wide timing (here: no delay, no linger). onOpenChange reports why."
      >
        <TooltipProvider showDelay={0} hideDelay={0}>
          <Tooltip content="Snappy" relationship="label">
            <IconButton variant="tonal">
              <UndoOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip content="Also snappy" relationship="label">
            <IconButton variant="tonal">
              <RedoOutlined />
            </IconButton>
          </Tooltip>
        </TooltipProvider>
        <TooltipControlled />
      </Section>

      {/* Text field */}
      <Section
        title="Text field — filled & outlined"
        hint="Server-rendered. Click in: the label floats on the Expressive spring, the indicator / outline thickens. Uncontrolled fields float and validate before hydration."
      >
        <TextField label="Filled" supportingText="Supporting text" />
        <TextField variant="outlined" label="Outlined" defaultValue="Input" />
        <TextField
          label="Email"
          type="email"
          leadingIcon={<MailOutlined />}
          error
          defaultValue="ada@"
          errorText="Enter a valid email address"
        />
        <TextField
          variant="outlined"
          label="Disabled"
          defaultValue="Can't touch this"
          disabled
        />
      </Section>

      <Section
        title="Text field — affixes, counter, clear, password, multiline"
        hint="Prefix/suffix show with the floated label; the counter, clear button and password toggle are the field's one client island."
      >
        <TextField label="Price" prefix="$" suffix="USD" inputMode="decimal" />
        <TextField
          variant="outlined"
          label="Display name"
          maxLength={20}
          clearable
          defaultValue="Ada Lovelace"
        />
        <TextField variant="outlined" label="Password" type="password" />
        <TextField
          multiline
          label="Message"
          maxRows={5}
          supportingText="Grows up to 5 lines"
        />
        <TextField
          label="Label above"
          labelPosition="above"
          placeholder="Placeholder"
          density="-2"
        />
      </Section>

      <Section
        title="Text field — client demos"
        hint="Controlled value + state-driven error, a live search, and a native-validation form."
      >
        <TextFieldControlled />
        <TextFieldSearch />
        <TextFieldSignIn />
      </Section>

      {/* MD3 chips — Server-rendered shells; only the actions hydrate */}
      <Section
        title="Chips — assist, filter, input, suggestion"
        hint="Rendered on the server. Press a chip: the 12dp corners tighten to 8dp (M3 Expressive); selected filter chips are pills with a checkmark."
      >
        <ChipSet aria-label="Chip variants">
          <Chip icon={<CalendarTodayOutlined />}>Add to calendar</Chip>
          <Chip elevated icon={<LocationOnOutlined />}>
            Directions
          </Chip>
          <Chip variant="filter" defaultSelected>
            Selected filter
          </Chip>
          <Chip variant="filter" icon={<StarOutlined />}>
            Top rated
          </Chip>
          <Chip variant="input" removeOnly>
            Remove only
          </Chip>
          <Chip variant="suggestion">Sounds good!</Chip>
          <Chip disabled>Disabled</Chip>
          <Chip loading>Saving…</Chip>
          <Chip href="https://m3.material.io/components/chips">Link chip</Chip>
        </ChipSet>
      </Section>

      <Section
        title="Chips — client demos"
        hint="A controlled multi-select filter set and removable input chips (Backspace / Delete removes the focused chip)."
      >
        <ChipFilterSet />
        <ChipInputSet />
      </Section>

      {/* @chatool/icons */}
      <Section title="@chatool/icons">
        <ChatOutlined className="size-8" />
        <KeyboardArrowDownOutlined className="size-8 text-on-surface-variant" />
        <ProgressActivityOutlined className="size-8 animate-spin text-primary" />
      </Section>

      {/* @chatool/utils — cn() composing conditional classes */}
      <Section title="@chatool/utils — cn()">
        <span
          className={cn(
            "px-3 py-1 text-sm rounded-md",
            true && "bg-secondary-container text-on-secondary-container",
            false && "hidden",
          )}
        >
          Built with cn()
        </span>
      </Section>
    </main>
  );
}
