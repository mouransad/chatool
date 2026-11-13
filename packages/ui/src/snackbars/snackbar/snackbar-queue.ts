import type * as React from "react";

import {
  type SnackbarCloseReason,
  type SnackbarData,
  type SnackbarFunction,
  type SnackbarHandle,
  type SnackbarOptions,
  type SnackbarQueue,
  type SnackbarQueueState,
  type SnackbarStrategy,
} from "./snackbar.types";

/*
 * A framework-free snackbar queue: Compose's `SnackbarHostState` (one at a
 * time, `showSnackbar` resolves to the result) plus MDC-Android's
 * `SnackbarManager` (update in place, replace the current one). React reads
 * it through `useSyncExternalStore`; snapshots are immutable, so a render
 * only happens when something actually changed.
 */

type Patch = Partial<Omit<SnackbarOptions, "id">>;

interface Entry {
  data: SnackbarData;
  resolve: (reason: SnackbarCloseReason) => void;
  settled: boolean;
}

let counter = 0;
const nextId = () => `snackbar-${(counter += 1)}`;
let keyCounter = 0;
const nextKey = () => `k${(keyCounter += 1)}`;

const isOptions = (value: unknown): value is SnackbarOptions =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "message" in value &&
  !("$$typeof" in value);

const activeElement = (): HTMLElement | null => {
  if (typeof document === "undefined") return null;
  let element = document.activeElement;
  // Look through open shadow roots for the real focus.
  while (element?.shadowRoot?.activeElement) {
    element = element.shadowRoot.activeElement;
  }
  return element instanceof HTMLElement && element !== document.body
    ? element
    : null;
};

/** Creates an independent queue for a scoped `SnackbarHost`. */
export const createSnackbarQueue = (
  options: { strategy?: SnackbarStrategy } = {},
): SnackbarQueue => {
  let strategy: SnackbarStrategy = options.strategy ?? "queue";
  let current: Entry | null = null;
  let pending: Entry[] = [];
  let snapshot: SnackbarQueueState = { current: null, pending: [] };
  const listeners = new Set<() => void>();

  const emit = () => {
    snapshot = {
      current: current?.data ?? null,
      pending: pending.map((entry) => entry.data),
    };
    for (const listener of listeners) listener();
  };

  const find = (id: string) =>
    current?.data.id === id ? current : pending.find((e) => e.data.id === id);

  const settle = (entry: Entry, reason: SnackbarCloseReason) => {
    if (entry.settled) return;
    entry.settled = true;
    entry.resolve(reason);
    try {
      entry.data.onClose?.(reason);
    } catch (error) {
      // A throwing callback must not wedge the queue.
      queueMicrotask(() => {
        throw error;
      });
    }
  };

  const dismiss = (
    id?: string,
    reason: SnackbarCloseReason = "programmatic",
  ) => {
    const entry = id === undefined ? current : find(id);
    if (!entry) return;
    if (entry === current) {
      current = pending.shift() ?? null;
    } else {
      pending = pending.filter((e) => e !== entry);
    }
    settle(entry, reason);
    emit();
  };

  const build = (
    id: string,
    options: Omit<SnackbarOptions, "id">,
    version: number,
    trigger: HTMLElement | null,
    key: string,
  ): SnackbarData => {
    const data: SnackbarData = {
      ...options,
      id,
      key,
      version,
      trigger,
      dismiss: (reason = "dismiss") => dismiss(id, reason),
      performAction: () => dismiss(id, "action"),
    };
    return data;
  };

  const resultOf = new WeakMap<Entry, Promise<SnackbarCloseReason>>();
  const handleFor = (entry: Entry): SnackbarHandle => {
    const { id } = entry.data;
    return {
      id,
      result: resultOf.get(entry) ?? Promise.resolve("programmatic"),
      update: (patch) => update(id, patch),
      dismiss: () => dismiss(id, "programmatic"),
    };
  };

  const update = (id: string, patch: Patch) => {
    const entry = find(id);
    if (!entry) return;
    const { data } = entry;
    entry.data = build(
      id,
      { ...data, ...patch },
      data.version + 1,
      data.trigger,
      data.key,
    );
    emit();
  };

  const show: SnackbarQueue["show"] = (input, extra) => {
    const options: SnackbarOptions = isOptions(input)
      ? { ...input, ...extra }
      : { ...extra, message: input as React.ReactNode };
    const { id: requestedId, ...rest } = options;
    const id = requestedId ?? nextId();

    const existing = find(id);
    if (existing) {
      update(id, rest);
      return handleFor(existing);
    }

    let resolve!: (reason: SnackbarCloseReason) => void;
    const result = new Promise<SnackbarCloseReason>((done) => {
      resolve = done;
    });
    const entry: Entry = {
      data: build(id, rest, 0, activeElement(), nextKey()),
      resolve,
      settled: false,
    };
    resultOf.set(entry, result);

    const replace = rest.replace ?? strategy === "replace";
    if (!current) {
      current = entry;
    } else if (replace) {
      const previous = current;
      current = entry;
      settle(previous, "replaced");
    } else {
      pending = [...pending, entry];
    }
    emit();
    return handleFor(entry);
  };

  const clear = () => {
    const all = [...(current ? [current] : []), ...pending];
    current = null;
    pending = [];
    for (const entry of all) settle(entry, "cleared");
    emit();
  };

  const promise: SnackbarQueue["promise"] = (input, messages, options) => {
    const run = typeof input === "function" ? input() : input;
    const handle = show({
      ...options,
      message: messages.loading,
      duration: "indefinite",
      // A spinner-like "Saving…" message has nothing to dismiss yet.
      withDismissAction: options?.withDismissAction ?? false,
    });
    const settleWith = (message: React.ReactNode) => {
      // Back to the caller's own duration (or the host default) for the
      // outcome; `show` with the same id updates in place if still on screen.
      show({
        ...options,
        id: handle.id,
        message,
        duration: options?.duration,
        withDismissAction: options?.withDismissAction,
      });
    };
    run.then(
      (value) => {
        const { success } = messages;
        settleWith(
          typeof success === "function"
            ? (success as (value: unknown) => React.ReactNode)(value)
            : success,
        );
      },
      (error: unknown) => {
        const { error: failure } = messages;
        settleWith(
          typeof failure === "function"
            ? (failure as (error: unknown) => React.ReactNode)(error)
            : failure,
        );
      },
    );
    return { ...handle, promise: run };
  };

  return {
    show,
    update,
    dismiss,
    clear,
    promise,
    setStrategy: (next) => {
      strategy = next;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
  };
};

const defaultQueue = createSnackbarQueue();

/**
 * Show a snackbar on the default queue, from anywhere in **client** code (an
 * event handler, a mutation callback, a store), React or not:
 *
 * ```ts
 * snackbar("Message sent");
 * const { result } = snackbar({ message: "Archived", action: "Undo" });
 * snackbar.promise(save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" });
 * ```
 *
 * A `<SnackbarHost />` somewhere in the app renders it.
 */
export const snackbar: SnackbarFunction = Object.assign(
  (
    message: React.ReactNode | SnackbarOptions,
    options?: Omit<SnackbarOptions, "message">,
  ) => defaultQueue.show(message, options),
  {
    update: defaultQueue.update,
    dismiss: defaultQueue.dismiss,
    clear: defaultQueue.clear,
    promise: defaultQueue.promise,
    queue: defaultQueue,
  },
);
