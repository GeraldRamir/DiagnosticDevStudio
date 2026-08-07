import type { TechnicalMetrics } from "./types";

const FREE_HOST_PATTERNS = [
  ".netlify.app",
  ".vercel.app",
  ".wixsite.com",
  ".blogspot.",
  ".wordpress.com",
  ".myshopify.com",
];

const TIMEOUT_MS = 25_000;

type PagespeedCategory = {
  score?: number | null;
};

type PagespeedAudit = {
  numericValue?: number;
  score?: number | null;
  displayValue?: string;
};

export type PagespeedResponse = {
  lighthouseResult?: {
    categories?: {
      performance?: PagespeedCategory;
      seo?: PagespeedCategory;
      accessibility?: PagespeedCategory;
      "best-practices"?: PagespeedCategory;
    };
    audits?: Record<string, PagespeedAudit>;
  };
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err: unknown) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function emptyMetrics(partial: Partial<TechnicalMetrics> = {}): TechnicalMetrics {
  return {
    reachable: false,
    httpStatus: null,
    performanceScore: null,
    seoScore: null,
    accessibilityScore: null,
    bestPracticesScore: null,
    lcpSeconds: null,
    cls: null,
    tbtMs: null,
    hasViewport: null,
    isHttps: null,
    isOwnDomain: null,
    hasTitle: null,
    hasMetaDescription: null,
    hasOgTitle: null,
    hasOgImage: null,
    hasWhatsAppLink: null,
    hasContactForm: null,
    hasAnalytics: null,
    freeHostSubdomain: null,
    ...partial,
  };
}

/** Detecta subdominios gratuitos (.vercel.app, .wixsite.com, etc.) */
export function isFreeHostDomain(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return FREE_HOST_PATTERNS.some((pattern) => host.includes(pattern));
}

