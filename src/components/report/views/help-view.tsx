"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ReportPageHeader,
  ReportSection,
  ReportShell,
} from "@/components/report/report-ui";

const FAQ = [
  {
    q: "¿Cómo se calcula el puntaje global?",
    a: "Combina cinco pilares con pesos fijos: presencia, rendimiento, captación, operación y datos. El resultado es determinístico.",
  },
  {
    q: "¿Los hallazgos los genera la IA?",
    a: "La IA redacta a partir de señales ya medidas. El puntaje numérico no depende del texto generado.",
  },
  {
    q: "¿Se comparten mis datos de contacto con la IA?",
    a: "No. Nombre, correo y WhatsApp se almacenan de forma segura y no se envían al motor de narrativa.",
  },
  {
    q: "¿Puedo compartir este informe?",
    a: "Sí. La URL es permanente. Use Configuración para copiar el enlace o exportar PDF.",
  },
];

export function HelpView() {
  return (
    <ReportShell>
      <ReportPageHeader
        title="Centro de ayuda"
        description="Guía para interpretar los resultados del diagnóstico de madurez digital."
      />

      <div className="p-6">
        <ReportSection title="Preguntas frecuentes">
          <dl className="divide-y divide-[#e5e7eb]">
            {FAQ.map((item) => (
              <div key={item.q} className="py-4 first:pt-0 last:pb-0">
                <dt className="font-semibold text-[#0f172a]">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#4b5563]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </ReportSection>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/diagnostico", label: "Nuevo diagnóstico" },
            { href: "/privacidad", label: "Política de privacidad" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between border border-[#d1d5db] bg-[#f9fafb] px-4 py-3 text-sm font-medium text-[#0f172a] transition-colors hover:bg-white"
            >
              {link.label}
              <ArrowRight className="size-4 text-[#9ca3af]" />
            </Link>
          ))}
        </div>
      </div>
    </ReportShell>
  );
}
