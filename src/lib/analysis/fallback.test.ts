import { describe, expect, it } from "vitest";
import { calculateHoursLost } from "./hours";
import { calculateScores } from "./scoring";
import { FALLBACK_BLOCK_IDS, generateFallbackNarrative } from "./fallback";

describe("generateFallbackNarrative", () => {
  it("devuelve exactamente 5 hallazgos con contrato NarrativeResult", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "5_10",
      recordKeeping: "excel",
      orderChannel: ["whatsapp"],
    });

    const scores = calculateScores({
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

    const result = generateFallbackNarrative(
      scores.signals,
      scores,
      hours,
    );

    expect(result.findings).toHaveLength(5);
    expect(result.headline).toBeTruthy();
    expect(result.summary).toContain(String(scores.globalScore));
    expect(result.summary).toContain(String(hours.horasMes));
    expect(result.quickWin).toMatch(/^Esta semana:/);
    for (const finding of result.findings) {
      expect(finding.title.length).toBeLessThanOrEqual(60);
      expect(["alta", "media", "baja"]).toContain(finding.severity);
      expect(finding.whatWeFound).toBeTruthy();
      expect(finding.whyItMatters).toBeTruthy();
      expect(finding.pillar).toBeTruthy();
    }
  });

  it("prioriza señales fail sobre warn por peso", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "mas_20",
      recordKeeping: "papel",
      orderChannel: ["whatsapp", "llamada"],
    });

    const scores = calculateScores({
      form: {
        hasWebsite: "no",
        websiteUrl: null,
        instagramHandle: null,
        orderChannel: ["whatsapp", "llamada"],
        recordKeeping: "papel",
        weeklyHoursOnAdmin: "mas_20",
        teamSize: "solo",
        biggestTimeWaster: "Anotar pedidos a mano",
      },
      technical: null,
      hours,
    });

    const result = generateFallbackNarrative(
      scores.signals,
      scores,
      hours,
    );

    const failSignals = scores.signals.filter((s) => s.status === "fail");
    expect(failSignals.length).toBeGreaterThan(0);
    expect(result.findings[0]?.severity).toBe("alta");
  });

  it("rellena placeholders con números reales del análisis", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "10_20",
      recordKeeping: "papel",
      orderChannel: ["whatsapp"],
    });

    const scores = calculateScores({
      form: {
        hasWebsite: "no",
        websiteUrl: null,
        instagramHandle: null,
        orderChannel: ["whatsapp"],
        recordKeeping: "papel",
        weeklyHoursOnAdmin: "10_20",
        teamSize: "solo",
        biggestTimeWaster: "Cuadrar inventario",
      },
      technical: null,
      hours,
    });

    const result = generateFallbackNarrative(
      scores.signals,
      scores,
      hours,
    );

    expect(result.summary).toContain(String(hours.horasMes));
    expect(result.summary).toContain(String(hours.automatizable));
    expect(result.summary).toContain(String(scores.globalScore));
  });

  it("ordena hallazgos por severidad (alta primero)", () => {
    const hours = calculateHoursLost({
      weeklyHoursOnAdmin: "5_10",
      recordKeeping: "ninguno",
      orderChannel: ["persona"],
    });

    const scores = calculateScores({
      form: {
        hasWebsite: "social_only",
        websiteUrl: null,
        instagramHandle: "@negocio",
        orderChannel: ["persona"],
        recordKeeping: "ninguno",
        weeklyHoursOnAdmin: "5_10",
        teamSize: "2_5",
        biggestTimeWaster: "Organizar entregas",
      },
      technical: null,
      hours,
    });

    const result = generateFallbackNarrative(
      scores.signals,
      scores,
      hours,
    );

    const ranks = result.findings.map((f) =>
      f.severity === "alta" ? 0 : f.severity === "media" ? 1 : 2,
    );
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1]!);
    }
  });
});

describe("FALLBACK_BLOCK_IDS", () => {
  it("cubre todos los signal.id definidos en scoring", () => {
    const expectedIds = [
      "presencia.has_website",
      "presencia.reachable",
      "presencia.own_domain",
      "presencia.https",
      "presencia.indexable",
      "presencia.no_site_cap",
      "rendimiento.performance",
      "rendimiento.lcp",
      "rendimiento.viewport",
      "rendimiento.na",
      "captacion.instagram",
      "captacion.ig_recency",
      "captacion.ig_engagement",
      "captacion.ig_oauth",
      "captacion.ig_reach",
      "captacion.whatsapp",
      "captacion.form",
      "captacion.og",
      "captacion.cta",
      "captacion.no_site_cta",
      "captacion.orders_whatsapp",
      "operacion.order_channel",
      "operacion.record_keeping",
      "operacion.team_vs_manual",
      "operacion.hours_lost",
      "datos.analytics",
      "datos.registro",
      "datos.reportabilidad",
    ];

    for (const id of expectedIds) {
      expect(FALLBACK_BLOCK_IDS).toContain(id);
    }
    expect(FALLBACK_BLOCK_IDS).toHaveLength(32);
  });
});
