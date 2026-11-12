"use client";

import { useEffect, useRef } from "react";

/** Elements that handle their own pointer presses. */
const INTERACTIVE =
  "input,textarea,select,button,a[href],label,summary,[contenteditable=''],[contenteditable=true],[tabindex]";

type Control = HTMLInputElement | HTMLTextAreaElement;

/** The real `<input>` / `<textarea>`, even when `asChild` wraps it. */
const findControl = (root: Element): Control | null => {
  const slot = root.querySelector("[data-slot=text-field-input]");
  if (!slot) return null;
  if (slot instanceof HTMLInputElement || slot instanceof HTMLTextAreaElement)
    return slot;
  return slot.querySelector<Control>("input,textarea");
};

/**
 * Set the value the way typing would: through the prototype's setter (React's
 * value tracker then sees a change) followed by `input` + `change` events, so
 * a controlled field's `onChange` fires and an uncontrolled one just updates.
 */
const setValue = (control: Control, value: string) => {
  const proto = Object.getPrototypeOf(control) as object;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(control, value);
  control.dispatchEvent(new Event("input", { bubbles: true }));
  control.dispatchEvent(new Event("change", { bubbles: true }));
};

/** Fill a `{count}` / `{max}` template. */
const format = (template: string, count: number, max: string | null) =>
  template.replace("{count}", String(count)).replace("{max}", max ?? "");

/**
 * The text field's only client island. It renders an empty, hidden marker and,
 * on mount, wires the server-rendered field around it — no React state, so
 * `TextField` itself stays a Server Component and everything works (minus
 * these enhancements) before hydration:
 *
 * - **Click to focus.** A press anywhere on the container that isn't on an
 *   interactive element (padding, a decorative icon, the prefix) focuses the
 *   input instead of blurring it, caret at the end — like Material Web / Compose.
 * - **Clear.** The clear button (and Escape in the field, while it has text)
 *   empties the value through the native setter + `input` event, so React's
 *   `onChange` fires for controlled fields, and keeps focus in the field.
 *   Escape is `preventDefault`ed, so an enclosing `<dialog>` stays open.
 * - **Password toggle.** Flips `type` between `password` and `text`, swaps the
 *   button's accessible name and `data-visible`, and turns the password back
 *   into dots when its form submits or resets.
 * - **Counter.** For uncontrolled fields, re-counts on every `input` and after
 *   a form reset (controlled fields are re-rendered by React with the count).
 * - **Auto-grow fallback.** Where `field-sizing: content` isn't supported, a
 *   growing `<textarea>` is resized to its `scrollHeight` (CSS still clamps it
 *   to `minRows` / `maxRows`).
 */
const TextFieldInteraction = () => {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = markerRef.current?.parentElement;
    const root = container?.closest("[data-slot=text-field]");
    const control = root ? findControl(root) : null;
    if (!container || !root || !control) return;

    const cleanups: (() => void)[] = [];
    const listen = <K extends keyof HTMLElementEventMap>(
      target: HTMLElement,
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void,
    ) => {
      target.addEventListener(type, handler);
      cleanups.push(() => target.removeEventListener(type, handler));
    };

    // Click anywhere on the container → focus the control.
    listen(container, "mousedown", (event) => {
      if (event.button !== 0 || control.disabled) return;
      const target = event.target as Element | null;
      if (!target || target.closest(INTERACTIVE)) return;
      event.preventDefault();
      if (document.activeElement === control) return;
      control.focus();
      try {
        const end = control.value.length;
        control.setSelectionRange(end, end);
      } catch {
        // `email` / `number` inputs don't support selection ranges.
      }
    });

    // Clear button + Escape.
    const clearButton = root.querySelector<HTMLElement>(
      "[data-slot=text-field-clear]",
    );
    if (clearButton) {
      const clear = () => {
        setValue(control, "");
        control.focus();
      };
      listen(clearButton, "click", clear);
      listen(control, "keydown", (event) => {
        if (
          event.key !== "Escape" ||
          event.defaultPrevented ||
          !control.value ||
          control.readOnly ||
          control.disabled
        ) {
          return;
        }
        event.preventDefault();
        clear();
      });
    }

    // Password show / hide.
    const toggle = root.querySelector<HTMLElement>(
      "[data-slot=text-field-password-toggle]",
    );
    if (toggle && control instanceof HTMLInputElement) {
      const setVisible = (visible: boolean) => {
        control.type = visible ? "text" : "password";
        toggle.toggleAttribute("data-visible", visible);
        const label = toggle.getAttribute(
          visible ? "data-label-hide" : "data-label-show",
        );
        if (label) toggle.setAttribute("aria-label", label);
      };
      listen(toggle, "click", () => setVisible(control.type === "password"));
      const form = control.form;
      if (form) {
        const conceal = () => setVisible(false);
        listen(form, "submit", conceal);
        listen(form, "reset", conceal);
      }
    }

    // Uncontrolled character counter.
    const counter = root.querySelector<HTMLElement>(
      "[data-slot=text-field-counter]:not([data-controlled])",
    );
    if (counter) {
      const visible = counter.querySelector("[data-part=visible]");
      const spoken = counter.querySelector("[data-part=spoken]");
      const max = counter.getAttribute("data-max");
      const template = counter.getAttribute("data-template") ?? "{count}";
      const update = () => {
        const count = control.value.length;
        if (visible) visible.textContent = max ? `${count}/${max}` : `${count}`;
        if (spoken) spoken.textContent = format(template, count, max);
        counter.toggleAttribute("data-over", max !== null && count > +max);
      };
      listen(control, "input", update);
      const form = control.form;
      if (form) {
        listen(form, "reset", () => requestAnimationFrame(update));
      }
      update();
    }

    // Auto-grow fallback for browsers without `field-sizing: content`.
    if (
      control instanceof HTMLTextAreaElement &&
      control.hasAttribute("data-autosize") &&
      !CSS.supports("field-sizing", "content")
    ) {
      const fit = () => {
        control.style.height = "auto";
        control.style.height = `${control.scrollHeight}px`;
      };
      listen(control, "input", fit);
      // Re-fit when the width changes (wrapping changes); ignore the height
      // changes `fit` itself causes.
      let width = control.clientWidth;
      const observer = new ResizeObserver(() => {
        if (control.clientWidth === width) return;
        width = control.clientWidth;
        fit();
      });
      observer.observe(control);
      cleanups.push(() => observer.disconnect());
      fit();
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return <span ref={markerRef} hidden />;
};

export default TextFieldInteraction;
