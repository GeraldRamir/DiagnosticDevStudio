import type { ToolCategory, ToolId } from "@/types/tools";

/**
 * Paleta pastel del catálogo.
 * `surface` es el fondo de tarjeta, `deep` la banda saturada del rail
 * y `icon` el tono del icono sobre el tile blanco.
 */
export type ToolTheme = {
  surface: string;
  deep: string;
  icon: string;
};

const DEFAULT_THEME: ToolTheme = {
  surface: "#EFEFFA",
  deep: "#C9C8EE",
  icon: "#7C7BD6",
};

export const TOOL_THEMES: Record<ToolId, ToolTheme> = {
  "diagnostico-digital": { surface: "#F8D7D3", deep: "#EFA6A3", icon: "#E08A80" },
  "instagram-analyzer": { surface: "#FBE3C0", deep: "#F5C583", icon: "#D79A47" },
  "whatsapp-generator": { surface: "#BFEBD5", deep: "#8FDCB8", icon: "#4BA37C" },
  "qr-generator": { surface: "#D7D8F7", deep: "#B4B6EE", icon: "#7C7BD6" },
  "menu-digital": { surface: "#F5DCEA", deep: "#E9B4D2", icon: "#C76FA0" },
};

export const CATEGORY_ICON_TINT: Record<ToolCategory, string> = {
  marketing: "#D79A47",
  ventas: "#C76FA0",
  comunicacion: "#4BA37C",
  digitalizacion: "#E08A80",
  productividad: "#7C7BD6",
};

export function getToolTheme(id: ToolId): ToolTheme {
  return TOOL_THEMES[id] ?? DEFAULT_THEME;
}
