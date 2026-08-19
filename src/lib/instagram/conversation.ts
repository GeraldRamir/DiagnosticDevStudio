export type IgIntent =
  | "diagnostico"
  | "cotizar"
  | "precio"
  | "web"
  | "sistema"
  | "app"
  | "menu";

export type IgQuickReply = {
  content_type: "text";
  title: string;
  payload: string;
};

export type IgReply = {
  text: string;
  quickReplies: IgQuickReply[];
};

const MENU_REPLIES: IgQuickReply[] = [
  { content_type: "text", title: "Diagnóstico", payload: "DIAGNOSTICO" },
  { content_type: "text", title: "Cotizar", payload: "COTIZAR" },
  { content_type: "text", title: "Precios", payload: "PRECIO" },
];

const PAYLOAD_INTENT: Record<string, IgIntent> = {
  DIAGNOSTICO: "diagnostico",
  COTIZAR: "cotizar",
  PRECIO: "precio",
  WEB: "web",
  SISTEMA: "sistema",
  APP: "app",
  MENU: "menu",
};

const RULES: Array<{ intent: IgIntent; tests: RegExp[] }> = [
  { intent: "diagnostico", tests: [/\bdiagn[oó]stico\b/i, /\breporte\b/i, /\bpuntaje\b/i, /^1$/] },
  { intent: "cotizar", tests: [/\bcotiz/i, /\bpresupuesto\b/i, /\bpropuesta\b/i, /^2$/] },
  { intent: "precio", tests: [/\bprecio/i, /\bcuesta\b/i, /\bcosto\b/i, /\bcu[aá]nto\b/i, /^3$/] },
  { intent: "web", tests: [/\bsitio\b/i, /\bp[aá]gina\b/i, /\btienda\b/i, /\bweb\b/i, /\bshopify\b/i] },
  { intent: "sistema", tests: [/\bsistema\b/i, /\bcrm\b/i, /\bpanel\b/i, /\binventario\b/i] },
  { intent: "app", tests: [/\bapp\b/i, /\bios\b/i, /\bandroid\b/i, /\bm[oó]vil\b/i] },
];

export function classifyIntent(text: string, payload?: string | null): IgIntent {
  const fromPayload = payload ? PAYLOAD_INTENT[payload.trim().toUpperCase()] : undefined;
  if (fromPayload) return fromPayload;

  const hay = (text || "").trim();
  if (!hay) return "menu";

  for (const rule of RULES) {
    if (rule.tests.some((re) => re.test(hay))) return rule.intent;
  }
  return "menu";
}

export function isMagnetComment(text: string): boolean {
  return /\bdiagn[oó]stico\b|\breporte gratis\b|\breporte\b/i.test((text || "").trim());
}

export function buildReply(
  intent: IgIntent,
  urls: { diagnostic: string; quote: string; site: string },
): IgReply {
  switch (intent) {
    case "diagnostico":
      return {
        text: [
          "Perfecto. El diagnóstico digital es gratis, toma 2 minutos y no pide tarjeta.",
          `Entra aquí: ${urls.diagnostic}`,
          "Te devolvemos un puntaje 0–100 y hallazgos concretos.",
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
    case "cotizar":
      return {
        text: [
          "Armamos una cotización por línea (web, sistema, app, desktop o SaaS).",
          `Elige servicios aquí: ${urls.quote}`,
          "Si aún no tienes claro el alcance, empieza por el diagnóstico.",
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
    case "precio":
      return {
        text: [
          "Los precios de partida están en el catálogo. El alcance final se cierra en una reunión de 30 minutos.",
          `Ver planes: ${urls.quote}`,
          `O mide primero tu negocio: ${urls.diagnostic}`,
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
    case "web":
      return {
        text: [
          "Sitios y tiendas pensados para convertir, no para quedar de folleto.",
          `Cotiza la línea web: ${urls.quote}`,
          `Sitio: ${urls.site}`,
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
    case "sistema":
      return {
        text: [
          "Sistemas internos, paneles y CRMs para dejar WhatsApp + Excel atrás.",
          `Cotiza sistemas: ${urls.quote}`,
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
    case "app":
      return {
        text: [
          "Apps iOS y Android con una sola base, listas para operar de verdad.",
          `Cotiza móvil: ${urls.quote}`,
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
    default:
      return {
        text: [
          "Hola, soy Dev Studio.",
          "¿Qué necesitas?",
          "1) Diagnóstico gratis de tu negocio",
          "2) Cotizar un proyecto",
          "3) Ver precios",
          "También puedes comentar DIAGNOSTICO en un post y te mando el link por DM.",
        ].join("\n"),
        quickReplies: MENU_REPLIES,
      };
  }
}

export function magnetPrivateReply(diagnosticUrl: string): string {
  return [
    "Recibí tu comentario. Aquí tienes el diagnóstico digital gratis (2 min, sin tarjeta):",
    diagnosticUrl,
    "Si prefieres, responde este DM y te oriento.",
  ].join("\n");
}

export function magnetPublicReply(): string {
  return "Te envié el diagnóstico por DM.";
}
