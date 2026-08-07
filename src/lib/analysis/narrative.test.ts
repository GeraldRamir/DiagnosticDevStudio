import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateHoursLost } from "./hours";
import { calculateScores } from "./scoring";
import {
  buildAnonymizedPayload,
  generateNarrative,
  parseNarrativeResponse,
  rehydrateBusinessName,
  sanitizeTimeWaster,
} from "./narrative";

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class MockGoogleGenAI {
    models = {
      generateContent: mockGenerateContent,
    };
  },
}));

function sampleParams() {
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

  return {
    signals: scores.signals,
    scores,
    hours,
    industry: "Restaurante",
    country: "México",
    biggestTimeWaster: "Responder mensajes uno por uno",
    businessName: "La Esquina",
  };
}

const validGeminiResponse = {
  headline: "El negocio opera con fricción operativa",
  summary: `Puntaje ${42}/100. ~43.8 h/mes en admin.`,
  findings: [
    {
      title: "Sin sitio web",
      severity: "alta" as const,
      whatWeFound: "Presencia 4/25.",
      whyItMatters: "Menos captación orgánica.",
      pillar: "Presencia",
    },
    {
      title: "Pedidos manuales",
      severity: "alta" as const,
      whatWeFound: "WhatsApp sin sistema.",
      whyItMatters: "Errores en picos.",
      pillar: "Operación",
    },
    {
      title: "Registro en Excel",
      severity: "media" as const,
      whatWeFound: "Registro: excel.",
      whyItMatters: "Datos dispersos.",
      pillar: "Operación",
    },
    {
      title: "Instagram ausente",
      severity: "baja" as const,
      whatWeFound: "Sin handle.",
      whyItMatters: "Menos descubrimiento.",
      pillar: "Captación",
    },
    {
      title: "Horas admin",
      severity: "alta" as const,
      whatWeFound: "~43.8 h/mes.",
      whyItMatters: "Tiempo no vendido.",
      pillar: "Operación",
    },
  ],
  quickWin: "Esta semana: publica un enlace de WhatsApp visible.",
  softwareRecommendations: {
    summary: "Prioriza un CRM de pedidos y software de facturación antes de escalar.",
    items: [
      {
        category: "CRM / Pedidos",
        recommendation: "Sistema de pedidos por WhatsApp",
        why: "Los pedidos manuales generan errores en picos.",
      },
      {
        category: "Facturación",
        recommendation: "Software de facturación e inventario",
        why: "Excel no escala con más volumen.",
      },
    ],
  },
};

describe("sanitizeTimeWaster", () => {
  it("elimina caracteres de control y limita longitud", () => {
    const dirty = "  Responder\u0001mensajes   \n\nuno por uno  ";
    expect(sanitizeTimeWaster(dirty)).toBe("Responder mensajes uno por uno");
    expect(sanitizeTimeWaster("x".repeat(600)).length).toBe(500);
  });
});

describe("buildAnonymizedPayload", () => {
  it("no incluye nombre del negocio ni URL del sitio", () => {
    const params = sampleParams();
    const payload = buildAnonymizedPayload(params);
    const serialized = JSON.stringify(payload);

    expect(serialized).not.toContain("La Esquina");
    expect(serialized).not.toContain("websiteUrl");
    expect(payload.industry).toBe("Restaurante");
    expect(payload.biggestTimeWaster).toBe(
      sanitizeTimeWaster(params.biggestTimeWaster),
    );
  });
});

describe("rehydrateBusinessName", () => {
  it("reemplaza 'el negocio' por el nombre real", () => {
    const result = rehydrateBusinessName(
      {
        headline: "El negocio necesita orden",
        summary: "El negocio pierde horas.",
        findings: [
          {
            title: "El negocio sin web",
            severity: "alta",
            whatWeFound: "El negocio en 4/25.",
            whyItMatters: "El negocio pierde clientes.",
            pillar: "Presencia",
          },
          ...validGeminiResponse.findings.slice(1),
        ],
        quickWin: "El negocio puede empezar hoy.",
        softwareRecommendations: validGeminiResponse.softwareRecommendations,
      },
      "La Esquina",
    );

    expect(result.headline).toBe("La Esquina necesita orden");
    expect(result.findings[0]?.title).toBe("La Esquina sin web");
  });
});

describe("parseNarrativeResponse", () => {
  it("valida estructura con Zod", () => {
    const parsed = parseNarrativeResponse(validGeminiResponse);
    expect(parsed.findings).toHaveLength(5);
  });

  it("rechaza respuestas incompletas", () => {
    expect(() =>
      parseNarrativeResponse({ headline: "x", summary: "y" }),
    ).toThrow();
  });
});

describe("generateNarrative", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("usa fallback cuando AI_NARRATIVE_ENABLED=false", async () => {
    process.env.AI_NARRATIVE_ENABLED = "false";
    process.env.GEMINI_API_KEY = "test-key";

    const result = await generateNarrative(sampleParams());

    expect(mockGenerateContent).not.toHaveBeenCalled();
    expect(result.analysisStatus).toBe("fallback");
    expect(result.narrative.findings).toHaveLength(5);
  });

  it("usa fallback sin GEMINI_API_KEY", async () => {
    process.env.AI_NARRATIVE_ENABLED = "true";
    delete process.env.GEMINI_API_KEY;

    const result = await generateNarrative(sampleParams());

    expect(mockGenerateContent).not.toHaveBeenCalled();
    expect(result.analysisStatus).toBe("fallback");
  });

  it("usa Gemini y marca completo cuando responde bien", async () => {
    process.env.AI_NARRATIVE_ENABLED = "true";
    process.env.GEMINI_API_KEY = "test-key";
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(validGeminiResponse),
    });

    const result = await generateNarrative(sampleParams());

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(result.analysisStatus).toBe("completo");
    expect(result.narrative.headline).toContain("fricción");
  });

  it("reintenta en 429 y luego usa fallback si falla de nuevo", async () => {
    process.env.AI_NARRATIVE_ENABLED = "true";
    process.env.GEMINI_API_KEY = "test-key";

    const quotaError = Object.assign(new Error("quota exceeded"), {
      status: 429,
    });
    mockGenerateContent
      .mockRejectedValueOnce(quotaError)
      .mockRejectedValueOnce(quotaError);

    const result = await generateNarrative(sampleParams());

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(result.analysisStatus).toBe("fallback");
  });

  it("marca parcial cuando forcePartial=true con IA", async () => {
    process.env.AI_NARRATIVE_ENABLED = "true";
    process.env.GEMINI_API_KEY = "test-key";
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(validGeminiResponse),
    });

    const result = await generateNarrative({
      ...sampleParams(),
      forcePartial: true,
    });

    expect(result.analysisStatus).toBe("parcial");
  });

  it("cae a fallback si JSON no valida", async () => {
    process.env.AI_NARRATIVE_ENABLED = "true";
    process.env.GEMINI_API_KEY = "test-key";
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({ headline: "incompleto" }),
    });

    const result = await generateNarrative(sampleParams());

    expect(result.analysisStatus).toBe("fallback");
    expect(result.narrative.findings).toHaveLength(5);
  });
});
