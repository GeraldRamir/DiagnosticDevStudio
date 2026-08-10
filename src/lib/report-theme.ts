/**
 * Paleta del informe: gris neutro, tarjetas blancas y acento coral.
 * Se comparte entre UI, gráficos, PDF y correo para mantener una sola identidad.
 */
export const RP = {
  page: "#e8e8e8",
  shell: "#f5f5f5",
  band: "#f0f0f0",
  card: "#ffffff",
  black: "#101010",
  ink: "#131313",
  inkSoft: "#4a4a4a",
  muted: "#9a9a9a",
  faint: "#c9c9c9",
  line: "#ededed",
  lineSoft: "#f5f5f5",
  accent: "#ee5b45",
  accentDark: "#d9452f",
  accentSoft: "#fdeeeb",
  good: "#1f9d6b",
  goodSoft: "#e9f6f0",
  warn: "#dd9a2b",
  warnSoft: "#fcf3e3",
} as const;

/** Escala coral usada en gráficos de pilares (exterior → interior) */
export const RP_SCALE = [
  "#ee5b45",
  "#f27460",
  "#f68d7c",
  "#f9a698",
  "#fbc0b4",
] as const;

export type RpStatus = "ok" | "warn" | "fail";

export const RP_STATUS: Record<RpStatus, { color: string; soft: string; label: string }> = {
  ok: { color: RP.good, soft: RP.goodSoft, label: "Conforme" },
  warn: { color: RP.warn, soft: RP.warnSoft, label: "Alerta" },
  fail: { color: RP.accent, soft: RP.accentSoft, label: "Crítico" },
};

export const RP_SEVERITY: Record<"alta" | "media" | "baja", RpStatus> = {
  alta: "fail",
  media: "warn",
  baja: "ok",
};
