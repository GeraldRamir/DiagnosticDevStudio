"use client";

import type { NarrativeResult } from "@/lib/analysis/types";
import {
  ReportPageHeader,
  ReportSection,
  ReportShell,
  SeverityBadge,
} from "@/components/report/report-ui";
import type { ReportMeta } from "@/lib/report-view-model";

type ReportNarrativeViewProps = {
  narrative: NarrativeResult;
  meta: ReportMeta;
  globalScore: number;
  scoreLabel: string;
};

export function ReportNarrativeView({
  narrative,
  meta,
  globalScore,
  scoreLabel,
}: ReportNarrativeViewProps) {
  return (
    <ReportShell>
      <ReportPageHeader
        title={narrative.headline}
        description={narrative.summary}
        meta={`${meta.industry} · ${meta.country} · ${globalScore}/100 (${scoreLabel}) · ${meta.createdAt} · Ref. ${meta.slug}`}
      />

      <div className="space-y-6 p-6">
        <ReportSection title="Hallazgos priorizados" subtitle="Cinco observaciones ordenadas por severidad e impacto">
          <ol className="divide-y divide-[#e5e7eb]">
            {narrative.findings.map((f, i) => (
              <li key={i} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center border border-[#d1d5db] bg-[#f9fafb] text-sm font-semibold text-[#374151]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-semibold text-[#0f172a]">{f.title}</h4>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-[#9ca3af]">{f.pillar}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={f.severity} />
                </div>
                <dl className="mt-4 grid gap-3 pl-12 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                      Hallazgo
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-[#374151]">{f.whatWeFound}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                      Implicación
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-[#374151]">{f.whyItMatters}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </ReportSection>

        <ReportSection title="Acción inmediata" subtitle="Recomendación ejecutable para esta semana">
          <p className="text-sm leading-relaxed text-[#374151]">{narrative.quickWin}</p>
        </ReportSection>

        <p className="text-center text-xs text-[#9ca3af]">
          Estado del análisis: {meta.analysisStatus} · Documento confidencial
        </p>
      </div>
    </ReportShell>
  );
}
