import type { QrFormValues, QrStyle, QrType } from "@/lib/tools/qr/types";

/**
 * Plantillas rápidas: preseleccionan tipo, nombre, textos y estilo.
 * Nunca inventan datos del negocio; solo dejan el formulario listo para rellenar.
 */
export type QrTemplate = {
  id: string;
  label: string;
  description: string;
  type: QrType;
  name: string;
  form: Partial<QrFormValues>;
  style: Partial<QrStyle>;
};

export const QR_TEMPLATES: QrTemplate[] = [
  {
    id: "contacto-whatsapp",
    label: "Contacta con nosotros",
    description: "Chat de WhatsApp con un mensaje inicial listo.",
    type: "whatsapp",
    name: "QR WhatsApp",
    form: { message: "Hola, quiero información sobre sus productos." },
    style: { caption: "Escríbenos por WhatsApp" },
  },
  {
    id: "menu-restaurante",
    label: "Ver nuestro menú",
    description: "Lleva a la carta digital desde la mesa.",
    type: "menu",
    name: "QR menú principal",
    form: {},
    style: { caption: "Escanea para ver el menú" },
  },
  {
    id: "seguir-instagram",
    label: "Síguenos en Instagram",
    description: "Abre tu perfil para ganar seguidores en el local.",
    type: "instagram",
    name: "QR Instagram",
    form: {},
    style: { caption: "Síguenos en Instagram" },
  },
  {
    id: "ubicacion",
    label: "Encuéntranos",
    description: "Abre Google Maps con la ruta hacia tu negocio.",
    type: "maps",
    name: "QR ubicación",
    form: { mapsMode: "address" },
    style: { caption: "Cómo llegar" },
  },
  {
    id: "wifi-clientes",
    label: "Conéctate al WiFi",
    description: "Conexión automática sin dictar la contraseña.",
    type: "wifi",
    name: "QR WiFi",
    form: { security: "WPA" },
    style: { caption: "WiFi para clientes", errorCorrection: "Q" },
  },
];

/** Tarjetas de "¿Para qué necesitas tu QR?" — solo seleccionan tipo y plantilla. */
export type QrBusinessPreset = {
  id: string;
  label: string;
  description: string;
  icon: "menu" | "whatsapp" | "maps" | "instagram" | "store" | "wifi";
  templateId: string;
};

export const QR_BUSINESS_PRESETS: QrBusinessPreset[] = [
  {
    id: "restaurante",
    label: "Restaurante",
    description: "Menú en la mesa",
    icon: "menu",
    templateId: "menu-restaurante",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Que te escriban",
    icon: "whatsapp",
    templateId: "contacto-whatsapp",
  },
  {
    id: "ubicacion",
    label: "Ubicación",
    description: "Cómo llegar",
    icon: "maps",
    templateId: "ubicacion",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Más seguidores",
    icon: "instagram",
    templateId: "seguir-instagram",
  },
  {
    id: "tienda",
    label: "Tienda",
    description: "Catálogo online",
    icon: "store",
    templateId: "menu-restaurante",
  },
  {
    id: "wifi",
    label: "WiFi",
    description: "Conexión directa",
    icon: "wifi",
    templateId: "wifi-clientes",
  },
];

export function getTemplate(id: string): QrTemplate | undefined {
  return QR_TEMPLATES.find((item) => item.id === id);
}
