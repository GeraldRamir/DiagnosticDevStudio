"use client";

import { useMemo, useState } from "react";
import {
  DataTable,
  ReportPageHeader,
  ReportShell,
  StatusBadge,
} from "@/components/report/report-ui";
import type { SignalDetail } from "@/lib/report-view-model";
import { PILLAR_LABELS } from "@/lib/report-view-model";
import type { PillarId } from "@/lib/analysis/types";

type SignalsViewProps = {
  signals: SignalDetail[];
  query?: string;
};

const selectCls =
  "h-9 rounded border border-[#d1d5db] bg-white px-3 text-sm text-[#374151] focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]";

export function SignalsView({ signals, query = "" }: SignalsViewProps) {
  const [pillarFilter, setPillarFilter] = useState<PillarId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "fail" | "warn" | "ok">("all");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    let rows = [...signals];
    if (pillarFilter !== "all") rows = rows.filter((s) => s.pillarId === pillarFilter);
    if (statusFilter !== "all") rows = rows.filter((s) => s.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.evidence.toLowerCase().includes(q) ||
          s.pillar.toLowerCase().includes(q),
      );
    }
    rows.sort((a, b) => (sortDesc ? b.weight - a.weight : a.weight - b.weight));
    return rows;
  }, [signals, pillarFilter, statusFilter, query, sortDesc]);

  return (
    <ReportShell>
      <ReportPageHeader
        title="Matriz de señales"
        description="Registro completo de hallazgos técnicos y operativos. Cada fila corresponde a una medición verificable del diagnóstico."
        meta={`${filtered.length} señales registradas`}
      />

      <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-6 py-3">
        <div className="flex flex-wrap gap-2">
          <select value={pillarFilter} onChange={(e) => setPillarFilter(e.target.value as PillarId | "all")} className={selectCls}>
            <option value="all">Todos los pilares</option>
            {(Object.keys(PILLAR_LABELS) as PillarId[]).map((id) => (
              <option key={id} value={id}>{PILLAR_LABELS[id]}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={selectCls}>
            <option value="all">Todos los estados</option>
            <option value="fail">Crítico</option>
            <option value="warn">Alerta</option>
            <option value="ok">Conforme</option>
          </select>
          <button type="button" onClick={() => setSortDesc((v) => !v)} className={selectCls}>
            Peso {sortDesc ? "↓" : "↑"}
          </button>
        </div>
      </div>

      <div className="p-6">
        {filtered.length > 0 ? (
          <DataTable
            columns={["Señal", "Pilar", "Peso", "Estado", "Evidencia"]}
            rows={filtered.map((row) => [
              <span key="l" className="font-medium text-[#0f172a]">{row.label}</span>,
              row.pillar,
              <span key="w" className="font-mono text-[#0f172a]">{row.weight}</span>,
              <StatusBadge
                key="s"
                status={row.status === "fail" ? "fail" : row.status === "warn" ? "warn" : "ok"}
                label={row.statusLabel}
              />,
              <span key="e" className="text-xs leading-relaxed text-[#6b7280]">{row.evidence}</span>,
            ])}
          />
        ) : (
          <p className="py-12 text-center text-sm text-[#9ca3af]">No hay señales con los filtros seleccionados.</p>
        )}
      </div>
    </ReportShell>
  );
}
