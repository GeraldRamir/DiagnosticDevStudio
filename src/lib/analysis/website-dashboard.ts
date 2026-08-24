import type { TechnicalMetrics } from "./types";

export type WebsiteInsightStatus = "ok" | "warn" | "fail";

export type WebsiteInsight = {
  id: string;
  label: string;
  status: WebsiteInsightStatus;
  detail: string;
};

export type WebsiteDashboardSummary = {
  url: string;
  reachable: boolean;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  lcpSeconds: number | null;
  cls: number | null;
  isHttps: boolean | null;
  isOwnDomain: boolean | null;
  hasWhatsAppLink: boolean | null;
  hasContactForm: boolean | null;
  hasAnalytics: boolean | null;
  hasTitle: boolean | null;
  hasMetaDescription: boolean | null;
  improvements: WebsiteInsight[];
  strengths: WebsiteInsight[];
  pagespeedFailed: boolean;
};

function pctScore(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return value <= 1 ? Math.round(value * 100) : Math.round(value);
}

function lcpRounded(lcp: number | null | undefined): number | null {
  if (lcp == null || !Number.isFinite(lcp)) return null;
  return Number(lcp.toFixed(1));
}

export function analyzeWebsiteMetrics(
  metrics: TechnicalMetrics,
  url: string,
): WebsiteInsight[] {
  const insights: WebsiteInsight[] = [];

  if (!metrics.reachable) {
    insights.push({
      id: "reachable",
      label: "Sitio no responde",
      status: "fail",
      detail: metrics.error ?? "No pudimos cargar la URL declarada.",
    });
    return insights;
  }

  const perf = pctScore(metrics.performanceScore);
  if (perf != null) {
    insights.push({
      id: "performance",
      label: "Velocidad móvil",
      status: perf >= 70 ? "ok" : perf >= 50 ? "warn" : "fail",
      detail: `PageSpeed Performance: ${perf}/100.`,
    });
  } else if (metrics.pagespeedFailed) {
    insights.push({
      id: "performance",
      label: "Velocidad no medida",
      status: "warn",
      detail: "PageSpeed no respondió; el resto del sitio sí se analizó.",
    });
  }

  const lcp = lcpRounded(metrics.lcpSeconds);
  if (lcp != null) {
    insights.push({
      id: "lcp",
      label: "Tiempo de carga (LCP)",
      status: lcp <= 2.5 ? "ok" : lcp <= 4 ? "warn" : "fail",
      detail: `LCP ${lcp}s — ${lcp <= 2.5 ? "buena percepción" : "puede hacer perder visitas"}.`,
    });
  }

  const seo = pctScore(metrics.seoScore);
  if (seo != null) {
    insights.push({
      id: "seo",
      label: "SEO técnico",
      status: seo >= 80 ? "ok" : seo >= 60 ? "warn" : "fail",
      detail: `SEO PageSpeed: ${seo}/100.`,
    });
  }

  if (metrics.isHttps === false) {
    insights.push({
      id: "https",
      label: "HTTPS",
      status: "fail",
      detail: "El sitio no usa conexión segura HTTPS.",
    });
  } else if (metrics.isHttps === true) {
    insights.push({
      id: "https",
      label: "HTTPS activo",
      status: "ok",
      detail: "Conexión segura detectada.",
    });
  }

  if (metrics.hasTitle === false || metrics.hasMetaDescription === false) {
    insights.push({
      id: "meta",
      label: "Title y meta description",
      status: "fail",
      detail: "Faltan etiquetas básicas para buscadores y redes.",
    });
  } else if (metrics.hasTitle && metrics.hasMetaDescription) {
    insights.push({
      id: "meta",
      label: "Indexación básica",
      status: "ok",
      detail: "Title y meta description presentes.",
    });
  }

  if (metrics.hasWhatsAppLink === false && metrics.hasContactForm !== true) {
    insights.push({
      id: "cta",
      label: "Captación en el sitio",
      status: "fail",
      detail: "No detectamos WhatsApp ni formulario de contacto visibles.",
    });
  } else {
    insights.push({
      id: "cta",
      label: "Canal de contacto",
      status: "ok",
      detail: metrics.hasWhatsAppLink
        ? "Enlace a WhatsApp detectado."
        : "Formulario de contacto detectado.",
    });
  }

  if (metrics.freeHostSubdomain) {
    insights.push({
      id: "domain",
      label: "Dominio propio",
      status: "warn",
      detail: "Usas un subdominio gratuito; un dominio propio transmite más confianza.",
    });
  } else if (metrics.isOwnDomain === true) {
    insights.push({
      id: "domain",
      label: "Dominio propio",
      status: "ok",
      detail: "Dominio propio detectado.",
    });
  }

  return insights;
}

export function buildWebsiteDashboardSummary(
  metrics: TechnicalMetrics | null | undefined,
  websiteUrl: string | null | undefined,
): WebsiteDashboardSummary | null {
  if (!metrics || !websiteUrl?.trim()) return null;

  const improvements = analyzeWebsiteMetrics(metrics, websiteUrl);
  const strengths = improvements.filter((i) => i.status === "ok");
  const issues = improvements.filter((i) => i.status !== "ok");

  return {
    url: websiteUrl.trim(),
    reachable: metrics.reachable,
    performanceScore: pctScore(metrics.performanceScore),
    seoScore: pctScore(metrics.seoScore),
    accessibilityScore: pctScore(metrics.accessibilityScore),
    bestPracticesScore: pctScore(metrics.bestPracticesScore),
    lcpSeconds: lcpRounded(metrics.lcpSeconds),
    cls: metrics.cls,
    isHttps: metrics.isHttps,
    isOwnDomain: metrics.isOwnDomain,
    hasWhatsAppLink: metrics.hasWhatsAppLink,
    hasContactForm: metrics.hasContactForm,
    hasAnalytics: metrics.hasAnalytics,
    hasTitle: metrics.hasTitle,
    hasMetaDescription: metrics.hasMetaDescription,
    improvements: issues,
    strengths,
    pagespeedFailed: Boolean(metrics.pagespeedFailed),
  };
}
