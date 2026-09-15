/** Tipos de contenido que la herramienta puede convertir en código QR. */
export type QrType =
  | "whatsapp"
  | "url"
  | "instagram"
  | "menu"
  | "maps"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "wifi";

export type QrErrorCorrection = "L" | "M" | "Q" | "H";

/** Formas de los módulos. Los ojos (finder patterns) siempre van cuadrados. */
export type QrModuleStyle = "square" | "rounded" | "dots";

export type QrCaptionAlign = "left" | "center" | "right";

export type QrWifiSecurity = "WPA" | "WEP" | "nopass";

/** Valores del formulario. Se guardan todos para poder reabrir un QR del historial. */
export type QrFormValues = {
  /** WhatsApp / teléfono / SMS */
  countryCode: string;
  phone: string;
  message: string;
  /** URL, menú y maps por enlace */
  url: string;
  /** Instagram */
  instagram: string;
  /** Google Maps por nombre y dirección */
  placeName: string;
  address: string;
  mapsMode: "url" | "address";
  /** Texto libre */
  text: string;
  /** Email */
  email: string;
  subject: string;
  body: string;
  /** WiFi */
  ssid: string;
  password: string;
  security: QrWifiSecurity;
  hidden: boolean;
};

export type QrStyle = {
  foreground: string;
  background: string;
  /** Lado del PNG exportado, en píxeles. */
  size: number;
  /** Zona de silencio, en módulos. */
  margin: number;
  errorCorrection: QrErrorCorrection;
  moduleStyle: QrModuleStyle;
  logoDataUrl: string | null;
  logoEnabled: boolean;
  /** Proporción del lado del QR que ocupa el logo (0.10 – 0.30). */
  logoScale: number;
  caption: string;
  captionSize: number;
  captionAlign: QrCaptionAlign;
};

export type QrHistoryEntry = {
  id: string;
  name: string;
  type: QrType;
  /** Contenido codificado, para mostrarlo y copiarlo sin recalcular. */
  value: string;
  form: QrFormValues;
  style: QrStyle;
  createdAt: string;
  updatedAt: string;
};

export const QR_SIZES = [256, 512, 1024, 2048] as const;

export const QR_ERROR_LEVELS: {
  id: QrErrorCorrection;
  label: string;
  recovery: string;
}[] = [
  { id: "L", label: "L · Baja", recovery: "~7%" },
  { id: "M", label: "M · Media", recovery: "~15%" },
  { id: "Q", label: "Q · Alta", recovery: "~25%" },
  { id: "H", label: "H · Máxima", recovery: "~30%" },
];

export const QR_MODULE_STYLES: { id: QrModuleStyle; label: string }[] = [
  { id: "square", label: "Cuadrados" },
  { id: "rounded", label: "Redondeados" },
  { id: "dots", label: "Puntos" },
];

export type QrTypeDefinition = {
  id: QrType;
  label: string;
  /** Nombre del icono; el mapeo a lucide vive en la capa de UI. */
  icon:
    | "whatsapp"
    | "link"
    | "instagram"
    | "menu"
    | "maps"
    | "text"
    | "email"
    | "phone"
    | "sms"
    | "wifi";
  helper: string;
  example: string;
  /** Si el contenido puede abrirse en una pestaña nueva con "Probar". */
  openable: boolean;
};

export const QR_TYPES: QrTypeDefinition[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    helper: "Abre un chat contigo con el mensaje ya escrito.",
    example: "https://wa.me/18095551234?text=Hola",
    openable: true,
  },
  {
    id: "url",
    label: "Página web",
    icon: "link",
    helper: "Abre tu sitio, tu landing o cualquier enlace.",
    example: "https://devstudioo.com",
    openable: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "instagram",
    helper: "Lleva al perfil de tu negocio.",
    example: "https://instagram.com/dev_studioo",
    openable: true,
  },
  {
    id: "menu",
    label: "Menú digital",
    icon: "menu",
    helper: "Abre el menú o catálogo online de tu negocio.",
    example: "https://midominio.com/menu/restaurante",
    openable: true,
  },
  {
    id: "maps",
    label: "Google Maps",
    icon: "maps",
    helper: "Abre tu ubicación con la ruta lista.",
    example: "https://maps.google.com/?q=Dev+Studio",
    openable: true,
  },
  {
    id: "text",
    label: "Texto",
    icon: "text",
    helper: "Muestra un texto al escanear, sin abrir nada.",
    example: "Wifi de cortesía para clientes",
    openable: false,
  },
  {
    id: "email",
    label: "Email",
    icon: "email",
    helper: "Abre el correo con destinatario y asunto listos.",
    example: "mailto:hola@negocio.com?subject=Pedido",
    openable: true,
  },
  {
    id: "phone",
    label: "Teléfono",
    icon: "phone",
    helper: "Marca tu número al escanear.",
    example: "tel:+18095551234",
    openable: true,
  },
  {
    id: "sms",
    label: "SMS",
    icon: "sms",
    helper: "Abre un mensaje de texto con el contenido listo.",
    example: "sms:+18095551234?body=Hola",
    openable: true,
  },
  {
    id: "wifi",
    label: "WiFi",
    icon: "wifi",
    helper: "Conecta al WiFi sin dictar la contraseña.",
    example: "WIFI:T:WPA;S:MiRed;P:clave;;",
    openable: false,
  },
];

export const DEFAULT_QR_FORM: QrFormValues = {
  countryCode: "1",
  phone: "",
  message: "",
  url: "",
  instagram: "",
  placeName: "",
  address: "",
  mapsMode: "url",
  text: "",
  email: "",
  subject: "",
  body: "",
  ssid: "",
  password: "",
  security: "WPA",
  hidden: false,
};

export const DEFAULT_QR_STYLE: QrStyle = {
  foreground: "#171311",
  background: "#ffffff",
  size: 512,
  margin: 2,
  errorCorrection: "M",
  moduleStyle: "square",
  logoDataUrl: null,
  logoEnabled: false,
  logoScale: 0.18,
  caption: "",
  captionSize: 18,
  captionAlign: "center",
};

export function getQrType(id: QrType): QrTypeDefinition {
  const found = QR_TYPES.find((item) => item.id === id);
  if (!found) throw new Error(`Tipo de QR no registrado: ${id}`);
  return found;
}
