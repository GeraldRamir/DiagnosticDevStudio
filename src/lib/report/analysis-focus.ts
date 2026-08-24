import type { InstagramDashboardSummary } from "@/lib/analysis/instagram-bio";
import type { WebsiteDashboardSummary } from "@/lib/analysis/website-dashboard";
import type { HasWebsite, InstagramMetrics, Signal, TechnicalMetrics } from "@/lib/analysis/types";

export type AnalysisFocus = "instagram" | "website" | "hybrid" | "operations";

export type ChannelKpi = {
  label: string;
  value: number | null;
  suffix?: string;
  display?: string | null;
};

export const FOCUS_LABELS: Record<AnalysisFocus, string> = {
  instagram: "Análisis de Instagram",
  website: "Análisis web",
  hybrid: "Instagram + sitio web",
  operations: "Operación digital",
};

export const FOCUS_SUBTITLES: Record<AnalysisFocus, string> = {
  instagram: "Métricas e insights de tu perfil de Instagram",
  website: "Rendimiento, SEO y captación de tu sitio",
  hybrid: "Presencia en Instagram y rendimiento web",
  operations: "Canales, procesos y datos del negocio",
};

export const FOCUS_GREETINGS: Record<AnalysisFocus, string> = {
  instagram: "Tu diagnóstico de Instagram está listo",
  website: "Tu diagnóstico web está listo",
  hybrid: "Tu diagnóstico digital está listo",
  operations: "Tu diagnóstico está listo",
};

export const FOCUS_NARRATIVE_HINTS: Record<AnalysisFocus, string> = {
  instagram:
    "El negocio declaró presencia principal en Instagram. Prioriza hallazgos sobre bio, engagement, frecuencia de publicación, link en bio e insights de la cuenta. No centres el reporte en velocidad web salvo que haya señales web críticas.",
  website:
    "El negocio tiene sitio web. Prioriza hallazgos sobre velocidad, SEO, HTTPS, captación en el sitio y experiencia móvil. Menciona Instagram solo si hay señales relevantes de captación.",
  hybrid:
    "El negocio combina Instagram y sitio web. Equilibra hallazgos entre perfil social y rendimiento web, citando métricas de ambos canales.",
  operations:
    "El negocio no tiene sitio web ni Instagram conectado. Enfócate en operación, canales de pedido, registro de datos y horas administrativas.",
};

export function resolveAnalysisFocus(input: {
  hasWebsite: HasWebsite | string;
  instagram: InstagramMetrics | null | undefined;
  technical: TechnicalMetrics | null | undefined;
  instagramHandle?: string | null;
}): AnalysisFocus {
  const hasIg =
    Boolean(input.instagram?.found) || Boolean(input.instagramHandle?.trim());
  const hasWeb =
    input.hasWebsite === "yes" &&
    Boolean(input.technical && (input.technical.reachable || input.technical.performanceScore != null));

  if (input.hasWebsite === "social_only") {
    return hasIg ? "instagram" : "operations";
  }
  if (input.hasWebsite === "yes") {
    if (hasWeb && hasIg) return "hybrid";
    if (hasWeb) return "website";
    if (hasIg) return "instagram";
    return "website";
  }
  if (hasIg) return "instagram";
  return "operations";
}

const IG_SIGNAL = /\.ig_|^captacion\.instagram$/;
const WEB_SIGNAL = /^rendimiento\.|^presencia\.(reachable|own_domain|https|indexable)/;
const WEB_CAPTACION = /^captacion\.(whatsapp|form|og|cta)/;

export function filterSignalsForFocus(
  signals: Signal[],
  focus: AnalysisFocus,
): Signal[] {
  if (focus === "hybrid") return signals;

  return signals.filter((signal) => {
    const shared =
      signal.pillar === "operacion" ||
      signal.pillar === "datos" ||
      signal.id === "presencia.has_website";

    if (focus === "instagram") {
      return shared || IG_SIGNAL.test(signal.id) || signal.id === "captacion.no_site_cta";
    }
    if (focus === "website") {
      return (
        shared ||
        WEB_SIGNAL.test(signal.id) ||
        WEB_CAPTACION.test(signal.id) ||
        signal.id === "captacion.orders_whatsapp"
      );
    }
    return shared || signal.id === "presencia.no_site_cap";
  });
}

export function buildChannelKpis(input: {
  focus: AnalysisFocus;
  instagram: InstagramDashboardSummary | null;
  website: WebsiteDashboardSummary | null;
  globalScore: number;
  hoursRecoverable: number;
}): ChannelKpi[] {
  const { focus, instagram, website, globalScore, hoursRecoverable } = input;

  if (focus === "instagram" && instagram) {
    return [
      { label: "Seguidores", value: instagram.followers },
      {
        label: "Engagement",
        value: instagram.engagementRate,
        suffix: instagram.engagementRate != null ? "%" : undefined,
      },
      { label: "Publicaciones", value: instagram.posts },
      {
        label: "Alcance reciente",
        value: instagram.reach7d,
        display: instagram.reach7d == null ? "—" : null,
      },
    ];
  }

  if (focus === "website" && website) {
    return [
      {
        label: "Velocidad móvil",
        value: website.performanceScore,
        suffix: website.performanceScore != null ? "/100" : undefined,
      },
      {
        label: "SEO",
        value: website.seoScore,
        suffix: website.seoScore != null ? "/100" : undefined,
      },
      {
        label: "LCP",
        value: website.lcpSeconds,
        suffix: website.lcpSeconds != null ? " s" : undefined,
        display: website.lcpSeconds != null ? `${website.lcpSeconds}s` : null,
      },
      {
        label: "Accesibilidad",
        value: website.accessibilityScore,
        suffix: website.accessibilityScore != null ? "/100" : undefined,
      },
    ];
  }

  if (focus === "hybrid") {
    const kpis: ChannelKpi[] = [];
    if (instagram?.followers != null) {
      kpis.push({ label: "Seguidores IG", value: instagram.followers });
    }
    if (website?.performanceScore != null) {
      kpis.push({
        label: "Velocidad web",
        value: website.performanceScore,
        suffix: "/100",
      });
    }
    if (instagram?.engagementRate != null) {
      kpis.push({
        label: "Engagement IG",
        value: instagram.engagementRate,
        suffix: "%",
      });
    }
    if (website?.seoScore != null) {
      kpis.push({ label: "SEO web", value: website.seoScore, suffix: "/100" });
    }
    if (kpis.length >= 2) return kpis.slice(0, 4);
  }

  return [
    { label: "Puntaje global", value: globalScore, suffix: "/100" },
    { label: "Horas recuperables", value: hoursRecoverable, suffix: " h/mes" },
  ];
}
