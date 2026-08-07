import { describe, expect, it } from "vitest";
import { calculateHoursLost } from "./hours";
import { calculateScores } from "./scoring";
import type { TechnicalMetrics } from "./types";

const emptyTech: TechnicalMetrics = {
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
};

describe("calculateScores", () => {
  it("limita Presencia a 6 sin sitio web", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "5_10",
      recordKeeping: "excel",
      orderChannel: ["whatsapp"],
    });

    const result = calculateScores({
      form: {
        hasWebsite: "no",
        websiteUrl: null,
        instagramHandle: null,
        orderChannel: ["whatsapp"],
        recordKeeping: "excel",
        weeklyHoursOnAdmin: "5_10",
        teamSize: "solo",
        biggestTimeWaster: "Responder mensajes uno por uno",
      },
      technical: null,
      hours,
    });

    expect(result.pillars.presencia.score).toBeLessThanOrEqual(6);
    expect(result.pillars.presencia.max).toBe(25);
  });

  it("redistribuye Rendimiento cuando no hay sitio", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "menos_5",
      recordKeeping: "software",
      orderChannel: ["sistema"],
    });

    const result = calculateScores({
      form: {
        hasWebsite: "social_only",
        websiteUrl: null,
        instagramHandle: "@negocio",
        orderChannel: ["sistema"],
        recordKeeping: "software",
        weeklyHoursOnAdmin: "menos_5",
        teamSize: "2_5",
        biggestTimeWaster: "Cuadrar inventario",
      },
      technical: null,
      hours,
    });

    expect(result.rendimientoRedistributed).toBe(true);
    expect(result.pillars.rendimiento.max).toBe(0);
    expect(result.pillars.captacion.max + result.pillars.operacion.max).toBe(
      20 + 25 + 20,
    );
    expect(result.globalScore).toBeLessThanOrEqual(100);
  });

  it("es determinístico con los mismos inputs técnicos", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "10_20",
      recordKeeping: "papel",
      orderChannel: ["whatsapp", "llamada"],
    });

    const tech: TechnicalMetrics = {
      ...emptyTech,
      reachable: true,
      httpStatus: 200,
      performanceScore: 0.42,
      seoScore: 0.7,
      accessibilityScore: 0.8,
      bestPracticesScore: 0.75,
      lcpSeconds: 5.2,
      cls: 0.15,
      tbtMs: 400,
      hasViewport: true,
      isHttps: true,
      isOwnDomain: true,
      hasTitle: true,
      hasMetaDescription: false,
      hasOgTitle: false,
      hasOgImage: false,
      hasWhatsAppLink: true,
      hasContactForm: false,
      hasAnalytics: false,
      freeHostSubdomain: false,
    };

    const form = {
      hasWebsite: "yes" as const,
      websiteUrl: "https://ejemplo.com",
      instagramHandle: "@ejemplo",
      orderChannel: ["whatsapp", "llamada"] as const,
      recordKeeping: "papel" as const,
      weeklyHoursOnAdmin: "10_20" as const,
      teamSize: "solo" as const,
      biggestTimeWaster: "Tomar pedidos por chat",
    };

    const a = calculateScores({
      form: { ...form, orderChannel: [...form.orderChannel] },
      technical: tech,
      hours,
    });
    const b = calculateScores({
      form: { ...form, orderChannel: [...form.orderChannel] },
      technical: tech,
      hours,
    });

    expect(a.globalScore).toBe(b.globalScore);
    expect(a.scoreLabel).toBe(b.scoreLabel);
    expect(a.pillars).toEqual(b.pillars);
  });

  it("etiqueta el puntaje global correctamente", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "mas_20",
      recordKeeping: "ninguno",
      orderChannel: ["persona"],
    });

    const result = calculateScores({
      form: {
        hasWebsite: "no",
        websiteUrl: null,
        instagramHandle: null,
        orderChannel: ["persona"],
        recordKeeping: "ninguno",
        weeklyHoursOnAdmin: "mas_20",
        teamSize: "solo",
        biggestTimeWaster: "Anotar todo a mano",
      },
      technical: null,
      hours,
    });

    expect(["Crítico", "Frágil", "Funcional", "Sólido"]).toContain(
      result.scoreLabel,
    );
    if (result.globalScore <= 39) expect(result.scoreLabel).toBe("Crítico");
    else if (result.globalScore <= 59) expect(result.scoreLabel).toBe("Frágil");
    else if (result.globalScore <= 79)
      expect(result.scoreLabel).toBe("Funcional");
    else expect(result.scoreLabel).toBe("Sólido");
  });
});
