import { slugify } from "@/lib/utils/sanitize";

/**
 * Genera un slug único para la URL pública del menú.
 * Si "burger-house" ya existe, devuelve "burger-house-2".
 */
export function uniqueSlug(name: string, taken: string[]): string {
  const base = slugify(name, "menu");
  if (!taken.includes(base)) return base;

  let counter = 2;
  while (taken.includes(`${base}-${counter}`)) counter += 1;
  return `${base}-${counter}`;
}

/** URL pública del menú, relativa al sitio. */
export function menuPath(slug: string): string {
  return `/menu/${slug}`;
}

/** URL absoluta; en el navegador usa el origen real. */
export function menuUrl(slug: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${menuPath(slug)}`;
}
