"use client";

import { useState } from "react";
import Button from "@chatool/ui/button";

/**
 * Client island demoing the APG / HTML `type` rule: a `<Button>` defaults to
 * `type="button"`, so it does **not** submit the surrounding form; only the
 * explicit `type="submit"` button does. The submit is caught with `preventDefault`
 * so the playground doesn't reload.
 */
export function FormDemo() {
  const [submits, setSubmits] = useState(0);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmits((n) => n + 1);
      }}
      className="gap-3 flex flex-wrap items-center"
    >
      <Button variant="tonal">Default (type=button)</Button>
      <Button type="submit">Submit (type=submit)</Button>
      <span className="text-body-medium text-on-surface-variant">
        submitted {submits}×
      </span>
    </form>
  );
}
