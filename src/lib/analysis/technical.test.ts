import { describe, expect, it } from "vitest";
import {
  extractPagespeedMetrics,
  isFreeHostDomain,
  parseHtmlMetrics,
  type PagespeedResponse,
} from "./technical";

describe("isFreeHostDomain", () => {
  it("detecta subdominios gratuitos", () => {
    expect(isFreeHostDomain("mi-negocio.vercel.app")).toBe(true);
    expect(isFreeHostDomain("tienda.myshopify.com")).toBe(true);
    expect(isFreeHostDomain("blog.blogspot.com")).toBe(true);
  });

  it("acepta dominios propios", () => {
    expect(isFreeHostDomain("restaurante.com")).toBe(false);
    expect(isFreeHostDomain("www.clinica.mx")).toBe(false);
  });
});

describe("parseHtmlMetrics", () => {
  const url = new URL("https://ejemplo.com");

  it("detecta title, meta description y Open Graph", () => {
    const html = `<!DOCTYPE html>
      <html>
        <head>
          <title>Mi Negocio</title>
          <meta name="description" content="Descripción del negocio">
          <meta property="og:title" content="Mi Negocio">
          <meta property="og:image" content="https://ejemplo.com/img.jpg">
        </head>
        <body></body>
      </html>`;

    const result = parseHtmlMetrics(html, url);

    expect(result.hasTitle).toBe(true);
    expect(result.hasMetaDescription).toBe(true);
    expect(result.hasOgTitle).toBe(true);
    expect(result.hasOgImage).toBe(true);
    expect(result.isOwnDomain).toBe(true);
    expect(result.isHttps).toBe(true);
  });

  it("detecta WhatsApp, formulario y analytics", () => {
    const html = `<!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <a href="https://wa.me/18095551234">WhatsApp</a>
          <form><input type="email" name="email"></form>
          <script src="https://www.googletagmanager.com/gtag/js"></script>
        </body>
      </html>`;

    const result = parseHtmlMetrics(html, url);

    expect(result.hasWhatsAppLink).toBe(true);
    expect(result.hasContactForm).toBe(true);
    expect(result.hasAnalytics).toBe(true);
  });

  it("marca subdominio gratuito", () => {
    const freeUrl = new URL("https://tienda.vercel.app");
    const result = parseHtmlMetrics("<html><head><title>T</title></head></html>", freeUrl);

    expect(result.freeHostSubdomain).toBe(true);
    expect(result.isOwnDomain).toBe(false);
  });
});

describe("extractPagespeedMetrics", () => {
  it("extrae scores y audits de Lighthouse", () => {
    const data: PagespeedResponse = {
      lighthouseResult: {
        categories: {
          performance: { score: 0.42 },
          seo: { score: 0.85 },
          accessibility: { score: 0.9 },
          "best-practices": { score: 0.75 },
        },
        audits: {
          "largest-contentful-paint": { numericValue: 5200 },
          "cumulative-layout-shift": { numericValue: 0.152 },
          "total-blocking-time": { numericValue: 380 },
          viewport: { score: 1 },
          "is-on-https": { score: 1 },
        },
      },
    };

    const result = extractPagespeedMetrics(data);

    expect(result.performanceScore).toBe(0.42);
    expect(result.seoScore).toBe(0.85);
    expect(result.lcpSeconds).toBe(5.2);
    expect(result.cls).toBe(0.152);
    expect(result.tbtMs).toBe(380);
    expect(result.hasViewport).toBe(true);
    expect(result.isHttps).toBe(true);
  });

  it("devuelve objeto vacío sin lighthouseResult", () => {
    expect(extractPagespeedMetrics(null)).toEqual({});
    expect(extractPagespeedMetrics({})).toEqual({});
  });
});
