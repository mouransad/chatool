"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";

import { type FrameTask, schedule } from "./ticker";

/**
 * Drives `task` from the shared ticker while `ref`'s element is on screen — an
 * off-screen indicator costs nothing and resumes where it stopped. Returns `wake`,
 * which restarts the loop after a task stopped itself by returning `false`.
 */
export const useFrameLoop = (
  ref: RefObject<Element | null>,
  task: FrameTask,
) => {
  const taskRef = useRef(task);
  const cancelRef = useRef<(() => void) | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    taskRef.current = task;
  });

  const wake = useCallback(() => {
    if (cancelRef.current || !visibleRef.current) return;
    cancelRef.current = schedule((dt) => {
      const running = taskRef.current(dt);
      if (!running) cancelRef.current = null;
      return running;
    });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry?.isIntersecting ?? true;
      if (visibleRef.current) wake();
      else {
        cancelRef.current?.();
        cancelRef.current = null;
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, wake]);

  useEffect(
    () => () => {
      cancelRef.current?.();
      cancelRef.current = null;
    },
    [],
  );

  return wake;
};
