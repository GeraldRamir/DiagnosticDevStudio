"use client";

import { motion } from "motion/react";
import { Box, DollarSign, Package, TrendingDown, TrendingUp, Users } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ChartMount, Reveal } from "@/components/report/reveal";
import type { DashboardData, DashboardKpi } from "@/lib/report-dashboard";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function KpiIcon({ type }: { type: DashboardKpi["icon"] }) {
  const cls = "size-5";
  if (type === "signals") return <Box className={cls} />;
  if (type === "score") return <DollarSign className={cls} />;
  if (type === "recover") return <TrendingUp className={cls} />;
  return <TrendingDown className={cls} />;
}

function iconBg(type: DashboardKpi["icon"]) {
  if (type === "signals") return "bg-[#dbeafe] text-[#2563eb]";
  if (type === "score") return "bg-[#ede9fe] text-[#7c3aed]";
  if (type === "recover") return "bg-[#dcfce7] text-[#16a34a]";
  return "bg-[#fee2e2] text-[#dc2626]";
}

function activityTone(tone: string) {
  const map: Record<string, string> = {
    blue: "bg-[#dbeafe] text-[#2563eb]",
    red: "bg-[#fee2e2] text-[#dc2626]",
    purple: "bg-[#ede9fe] text-[#7c3aed]",
    gray: "bg-[#f1f5f9] text-[#64748b]",
    green: "bg-[#dcfce7] text-[#16a34a]",
  };
  return map[tone] ?? map.gray;
}

type DashboardHomeViewProps = {
  data: DashboardData;
  subtitle: string;
  onViewActivity?: () => void;
  onViewSignals?: () => void;
};

export function DashboardHomeView({
  data,
  subtitle,
  onViewActivity,
  onViewSignals,
}: DashboardHomeViewProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-[#64748b]">{subtitle}</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi, i) => (
          <Reveal key={kpi.label} delay={i * 120} className="min-h-[108px]">
            <article className="rounded-2xl border border-[#e8ebf0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">
                    {kpi.prefix}
                    <NumberTicker value={kpi.value} delay={0.2 + i * 0.1} className="text-[#111827]" />
                    {kpi.suffix ? (
                      <span className="text-base font-medium text-[#94a3b8]">{kpi.suffix}</span>
                    ) : null}
                  </p>
                </div>
                <span className={cn("flex size-10 items-center justify-center rounded-xl", iconBg(kpi.icon))}>
                  <KpiIcon type={kpi.icon} />
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Reveal delay={300} className="min-h-[360px]">
          <article className="flex h-full flex-col rounded-2xl border border-[#e8ebf0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-base font-semibold">Puntaje por pilar</h2>
            <p className="mt-0.5 text-xs text-[#94a3b8]">Obtenido vs. brecha al máximo</p>
            <ChartMount delay={350} height={280} className="mt-3">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.pillarBars} barGap={4}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: "1px solid #e8ebf0", fontSize: 12 }} />
                  <Bar activeBar={false} dataKey="obtenido" stackId="a" fill="#93c5fd" animationDuration={1400} animationBegin={400} />
                  <Bar activeBar={false} dataKey="brecha" stackId="a" fill="#e0e7ff" radius={[6, 6, 0, 0]} animationDuration={1400} animationBegin={600} />
                </BarChart>
              </ResponsiveContainer>
            </ChartMount>
          </article>
        </Reveal>

        <Reveal delay={450} className="min-h-[360px]">
          <article className="rounded-2xl border border-[#e8ebf0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-base font-semibold">Distribución por pilar</h2>
            <ChartMount delay={500} height={240} className="relative mt-2">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.pillarSlices} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2} animationDuration={1200} animationBegin={550}>
                    {data.pillarSlices.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: "1px solid #e8ebf0", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Participación"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[0.625rem] font-medium uppercase tracking-wider text-[#94a3b8]">Puntaje total</p>
                <p className="text-xl font-bold text-[#111827]">{data.totalAchieved}</p>
              </div>
            </ChartMount>
            <ul className="mt-2 space-y-2">
              {data.pillarSlices.map((slice) => (
                <li key={slice.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[#64748b]">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                    {slice.name}
                  </span>
                  <span className="font-medium text-[#111827]">{slice.value}%</span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Reveal delay={600} className="min-h-[320px]">
          <article className="rounded-2xl border border-[#e8ebf0] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Actividad reciente</h2>
              <button type="button" onClick={onViewActivity} className="text-xs font-medium text-[#64748b] hover:text-[#111827]">
                Ver todo
              </button>
            </div>
            <ul className="mt-4 space-y-4">
              {data.activity.map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.06 }} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f4f8] text-[#64748b]">
                    {i === 0 ? <Users className="size-4" /> : <Package className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#111827]">{item.title}</p>
                    <p className="mt-0.5 text-xs text-[#94a3b8]">{item.subtitle}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold", activityTone(item.tone))}>
                    {item.badge}
                  </span>
                </motion.li>
              ))}
            </ul>
          </article>
        </Reveal>

        <Reveal delay={700} className="min-h-[320px]">
          <article className="rounded-2xl border border-[#e8ebf0] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Señales prioritarias</h2>
              <button type="button" onClick={onViewSignals} className="text-xs font-medium text-[#64748b] hover:text-[#111827]">
                Ver todas
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] text-xs text-[#94a3b8]">
                    <th className="pb-3 font-medium">Señal</th>
                    <th className="pb-3 font-medium">Pilar</th>
                    <th className="pb-3 font-medium">Peso</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.signalRows.map((row) => (
                    <tr key={row.id} className="border-b border-[#f8fafc]">
                      <td className="py-3 font-medium text-[#111827]">{row.name}</td>
                      <td className="py-3 text-[#64748b]">{row.pillar}</td>
                      <td className="py-3 font-mono">{row.weight}</td>
                      <td className="py-3">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  );
}
