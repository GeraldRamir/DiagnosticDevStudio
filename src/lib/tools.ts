import type {
  RecommendationCard,
  ToolCategory,
  ToolDefinition,
  ToolId,
} from "@/types/tools";

export const TOOL_CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: "marketing", label: "Marketing" },
  { id: "ventas", label: "Ventas" },
  { id: "comunicacion", label: "Comunicación" },
  { id: "digitalizacion", label: "Digitalización" },
  { id: "productividad", label: "Productividad" },
];

/**
 * Registro de herramientas.
 * Para agregar una sexta herramienta: añade un objeto aquí y crea
 * `app/tools/<slug>/page.tsx` + componentes/servicios propios.
 */
export const TOOLS: readonly ToolDefinition[] = [
  {
    id: "diagnostico-digital",
    name: "Diagnóstico Digital de Negocios",
    shortName: "Diagnóstico Digital",
    slug: "diagnostico-digital",
    href: "/tools/diagnostico-digital",
    description:
      "Determina qué tan digitalizado está tu negocio y detecta oportunidades de mejora.",
    cardDescription:
      "Descubre qué tan preparado está tu negocio para crecer digitalmente.",
    icon: "activity",
    category: "digitalizacion",
    status: "available",
    accent: "#90BF53",
    features: [
      "Cuestionario guiado en 4 secciones",
      "Análisis automático de tu negocio",
      "Dashboard personalizado con recomendaciones",
    ],
    cta: "Usar herramienta",
    seoTitle: "Diagnóstico Digital de Negocios Gratis | Dev Studio",
    seoDescription:
      "Responde el cuestionario, recibe un dashboard personalizado con puntaje, fortalezas y recomendaciones para digitalizar tu negocio.",
  },
  {
    id: "instagram-analyzer",
    name: "Analizador de Instagram para Negocios",
    shortName: "Analizador de Instagram",
    slug: "instagram-analyzer",
    href: "/tools/instagram-analyzer",
    description:
      "Analiza tu perfil de Instagram con la información que tú proporcionas y recibe un puntaje accionable.",
    cardDescription:
      "Descubre oportunidades para convertir tu Instagram en una herramienta de ventas.",
    icon: "instagram",
    category: "marketing",
    status: "available",
    accent: "#90BF53",
    features: [
      "Análisis por categorías",
      "Propuesta de bio mejorada",
      "Arquitectura lista para Meta API e IA",
    ],
    cta: "Usar herramienta",
    seoTitle: "Analizador de Instagram para Negocios | Dev Studio",
    seoDescription:
      "Analiza tu Instagram de negocio y recibe recomendaciones para convertir tu perfil en una herramienta de ventas.",
  },
  {
    id: "whatsapp-generator",
    name: "Generador de Links de WhatsApp",
    shortName: "Link de WhatsApp",
    slug: "whatsapp-generator",
    href: "/tools/whatsapp-generator",
    description:
      "Crea un enlace de WhatsApp personalizado con mensaje automático para recibir clientes.",
    cardDescription: "Crea un enlace de WhatsApp personalizado para recibir clientes.",
    icon: "message-circle",
    category: "comunicacion",
    status: "available",
    accent: "#90BF53",
    features: [
      "Mensaje automático",
      "Presets listos para usar",
      "Copiar, compartir y generar QR",
    ],
    cta: "Usar herramienta",
    seoTitle: "Generador de Link de WhatsApp Gratis | Dev Studio",
    seoDescription:
      "Crea gratis tu link de WhatsApp personalizado con mensaje automático. Compártelo en Instagram, redes sociales, páginas web y más.",
  },
  {
    id: "qr-generator",
    name: "Generador de QR para Negocios",
    shortName: "Generador de QR",
    slug: "qr-generator",
    href: "/tools/qr-generator",
    description:
      "Genera códigos QR reales para WhatsApp, Instagram, web, mapas, menú, texto o WiFi.",
    cardDescription: "Crea códigos QR para conectar a tus clientes con tu negocio.",
    icon: "qr-code",
    category: "productividad",
    status: "available",
    accent: "#90BF53",
    features: [
      "Varios destinos de negocio",
      "Descarga PNG y SVG",
      "Logo y texto inferior opcionales",
    ],
    cta: "Usar herramienta",
    seoTitle: "Generador de QR Gratis para Negocios | Dev Studio",
    seoDescription:
      "Crea códigos QR gratis para WhatsApp, Instagram, menús, páginas web, WiFi, Google Maps y más.",
  },
  {
    id: "menu-digital",
    name: "Generador de Menú Digital",
    shortName: "Menú Digital",
    slug: "menu-digital",
    href: "/tools/menu-digital",
    description:
      "Crea un menú digital que tus clientes pueden consultar desde cualquier dispositivo.",
    cardDescription:
      "Crea un menú digital que tus clientes puedan consultar desde cualquier dispositivo.",
    icon: "utensils",
    category: "ventas",
    status: "available",
    accent: "#90BF53",
    features: [
      "Categorías y productos",
      "Vista previa real",
      "Enlace, QR y almacenamiento local",
    ],
    cta: "Usar herramienta",
    seoTitle: "Generador de Menú Digital Gratis | Dev Studio",
    seoDescription:
      "Crea un menú digital para tu negocio, previsualízalo y compártelo con un enlace o código QR.",
  },
] as const;

export const HOME_RECOMMENDATIONS: readonly RecommendationCard[] = [
  {
    id: "presencia",
    title: "Quiero mejorar mi presencia digital",
    description: "Empieza con un diagnóstico para saber en qué punto está tu negocio.",
    toolId: "diagnostico-digital",
  },
  {
    id: "instagram",
    title: "Quiero conseguir más clientes desde Instagram",
    description: "Analiza tu perfil y recibe recomendaciones de conversión.",
    toolId: "instagram-analyzer",
  },
  {
    id: "contacto",
    title: "Quiero facilitar que mis clientes me contacten",
    description: "Genera un enlace de WhatsApp listo para compartir.",
    toolId: "whatsapp-generator",
  },
  {
    id: "digitalizar",
    title: "Quiero digitalizar mi negocio",
    description: "Crea un menú digital que tus clientes puedan abrir en el celular.",
    toolId: "menu-digital",
  },
];

const toolsById = new Map(TOOLS.map((tool) => [tool.id, tool]));
const toolsBySlug = new Map(TOOLS.map((tool) => [tool.slug, tool]));

export function getToolById(id: ToolId): ToolDefinition {
  const tool = toolsById.get(id);
  if (!tool) {
    throw new Error(`Herramienta no registrada: ${id}`);
  }
  return tool;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolsBySlug.get(slug);
}

export function getAvailableTools(): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.status === "available");
}

export function filterTools(input: {
  query?: string;
  category?: ToolCategory | "all";
}): ToolDefinition[] {
  const query = input.query?.trim().toLowerCase() ?? "";
  const category = input.category ?? "all";

  return TOOLS.filter((tool) => {
    const matchesCategory = category === "all" || tool.category === category;
    if (!matchesCategory) return false;
    if (!query) return true;

    const haystack = [
      tool.name,
      tool.shortName,
      tool.description,
      tool.cardDescription,
      ...tool.features,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getCategoryLabel(category: ToolCategory): string {
  return TOOL_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}
