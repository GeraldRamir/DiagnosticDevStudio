"use client";

import { useCallback, useState } from "react";
import { Check, Copy, FileDown, Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  ReportPageHeader,
  ReportSection,
  ReportShell,
} from "@/components/report/report-ui";
import type { ReportMeta } from "@/lib/report-view-model";

type SettingsViewProps = {
  meta: ReportMeta;
  onExportPdf: () => void;
};

export function SettingsView({ meta, onExportPdf }: SettingsViewProps) {
  const [copied, setCopied] = useState(false);
  const reportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/reporte/${meta.slug}`
      : `/reporte/${meta.slug}`;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      toast.success("Enlace copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }, [reportUrl]);

  return (
    <ReportShell>
      <ReportPageHeader
        title="Configuración del informe"
        description="Exportación, datos de referencia y opciones de acceso al diagnóstico."
      />

      <div className="space-y-6 p-6">
        <ReportSection title="Exportar y compartir">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onExportPdf}
              className="inline-flex h-10 items-center gap-2 rounded border border-[#0f172a] bg-[#0f172a] px-5 text-sm font-medium text-white hover:bg-[#1e293b]"
            >
              <FileDown className="size-4" />
              Exportar PDF
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-10 items-center gap-2 rounded border border-[#d1d5db] bg-white px-5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
            >
              {copied ? <Check className="size-4 text-[#065f46]" /> : <Copy className="size-4" />}
              Copiar enlace
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5 text-xs text-[#6b7280]">
            <Link2 className="size-3.5 shrink-0" />
            <span className="truncate font-mono">{reportUrl}</span>
          </div>
        </ReportSection>

        <ReportSection title="Datos del diagnóstico">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["Referencia", meta.slug],
              ["Estado", meta.analysisStatus],
              ["Contacto", meta.fullName],
              ["Correo", meta.email],
              ["WhatsApp", meta.whatsapp],
              ["Visualizaciones", String(meta.viewCount)],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#f3f4f6] pb-3">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[#0f172a]">{value}</dd>
              </div>
            ))}
          </dl>
        </ReportSection>
      </div>
    </ReportShell>
  );
}
