/**
 * Join a base URL and a path into a single normalized URL, collapsing any
 * duplicate slashes at the join (`https://x/` + `/y` -> `https://x/y`).
 *
 * Pure function (no React) — safe to call on server or client.
 */
export function endPointUrlNormalizer(base: string, path = ""): string {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return trimmedPath ? `${trimmedBase}/${trimmedPath}` : trimmedBase;
}
