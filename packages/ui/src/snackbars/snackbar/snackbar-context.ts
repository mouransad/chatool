"use client";

import { createContext, useContext } from "react";

import { snackbar } from "./snackbar-queue";
import { type SnackbarQueue } from "./snackbar.types";

/** The queue of the nearest `SnackbarHost` that wraps its children. */
export const SnackbarQueueContext = createContext<SnackbarQueue | null>(null);

/**
 * The snackbar queue to talk to from a component: the one of the nearest
 * `<SnackbarHost>` wrapping it, else the global queue `snackbar()` uses.
 *
 * ```tsx
 * const { show } = useSnackbar();
 * show({ message: "Photo deleted", action: "Undo", onAction: restore });
 * ```
 */
export const useSnackbar = (): SnackbarQueue =>
  useContext(SnackbarQueueContext) ?? snackbar.queue;
