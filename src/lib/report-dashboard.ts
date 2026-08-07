import type {
  HoursResult,
  NarrativeResult,
  PillarId,
  PillarScores,
  ScoringResult,
  Signal,
} from "@/lib/analysis/types";

export const PILLAR_LABELS: Record<PillarId, string> = {
  presencia: "Presencia",
  rendimiento: "Rendimiento",
  captacion: "Captación",
  operacion: "Operación",
  datos: "Datos",
};

export type DashboardKpi = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: "up" | "down" | "neutral";
  icon: "signals" | "score" | "recover" | "lost";
};

export type PillarBarRow = {
  name: string;
  obtenido: number;
  brecha: number;
};

export type PillarSlice = {
  name: string;
  value: number;
  color: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  tone: "blue" | "red" | "purple" | "gray" | "green";
  icon: "order" | "stock" | "promo" | "system";
};

export type SignalRow = {
  id: string;
  name: string;
  pillar: string;
  weight: number;
  status: string;
  impact: string;
};

const DONUT_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

const PILLAR_IDS: PillarId[] = [
  "presencia",
  "rendimiento",
  "captacion",
  "operacion",
  "datos",
];

export function normalizePillarScores(raw: unknown): PillarScores {
  const source =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return Object.fromEntries(
    PILLAR_IDS.map((id) => {
      const p = source[id] as
        | { score?: number; max?: number; signals?: Signal[]; redistributed?: boolean }
        | undefined;
      return [
        id,
        {
          score: Number(p?.score ?? 0),
          max: Number(p?.max ?? 0),
          signals: Array.isArray(p?.signals) ? p.signals : [],
          redistributed: Boolean(p?.redistributed),
        },
      ];
    }),
  ) as PillarScores;
}

export function buildDashboardData(
  businessName: string,
  industry: string,
  scores: ScoringResult,
  hours: HoursResult,
  narrative: NarrativeResult,
  signals: Signal[],
) {
  const kpis: DashboardKpi[] = [
    {
      label: "Señales evaluadas",
      value: signals.length,
      trend: "neutral",
      icon: "signals",
    },
    {
      label: "Puntaje global",
      value: scores.globalScore,
      suffix: "/100",
      trend: scores.globalScore >= 60 ? "up" : "down",
      icon: "score",
    },
    {
      label: "Horas recuperables",
      value: Math.round(hours.automatizable),
      suffix: " h/mes",
      trend: "up",
      icon: "recover",
    },
    {
      label: "Horas perdidas",
      value: Math.round(hours.horasMes),
      suffix: " h/mes",
      trend: "down",
      icon: "lost",
    },
  ];

  const pillarBars: PillarBarRow[] = PILLAR_IDS.map((id) => {
    const p = scores.pillars[id];
    return {
      name: PILLAR_LABELS[id].slice(0, 4),
      obtenido: p?.score ?? 0,
      brecha: Math.max(0, (p?.max ?? 0) - (p?.score ?? 0)),
    };
  });

  const totalAchieved = PILLAR_IDS.reduce(
    (s, id) => s + (scores.pillars[id]?.score ?? 0),
    0,
  );
  const pillarSlices: PillarSlice[] = PILLAR_IDS.map((id, i) => {
    const p = scores.pillars[id];
    const score = p?.score ?? 0;
    return {
      name: PILLAR_LABELS[id],
      value: totalAchieved > 0 ? Math.round((score / totalAchieved) * 100) : 20,
      color: DONUT_COLORS[i] ?? DONUT_COLORS[0],
    };
  });

  const severityTone: Record<string, ActivityItem["tone"]> = {
    alta: "red",
    media: "purple",
    baja: "blue",
  };

  const severityBadge: Record<string, string> = {
    alta: "Crítico",
    media: "Atención",
    baja: "Info",
  };

  const activity: ActivityItem[] = narrative.findings.map((f, i) => ({
    id: `finding-${i}`,
    title: f.title,
    subtitle: f.whatWeFound.slice(0, 72) + (f.whatWeFound.length > 72 ? "…" : ""),
    badge: severityBadge[f.severity] ?? "Hallazgo",
    tone: severityTone[f.severity] ?? "gray",
    icon: i === 0 ? "order" : i === 1 ? "stock" : i === 2 ? "promo" : "system",
  }));

  const statusLabel: Record<string, string> = {
    ok: "OK",
    warn: "Alerta",
    fail: "Crítico",
  };

  const signalRows: SignalRow[] = [...signals]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      name: s.label,
      pillar: PILLAR_LABELS[s.pillar as PillarId] ?? s.pillar,
      weight: s.weight,
      status: statusLabel[s.status] ?? s.status,
      impact: s.evidence.slice(0, 48) + (s.evidence.length > 48 ? "…" : ""),
    }));

  return {
    businessName,
    industry,
    scoreLabel: scores.scoreLabel,
    globalScore: scores.globalScore,
    headline: narrative.headline,
    kpis,
    pillarBars,
    pillarSlices,
    totalAchieved,
    activity,
    signalRows,
  };
}

export type DashboardData = ReturnType<typeof buildDashboardData>;
