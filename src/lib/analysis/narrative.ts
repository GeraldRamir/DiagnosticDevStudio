import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { generateFallbackNarrative } from "./fallback";
import type {
  AnalysisStatus,
  HoursResult,
  NarrativeResult,
  ScoringResult,
  Signal,
} from "./types";

const narrativeSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  findings: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        severity: z.enum(["alta", "media", "baja"]),
        whatWeFound: z.string().min(1),
        whyItMatters: z.string().min(1),
        pillar: z.string().min(1),
      }),
    )
    .length(5),
  quickWin: z.string().min(1),
  softwareRecommendations: z.object({
    summary: z.string().min(1),
    items: z
      .array(
        z.object({
          category: z.string().min(1),
          recommendation: z.string().min(1),
          why: z.string().min(1),
        }),
      )
      .min(2)
      .max(4),
  }),
});

const SYSTEM_INSTRUCTION = `Eres un analista de madurez digital para dueños de negocio en Latinoamérica.
Recibes hallazgos YA calculados. NO inventes números, NO puntúes, NO calcules.
Tu único trabajo: convertir señales y métricas en prosa clara.

Reglas:
- Tratar al lector como dueño ocupado, no técnico. Traduce LCP/CLS/meta a consecuencias.
- Cada hallazgo debe citar un número real del payload.
- Tono directo y respetuoso. Sin catastrofismo. Sin vender.
- NUNCA menciones DevStudio, precios, planes ni servicios.
- Español neutro de LatAm.
- Si un dato no se midió, dilo; no inventes.
- Refiérete al negocio como "el negocio".
- Devuelve exactamente 5 hallazgos ordenados por severidad (alta → baja).
- title máximo 60 caracteres.
- Incluye softwareRecommendations: 2–4 tipos de software que el negocio necesita según industria, canales de pedido, registro de datos y señales. NO nombres marcas comerciales; describe categorías (ej. "CRM de pedidos por WhatsApp", "facturación electrónica", "inventario"). El summary explica la stack recomendada en 1–2 frases.`;

export function sanitizeTimeWaster(text: string): string {
  return text
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function anonymizedPayload(
  signals: Signal[],
  scores: ScoringResult,
  hours: HoursResult,
  industry: string,
  country: string,
  biggestTimeWaster: string,
) {
  return {
    industry,
    country,
    scoreLabel: scores.scoreLabel,
    globalScore: scores.globalScore,
    pillars: Object.fromEntries(
      Object.entries(scores.pillars).map(([k, v]) => [
        k,
        { score: v.score, max: v.max, redistributed: v.redistributed ?? false },
      ]),
    ),
    hours: {
      horasMes: hours.horasMes,
      automatizable: hours.automatizable,
      desglose: hours.desglose,
    },
    signals: signals.map((s) => ({
      id: s.id,
      label: s.label,
      status: s.status,
      weight: s.weight,
      evidence: s.evidence,
      pillar: s.pillar,
    })),
    biggestTimeWaster: sanitizeTimeWaster(biggestTimeWaster),
  };
}

function rehydrateNames(
  narrative: NarrativeResult,
  businessName: string,
): NarrativeResult {
  const replaceBiz = (text: string) =>
    text.replace(/\bel negocio\b/gi, businessName);

  return {
    headline: replaceBiz(narrative.headline),
    summary: replaceBiz(narrative.summary),
    findings: narrative.findings.map((f) => ({
      ...f,
      title: replaceBiz(f.title).slice(0, 60),
      whatWeFound: replaceBiz(f.whatWeFound),
      whyItMatters: replaceBiz(f.whyItMatters),
    })),
    quickWin: replaceBiz(narrative.quickWin),
    softwareRecommendations: {
      summary: replaceBiz(narrative.softwareRecommendations.summary),
      items: narrative.softwareRecommendations.items.map((item) => ({
        category: replaceBiz(item.category),
        recommendation: replaceBiz(item.recommendation),
        why: replaceBiz(item.why),
      })),
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isQuotaError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; code?: number | string; message?: string };
  return (
    e.status === 429 ||
    e.code === 429 ||
    e.code === "RESOURCE_EXHAUSTED" ||
    Boolean(e.message?.includes("429")) ||
    Boolean(e.message?.toLowerCase().includes("quota"))
  );
}

async function callGemini(payload: unknown): Promise<NarrativeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const responseSchema = {
    type: "object",
    properties: {
      headline: { type: "string" },
      summary: { type: "string" },
      findings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            severity: { type: "string", enum: ["alta", "media", "baja"] },
            whatWeFound: { type: "string" },
            whyItMatters: { type: "string" },
            pillar: { type: "string" },
          },
          required: [
            "title",
            "severity",
            "whatWeFound",
            "whyItMatters",
            "pillar",
          ],
        },
      },
      quickWin: { type: "string" },
      softwareRecommendations: {
        type: "object",
        properties: {
          summary: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                recommendation: { type: "string" },
                why: { type: "string" },
              },
              required: ["category", "recommendation", "why"],
            },
          },
        },
        required: ["summary", "items"],
      },
    },
    required: ["headline", "summary", "findings", "quickWin", "softwareRecommendations"],
  };

  const response = await Promise.race([
    ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Datos del diagnóstico (anónimos). Redacta el reporte JSON.\n\n${JSON.stringify(payload)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema,
      },
    }),
    sleep(20_000).then(() => {
      throw new Error("gemini_timeout");
    }),
  ]);

  const text = response.text;
  if (!text) {
    throw new Error("empty_gemini_response");
  }

  const parsed: unknown = JSON.parse(text);
  return narrativeSchema.parse(parsed);
}

