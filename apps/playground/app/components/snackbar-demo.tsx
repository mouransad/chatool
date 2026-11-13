"use client";

import { useState } from "react";
import Button from "@chatool/ui/button";
import Snackbar, {
  SnackbarHost,
  createSnackbarQueue,
  snackbar,
  type SnackbarCloseReason,
} from "@chatool/ui/snackbar";

/**
 * The global API: `snackbar()` from event handlers, shown by the one
 * `<SnackbarHost />` in `app/layout.tsx`. Results come back as a promise.
 */
export function SnackbarGlobal() {
  const [result, setResult] = useState<SnackbarCloseReason | "—">("—");
  const [saved, setSaved] = useState(false);

  return (
    <div className="gap-3 flex flex-col">
      <div className="gap-3 flex flex-wrap items-center">
        <Button
          variant={saved ? "tonal" : "filled"}
          onClick={() => {
            // MD3 web guidance: say it inline too ("Save" → "Saved").
            setSaved(true);
            snackbar("Draft saved");
          }}
        >
          {saved ? "Saved" : "Save"}
        </Button>
        <Button
          variant="tonal"
          onClick={async () => {
            const { result } = snackbar({
              message: "Conversation archived",
              action: "Undo",
            });
            setResult(await result);
          }}
        >
          Archive (with Undo)
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            snackbar.promise(
              new Promise((resolve) => setTimeout(resolve, 1500)),
              {
                loading: "Uploading photo…",
                success: "Photo uploaded",
                error: "Upload failed",
              },
            )
          }
        >
          Upload (promise)
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            snackbar({
              message:
                "Can't send this message right now. Check your connection and try again.",
              action: "Retry",
              politeness: "assertive",
              replace: true,
            })
          }
        >
          Error (long action text wraps)
        </Button>
        <Button variant="text" onClick={() => snackbar.clear()}>
          Clear
        </Button>
      </div>
      <p className="text-body-small text-on-surface-variant">
        Alt+G jumps to the snackbar · Escape dismisses it · swipe it away · last
        result: {result}
      </p>
    </div>
  );
}

/** A scoped queue in a `contained` host: snackbars stay inside the pane. */
export function SnackbarContained() {
  const [queue] = useState(() => createSnackbarQueue({ strategy: "replace" }));
  return (
    <div className="h-48 max-w-lg p-4 relative w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
      <Button
        variant="tonal"
        onClick={() =>
          queue.show({ message: "Filter applied", action: "Reset" })
        }
      >
        Apply filter
      </Button>
      <SnackbarHost queue={queue} contained label="Pane notifications" />
    </div>
  );
}

/** The surface alone, as Compose's `Snackbar(…)`. */
export function SnackbarSurfaces() {
  return (
    <div className="max-w-xl gap-3 flex w-full flex-col">
      <Snackbar>Single-line snackbar</Snackbar>
      <Snackbar action="Undo">Message archived</Snackbar>
      <Snackbar action="Action" withDismissAction>
        Single-line snackbar with action and close affordance
      </Snackbar>
      <Snackbar action="Longer action" actionOnNewLine>
        Two-line snackbar with a longer action, which moves to its own line
        under the text.
      </Snackbar>
    </div>
  );
}
