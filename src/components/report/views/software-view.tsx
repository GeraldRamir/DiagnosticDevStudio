"use client";

import type { NarrativeResult } from "@/lib/analysis/types";
import {
  ReportPageHeader,
  ReportSection,
  ReportShell,
} from "@/components/report/report-ui";

type SoftwareViewProps = {
  narrative: NarrativeResult;
  industry: string;
};

export function SoftwareView({ narrative, industry }: SoftwareViewProps) {
  const { softwareRecommendations: rec } = narrative;

  return (
    <ReportShell>
      <ReportPageHeader
        title="Recomendación de sistemas"
        description={rec.summary}
        meta={`Sector: ${industry} · ${rec.items.length} categorías priorizadas`}
      />

      <div className="divide-y divide-[#e5e7eb]">
        {rec.items.map((item, i) => (
          <article key={item.category} className="px-6 py-5">
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center border border-[#d1d5db] bg-[#f9fafb] text-xs font-bold text-[#374151]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">
                  {item.category}
                </p>
                <h3 className="mt-1 text-base font-semibold text-[#0f172a]">{item.recommendation}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">{item.why}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-[#e5e7eb] bg-[#f9fafb] px-6 py-4">
        <p className="text-xs text-[#6b7280]">
          Las recomendaciones se derivan de las señales medidas en el diagnóstico. No constituyen asesoría comercial ni implican marcas específicas.
        </p>
      </div>
    </ReportShell>
  );
}
