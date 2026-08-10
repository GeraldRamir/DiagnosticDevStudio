"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import {
  Card,
  CardHead,
  Chip,
  KpiRow,
  SeverityChip,
  ViewHeader,
} from "@/components/report/report-ui";
import type { NarrativeResult } from "@/lib/analysis/types";
import type { ReportMeta, ReportViewId } from "@/lib/report-view-model";

type ReportNarrativeViewProps = {
  narrative: NarrativeResult;
  meta: ReportMeta;
  globalScore: number;
  scoreLabel: string;
  onNavigate: (view: ReportViewId) => void;
};

export function ReportNarrativeView({
  narrative,
  meta,
  globalScore,
  scoreLabel,
  onNavigate,
}: ReportNarrativeViewProps) {
  const counts = {
    alta: narrative.findings.filter((f) => f.severity === "alta").length,
    media: narrative.findings.filter((f) => f.severity === "media").length,
    baja: narrative.findings.filter((f) => f.severity === "baja").length,
  };

  return (
    <div className="space-y-3">
      <ViewHeader
        eyebrow="Lectura ejecutiva"
        title={narrative.headline}
        description={narrative.summary}
        right={<Chip tone="dark">{globalScore}/100 · {scoreLabel}</Chip>}
      />

      <KpiRow
        delay={0.1}
        items={[
          { label: "Hallazgos", value: String(narrative.findings.length), note: "priorizados por impacto" },
          { label: "Severidad alta", value: String(counts.alta), note: "requieren acción inmediata" },
          { label: "Severidad media", value: String(counts.media), note: "planificar a corto plazo" },
          { label: "Severidad baja", value: String(counts.baja), note: "mejoras incrementales" },
        ]}
      />

      <Card
        tone="accent"
        className="group flex flex-wrap items-center justify-between gap-4"
        delay={0.36}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110">
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/70">
              Acción inmediata
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed">{narrative.quickWin}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("software")}
          className="group/cta inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#d9452f] transition-transform duration-200 hover:-translate-y-0.5"
        >
          Ver sistemas
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:rotate-45" />
        </button>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {narrative.findings.map((f, i) => (
          <Card key={`${f.title}-${i}`} className="group" delay={0.44 + i * 0.07}>
            <CardHead
              title={f.title}
              subtitle={f.pillar}
              icon={
                <span className="text-xs font-bold text-[#131313]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              }
              right={<SeverityChip severity={f.severity} />}
            />

            <dl className="mt-4 space-y-3">
              <div className="rounded-[1.125rem] bg-[#f7f7f7] p-3.5">
                <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#a3a3a3]">
                  Qué encontramos
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-[#4a4a4a]">{f.whatWeFound}</dd>
              </div>
              <div className="rounded-[1.125rem] bg-[#f7f7f7] p-3.5">
                <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#a3a3a3]">
                  Por qué importa
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-[#4a4a4a]">{f.whyItMatters}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <p className="pb-1 text-center text-xs text-[#b0b0b0]">
        Estado del análisis: {meta.analysisStatus} · Ref. {meta.slug} · Documento confidencial
      </p>
    </div>
  );
}
