import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos recogemos en el diagnóstico DevStudio, cómo se usan y qué información nunca se envía al motor de IA.",
};

const SECTIONS = [
  {
    title: "Qué datos recogemos",
    body: [
      "Datos del negocio: nombre, industria, país, tamaño del equipo, forma de registrar ventas, canales de contacto y la fricción operativa que declares.",
      "Datos de contacto: nombre completo, correo electrónico y número de WhatsApp, necesarios para entregarte el reporte.",
      "Datos técnicos: si indicas una URL, medimos señales públicas de ese sitio (velocidad, SEO, accesibilidad y adaptación a móvil).",
    ],
  },
  {
    title: "Qué no se envía a la inteligencia artificial",
    body: [
      "Tu nombre, correo electrónico y WhatsApp nunca viajan al motor de IA que redacta la narrativa del reporte.",
      "El motor solo recibe las señales ya medidas y el contexto del negocio necesario para escribir los hallazgos. El puntaje se calcula antes, de forma determinística, y no depende del texto generado.",
    ],
  },
  {
    title: "Para qué usamos la información",
    body: [
      "Generar tu reporte de madurez digital y alojarlo en una URL única y permanente.",
      "Enviarte por correo el enlace del reporte.",
      "Dar seguimiento comercial únicamente si nos lo solicitas.",
    ],
  },
  {
    title: "Conservación y acceso",
    body: [
      "El reporte queda disponible en su URL mientras no solicites su eliminación. Cualquiera con el enlace puede verlo, así que compártelo solo con quien corresponda.",
      "Puedes pedir la eliminación de tu diagnóstico y de tus datos de contacto escribiéndonos desde el mismo correo con el que lo generaste.",
    ],
  },
  {
    title: "Terceros que intervienen",
    body: [
      "Google PageSpeed Insights, para medir señales técnicas públicas del sitio que indiques.",
      "Google Gemini, para redactar la lectura ejecutiva a partir de datos ya medidos.",
      "Resend, para el envío del correo con el enlace del reporte.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="lp-font min-h-screen bg-white">
      <Navbar />

      <main className="px-[clamp(1.25rem,4vw,3.75rem)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#7b7b87] transition-colors hover:text-[#131316]"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Volver al inicio
          </Link>

          <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-[#131316]">
            Política de privacidad
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#7b7b87]">
            El diagnóstico existe para darte claridad, no para acumular datos. Aquí está, en
            lenguaje simple, qué recogemos y qué hacemos con ello.
          </p>

          <div className="mt-10 space-y-3">
            {SECTIONS.map((section, i) => (
              <section
                key={section.title}
                className="rounded-[1.5rem] border border-[#f0edf6] bg-white p-[clamp(1.25rem,2.4vw,2rem)] transition-colors hover:border-[#ded0fb]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f3ecff] text-[0.6875rem] font-bold text-[#5b3fa8]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-[#131316]">
                    {section.title}
                  </h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {section.body.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#ee5b45]" />
                      <p className="text-[0.875rem] leading-relaxed text-[#5b5b66]">{line}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-8 text-[0.875rem] text-[#7b7b87]">
            Para solicitar eliminación de datos consulta{" "}
            <Link href="/eliminacion-datos" className="font-semibold text-[#ee5b45] hover:underline">
              instrucciones para eliminar datos
            </Link>
            . También aplican los{" "}
            <Link href="/terminos" className="font-semibold text-[#ee5b45] hover:underline">
              términos del servicio
            </Link>
            .
          </p>

          <p className="mt-4 text-[0.75rem] text-[#b6b6c0]">
            Última actualización: agosto de 2026.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
