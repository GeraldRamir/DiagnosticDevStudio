import { digitsOnly, normalizeInstagramHandle } from "@/lib/tools/qr/build";
import type { QrFormValues, QrType } from "@/lib/tools/qr/types";

/** Errores por campo: { phone: "…" }. Objeto vacío = formulario válido. */
export type QrFieldErrors = Partial<Record<keyof QrFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const INSTAGRAM_RE = /^[a-z0-9._]{1,30}$/i;

function isValidUrl(value: string): boolean {
  const candidate = value.trim();
  if (!candidate) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    return Boolean(url.hostname) && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Valida el formulario según el tipo activo. */
export function validateQrForm(type: QrType, form: QrFormValues): QrFieldErrors {
  const errors: QrFieldErrors = {};

  switch (type) {
    case "whatsapp":
    case "phone":
    case "sms": {
      const digits = digitsOnly(form.phone);
      if (!digits) {
        errors.phone = "Ingresa el número, sin espacios ni guiones.";
      } else if (digits.length < 6) {
        errors.phone = "El número parece muy corto.";
      } else if (digits.length > 14) {
        errors.phone = "El número parece muy largo.";
      }
      if (!digitsOnly(form.countryCode)) {
        errors.countryCode = "Elige el código de país.";
      }
      if (type !== "phone" && form.message.length > 900) {
        errors.message = "El mensaje es demasiado largo.";
      }
      break;
    }

    case "url":
    case "menu": {
      if (!form.url.trim()) {
        errors.url = type === "menu" ? "Pega el enlace de tu menú." : "Pega o escribe la URL.";
      } else if (!isValidUrl(form.url)) {
        errors.url = "Esa URL no parece válida. Ejemplo: https://midominio.com";
      }
      break;
    }

    case "instagram": {
      const handle = normalizeInstagramHandle(form.instagram);
      if (!handle) {
        errors.instagram = "Escribe tu usuario, con o sin @.";
      } else if (!INSTAGRAM_RE.test(handle)) {
        errors.instagram = "Solo letras, números, punto y guion bajo.";
      }
      break;
    }

    case "maps": {
      if (form.mapsMode === "address") {
        if (!form.placeName.trim() && !form.address.trim()) {
          errors.address = "Escribe el nombre del negocio o la dirección.";
        }
      } else if (!form.url.trim()) {
        errors.url = "Pega el enlace de Google Maps.";
      } else if (!isValidUrl(form.url)) {
        errors.url = "Ese enlace de Maps no parece válido.";
      }
      break;
    }

    case "text": {
      if (!form.text.trim()) {
        errors.text = "Escribe el texto que verá quien escanee.";
      } else if (form.text.length > 1200) {
        errors.text = "El texto es muy largo para un QR legible.";
      }
      break;
    }

    case "email": {
      if (!form.email.trim()) {
        errors.email = "Ingresa el correo que recibirá los mensajes.";
      } else if (!EMAIL_RE.test(form.email.trim())) {
        errors.email = "Ese correo no parece válido.";
      }
      break;
    }

    case "wifi": {
      if (!form.ssid.trim()) {
        errors.ssid = "Ingresa el nombre exacto de la red (SSID).";
      }
      if (form.security !== "nopass" && !form.password) {
        errors.password = "Ingresa la contraseña o elige “Sin contraseña”.";
      }
      break;
    }
  }

  return errors;
}

export function hasErrors(errors: QrFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
