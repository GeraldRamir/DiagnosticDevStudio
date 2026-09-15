import { buildQrToolHref } from "@/lib/tools/cross-links";
import { menuUrl } from "@/lib/tools/menu/slug";
import { digitsOnly, normalizeInstagram } from "@/lib/tools/menu/validators";
import type { DigitalMenu, MenuProduct } from "@/lib/tools/menu/types";
import { copyToClipboard } from "@/lib/utils/clipboard";

/**
 * Integraciones del menú con el resto de la plataforma y con el teléfono
 * del cliente: QR, WhatsApp, Instagram, Maps y compartir.
 */

/** Envía la URL del menú al Generador de QR en vez de duplicar esa lógica. */
export function generateMenuQR(url: string, name: string): string {
  return buildQrToolHref({ type: "menu", url, name: `QR ${name}`.slice(0, 60) });
}

export function menuQrHref(menu: DigitalMenu, origin?: string): string {
  return generateMenuQR(menuUrl(menu.slug, origin), menu.business.name || menu.name);
}

/**
 * Enlace de pedido por WhatsApp.
 * Acepta productos para cuando exista carrito; hoy se usa sin ellos.
 */
export function generateWhatsAppOrderLink(input: {
  whatsapp: string;
  businessName: string;
  currency?: string;
  items?: { product: MenuProduct; quantity: number }[];
}): string | null {
  const number = digitsOnly(input.whatsapp);
  if (!number) return null;

  const lines = [`Hola ${input.businessName}, quiero realizar un pedido.`.trim()];
  if (input.items?.length) {
    lines.push("");
    for (const item of input.items) {
      const amount = `${input.currency ?? ""}${item.product.price}`;
      lines.push(`• ${item.quantity} × ${item.product.name} — ${amount}`);
    }
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function instagramHref(handle: string): string | null {
  const user = normalizeInstagram(handle);
  return user ? `https://instagram.com/${user}` : null;
}

export function phoneHref(phone: string): string | null {
  const number = digitsOnly(phone);
  return number ? `tel:+${number}` : null;
}

export function mapsHref(input: { mapsUrl: string; address: string; name: string }): string | null {
  if (input.mapsUrl.trim()) return input.mapsUrl.trim();
  const query = [input.name, input.address].filter(Boolean).join(", ").trim();
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;
}

/** Compartir con Web Share API y, si no existe, copiar el enlace. */
export async function shareMenu(input: {
  url: string;
  title: string;
  text: string;
}): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: input.title, text: input.text, url: input.url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }
  return (await copyToClipboard(input.url)) ? "copied" : "failed";
}
