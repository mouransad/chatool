import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import TextField from "@chatool/ui/text-field";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import SearchOutlined from "@chatool/icons/SearchOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";
import PersonOutlined from "@chatool/icons/PersonOutlined";
import LockOutlined from "@chatool/icons/LockOutlined";
import MicOutlined from "@chatool/icons/MicOutlined";
import CalendarTodayOutlined from "@chatool/icons/CalendarTodayOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import CheckCircleOutlined from "@chatool/icons/CheckCircleOutlined";

const meta = {
  title: "UI/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    label: "Label",
    supportingText: "Supporting text",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["filled", "outlined"] },
    label: { control: "text" },
    labelPosition: { control: "inline-radio", options: ["attached", "above"] },
    alwaysFloatLabel: { control: "boolean" },
    placeholder: { control: "text" },
    supportingText: { control: "text" },
    supportingTextOnFocus: { control: "boolean" },
    error: { control: "select", options: [undefined, true, false] },
    errorText: { control: "text" },
    prefix: { control: "text" },
    suffix: { control: "text" },
    clearable: { control: "boolean" },
    counter: { control: "boolean" },
    maxLength: { control: "number" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    density: {
      control: "inline-radio",
      options: ["0", "-1", "-2", "-3", "-4"],
    },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"],
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    leadingIcon: { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
    errorIcon: { table: { disable: true } },
    clearIcon: { table: { disable: true } },
    classNames: { table: { disable: true } },
    labels: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-6 flex flex-wrap items-start">{children}</div>
);

const Column = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-4 flex flex-col">{children}</div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="text-label-medium text-on-surface-variant">{children}</span>
);

/**
 * Every control. Click in, type, Tab away: the label floats on the
 * Expressive fast-spatial spring (it really resizes, as Compose does), the
 * indicator / outline thickens, colors fade on the effects springs.
 */
export const Playground: Story = {};

/**
 * MD3's two styles. Both have the same function — pick by emphasis (outlined
 * suits dense forms) and don't mix them in one region.
 */
export const Variants: Story = {
  render: () => (
    <Stack>
      <Column>
        <Caption>Filled</Caption>
        <TextField label="Empty" />
        <TextField label="Populated" defaultValue="Input text" />
      </Column>
      <Column>
        <Caption>Outlined</Caption>
        <TextField variant="outlined" label="Empty" />
        <TextField
          variant="outlined"
          label="Populated"
          defaultValue="Input text"
        />
      </Column>
    </Stack>
  ),
};

/**
 * The MD3 state matrix. Hover a field (filled gets the 8% state layer and an
 * `on-surface` indicator), focus it (2dp accent), hover an unfocused error
 * field (`on-error-container`). Disabled fields don't animate.
 */
export const States: Story = {
  render: () => (
    <div className="gap-x-6 gap-y-6 grid grid-cols-[repeat(2,minmax(0,17.5rem))]">
      {(["filled", "outlined"] as const).map((variant) => (
        <Column key={variant}>
          <Caption>{variant}</Caption>
          <TextField
            variant={variant}
            label="Enabled"
            supportingText="Supporting text"
          />
          <TextField
            variant={variant}
            label="Error"
            defaultValue="Input text"
            error
            errorText="Error message"
          />
          <TextField
            variant={variant}
            label="Disabled"
            defaultValue="Input text"
            supportingText="Supporting text"
            disabled
          />
          <TextField
            variant={variant}
            label="Read-only"
            defaultValue="Can't edit me"
            supportingText="Read-only fields look like editable ones"
            readOnly
          />
        </Column>
      ))}
    </div>
  ),
};

/**
 * Leading / trailing icons sit in 48dp targets 12dp from the edge, 16dp from
 * the text. A trailing **icon button** (dropdown, voice) carries its own name.
 */
export const Icons: Story = {
  render: () => (
    <Stack>
      <Column>
        <TextField label="Search" leadingIcon={<SearchOutlined />} />
        <TextField
          label="Email"
          type="email"
          leadingIcon={<MailOutlined />}
          trailingIcon={<CheckCircleOutlined />}
          defaultValue="ada@example.com"
        />
        <TextField
          label="Message"
          trailingIcon={
            <IconButton aria-label="Voice input">
              <MicOutlined />
            </IconButton>
          }
        />
      </Column>
      <Column>
        <TextField
          variant="outlined"
          label="Search"
          leadingIcon={<SearchOutlined />}
        />
        <TextField
          variant="outlined"
          label="Username"
          leadingIcon={<PersonOutlined />}
          defaultValue="ada"
        />
        <TextField
          variant="outlined"
          label="Country"
          trailingIcon={
            <IconButton aria-label="Open country list">
              <KeyboardArrowDownOutlined />
            </IconButton>
          }
        />
      </Column>
    </Stack>
  ),
};

/**
 * Prefix / suffix text appears with the floated label. Give symbols a spoken
 * form — they're added to the input's description.
 */
