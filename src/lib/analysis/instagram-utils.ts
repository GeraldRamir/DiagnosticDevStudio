/** Utilidades puras de Instagram — seguras para importar en cliente. */

export function normalizeInstagramUsername(handle: string): string {
  return handle.trim().replace(/^@+/, "").split("/")[0]?.toLowerCase() ?? "";
}

export function daysSinceIso(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return null;
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}
