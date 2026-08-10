"use client";

import {
  Card,
  CardHead,
  Chip,
  Counter,
  KpiRow,
  ProgressLine,
  StaticPill,
  StatusDot,
  ViewHeader,
  pillarColor,
} from "@/components/report/report-ui";
import type { PillarDetail } from "@/lib/report-view-model";
import type { HoursResult } from "@/lib/analysis/types";

type PillarsViewProps = {
  pillars: PillarDetail[];
  hours: HoursResult;
  globalScore: number;
};

export function PillarsView({ pillars, hours, globalScore }: PillarsViewProps) {
  const totalScore = pillars.reduce((s, p) => s + p.score, 0);
  const totalMax = pillars.reduce((s, p) => s + p.max, 0);
  const strongest = [...pillars].sort((a, b) => b.pct - a.pct)[0];
  const weakest = [...pillars].filter((p) => p.max > 0).sort((a, b) => a.pct - b.pct)[0];

  return (
    <div className="space-y-3">
      <ViewHeader
        eyebrow="Evaluación estructurada"
        title="Pilares de madurez digital"
        description="Cinco dimensiones con peso determinístico. Cada pilar agrupa señales medidas de forma verificable."
        right={<Chip tone="dark">{globalScore}/100</Chip>}
      />

      <KpiRow
        items={[
          { label: "Puntaje acumulado", value: `${totalScore} pt`, note: `de ${totalMax} posibles` },
          {
            label: "Pilar más sólido",
            value: strongest ? `${strongest.pct}%` : "—",
            note: strongest?.label,
          },
          {
            label: "Mayor oportunidad",
            value: weakest ? `${weakest.pct}%` : "—",
            note: weakest?.label,
          },
          {
            label: "Horas recuperables",
            value: `${Math.round(hours.automatizable)} h`,
            note: `de ${Math.round(hours.horasMes)} h administrativas`,
          },
        ]}
      />

      <Card delay={0.3}>
        <CardHead
          title="Cobertura por dimensión"
          subtitle="Porcentaje alcanzado sobre el máximo del pilar"
          right={<StaticPill label="Actual" />}
        />
        <ul className="mt-5 space-y-4">
          {pillars.map((pillar, i) => (
            <li
              key={pillar.id}
              title={`${pillar.label}: ${pillar.pct}% del máximo`}
              className="cursor-help rounded-lg transition-transform duration-200 hover:translate-x-1"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#131313]">{pillar.label}</span>
                <span className="text-xs font-semibold tabular-nums text-[#9a9a9a]">
                  {pillar.score} / {pillar.max} pt
                </span>
              </div>
              <ProgressLine
                className="mt-2"
                pct={pillar.pct}
                color={pillarColor(i)}
                delay={0.45 + i * 0.12}
              />
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {pillars.map((pillar, i) => (
          <Card key={pillar.id} className="group" delay={0.4 + i * 0.08}>
            <CardHead
              title={pillar.label}
              subtitle={
                pillar.redistributed
                  ? "Puntos redistribuidos — sin sitio web analizable"
                  : `${pillar.signals.length} señales medidas`
              }
              right={<Chip tone="accent">{pillar.pct}%</Chip>}
            />

            <p className="mt-4 text-[2rem] font-bold leading-none tracking-tight text-[#131313]">
              <Counter value={pillar.score} delay={0.55 + i * 0.08} />
              <span className="text-base font-semibold text-[#c9c9c9]"> / {pillar.max}</span>
            </p>
            <ProgressLine
              className="mt-3"
              pct={pillar.pct}
              color={pillarColor(i)}
              delay={0.6 + i * 0.08}
            />

            {pillar.signals.length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {pillar.signals.map((s) => (
                  <li
                    key={s.id}
                    title={s.evidence}
                    className="-mx-2 flex cursor-help items-start gap-2.5 rounded-lg px-2 py-1 transition-colors hover:bg-[#fafafa]"
                  >
                    <span className="mt-1.5">
                      <StatusDot status={s.status} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-[#5c5c5c]">{s.label}</span>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-[#b0b0b0]">
                      {s.weight} pt
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-[#a3a3a3]">Sin señales asignadas a este pilar.</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
