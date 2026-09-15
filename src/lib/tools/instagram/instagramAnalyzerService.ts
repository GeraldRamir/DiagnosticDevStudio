import { sanitizeMultiline, sanitizePlainText } from "@/lib/utils/sanitize";

export type InstagramGoal =
  | "clientes"
  | "productos"
  | "mensajes"
  | "reconocimiento"
  | "trafico";

export type InstagramChecklistKey =
  | "website"
  | "whatsapp"
  | "catalog"
  | "digitalMenu"
  | "cta"
  | "reels"
  | "educational"
  | "testimonials"
  | "offers";

export type InstagramChecklist = Record<InstagramChecklistKey, boolean>;

export type InstagramAnalyzerInput = {
  username: string;
  businessName: string;
  businessType: string;
  city: string;
  goal: InstagramGoal | "";
  currentBio: string;
  profileImages: number;
  postImages: number;
  checklist: InstagramChecklist;
};

export type InstagramCategoryId =
  | "perfil"
  | "branding"
  | "conversion"
  | "contenido"
  | "presencia";

export type InstagramCategoryScore = {
  id: InstagramCategoryId;
  label: string;
  score: number;
};

export type InstagramAnalyzerResult = {
  total: number;
  categories: InstagramCategoryScore[];
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
  currentBio: string;
  suggestedBio: string;
  bioNeedsWork: boolean;
};

export const INSTAGRAM_GOALS: { id: InstagramGoal; label: string }[] = [
  { id: "clientes", label: "Conseguir más clientes" },
  { id: "productos", label: "Vender productos" },
  { id: "mensajes", label: "Conseguir mensajes" },
  { id: "reconocimiento", label: "Crear reconocimiento" },
  { id: "trafico", label: "Llevar tráfico a una web" },
];

export const INSTAGRAM_CHECKLIST: {
  key: InstagramChecklistKey;
  label: string;
}[] = [
  { key: "website", label: "¿Tienes página web?" },
  { key: "whatsapp", label: "¿Tienes WhatsApp?" },
  { key: "catalog", label: "¿Tienes catálogo?" },
  { key: "digitalMenu", label: "¿Tienes menú digital?" },
  { key: "cta", label: "¿Utilizas CTA en tus publicaciones?" },
  { key: "reels", label: "¿Publicas Reels?" },
  { key: "educational", label: "¿Publicas contenido educativo?" },
  { key: "testimonials", label: "¿Publicas testimonios?" },
  { key: "offers", label: "¿Publicas ofertas/productos?" },
];

export const EMPTY_CHECKLIST: InstagramChecklist = {
  website: false,
  whatsapp: false,
  catalog: false,
  digitalMenu: false,
  cta: false,
  reels: false,
  educational: false,
  testimonials: false,
  offers: false,
};

