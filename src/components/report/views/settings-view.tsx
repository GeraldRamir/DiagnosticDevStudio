"use client";

import { Check, Copy, Download, Link2 } from "lucide-react";
import {
  Card,
  CardHead,
  Chip,
  PillButton,
  ViewHeader,
} from "@/components/report/report-ui";
import type { ReportMeta } from "@/lib/report-view-model";

type SettingsViewProps = {
  meta: ReportMeta;
  reportUrl: string;
  copied: boolean;
  onExportPdf: () => void;
  onCopyLink: () => void;
};

export function SettingsView({
  meta,
  reportUrl,
  copied,
  onExportPdf,
  onCopyLink,
}: SettingsViewProps) {
  const rows: [string, string][] = [
    ["Referencia", meta.slug],
    ["Emitido", meta.createdAt],
    ["Estado del análisis", meta.analysisStatus],
    ["Sector", meta.industry],
    ["País", meta.country],
    ["Sitio analizado", meta.websiteUrl ?? "No aplica"],
    ["Contacto", meta.fullName],
    ["Correo", meta.email],
    ["WhatsApp", meta.whatsapp],
    ["Visualizaciones", String(meta.viewCount)],
  ];

  return (
    <div className="space-y-3">
      <ViewHeader
        eyebrow="Administración"
        title="Configuración del informe"
        description="Exportación, enlace de acceso y datos de referencia del diagnóstico."
        right={<Chip tone="dark">Ref. {meta.slug}</Chip>}
      />

      <Card delay={0.12}>
        <CardHead title="Exportar y compartir" subtitle="El enlace es permanente y no caduca" />
        <div className="mt-4 flex flex-wrap gap-2">
          <PillButton variant="accent" onClick={onExportPdf} icon={<Download className="size-4" />}>
            Descargar PDF
          </PillButton>
          <PillButton
            variant="light"
            onClick={onCopyLink}
            icon={copied ? <Check className="size-4 text-[#1f9d6b]" /> : <Copy className="size-4" />}
          >
            {copied ? "Enlace copiado" : "Copiar enlace"}
          </PillButton>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-[#f7f7f7] px-4 py-3">
          <Link2 className="size-3.5 shrink-0 text-[#b0b0b0]" />
          <span className="truncate font-mono text-xs text-[#8a8a8a]">{reportUrl}</span>
        </div>
      </Card>

      <Card delay={0.2}>
        <CardHead title="Datos del diagnóstico" subtitle="Información asociada al informe" />
        <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="-mx-2 flex items-center justify-between gap-3 rounded-lg border-b border-[#f4f4f4] px-2 py-3 transition-colors hover:bg-[#fafafa]"
            >
              <dt className="text-xs font-medium text-[#a3a3a3]">{label}</dt>
              <dd className="min-w-0 truncate text-sm font-semibold text-[#131313]">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
