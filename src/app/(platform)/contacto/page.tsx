import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Camera,
  Globe,
  MessageCircle,
  PencilRuler,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { BRAND_LINKS } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto | Dev Studio Tools",
  description:
    "Escríbenos por el canal que prefieras: dudas sobre las herramientas, errores encontrados o un proyecto a medida.",
  path: "/contacto",
});

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "Dudas y errores",
    body: "Si una herramienta no hizo lo que esperabas, cuéntanos cuál era y qué pasó.",
    href: BRAND_LINKS.contacto,
    cta: "Abrir formulario de contacto",
  },
  {
    icon: PencilRuler,
    title: "Un proyecto a medida",
    body: "Web, aplicación, sistema interno o automatización para tu negocio.",
    href: BRAND_LINKS.cotizar,
    cta: "Pedir una cotización",
  },
  {
    icon: Globe,
    title: "Conocer el estudio",
    body: "Qué hace Dev Studio, con quién trabaja y cómo lleva los proyectos.",
    href: BRAND_LINKS.website,
    cta: "Ir a devstudioo.com",
  },
];

const SOCIALS = [
  { icon: Camera, label: "Instagram", href: BRAND_LINKS.instagram },
  { icon: Briefcase, label: "LinkedIn", href: BRAND_LINKS.linkedin },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos de tu negocio"
        description="No hay un centro de soporte con tickets: escribes por el canal que prefieras y te responde alguien del equipo."
      />

      <section className="dst-container pb-6">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-4 lg:grid-cols-3">
            {CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-[1.75rem] bg-[#f6f5fa] p-6 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span className="mb-5 flex size-10 items-center justify-center rounded-2xl bg-white text-foreground">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <h2 className="text-[1.05rem] font-medium tracking-tight text-foreground">
                    {channel.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {channel.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {channel.cta}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dst-container pb-16 md:pb-20">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <h2 className="max-w-md text-[1.6rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground sm:text-[1.9rem]">
                También estamos aquí
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Publicamos lo que vamos construyendo y respondemos mensajes por las redes del
                estudio.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-[2.6rem] items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-[0.8125rem] font-medium text-foreground"
                    >
                      <Icon className="size-4" strokeWidth={1.8} aria-hidden />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[#f6f5fa] p-6 md:justify-self-end">
              <p className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                Antes de escribir
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muchas dudas frecuentes ya están respondidas en la página de ayuda: cómo empezar,
                qué pasa con tus datos y qué esperar de cada resultado.
              </p>
              <Link
                href="/ayuda"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                Ver preguntas frecuentes
                <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
