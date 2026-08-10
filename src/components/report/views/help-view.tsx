"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHead, ViewHeader } from "@/components/report/report-ui";

const FAQ = [
  {
    q: "¿Cómo se calcula el puntaje global?",
    a: "Combina cinco pilares con pesos fijos: presencia, rendimiento, captación, operación y datos. El cálculo es determinístico y no depende de la IA.",
  },
  {
    q: "¿Los hallazgos los redacta la IA?",
    a: "Sí, la narrativa se redacta a partir de señales ya medidas. El puntaje numérico se calcula antes y no cambia con el texto.",
  },
  {
    q: "¿Se comparten mis datos de contacto con la IA?",
    a: "No. Nombre, correo y WhatsApp se almacenan de forma segura y no se envían al motor de narrativa.",
  },
  {
    q: "¿Qué significa el estado del análisis?",
    a: "«Completo» indica que todas las fuentes respondieron. «Parcial» significa que alguna medición externa falló y se usó una alternativa.",
  },
  {
    q: "¿Puedo compartir este informe?",
    a: "Sí. La URL es permanente. En Configuración puedes copiar el enlace o descargar el PDF.",
  },
];

const LINKS = [
  { href: "/diagnostico", label: "Realizar un nuevo diagnóstico" },
  { href: "/privacidad", label: "Política de privacidad y datos" },
];

export function HelpView() {
  return (
    <div className="space-y-3">
      <ViewHeader
        eyebrow="Soporte"
        title="Centro de ayuda"
        description="Cómo interpretar los resultados y qué hay detrás de cada métrica del diagnóstico."
      />

      <Card delay={0.12}>
        <CardHead title="Preguntas frecuentes" subtitle="Metodología y alcance del informe" />
        <dl className="mt-4 divide-y divide-[#f4f4f4]">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="-mx-2 rounded-xl px-2 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-[#fafafa]"
            >
              <dt className="text-sm font-semibold text-[#131313]">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-[#8a8a8a]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rp-card-shadow rp-card-hover group flex items-center justify-between gap-3 rounded-[1.375rem] border border-[#efefef] bg-white p-5 text-sm font-semibold text-[#131313] transition-transform duration-300 hover:-translate-y-1"
          >
            {link.label}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fdeeeb] text-[#ee5b45] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
