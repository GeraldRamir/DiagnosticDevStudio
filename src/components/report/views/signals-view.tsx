"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHead,
  Chip,
  DataTable,
  EmptyState,
  SelectPill,
  StatusChip,
  ViewHeader,
} from "@/components/report/report-ui";
import type { SignalDetail } from "@/lib/report-view-model";
import { PILLAR_LABELS } from "@/lib/report-view-model";
import type { PillarId } from "@/lib/analysis/types";

type SignalsViewProps = {
  signals: SignalDetail[];
  query?: string;
};

type StatusFilter = "all" | "fail" | "warn" | "ok";
type SortOrder = "desc" | "asc";

export function SignalsView({ signals, query = "" }: SignalsViewProps) {
  const [pillarFilter, setPillarFilter] = useState<PillarId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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
    rows.sort((a, b) => (sortOrder === "desc" ? b.weight - a.weight : a.weight - b.weight));
    return rows;
  }, [signals, pillarFilter, statusFilter, query, sortOrder]);

  return (
    <div className="space-y-3">
      <ViewHeader
        eyebrow="Registro de mediciones"
        title="Matriz de señales"
        description="Cada fila corresponde a una medición del diagnóstico con su evidencia y peso en el puntaje."
        right={<Chip tone="dark">{filtered.length} de {signals.length}</Chip>}
      />

      <Card className="group" delay={0.15}>
        <CardHead
          title="Señales evaluadas"
          subtitle={query.trim() ? `Filtrando por “${query.trim()}”` : "Ordenadas por peso en el puntaje"}
          right={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <SelectPill
                label="Filtrar por pilar"
                value={pillarFilter}
                onChange={setPillarFilter}
                options={[
                  { value: "all" as const, label: "Todos los pilares" },
                  ...(Object.keys(PILLAR_LABELS) as PillarId[]).map((id) => ({
                    value: id,
                    label: PILLAR_LABELS[id],
                  })),
                ]}
              />
              <SelectPill
                label="Filtrar por estado"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "Todos los estados" },
                  { value: "fail", label: "Críticas" },
                  { value: "warn", label: "Alertas" },
                  { value: "ok", label: "Conformes" },
                ]}
              />
              <SelectPill
                label="Ordenar por peso"
                value={sortOrder}
                onChange={setSortOrder}
                options={[
                  { value: "desc", label: "Mayor peso" },
                  { value: "asc", label: "Menor peso" },
                ]}
              />
            </div>
          }
        />

        <div className="mt-5">
          {filtered.length > 0 ? (
            <DataTable
              columns={["Señal", "Pilar", "Peso", "Estado", "Evidencia"]}
              rows={filtered.map((row) => [
                <span key="l" className="font-semibold text-[#131313]">
                  {row.label}
                </span>,
                <span key="p" className="text-[#8a8a8a]">
                  {row.pillar}
                </span>,
                <span key="w" className="font-semibold tabular-nums text-[#131313]">
                  {row.weight}
                </span>,
                <StatusChip
                  key="s"
                  status={row.status === "fail" ? "fail" : row.status === "warn" ? "warn" : "ok"}
                  label={row.statusLabel}
                />,
                <span key="e" className="text-xs leading-relaxed text-[#8a8a8a]">
                  {row.evidence}
                </span>,
              ])}
            />
          ) : (
            <EmptyState message="No hay señales con los filtros seleccionados." />
          )}
        </div>
      </Card>
    </div>
  );
}
