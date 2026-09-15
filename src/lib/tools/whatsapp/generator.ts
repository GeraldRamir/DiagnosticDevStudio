export const WHATSAPP_MESSAGE_MAX = 500;

/**
 * Países del generador. `id` es único aunque varios compartan el mismo `code`
 * (NANP: DO / US / CA usan +1). Agregar un país: un objeto más en este array.
 */
export const WHATSAPP_COUNTRIES = [
  { id: "do", code: "1", flag: "🇩🇴", name: "República Dominicana" },
  { id: "us", code: "1", flag: "🇺🇸", name: "Estados Unidos" },
  { id: "ca", code: "1", flag: "🇨🇦", name: "Canadá" },
  { id: "mx", code: "52", flag: "🇲🇽", name: "México" },
  { id: "es", code: "34", flag: "🇪🇸", name: "España" },
  { id: "co", code: "57", flag: "🇨🇴", name: "Colombia" },
  { id: "pa", code: "507", flag: "🇵🇦", name: "Panamá" },
  { id: "ve", code: "58", flag: "🇻🇪", name: "Venezuela" },
  { id: "cl", code: "56", flag: "🇨🇱", name: "Chile" },
  { id: "ar", code: "54", flag: "🇦🇷", name: "Argentina" },
  { id: "br", code: "55", flag: "🇧🇷", name: "Brasil" },
  { id: "pe", code: "51", flag: "🇵🇪", name: "Perú" },
  { id: "ec", code: "593", flag: "🇪🇨", name: "Ecuador" },
  { id: "cr", code: "506", flag: "🇨🇷", name: "Costa Rica" },
  { id: "gt", code: "502", flag: "🇬🇹", name: "Guatemala" },
  { id: "sv", code: "503", flag: "🇸🇻", name: "El Salvador" },
  { id: "hn", code: "504", flag: "🇭🇳", name: "Honduras" },
  { id: "ni", code: "505", flag: "🇳🇮", name: "Nicaragua" },
  { id: "py", code: "595", flag: "🇵🇾", name: "Paraguay" },
  { id: "uy", code: "598", flag: "🇺🇾", name: "Uruguay" },
  { id: "bo", code: "591", flag: "🇧🇴", name: "Bolivia" },
] as const;

export type WhatsappCountryId = (typeof WHATSAPP_COUNTRIES)[number]["id"];

/**
 * Lista compacta (un ítem por código) para el generador de QR y otros formularios
 * que guardan solo el dial code.
 */
export const COUNTRY_CODES = [
  { code: "1", label: "Rep. Dominicana / USA / Canadá (+1)" },
  { code: "52", label: "México (+52)" },
  { code: "57", label: "Colombia (+57)" },
  { code: "34", label: "España (+34)" },
  { code: "51", label: "Perú (+51)" },
  { code: "56", label: "Chile (+56)" },
  { code: "54", label: "Argentina (+54)" },
  { code: "55", label: "Brasil (+55)" },
  { code: "593", label: "Ecuador (+593)" },
  { code: "507", label: "Panamá (+507)" },
  { code: "506", label: "Costa Rica (+506)" },
  { code: "502", label: "Guatemala (+502)" },
  { code: "503", label: "El Salvador (+503)" },
  { code: "504", label: "Honduras (+504)" },
  { code: "505", label: "Nicaragua (+505)" },
  { code: "58", label: "Venezuela (+58)" },
  { code: "595", label: "Paraguay (+595)" },
  { code: "598", label: "Uruguay (+598)" },
  { code: "591", label: "Bolivia (+591)" },
] as const;

export const WHATSAPP_PRESETS = [
  {
    id: "info",
    label: "Información",
    message: "Hola, quiero información sobre sus productos.",
  },
  {
    id: "buy",
    label: "Comprar",
    message: "Hola, quiero realizar una compra.",
  },
  {
    id: "quote",
    label: "Cotización",
    message: "Hola, quisiera solicitar una cotización.",
  },
  {
    id: "reserve",
    label: "Reservar",
    message: "Hola, quisiera realizar una reserva.",
  },
  {
    id: "availability",
    label: "Disponibilidad",
    message: "Hola, quisiera saber si tienen disponibilidad.",
  },
] as const;

export const DEFAULT_WHATSAPP_COUNTRY_ID: WhatsappCountryId = "do";

const NON_DIGIT_RE = /\D/g;

export function getWhatsappCountry(id: string) {
  return WHATSAPP_COUNTRIES.find((item) => item.id === id) ?? WHATSAPP_COUNTRIES[0];
}

/** Deja dígitos, espacios, guiones y paréntesis. Bloquea letras. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d\s\-()]/g, "").slice(0, 22);
}

export function digitsOnly(value: string): string {
  return value.replace(NON_DIGIT_RE, "");
}

export function normalizePhone(countryCode: string, number: string): string {
  const code = digitsOnly(countryCode);
  const local = digitsOnly(number).replace(new RegExp(`^${code}`), "");
  return `${code}${local}`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = digitsOnly(phone);
  const text = message.trim();
  const base = `https://wa.me/${digits}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppLink(input: {
  countryCode: string;
  phoneNumber: string;
  message?: string;
}): string {
  return buildWhatsAppUrl(
    normalizePhone(input.countryCode, input.phoneNumber),
    input.message ?? "",
  );
}

export function isValidWhatsAppPhone(phone: string): boolean {
  const digits = digitsOnly(phone);
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Validación del formulario. NANP (+1) exige 10 dígitos locales (RD, US, CA).
 * El resto admite longitudes razonables de E.164.
 */
export function isValidWhatsAppNumber(countryCode: string, phoneNumber: string): boolean {
  const code = digitsOnly(countryCode);
  const local = digitsOnly(phoneNumber).replace(new RegExp(`^${code}`), "");
  if (!code || !local) return false;
  if (code === "1") return local.length === 10;
  const full = `${code}${local}`;
  return local.length >= 6 && full.length >= 8 && full.length <= 15;
}

export function displayWhatsAppUrl(url: string): string {
  const stripped = url.replace(/^https:\/\//i, "");
  const [base, query] = stripped.split("?");
  if (!query) return stripped;
  return `${base}?…`;
}
