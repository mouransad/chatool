interface TextFieldVisibilityIconProps {
  /** `visibility_off` (crossed eye) instead of `visibility`. */
  off?: boolean;
  /** Which password state this glyph belongs to (the toggle shows one). */
  "data-icon"?: "show" | "hide";
}

/**
 * Material Symbols `visibility` / `visibility_off` (outlined) for the password
 * toggle. Inlined so `@chatool/ui` doesn't depend on `@chatool/icons`; `1em`,
 * `currentColor`.
 */
const TextFieldVisibilityIcon = ({
  off = false,
  ...props
}: TextFieldVisibilityIconProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 -960 960 960"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path
      d={
        off
          ? "m629-419-44-44q26-71-27-118t-115-24l-44-44q17-11 38-16t43-5q71 0 120.5 49.5T650-500q0 22-5.5 43.5T629-419m129 129-40-40q49-36 85.5-80.5T857-500q-50-111-150-175.5T490-740q-42 0-86 8t-69 19l-46-47q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93m58 226L648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757zM223-654q-37 27-71.5 71T102-500q51 111 153.5 175.5T488-260q33 0 65-4t48-12l-64-64q-11 5-27 7.5t-30 2.5q-70 0-120-49t-50-121q0-15 2.5-30t7.5-27zm189 200"
          : "M600.5-379.5Q650-429 650-500t-49.5-120.5T480-670t-120.5 49.5T310-500t49.5 120.5T480-330t120.5-49.5m-200-41Q368-453 368-500t32.5-79.5T480-612t79.5 32.5T592-500t-32.5 79.5T480-388t-79.5-32.5M216-283Q98-366 40-500q58-134 176-217t264-83 264 83 176 217q-58 134-176 217t-264 83-264-83m486.5-42.5Q804-391 857-500q-53-109-154.5-174.5T480-740t-222.5 65.5T102-500q54 109 155.5 174.5T480-260t222.5-65.5"
      }
    />
  </svg>
);

export default TextFieldVisibilityIcon;
