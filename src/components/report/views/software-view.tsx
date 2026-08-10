"use client";

import { Layers } from "lucide-react";
import { Card, CardHead, Chip, ViewHeader } from "@/components/report/report-ui";
import type { NarrativeResult } from "@/lib/analysis/types";

type SoftwareViewProps = {
  narrative: NarrativeResult;
  industry: string;
};

export function SoftwareView({ narrative, industry }: SoftwareViewProps) {
  const rec = narrative.softwareRecommendations;

  return (
    <div className="space-y-3">
      <ViewHeader
        eyebrow="Plan de sistemas"
        title="Sistemas recomendados"
        description={rec.summary}
        right={<Chip tone="dark">{rec.items.length} categorías</Chip>}
      />

      <Card tone="muted" className="group flex flex-wrap items-center gap-4" delay={0.12}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ee5b45] text-white transition-transform duration-300 group-hover:scale-110">
          <Layers className="size-4" />
        </span>
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-[#4a4a4a]">
          Prioridades derivadas de las señales medidas para el sector <strong>{industry}</strong>.
          No implican marcas específicas ni constituyen asesoría comercial.
        </p>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {rec.items.map((item, i) => (
          <Card key={item.category} className="group" delay={0.2 + i * 0.07}>
            <CardHead
              title={item.recommendation}
              subtitle={item.category}
              icon={
                <span className="text-xs font-bold text-[#131313]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              }
              right={<Chip tone="accent">Prioridad {i + 1}</Chip>}
            />
            <p className="mt-4 rounded-[1.125rem] bg-[#f7f7f7] p-3.5 text-sm leading-relaxed text-[#4a4a4a]">
              {item.why}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
