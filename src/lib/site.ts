import { BRAND_LINKS } from "@/lib/brand";

export const SITE_NAME = "Dev Studio Tools";
export const SITE_BRAND = "Dev Studio";
export const SITE_TAGLINE = "Soluciones digitales para negocios.";
export const SITE_DESCRIPTION =
  "Herramientas digitales gratuitas creadas por Dev Studio para mejorar tu presencia digital, vender más y simplificar tu negocio.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://tools.devstudioo.com";

export const CONTACT_HREF = BRAND_LINKS.contacto;
export const CREATE_TOOL_HREF = BRAND_LINKS.cotizar;
export const ABOUT_HREF = "/sobre";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
