import type {
  HoursResult,
  InstagramMetrics,
  NarrativeResult,
  PillarId,
  ScoringResult,
  Signal,
  TechnicalMetrics,
} from "@/lib/analysis/types";
import { generateSoftwareRecommendations } from "@/lib/analysis/fallback";
import {
  buildDashboardData,
  normalizePillarScores,
  PILLAR_LABELS,
  type DashboardData,
} from "@/lib/report-dashboard";

export type { DashboardData };
export { normalizePillarScores, PILLAR_LABELS };

export type PillarDetail = {
  id: PillarId;
  label: string;
  score: number;
  max: number;
  pct: number;
  redistributed?: boolean;
  signals: Signal[];
};

export type SignalDetail = {
  id: string;
  label: string;
  pillar: string;
  pillarId: PillarId;
  weight: number;
  status: Signal["status"];
  statusLabel: string;
  evidence: string;
};

export type ReportMeta = {
  slug: string;
  createdAt: string;
  /** Día del mes, para el marcador de fecha del encabezado */
  createdAtDay: string;
  /** Etiqueta corta "mié, agosto" */
  createdAtLabel: string;
  analysisStatus: string;
  country: string;
  industry: string;
  websiteUrl: string | null;
  hasWebsite: string;
  fullName: string;
  email: string;
  whatsapp: string;
  viewCount: number;
};

export type ReportViewModel = {
  dashboard: DashboardData;
  meta: ReportMeta;
  pillars: PillarDetail[];
  signals: SignalDetail[];
  narrative: NarrativeResult;
  hours: HoursResult;
  scores: ScoringResult;
  technical: TechnicalMetrics | null;
  instagram: InstagramMetrics | null;
};

const PILLAR_IDS: PillarId[] = [
  "presencia",
  "rendimiento",
  "captacion",
  "operacion",
  "datos",
];

const STATUS_LABEL: Record<Signal["status"], string> = {
  ok: "OK",
  warn: "Alerta",
  fail: "Crítico",
};

export function buildReportViewModel(input: {
  businessName: string;
  industry: string;
  country: string;
  hasWebsite: string;
  websiteUrl: string | null;
  fullName: string;
  email: string;
  whatsapp: string;
  slug: string;
  createdAt: string;
  createdAtDay?: string;
  createdAtLabel?: string;
  analysisStatus: string;
  viewCount: number;
  globalScore: number;
  scoreLabel: string;
  pillarScoresRaw: unknown;
  signalsRaw: unknown;
  hoursRaw: unknown;
  narrativeRaw: unknown;
  technicalMetricsRaw?: unknown;
  instagramRaw?: unknown;
}): ReportViewModel {
  const pillars = normalizePillarScores(input.pillarScoresRaw);
  const signals = (Array.isArray(input.signalsRaw) ? input.signalsRaw : []) as Signal[];
  const hours = input.hoursRaw as HoursResult;
  const rawNarrative = input.narrativeRaw as NarrativeResult;

  const scores: ScoringResult = {
    globalScore: input.globalScore,
    scoreLabel: input.scoreLabel as ScoringResult["scoreLabel"],
    pillars,
    signals,
    rendimientoRedistributed: pillars.rendimiento.max === 0,
  };

  const narrative: NarrativeResult = rawNarrative.softwareRecommendations
    ? rawNarrative
    : {
        ...rawNarrative,
        softwareRecommendations: generateSoftwareRecommendations(signals, scores, hours),
      };

  const dashboard = buildDashboardData(
    input.businessName,
    input.industry,
    scores,
    hours,
    narrative,
    signals,
  );

  const pillarDetails: PillarDetail[] = PILLAR_IDS.map((id) => {
    const p = pillars[id];
    const max = p?.max ?? 0;
    const score = p?.score ?? 0;
    return {
      id,
      label: PILLAR_LABELS[id],
      score,
      max,
      pct: max > 0 ? Math.round((score / max) * 100) : 0,
      redistributed: p?.redistributed,
      signals: p?.signals ?? [],
    };
  });

  const signalDetails: SignalDetail[] = signals.map((s) => ({
    id: s.id,
    label: s.label,
    pillar: PILLAR_LABELS[s.pillar as PillarId] ?? s.pillar,
    pillarId: s.pillar,
    weight: s.weight,
    status: s.status,
    statusLabel: STATUS_LABEL[s.status],
    evidence: s.evidence,
  }));

  const technical = (input.technicalMetricsRaw as TechnicalMetrics | null) ?? null;
  const instagram = (input.instagramRaw as InstagramMetrics | null) ?? null;

  return {
    dashboard,
    meta: {
      slug: input.slug,
      createdAt: input.createdAt,
      createdAtDay: input.createdAtDay ?? input.createdAt.split(" ")[0] ?? "—",
      createdAtLabel: input.createdAtLabel ?? input.createdAt,
      analysisStatus: input.analysisStatus,
      country: input.country,
      industry: input.industry,
      websiteUrl: input.websiteUrl,
      hasWebsite: input.hasWebsite,
      fullName: input.fullName,
      email: input.email,
      whatsapp: input.whatsapp,
      viewCount: input.viewCount,
    },
    pillars: pillarDetails,
    signals: signalDetails,
    narrative,
    hours,
    scores,
    technical,
    instagram,
  };
}

export type ReportViewId =
  | "dashboard"
  | "pillars"
  | "signals"
  | "report"
  | "software"
  | "settings"
  | "help";

export const VIEW_TITLES: Record<ReportViewId, string> = {
  dashboard: "Dashboard",
  pillars: "Pilares",
  signals: "Señales",
  report: "Reporte",
  software: "Sistemas recomendados",
  settings: "Configuración",
  help: "Ayuda",
};
