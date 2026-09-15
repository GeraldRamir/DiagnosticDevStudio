import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Términos del servicio",
  description:
    "Condiciones de uso del diagnóstico digital DevStudio: qué ofrece el servicio, responsabilidades y limitaciones.",
};

const SECTIONS = [
  {
    title: "Aceptación",
    body: [
      "Al usar el diagnóstico digital de DevStudio aceptas estos términos. Si no estás de acuerdo, no utilices el servicio.",
      "El servicio está dirigido a dueños y responsables de negocios en Latinoamérica que desean evaluar su madurez digital.",
    ],
  },
  {
    title: "Qué ofrece el servicio",
    body: [
      "Analizamos señales públicas o autorizadas de tu presencia digital (sitio web, Instagram u otros datos que declares) y generamos un reporte con puntaje, hallazgos y recomendaciones orientativas.",
      "El reporte es informativo. No constituye asesoría legal, contable ni garantía de resultados comerciales.",
      "Las métricas de Instagram solo están disponibles si conectas tu cuenta y autorizas los permisos correspondientes.",
    ],
  },
  {
    title: "Tu responsabilidad",
    body: [
      "Debes proporcionar información veraz sobre tu negocio y contar con autorización para analizar las URLs o cuentas que indiques.",
      "Si conectas Instagram, confirmas que eres titular o administrador autorizado de esa cuenta profesional.",
      "El enlace del reporte es privado pero accesible para quien lo tenga; compártelo solo con personas de confianza.",
    ],
  },
  {
    title: "Propiedad intelectual",
    body: [
      "DevStudio conserva los derechos sobre la plataforma, el diseño del reporte y la metodología de medición.",
      "Los datos de tu negocio y el contenido de tu sitio o perfil siguen siendo tuyos.",
    ],
  },
  {
    title: "Limitación de responsabilidad",
    body: [
      "El diagnóstico se entrega “tal cual”, en base a mediciones automatizadas en el momento del análisis. Las condiciones de tu sitio o redes pueden cambiar después.",
      "DevStudio no se hace responsable por decisiones de negocio tomadas únicamente con base en el reporte.",
    ],
  },
  {
    title: "Modificaciones y contacto",
    body: [
      "Podemos actualizar estos términos. La fecha de la última revisión aparece al final de esta página.",
      "Para consultas sobre el servicio puedes contactarnos por Instagram @dev_studioo o por el correo con el que generaste tu diagnóstico.",
    ],
  },
];

export default function TermsPage() {
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
            Términos del servicio
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#7b7b87]">
            Condiciones de uso del diagnóstico digital DevStudio. Léelas antes de conectar tu
            cuenta de Instagram o enviar tu información.
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
            Consulta también nuestra{" "}
            <Link href="/privacidad" className="font-semibold text-[#ee5b45] hover:underline">
              política de privacidad
            </Link>{" "}
            y las{" "}
            <Link href="/eliminacion-datos" className="font-semibold text-[#ee5b45] hover:underline">
              instrucciones para eliminar datos
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
