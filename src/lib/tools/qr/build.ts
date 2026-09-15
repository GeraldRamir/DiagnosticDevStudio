import type { QrFormValues, QrType } from "@/lib/tools/qr/types";

const HTTP_URL_RE = /^https?:\/\//i;

/** Añade https:// cuando el usuario escribe solo el dominio. */
export function normalizeHttpUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (HTTP_URL_RE.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Deja solo dígitos; usado para WhatsApp, teléfono y SMS. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeInstagramHandle(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
}

/** Escapa los caracteres reservados del formato WIFI:. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

/**
 * Construye el contenido exacto que se codifica en el QR.
 * Devuelve cadena vacía cuando faltan datos obligatorios.
 */
export function buildQrValue(type: QrType, form: QrFormValues): string {
  switch (type) {
    case "whatsapp": {
      if (!digitsOnly(form.phone)) return "";
      const number = digitsOnly(`${form.countryCode}${form.phone}`);
      if (!number) return "";
      const message = form.message.trim();
      return message
        ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${number}`;
    }

    case "url":
    case "menu":
      return normalizeHttpUrl(form.url);

    case "instagram": {
      const handle = normalizeInstagramHandle(form.instagram);
      return handle ? `https://instagram.com/${handle}` : "";
    }

    case "maps": {
      if (form.mapsMode === "address") {
        const query = [form.placeName.trim(), form.address.trim()]
          .filter(Boolean)
          .join(", ");
        return query
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
          : "";
      }
      return normalizeHttpUrl(form.url);
    }

    case "text":
      return form.text.trim();

    case "email": {
      const address = form.email.trim();
      if (!address) return "";
      /* mailto usa %20 para los espacios: URLSearchParams pondría "+". */
      const parts: string[] = [];
      if (form.subject.trim()) {
        parts.push(`subject=${encodeURIComponent(form.subject.trim())}`);
      }
      if (form.body.trim()) parts.push(`body=${encodeURIComponent(form.body.trim())}`);
      return parts.length ? `mailto:${address}?${parts.join("&")}` : `mailto:${address}`;
    }

    case "phone": {
      if (!digitsOnly(form.phone)) return "";
      const number = digitsOnly(`${form.countryCode}${form.phone}`);
      return number ? `tel:+${number}` : "";
    }

    case "sms": {
      if (!digitsOnly(form.phone)) return "";
      const number = digitsOnly(`${form.countryCode}${form.phone}`);
      if (!number) return "";
      const message = form.message.trim();
      return message
        ? `sms:+${number}?body=${encodeURIComponent(message)}`
        : `sms:+${number}`;
    }

    case "wifi": {
      const ssid = form.ssid.trim();
      if (!ssid) return "";
      const hidden = form.hidden ? "H:true;" : "";
      if (form.security === "nopass") {
        return `WIFI:T:nopass;S:${escapeWifi(ssid)};;${hidden}`;
      }
      return `WIFI:T:${form.security};S:${escapeWifi(ssid)};P:${escapeWifi(form.password)};${hidden};`;
    }
  }
}

/** Contenido que puede abrirse en una pestaña nueva con el botón "Probar". */
export function openableHref(type: QrType, value: string): string | null {
  if (!value) return null;
  if (type === "wifi" || type === "text") return null;
  return value;
}
