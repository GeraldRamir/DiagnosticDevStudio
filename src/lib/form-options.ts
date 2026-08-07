import { copy } from "@/lib/copy";

export const INDUSTRIES = copy.landing.headerDropdown.industries;

export const COUNTRIES = [
  "México",
  "Colombia",
  "Chile",
  "Argentina",
  "Perú",
  "Rep. Dominicana",
  "Ecuador",
  "Guatemala",
  "Costa Rica",
  "Panamá",
  "Uruguay",
  "Otro",
] as const;

export const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "Solo yo" },
  { value: "2_5", label: "2–5 personas" },
  { value: "6_15", label: "6–15 personas" },
  { value: "mas_15", label: "Más de 15" },
] as const;

export const WEEKLY_HOURS_OPTIONS = [
  { value: "menos_5", label: "Menos de 5 h/semana" },
  { value: "5_10", label: "5–10 h/semana" },
  { value: "10_20", label: "10–20 h/semana" },
  { value: "mas_20", label: "Más de 20 h/semana" },
] as const;

export const RECORD_KEEPING_OPTIONS = [
  { value: "papel", label: "Papel / cuaderno" },
  { value: "excel", label: "Excel o hojas de cálculo" },
  { value: "software", label: "Software / POS / ERP" },
  { value: "ninguno", label: "Sin registro formal" },
] as const;

export const HAS_WEBSITE_OPTIONS = [
  { value: "yes", label: "Sí, tengo sitio web" },
  { value: "social_only", label: "Solo redes sociales" },
  { value: "no", label: "No tengo presencia web" },
] as const;

export const ORDER_CHANNEL_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada telefónica" },
  { value: "persona", label: "Presencial" },
  { value: "redes", label: "Redes sociales" },
  { value: "sistema", label: "Sistema / app propia" },
  { value: "correo", label: "Correo electrónico" },
] as const;

export function labelForOption(
  options: readonly { value: string; label: string }[],
  value: string,
) {
  return options.find((o) => o.value === value)?.label ?? value;
}
