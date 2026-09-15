import { getToolById } from "@/lib/tools";
import type { ToolId } from "@/types/tools";

export function buildQrToolHref(params: Record<string, string>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `/tools/qr-generator?${query}` : "/tools/qr-generator";
}

export function recommendedToolsFor(id: ToolId): { href: string; label: string; reason: string }[] {
  if (id === "diagnostico-digital") {
    return [
      {
        href: getToolById("whatsapp-generator").href,
        label: getToolById("whatsapp-generator").shortName,
        reason: "Facilita el primer contacto con un enlace directo.",
      },
      {
        href: getToolById("menu-digital").href,
        label: getToolById("menu-digital").shortName,
        reason: "Digitaliza tu oferta para que se consulte sin fricción.",
      },
      {
        href: getToolById("instagram-analyzer").href,
        label: getToolById("instagram-analyzer").shortName,
        reason: "Convierte tu Instagram en un canal de ventas.",
      },
    ];
  }

  if (id === "instagram-analyzer") {
    return [
      {
        href: getToolById("whatsapp-generator").href,
        label: getToolById("whatsapp-generator").shortName,
        reason: "Pon un enlace de WhatsApp en la bio.",
      },
      {
        href: getToolById("menu-digital").href,
        label: getToolById("menu-digital").shortName,
        reason: "Si vendes productos o comida, enlaza un menú digital.",
      },
      {
        href: getToolById("qr-generator").href,
        label: getToolById("qr-generator").shortName,
        reason: "Lleva gente de un local físico a tu perfil.",
      },
    ];
  }

  return [];
}