export const PrefixAndSuffix: Story = {
  render: () => (
    <Stack>
      <TextField
        label="Amount"
        type="number"
        inputMode="decimal"
        prefix={
          <>
            <span aria-hidden>$</span>
            <span className="sr-only">US dollars</span>
          </>
        }
        suffix="USD"
      />
      <TextField
        variant="outlined"
        label="Weight"
        suffix="kg"
        defaultValue="72"
      />
      <TextField
        variant="outlined"
        label="Email"
        suffix="@gmail.com"
        alwaysFloatLabel
      />
    </Stack>
  ),
};

/**
 * Supporting text vs error text: the error **replaces** the supporting text
 * (MD3: swap, don't stack) and the built-in error icon appears. Native
 * validation drives it too — type a bad email and Tab away (`:user-invalid`).
 */
export const SupportingAndErrorText: Story = {
  render: () => (
    <Stack>
      <Column>
        <TextField
          label="Username"
          supportingText="Letters and numbers only"
          errorText="Username already taken"
          error
          defaultValue="ada"
        />
        <TextField
          label="Email"
          type="email"
          required
          supportingText="Type something invalid, then Tab away"
          errorText="Enter a valid email address"
        />
        <TextField
          label="Hint on focus"
          supportingText="Shown only while focused"
          supportingTextOnFocus
        />
      </Column>
      <Column>
        <TextField
          variant="outlined"
          label="Username"
          supportingText="Letters and numbers only"
          errorText="Username already taken"
          error
          defaultValue="ada"
        />
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          required
          supportingText="Type something invalid, then Tab away"
          errorText="Enter a valid email address"
        />
        <TextField
          variant="outlined"
          label="No error icon"
          error
          errorIcon={false}
          errorText="Error text, no icon"
        />
      </Column>
    </Stack>
  ),
};

/** `required` adds MD3's asterisk to the label (and the native `required`). */
export const Required: Story = {
  render: () => (
    <Column>
      <span className="text-body-small text-on-surface-variant">
        * indicates a required field
      </span>
      <Stack>
        <TextField label="First name" required />
        <TextField variant="outlined" label="Last name" required />
        <TextField label="Nickname" required requiredIndicator=" (required)" />
      </Stack>
    </Column>
  ),
};

/**
 * The MD3 character counter: automatic with `maxLength`, spoken as "n of max
 * characters". It updates live for uncontrolled fields too.
 */
export const CharacterCounter: Story = {
  render: () => (
    <Stack>
      <TextField
        label="Display name"
        maxLength={20}
        supportingText="Shown on your profile"
        defaultValue="Ada"
      />
      <TextField variant="outlined" label="Bio" maxLength={60} />
      <TextField variant="outlined" label="Tag" counter />
    </Stack>
  ),
};

/**
 * `clearable` adds MD3's clear icon, shown only while there's text. Press
 * Escape in the field to clear it too.
 */
export const Clearable: Story = {
  render: () => (
    <Stack>
      <TextField
        label="Search"
        leadingIcon={<SearchOutlined />}
        clearable
        defaultValue="Material 3"
      />
      <TextField
        variant="outlined"
        label="Search"
        leadingIcon={<SearchOutlined />}
        clearable
        defaultValue="Expressive"
      />
    </Stack>
  ),
};

/**
 * `type="password"` gets a show / hide toggle ("Show password" / "Hide
 * password"); it hides the password again when the form submits.
 */
export const Password: Story = {
  render: () => (
    <Stack>
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        leadingIcon={<LockOutlined />}
        supportingText="At least 8 characters"
        minLength={8}
        required
      />
      <TextField
        variant="outlined"
        label="Password"
        type="password"
        defaultValue="hunter22"
      />
    </Stack>
  ),
};

/**
 * MD3's multi-line field grows with its content (`minRows` / `maxRows`); a
 * **text area** (`rows`) keeps a fixed height and scrolls — MD3 prefers text
 * areas on the web.
 */
export const Multiline: Story = {
  render: () => (
    <Stack>
      <TextField
        multiline
        label="Multi-line"
        maxRows={6}
        supportingText="Grows up to 6 lines"
      />
      <TextField
        multiline
        variant="outlined"
        label="Text area"
        rows={4}
        maxLength={280}
      />
      <TextField
        multiline
        variant="outlined"
        label="Starts at 3 lines"
        minRows={3}
        defaultValue={"Line one\nLine two"}
      />
    </Stack>
  ),
};

/**
 * `labelPosition="above"` (Compose's `TextFieldLabelPosition.Above`) keeps the
 * label above the container; `alwaysFloatLabel` keeps an inside label up so a
 * placeholder can show. Without a label, name the field with `aria-label`.
 */
export const LabelPlacement: Story = {
  render: () => (
    <Stack>
      <TextField
        label="Label above"
        labelPosition="above"
        placeholder="Placeholder"
      />
      <TextField
        variant="outlined"
        label="Label above"
        labelPosition="above"
        placeholder="Placeholder"
      />
      <TextField
        label="Always floated"
        alwaysFloatLabel
        placeholder="name@example.com"
      />
      <TextField
        variant="outlined"
        aria-label="Search"
        placeholder="Search (no label)"
        leadingIcon={<SearchOutlined />}
      />
    </Stack>
  ),
};