export type NarrativeGenerationResult = {
  narrative: NarrativeResult;
  analysisStatus: AnalysisStatus;
};

export type GenerateNarrativeParams = {
  signals: Signal[];
  scores: ScoringResult;
  hours: HoursResult;
  industry: string;
  country: string;
  biggestTimeWaster: string;
  businessName: string;
  forcePartial?: boolean;
};

/**
 * Cadena: Gemini → reintento 429 → fallback plantillas.
 * AI_NARRATIVE_ENABLED=false salta Gemini.
 */
export async function generateNarrative(
  params: GenerateNarrativeParams,
): Promise<NarrativeGenerationResult> {
  const enabled = process.env.AI_NARRATIVE_ENABLED !== "false";

  const fallback = (): NarrativeGenerationResult => {
    const raw = generateFallbackNarrative(
      params.signals,
      params.scores,
      params.hours,
    );
    return {
      narrative: rehydrateNames(raw, params.businessName),
      analysisStatus: params.forcePartial ? "parcial" : "fallback",
    };
  };

  if (!enabled || !process.env.GEMINI_API_KEY) {
    return fallback();
  }

  const payload = anonymizedPayload(
    params.signals,
    params.scores,
    params.hours,
    params.industry,
    params.country,
    params.biggestTimeWaster,
  );

  try {
    const first = await callGemini(payload);
    return {
      narrative: rehydrateNames(first, params.businessName),
      analysisStatus: params.forcePartial ? "parcial" : "completo",
    };
  } catch (err) {
    if (isQuotaError(err)) {
      try {
        await sleep(2000);
        const second = await callGemini(payload);
        return {
          narrative: rehydrateNames(second, params.businessName),
          analysisStatus: params.forcePartial ? "parcial" : "completo",
        };
      } catch {
        return fallback();
      }
    }
    return fallback();
  }
}

/** Expuesto para tests — valida respuesta JSON de Gemini. */
export function parseNarrativeResponse(json: unknown): NarrativeResult {
  return narrativeSchema.parse(json);
}

/** Expuesto para tests — construye payload anonimizado. */
export function buildAnonymizedPayload(
  params: Omit<GenerateNarrativeParams, "businessName" | "forcePartial">,
) {
  return anonymizedPayload(
    params.signals,
    params.scores,
    params.hours,
    params.industry,
    params.country,
    params.biggestTimeWaster,
  );
}

/** Expuesto para tests — reinserta nombre del negocio. */
export function rehydrateBusinessName(
  narrative: NarrativeResult,
  businessName: string,
): NarrativeResult {
  return rehydrateNames(narrative, businessName);
}
