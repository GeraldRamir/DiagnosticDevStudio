import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { BRAND_LINKS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Eliminación de datos",
  description:
    "Cómo solicitar la eliminación de tus datos personales y desconectar Instagram del diagnóstico DevStudio.",
};

const STEPS = [
  {
    title: "Datos que podemos eliminar",
    body: [
      "Información de contacto: nombre, correo y WhatsApp asociados a un diagnóstico.",
      "Respuestas del formulario y el reporte generado (puntaje, hallazgos, señales medidas).",
      "Eventos de uso anónimos vinculados a tu sesión del diagnóstico, cuando sea técnicamente posible identificarlos.",
    ],
  },
  {
    title: "Datos de Instagram",
    body: [
      "Si conectaste Instagram durante el diagnóstico, guardamos temporalmente en tu navegador (cookies) un token de acceso firmado para leer métricas mientras completas el formulario.",
      "Esos tokens expiran en unas horas y no se almacenan de forma permanente en nuestros servidores como credencial de Instagram.",
      "Para revocar el acceso de la app de DevStudio a tu cuenta de Instagram, ve a Instagram → Configuración → Seguridad → Apps y sitios web → Active → DevStudio → Eliminar acceso.",
    ],
  },
  {
    title: "Cómo solicitar la eliminación",
    body: [
      "Envía un correo desde la misma dirección que usaste al generar el diagnóstico.",
      "Indica en el asunto: “Eliminación de datos — Diagnóstico DevStudio”.",
      "Incluye el enlace de tu reporte (si lo tienes) o el nombre del negocio y la fecha aproximada del diagnóstico.",
      "Procesaremos la solicitud en un plazo razonable (habitualmente dentro de 30 días) y te confirmaremos por correo cuando se complete.",
    ],
  },
  {
    title: "Eliminación automática por Meta (callback)",
    body: [
      "Si eliminas tu cuenta de Instagram o revocas la app desde Meta, dejaremos de recibir datos nuevos de esa cuenta.",
      "Para solicitudes iniciadas desde Meta, también puedes usar el correo de contacto indicado abajo; responderemos con la confirmación de eliminación.",
    ],
  },
];

export default function DataDeletionPage() {
  return (
    <div className="lp-font min-h-screen bg-white">
      <SiteHeader />

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
            Instrucciones para la eliminación de datos
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#7b7b87]">
            Puedes pedir que borremos tu diagnóstico y datos de contacto, y revocar el acceso de
            Instagram en cualquier momento.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="mailto:lucianoramirezgerald@gmail.com?subject=Eliminación%20de%20datos%20—%20Diagnóstico%20DevStudio"
              className="flex items-start gap-3 rounded-[1.25rem] border border-[#f0edf6] bg-[#faf8ff] p-5 transition-colors hover:border-[#ded0fb]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f3ecff] text-[#5b3fa8]">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#131316]">Correo de solicitudes</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#5b5b66]">
                  lucianoramirezgerald@gmail.com
                </p>
              </div>
            </a>
            <a
              href={BRAND_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-[1.25rem] border border-[#f0edf6] bg-white p-5 transition-colors hover:border-[#ded0fb]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fdeeeb] text-[#ee5b45]">
                <MessageCircle className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#131316]">Instagram DevStudio</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#5b5b66]">
                  @dev_studioo — mensaje directo con tu solicitud
                </p>
              </div>
            </a>
          </div>

          <div className="mt-10 space-y-3">
            {STEPS.map((section, i) => (
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
            Más información en nuestra{" "}
            <Link href="/privacidad" className="font-semibold text-[#ee5b45] hover:underline">
              política de privacidad
            </Link>{" "}
            y en los{" "}
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

      <SiteFooter />
    </div>
  );
}
