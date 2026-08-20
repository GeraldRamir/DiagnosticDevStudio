import { daysSinceIso, normalizeInstagramUsername } from "@/lib/analysis/instagram-utils";
import type { InstagramMetrics } from "@/lib/analysis/types";

export type BioInsightStatus = "ok" | "warn" | "fail";

export type InstagramBioInsight = {
  id: string;
  label: string;
  status: BioInsightStatus;
  detail: string;
};

export type BioLinkType = "website" | "whatsapp" | "instagram" | "other" | "none";

export type InstagramDashboardSummary = {
  username: string;
  found: boolean;
  source: InstagramMetrics["source"];
  followers: number | null;
  following: number | null;
  posts: number | null;
  biography: string | null;
  externalUrl: string | null;
  hasWebsiteInBio: boolean;
  bioLinkType: BioLinkType;
  isPrivate: boolean | null;
  isBusiness: boolean | null;
  lastPostAt: string | null;
  daysSinceLastPost: number | null;
  postsLast30Days: number | null;
  avgLikes: number | null;
  avgComments: number | null;
  engagementRate: number | null;
  hasReels: boolean | null;
  reach7d: number | null;
  impressions7d: number | null;
  profileViews7d: number | null;
  oauthConnected: boolean;
  bioImprovements: InstagramBioInsight[];
  dataUnavailable?: boolean;
  unavailableReason?: string | null;
};

const CTA_PATTERN =
  /\b(whatsapp|wa\.me|escr[ií]b|dm|mensaje|pedido|reserva|cita|link|bio|cat[aá]logo|tienda|web|vis[ií]t|cont[aá]ct)\b/i;

function classifyBioLink(url: string | null | undefined): BioLinkType {
  if (!url?.trim()) return "none";
  const lower = url.toLowerCase();
  if (lower.includes("wa.me") || lower.includes("whatsapp.com") || lower.includes("api.whatsapp")) {
    return "whatsapp";
  }
  if (lower.includes("instagram.com") || lower.includes("instagr.am")) {
    return "instagram";
  }
  if (/^https?:\/\//i.test(url) || lower.includes(".") ) {
    return "website";
  }
  return "other";
}

function isRealWebsite(linkType: BioLinkType) {
  return linkType === "website";
}

export function analyzeInstagramBio(metrics: InstagramMetrics): InstagramBioInsight[] {
  const insights: InstagramBioInsight[] = [];
  const bio = metrics.biography?.trim() ?? "";
  const linkType = classifyBioLink(metrics.externalUrl);
  const hasWebsite = isRealWebsite(linkType);

  if (linkType === "none") {
    insights.push({
      id: "bio_link",
      label: "Agrega un enlace en la biografía",
      status: "fail",
      detail:
        "No hay link en bio. Usa tu único enlace para WhatsApp, sitio web o catálogo — es el principal puente entre Instagram y ventas.",
    });
  } else if (linkType === "whatsapp") {
    insights.push({
      id: "bio_link",
      label: "Solo WhatsApp en bio",
      status: "warn",
      detail:
        "Tienes WhatsApp en bio (bien para contacto). Considera también un sitio o landing para dar más confianza y medir visitas.",
    });
  } else if (linkType === "instagram") {
    insights.push({
      id: "bio_link",
      label: "El enlace apunta a Instagram",
      status: "warn",
      detail: "El link en bio no lleva fuera de Instagram. Apunta a tu web, catálogo o WhatsApp.",
    });
  } else {
    insights.push({
      id: "bio_link",
      label: "Enlace en biografía activo",
      status: "ok",
      detail: metrics.externalUrl
        ? `Detectamos: ${metrics.externalUrl}`
        : "Hay un enlace externo configurado.",
    });
  }

  if (!bio) {
    insights.push({
      id: "bio_text",
      label: "Biografía vacía",
      status: "fail",
      detail:
        "Escribe qué haces, para quién y dónde operas. Ejemplo: “Restaurante familiar · pedidos y reservas · Santo Domingo”.",
    });
  } else if (bio.length < 40) {
    insights.push({
      id: "bio_text",
      label: "Biografía muy corta",
      status: "warn",
      detail:
        `Solo ${bio.length} caracteres. Añade propuesta de valor, zona y un llamado a la acción (pedidos, reservas, DM).`,
    });
  } else if (bio.length > 150) {
    insights.push({
      id: "bio_text",
      label: "Biografía larga — prioriza lo esencial",
      status: "warn",
      detail:
        "Las primeras líneas son las que se ven sin expandir. Coloca lo más importante al inicio: qué vendes y cómo contactarte.",
    });
  } else if (!CTA_PATTERN.test(bio)) {
    insights.push({
      id: "bio_cta",
      label: "Falta llamado a la acción",
      status: "warn",
      detail:
        "Incluye un CTA claro: “Escríbenos por WhatsApp”, “Link en bio”, “Reserva aquí” o similar.",
    });
  } else {
    insights.push({
      id: "bio_text",
      label: "Biografía con contexto",
      status: "ok",
      detail: "La bio comunica actividad y tiene señales de llamado a la acción.",
    });
  }

  if (metrics.isPrivate) {
    insights.push({
      id: "bio_private",
      label: "Cuenta privada",
      status: "warn",
      detail:
        "Para negocio local, un perfil público facilita descubrimiento por hashtags y recomendaciones.",
    });
  }

  if (metrics.isBusiness === false) {
    insights.push({
      id: "bio_business",
      label: "Perfil personal (no comercial)",
      status: "warn",
      detail:
        "Convierte a cuenta Business o Creator para botones de contacto, insights y credibilidad.",
    });
  }

  const days = daysSinceIso(metrics.lastPostAt);
  if (days != null && days > 30) {
    insights.push({
      id: "bio_activity",
      label: "Sin publicaciones recientes",
      status: "fail",
      detail: `Último post hace ${days} días. Perfiles activos generan más confianza al visitar desde la bio.`,
    });
  } else if (days != null && days > 14) {
    insights.push({
      id: "bio_activity",
      label: "Poca actividad reciente",
      status: "warn",
      detail: `Último post hace ${days} días. Publicar al menos cada 2 semanas mantiene el perfil “vivo”.`,
    });
  }

  if (metrics.followers != null && metrics.followers < 100) {
    insights.push({
      id: "bio_audience",
      label: "Base de seguidores pequeña",
      status: "warn",
      detail:
        `${metrics.followers.toLocaleString("es")} seguidores. Refuerza la bio con prueba social (años en el mercado, especialidad, zona).`,
    });
  }

  if (!hasWebsite && linkType !== "none") {
    insights.push({
      id: "bio_website",
      label: "Sin sitio web en bio",
      status: "warn",
      detail:
        "No detectamos un dominio propio en el enlace. Un sitio ayuda a medir tráfico y transmitir seriedad.",
    });
  } else if (hasWebsite) {
    insights.push({
      id: "bio_website",
      label: "Sitio web en bio",
      status: "ok",
      detail: "El enlace en bio dirige a una presencia web fuera de Instagram.",
    });
  }

  return insights;
}

