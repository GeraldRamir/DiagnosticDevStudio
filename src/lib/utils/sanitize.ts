const HTML_TAG_RE = /<\/?[^>]+>/g;
const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

export function sanitizePlainText(value: string, maxLength = 2000): string {
  return value
    .replace(HTML_TAG_RE, "")
    .replace(CONTROL_CHARS_RE, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeMultiline(value: string, maxLength = 4000): string {
  return value
    .replace(HTML_TAG_RE, "")
    .replace(CONTROL_CHARS_RE, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

export function slugify(value: string, fallback = "item"): string {
  const base = value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || fallback;
}
