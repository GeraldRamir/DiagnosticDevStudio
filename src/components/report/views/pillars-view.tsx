"use client";

import { ChartMount } from "@/components/report/reveal";
import {
  KpiGrid,
  ReportPageHeader,
  ReportSection,
  ReportShell,
  StatusBadge,
} from "@/components/report/report-ui";
import type { PillarDetail } from "@/lib/report-view-model";
import type { HoursResult } from "@/lib/analysis/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PillarsViewProps = {
  pillars: PillarDetail[];
  hours: HoursResult;
  globalScore: number;
};

export function PillarsView({ pillars, hours, globalScore }: PillarsViewProps) {
  const chartData = pillars.map((p) => ({
    name: p.label,
    score: p.score,
    max: p.max,
  }));

  return (
    <div className="space-y-0">
      <ReportShell>
        <ReportPageHeader
          title="Evaluación por pilares"
          description="Desglose estructurado de madurez digital en cinco dimensiones. Cada pilar agrupa señales medidas con peso determinístico."
          meta={`Índice global: ${globalScore}/100`}
        />

        <div className="space-y-6 p-6">
          <ReportSection title="Comparativa de puntaje" subtitle="Puntaje obtenido por dimensión">
            <ChartMount delay={100} height={280}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                  <CartesianGrid stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: 4,
                      border: "1px solid #d1d5db",
                      fontSize: 12,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar activeBar={false} dataKey="score" fill="#1e3a5f" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartMount>
          </ReportSection>

          <div className="grid gap-4 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <ReportSection
                key={pillar.id}
                title={pillar.label}
                subtitle={
                  pillar.redistributed
                    ? "Puntos redistribuidos — sin sitio web analizable"
                    : `${pillar.pct}% del máximo del pilar`
                }
              >
                <div className="flex items-baseline justify-between border-b border-[#e5e7eb] pb-3">
                  <span className="text-3xl font-semibold tabular-nums text-[#0f172a]">
                    {pillar.score}
                    <span className="text-lg font-normal text-[#9ca3af]"> / {pillar.max}</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-[#e5e7eb]">
                  <div className="h-full bg-[#1e3a5f]" style={{ width: `${pillar.pct}%` }} />
                </div>
                {pillar.signals.length > 0 ? (
                  <ul className="mt-4 divide-y divide-[#e5e7eb]">
                    {pillar.signals.map((s) => (
                      <li key={s.id} className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
                        <span className="text-sm text-[#374151]">{s.label}</span>
                        <StatusBadge
                          status={s.status === "fail" ? "fail" : s.status === "warn" ? "warn" : "ok"}
                          label={s.status === "fail" ? "Crítico" : s.status === "warn" ? "Alerta" : "OK"}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </ReportSection>
            ))}
          </div>

          <ReportSection title="Impacto operativo" subtitle="Estimación basada en respuestas del cuestionario">
            <KpiGrid
              items={[
                { label: "Horas admin / mes", value: `${Math.round(hours.horasMes)} h` },
                {
                  label: "Horas recuperables",
                  value: `${Math.round(hours.automatizable)} h`,
                  note: "Potencial de automatización",
                },
                {
                  label: "Factores operativos",
                  value: String(hours.desglose.factores.length),
                },
              ]}
            />
          </ReportSection>
        </div>
      </ReportShell>
    </div>
  );
}