export function buildInstagramDashboardSummary(
  metrics: InstagramMetrics | null | undefined,
  handle?: string | null,
): InstagramDashboardSummary | null {
  const username = normalizeInstagramUsername(metrics?.username || handle || "");
  if (!username) return null;

  if (!metrics?.found) {
    return {
      username,
      found: false,
      source: metrics?.source ?? null,
      followers: null,
      following: null,
      posts: null,
      biography: null,
      externalUrl: null,
      hasWebsiteInBio: false,
      bioLinkType: "none",
      isPrivate: null,
      isBusiness: null,
      lastPostAt: null,
      daysSinceLastPost: null,
      postsLast30Days: null,
      avgLikes: null,
      avgComments: null,
      engagementRate: null,
      hasReels: null,
      reach7d: null,
      impressions7d: null,
      profileViews7d: null,
      oauthConnected: false,
      bioImprovements: [],
      dataUnavailable: true,
      unavailableReason:
        metrics?.error ??
        "Instagram ya no expone seguidores ni bio de forma pública. Conecta tu cuenta con el botón «Conectar Instagram» al completar el diagnóstico para ver métricas reales.",
    };
  }

  const linkType = classifyBioLink(metrics.externalUrl);
  const engagementRate =
    metrics.avgLikes != null && metrics.followers && metrics.followers > 0
      ? Number(
          (
            ((metrics.avgLikes + (metrics.avgComments ?? 0)) / metrics.followers) *
            100
          ).toFixed(1),
        )
      : null;

  return {
    username: metrics.username,
    found: true,
    source: metrics.source ?? null,
    followers: metrics.followers,
    following: metrics.following,
    posts: metrics.posts,
    biography: metrics.biography,
    externalUrl: metrics.externalUrl,
    hasWebsiteInBio: isRealWebsite(linkType),
    bioLinkType: linkType,
    isPrivate: metrics.isPrivate,
    isBusiness: metrics.isBusiness,
    lastPostAt: metrics.lastPostAt,
    daysSinceLastPost: daysSinceIso(metrics.lastPostAt),
    postsLast30Days: metrics.postsLast30Days,
    avgLikes: metrics.avgLikes,
    avgComments: metrics.avgComments,
    engagementRate,
    hasReels: metrics.hasReels,
    reach7d: metrics.reach7d ?? null,
    impressions7d: metrics.impressions7d ?? null,
    profileViews7d: metrics.profileViews7d ?? null,
    oauthConnected: Boolean(metrics.oauthConnected),
    bioImprovements: analyzeInstagramBio(metrics),
  };
}