/** Date and time inputs always float their label over the native template. */
export const DateAndTime: Story = {
  render: () => (
    <Stack>
      <TextField
        label="Date"
        type="date"
        leadingIcon={<CalendarTodayOutlined />}
      />
      <TextField variant="outlined" label="Time" type="time" />
    </Stack>
  ),
};

/**
 * MD3 density: 4dp less per step (56 → 40dp). Offer it as a user choice, not
 * a default.
 */
export const Density: Story = {
  render: () => (
    <Stack>
      {(["0", "-1", "-2", "-3", "-4"] as const).map((density) => (
        <Column key={density}>
          <TextField density={density} label={`Density ${density}`} />
          <TextField
            density={density}
            variant="outlined"
            label={`Density ${density}`}
            defaultValue="Text"
          />
        </Column>
      ))}
    </Stack>
  ),
};

/** The focus accent: MD3 specifies `primary`; `secondary` / `tertiary` too. */
export const Colors: Story = {
  render: () => (
    <Stack>
      {(["primary", "secondary", "tertiary"] as const).map((color) => (
        <Column key={color}>
          <TextField color={color} label={color} alwaysFloatLabel />
          <TextField
            color={color}
            variant="outlined"
            label={color}
            alwaysFloatLabel
          />
        </Column>
      ))}
    </Stack>
  ),
};

/**
 * Re-theme with `--md-comp-text-field-*` tokens (or the global `--md-sys-*`
 * roles): here a pill-shaped outlined search field, a `surface-container`
 * filled field with a rounded bottom, and wider spacing.
 */
export const Customization: Story = {
  render: () => (
    <Stack>
      <TextField
        variant="outlined"
        aria-label="Search"
        placeholder="Search messages"
        leadingIcon={<SearchOutlined />}
        clearable
        className="[--md-comp-text-field-container-shape:var(--md-sys-shape-corner-full)]"
      />
      <TextField
        label="Pill with label"
        variant="outlined"
        className="[--md-comp-text-field-container-shape:1.75rem]"
      />
      <TextField
        label="Custom filled"
        className="[--md-comp-text-field-active-indicator-color:transparent] [--md-comp-text-field-container-color:var(--md-sys-color-surface-container)]"
        classNames={{ container: "rounded-lg" }}
      />
      <TextField
        label="Roomy"
        className="w-96 [--md-comp-text-field-leading-space:1.5rem] [--md-comp-text-field-trailing-space:1.5rem]"
      />
    </Stack>
  ),
};

const ControlledDemo = () => {
  const [value, setValue] = useState("");
  const tooLong = value.length > 12;
  return (
    <Column>
      <TextField
        label="Controlled"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        clearable
        counter
        error={tooLong}
        supportingText="Up to 12 characters (soft limit)"
        errorText={`${value.length - 12} too many`}
      />
      <span className="text-body-small text-on-surface-variant">
        value: “{value}”
      </span>
    </Column>
  );
};

/**
 * Controlled usage: `value` + `onChange` as usual. The clear button and
 * Escape fire `onChange`; here `error` is driven by state (a soft limit).
 */
export const Controlled: Story = { render: () => <ControlledDemo /> };

const FormDemo = () => {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      className="gap-4 max-w-sm flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(
          JSON.stringify(
            Object.fromEntries(new FormData(event.currentTarget)),
            null,
            2,
          ),
        );
      }}
    >
      <TextField
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        errorText="Enter a valid email address"
        className="w-full"
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        minLength={8}
        required
        supportingText="At least 8 characters"
        errorText="Use 8 characters or more"
        className="w-full"
      />
      <div className="gap-2 flex">
        <Button type="submit">Sign in</Button>
        <Button type="reset" variant="text">
          Reset
        </Button>
      </div>
      {submitted && (
        <pre className="p-3 rounded-md bg-surface-container text-body-small">
          {submitted}
        </pre>
      )}
    </form>
  );
};

/**
 * A real `<form>` with **native** validation: submit empty or with a bad
 * email and the fields turn to their error state (`:user-invalid`), swapping
 * in `errorText` — no state, no JS validation.
 */
export const NativeFormValidation: Story = { render: () => <FormDemo /> };

const UpperCaseInput = (props: React.ComponentProps<"input">) => (
  <input
    {...props}
    onInput={(event) => {
      const input = event.currentTarget;
      input.value = input.value.toUpperCase();
    }}
  />
);

/**
 * `asChild` renders your own control as the field (a masked / formatted
 * input, an autocomplete's input). It receives the classes, `id`,
 * `placeholder` and `aria-*`.
 */
export const AsChild: Story = {
  render: () => (
    <TextField
      asChild
      label="Promo code"
      supportingText="Upper-cased as you type"
    >
      <UpperCaseInput />
    </TextField>
  ),
};

/** Logical layout: icons, prefix / suffix, label and notch mirror in RTL. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Stack>
        <TextField
          label="جستجو"
          leadingIcon={<SearchOutlined />}
          clearable
          defaultValue="متریال"
        />
        <TextField
          variant="outlined"
          label="مبلغ"
          suffix="تومان"
          supportingText="متن راهنما"
          maxLength={10}
        />
      </Stack>
    </div>
  ),
};