/** Extrae señales del HTML del sitio (sin PageSpeed). */
export function parseHtmlMetrics(
  html: string,
  url: URL,
): Partial<TechnicalMetrics> {
  const lower = html.toLowerCase();

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const hasTitle = Boolean(titleMatch?.[1]?.trim());

  const metaDesc =
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i.exec(
      html,
    ) ??
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i.exec(
      html,
    );
  const hasMetaDescription = Boolean(metaDesc?.[1]?.trim());

  const hasOgTitle = /property=["']og:title["']/i.test(html);
  const hasOgImage = /property=["']og:image["']/i.test(html);

  const hasWhatsAppLink =
    lower.includes("wa.me/") || lower.includes("api.whatsapp.com");

  const hasForm = /<form[\s>]/i.test(html);
  const formHasContact =
    hasForm &&
    (/type=["']email["']/i.test(html) ||
      /type=["']tel["']/i.test(html) ||
      /name=["'][^"']*(email|phone|telefono|whatsapp)[^"']*["']/i.test(html));

  const hasAnalytics =
    lower.includes("google-analytics.com") ||
    lower.includes("googletagmanager.com") ||
    lower.includes("gtag(") ||
    lower.includes("fbq(") ||
    lower.includes("connect.facebook.net");

  const freeHostSubdomain = isFreeHostDomain(url.hostname);

  return {
    hasTitle,
    hasMetaDescription,
    hasOgTitle,
    hasOgImage,
    hasWhatsAppLink,
    hasContactForm: formHasContact,
    hasAnalytics,
    freeHostSubdomain,
    isOwnDomain: !freeHostSubdomain,
    isHttps: url.protocol === "https:",
  };
}

/** Extrae métricas Lighthouse de la respuesta de PageSpeed Insights. */
export function extractPagespeedMetrics(
  data: PagespeedResponse | null,
): Partial<TechnicalMetrics> {
  if (!data?.lighthouseResult) return {};

  const cats = data.lighthouseResult.categories ?? {};
  const audits = data.lighthouseResult.audits ?? {};

  const lcpMs = audits["largest-contentful-paint"]?.numericValue;
  const cls = audits["cumulative-layout-shift"]?.numericValue;
  const tbt = audits["total-blocking-time"]?.numericValue;
  const viewportScore = audits.viewport?.score;
  const httpsScore = audits["is-on-https"]?.score;

  return {
    performanceScore: cats.performance?.score ?? null,
    seoScore: cats.seo?.score ?? null,
    accessibilityScore: cats.accessibility?.score ?? null,
    bestPracticesScore: cats["best-practices"]?.score ?? null,
    lcpSeconds: lcpMs != null ? Math.round((lcpMs / 1000) * 10) / 10 : null,
    cls: cls != null ? Math.round(cls * 1000) / 1000 : null,
    tbtMs: tbt != null ? Math.round(tbt) : null,
    hasViewport: viewportScore == null ? null : viewportScore === 1,
    isHttps: httpsScore == null ? null : httpsScore === 1,
  };
}

async function fetchHtml(url: string): Promise<{
  reachable: boolean;
  httpStatus: number | null;
  html: string | null;
  error?: string;
}> {
  try {
    const response = await withTimeout(
      fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent":
            "DevStudioDiagnosticBot/1.0 (+https://devstudio; technical audit)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }),
      TIMEOUT_MS,
    );

    const httpStatus = response.status;
    const reachable = httpStatus >= 200 && httpStatus < 400;
    const contentType = response.headers.get("content-type") ?? "";
    const html = contentType.includes("text/html")
      ? await response.text()
      : await response.text().catch(() => null);

    return { reachable, httpStatus, html };
  } catch (err) {
    return {
      reachable: false,
      httpStatus: null,
      html: null,
      error: err instanceof Error ? err.message : "fetch_failed",
    };
  }
}

async function fetchPagespeed(
  url: string,
  apiKey: string | undefined,
): Promise<{
  data: PagespeedResponse | null;
  failed: boolean;
}> {
  try {
    const endpoint = new URL(
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
    );
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", "mobile");
    for (const cat of [
      "performance",
      "seo",
      "accessibility",
      "best-practices",
    ]) {
      endpoint.searchParams.append("category", cat);
    }
    if (apiKey) {
      endpoint.searchParams.set("key", apiKey);
    }

    const response = await withTimeout(
      fetch(endpoint.toString(), { signal: AbortSignal.timeout(TIMEOUT_MS) }),
      TIMEOUT_MS,
    );

    if (!response.ok) {
      return { data: null, failed: true };
    }

    const data = (await response.json()) as PagespeedResponse;
    return { data, failed: false };
  } catch {
    return { data: null, failed: true };
  }
}

/**
 * Análisis técnico: PageSpeed (mobile) + scrape HTML.
 * Fallos se convierten en hallazgos, no en errores de app.
 */
export async function analyzeTechnical(
  websiteUrl: string,
): Promise<{ metrics: TechnicalMetrics; raw: PagespeedResponse | null }> {
  let parsed: URL;
  try {
    parsed = new URL(websiteUrl);
  } catch {
    return {
      metrics: emptyMetrics({
        reachable: false,
        error: "URL inválida",
        pagespeedFailed: true,
      }),
      raw: null,
    };
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  const [htmlResult, psi] = await Promise.all([
    fetchHtml(parsed.toString()),
    fetchPagespeed(parsed.toString(), apiKey),
  ]);

  const fromHtml = htmlResult.html
    ? parseHtmlMetrics(htmlResult.html, parsed)
    : {
        freeHostSubdomain: isFreeHostDomain(parsed.hostname),
        isOwnDomain: !isFreeHostDomain(parsed.hostname),
        isHttps: parsed.protocol === "https:",
      };

  const fromPsi = extractPagespeedMetrics(psi.data);

  const metrics = emptyMetrics({
    reachable: htmlResult.reachable,
    httpStatus: htmlResult.httpStatus,
    error: htmlResult.error,
    pagespeedFailed: psi.failed,
    ...fromHtml,
    ...fromPsi,
    isHttps: fromPsi.isHttps ?? fromHtml.isHttps ?? null,
    hasViewport: fromPsi.hasViewport ?? null,
  });

  if (!htmlResult.reachable && !metrics.error) {
    metrics.error = "El sitio no respondió a tiempo";
  }

  return { metrics, raw: psi.data };
}
