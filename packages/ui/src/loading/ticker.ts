/*
 * One `requestAnimationFrame` loop shared by every loading-family instance, so a
 * screen full of indicators costs a single callback per frame and the loop stops
 * entirely when nothing is animating.
 */

/** Advances by `dt` milliseconds; return `false` to stop being called. */
export type FrameTask = (dt: number) => boolean;

/** Long gaps (a throttled tab, a slow frame) must not jump animations forward. */
const MAX_FRAME_DELTA = 64;

const tasks = new Set<FrameTask>();
let handle = 0;
let last = 0;

const tick = (now: number) => {
  const dt = Math.min(now - last, MAX_FRAME_DELTA);
  last = now;
  for (const task of tasks) {
    if (!task(dt)) tasks.delete(task);
  }
  handle = tasks.size > 0 ? requestAnimationFrame(tick) : 0;
};

/** Runs `task` every frame until it returns `false` or the result is called. */
export const schedule = (task: FrameTask) => {
  tasks.add(task);
  if (handle === 0) {
    last = performance.now();
    handle = requestAnimationFrame(tick);
  }
  return () => {
    tasks.delete(task);
  };
};