const GOAL_CTA: Record<InstagramGoal, string> = {
  clientes: "Escríbenos para cotizar",
  productos: "Pide por DM o WhatsApp",
  mensajes: "Envíanos un mensaje hoy",
  reconocimiento: "Síguenos para inspirarte",
  trafico: "Visita nuestra web",
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function suggestInstagramBio(input: InstagramAnalyzerInput): string {
  const name = sanitizePlainText(input.businessName || "Tu negocio", 60);
  const type = sanitizePlainText(input.businessType || "negocio local", 40);
  const city = sanitizePlainText(input.city, 40);
  const handle = sanitizePlainText(input.username.replace(/^@/, ""), 30);
  const goal = input.goal || "clientes";
  const location = city ? ` · ${city}` : "";
  const contact = input.checklist.whatsapp
    ? "WhatsApp en el enlace"
    : input.checklist.website
      ? "Link en la bio"
      : "Escríbenos por DM";

  return [
    `${name}${location}`,
    `${type} con atención cercana y resultados claros.`,
    GOAL_CTA[goal],
    contact,
    handle ? `@${handle}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Servicio local de análisis.
 * Más adelante se puede reemplazar por un backend que conecte Meta API,
 * visión artificial y un proveedor de IA sin cambiar la UI.
 */
export interface InstagramAnalyzerService {
  analyze(input: InstagramAnalyzerInput): Promise<InstagramAnalyzerResult>;
}

export class LocalInstagramAnalyzerService implements InstagramAnalyzerService {
  async analyze(input: InstagramAnalyzerInput): Promise<InstagramAnalyzerResult> {
    const usernameScore = input.username.trim() ? 78 : 20;
    const profileScore = input.profileImages > 0 ? 86 : 42;
    const bioScore = input.currentBio.trim().length >= 40 ? 84 : input.currentBio.trim() ? 58 : 30;
    const perfil = clampScore(average([usernameScore, profileScore, bioScore]));

    const branding = clampScore(
      average([
        input.businessName ? 88 : 40,
        input.businessType ? 82 : 45,
        input.city ? 75 : 50,
        input.profileImages > 0 ? 80 : 48,
      ]),
    );

    const conversion = clampScore(
      average([
        input.checklist.cta ? 86 : 48,
        input.checklist.whatsapp ? 84 : 46,
        input.checklist.catalog || input.checklist.digitalMenu ? 80 : 44,
        input.checklist.offers ? 78 : 50,
        input.goal ? 82 : 55,
      ]),
    );

    const contenido = clampScore(
      average([
        input.checklist.reels ? 84 : 46,
        input.checklist.educational ? 80 : 52,
        input.checklist.testimonials ? 78 : 50,
        input.postImages > 0 ? 74 : 42,
        input.postImages >= 3 ? 82 : 60,
      ]),
    );

    const presencia = clampScore(
      average([
        input.checklist.website ? 86 : 48,
        input.checklist.whatsapp ? 82 : 50,
        input.checklist.catalog ? 76 : 52,
        input.checklist.digitalMenu ? 74 : 54,
        input.username.trim() ? 80 : 40,
      ]),
    );

    const categories: InstagramCategoryScore[] = [
      { id: "perfil", label: "Perfil", score: perfil },
      { id: "branding", label: "Branding", score: branding },
      { id: "conversion", label: "Conversión", score: conversion },
      { id: "contenido", label: "Contenido", score: contenido },
      { id: "presencia", label: "Presencia digital", score: presencia },
    ];

    const total = clampScore(average(categories.map((item) => item.score)));
    const strengths: string[] = [];
    const opportunities: string[] = [];
    const recommendations: string[] = [];

    if (perfil >= 70) strengths.push("Tu perfil tiene una base clara para transmitir confianza.");
    else opportunities.push("El perfil todavía no comunica con suficiente claridad quién eres.");

    if (branding >= 70) strengths.push("El negocio está bien identificado (nombre, rubro y ciudad).");
    else opportunities.push("El branding del perfil puede ser más específico y memorable.");

    if (conversion >= 70) strengths.push("Ya hay caminos de conversión (CTA, WhatsApp o catálogo).");
    else {
      opportunities.push("Instagram todavía no está optimizado para convertir visitas en clientes.");
      recommendations.push(
        "Agrega un CTA visible en la bio y en las publicaciones: WhatsApp, menú o reserva.",
      );
    }

    if (contenido >= 70) strengths.push("El contenido cubre formatos que hoy ayudan a alcanzar clientes.");
    else {
      opportunities.push("El contenido aún no cubre educación, prueba social o Reels de forma consistente.");
      recommendations.push("Publica Reels cortos, un testimonio y una oferta o producto cada semana.");
    }

    if (presencia >= 70) strengths.push("Tu presencia digital fuera de Instagram ya da soporte al perfil.");
    else {
      opportunities.push("Falta conectar Instagram con web, WhatsApp o un catálogo/menú digital.");
      recommendations.push("Enlaza WhatsApp y, si aplica, un menú o catálogo digital desde la bio.");
    }

    if (!input.currentBio.trim() || input.currentBio.trim().length < 40) {
      opportunities.push("Tu bio podría mejorar");
      recommendations.push("Usa una bio con nombre, propuesta de valor, ciudad y un CTA único.");
    }

    if (input.profileImages === 0) {
      recommendations.push("Sube una captura de tu perfil para revisar foto, highlights y orden visual.");
    }

    const suggestedBio = suggestInstagramBio(input);

    return {
      total,
      categories,
      strengths,
      opportunities,
      recommendations,
      currentBio: sanitizeMultiline(input.currentBio, 300),
      suggestedBio,
      bioNeedsWork: !input.currentBio.trim() || input.currentBio.trim().length < 40,
    };
  }
}

/**
 * Stub para conectar Meta Graph API, visión artificial y un proveedor de IA.
 * La UI debe depender de la interfaz, no de esta clase.
 */
export class ApiInstagramAnalyzerService implements InstagramAnalyzerService {
  async analyze(input: InstagramAnalyzerInput): Promise<InstagramAnalyzerResult> {
    void input;
    throw new Error("ApiInstagramAnalyzerService aún no está conectado.");
  }
}

export const instagramAnalyzerService: InstagramAnalyzerService =
  new LocalInstagramAnalyzerService();
