"use client";

import { cn } from "@/lib/utils";

export function ReportPageHeader({
  title,
  description,
  meta,
}: {
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <header className="border-b border-[#d1d5db] bg-white px-6 py-5">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
        Informe de madurez digital
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">{title}</h2>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#4b5563]">{description}</p>
      {meta ? <p className="mt-2 text-xs text-[#9ca3af]">{meta}</p> : null}
    </header>
  );
}

export function ReportSection({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-[#d1d5db] bg-white", className)}>
      <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-5 py-3">
        <h3 className="text-sm font-semibold text-[#0f172a]">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-[#6b7280]">{subtitle}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: "ok" | "warn" | "fail" | "neutral";
  label: string;
}) {
  const styles = {
    ok: "border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46]",
    warn: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
    fail: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
    neutral: "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide",
        styles[status],
      )}
    >
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: "alta" | "media" | "baja" }) {
  const map = {
    alta: { status: "fail" as const, label: "Alta" },
    media: { status: "warn" as const, label: "Media" },
    baja: { status: "ok" as const, label: "Baja" },
  };
  const s = map[severity];
  return <StatusBadge status={s.status} label={s.label} />;
}

export function KpiGrid({
  items,
}: {
  items: { label: string; value: string; note?: string }[];
}) {
  return (
    <dl className="grid gap-px overflow-hidden rounded border border-[#d1d5db] bg-[#d1d5db] sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white px-5 py-4">
          <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">
            {item.label}
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#0f172a]">{item.value}</dd>
          {item.note ? <dd className="mt-0.5 text-xs text-[#9ca3af]">{item.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#d1d5db] bg-[#f9fafb]">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#6b7280]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafafa]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-[#374151]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReportShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded border border-[#d1d5db] bg-white shadow-sm">
      {children}
    </div>
  );
}
