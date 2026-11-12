"use client";

import { useState } from "react";
import TextField from "@chatool/ui/text-field";
import Button from "@chatool/ui/button";
import SearchOutlined from "@chatool/icons/SearchOutlined";

/**
 * Controlled usage: `value` + `onChange`, with `error` driven by state. The
 * clear button / Escape call `onChange` like typing does.
 */
export function TextFieldControlled() {
  const [handle, setHandle] = useState("");
  const invalid = handle.length > 0 && !/^[a-z0-9_]+$/.test(handle);

  return (
    <TextField
      variant="outlined"
      label="Handle"
      prefix="@"
      value={handle}
      onChange={(event) => setHandle(event.target.value)}
      maxLength={15}
      clearable
      error={invalid}
      supportingText="Lowercase letters, numbers and _"
      errorText="Only a–z, 0–9 and _ are allowed"
    />
  );
}

/** A search field whose results react to every keystroke (and to clearing). */
export function TextFieldSearch() {
  const [query, setQuery] = useState("");
  const fruits = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry"];
  const matches = fruits.filter((fruit) =>
    fruit.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="gap-2 flex flex-col">
      <TextField
        type="search"
        aria-label="Search fruit"
        placeholder="Search fruit"
        leadingIcon={<SearchOutlined />}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        clearable
        className="[--md-comp-text-field-active-indicator-color:transparent] [--md-comp-text-field-container-shape:var(--md-sys-shape-corner-full)]"
      />
      <span className="text-body-small text-on-surface-variant">
        {matches.join(" · ") || "No matches"}
      </span>
    </div>
  );
}

/**
 * A native `<form>`: `required` / `type="email"` / `minLength` validation
 * shows MD3 error states via `:user-invalid` — no validation code.
 */
export function TextFieldSignIn() {
  const [result, setResult] = useState<string | null>(null);

  return (
    <form
      className="gap-3 max-w-sm flex w-full flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`Signed in as ${String(data.get("email"))}`);
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
      <Button type="submit" className="self-start">
        Sign in
      </Button>
      {result && <p className="text-body-medium text-primary">{result}</p>}
    </form>
  );
}
