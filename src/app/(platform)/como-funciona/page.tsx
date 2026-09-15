import Link from "next/link";
import { ArrowUpRight, Compass, Hammer, LineChart, LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cómo funciona | Dev Studio Tools",
  description:
    "Qué hace esta plataforma, en qué orden conviene usar las herramientas y qué pasa con la información que entregas.",
  path: "/como-funciona",
});

const STEPS = [
  {
    icon: Compass,
    title: "1. Mide dónde estás",
    body: "El diagnóstico te dice en qué punto está tu negocio en presencia, captación y operación. Sin eso, cualquier mejora es una apuesta.",
    href: "/tools/diagnostico-digital",
    cta: "Hacer el diagnóstico",
  },
  {
    icon: Hammer,
    title: "2. Arregla un punto a la vez",
    body: "Cada herramienta resuelve un problema concreto: un canal de contacto sin fricción, un perfil que convierte, un menú que se actualiza solo.",
    href: "/tools",
    cta: "Ver herramientas",
  },
  {
    icon: LineChart,
    title: "3. Revisa y repite",
    body: "Vuelve a medir después de aplicar los cambios. Lo que mejora se mantiene; lo que no, se cambia por otra cosa.",
    href: "/guias",
    cta: "Leer las guías",
  },
];

const PRINCIPLES = [
  {
    title: "Sin cuentas ni contraseñas",
    body: "No hay registro. Entras a la herramienta, la usas y te llevas el resultado.",
  },
  {
    title: "Una herramienta, un problema",
    body: "Ninguna intenta hacerlo todo. Puedes usarlas por separado o combinarlas, en el orden que te sirva.",
  },
  {
    title: "Pensadas para el celular",
    body: "La mayoría de los negocios pequeños trabajan desde el teléfono, así que todo funciona ahí primero.",
  },
  {
    title: "Resultados que te llevas",
    body: "Enlaces, códigos, menús y reportes son tuyos y puedes usarlos comercialmente sin pedir permiso.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cómo funciona"
        title="Medir, arreglar y volver a medir"
        description="Esta plataforma no es un curso ni un panel que hay que aprender. Son herramientas sueltas que resuelven un problema concreto cada una, ordenadas en la secuencia que suele funcionar."
      />

      <section className="dst-container pb-6">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-4 lg:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex flex-col rounded-[1.75rem] bg-[#f6f5fa] p-6"
                >
                  <span className="mb-5 flex size-10 items-center justify-center rounded-2xl bg-white text-foreground">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <h2 className="text-[1.05rem] font-medium tracking-tight text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  <Link
                    href={step.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                  >
                    {step.cta}
                    <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dst-container pb-6">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
            <h2 className="max-w-md text-[1.85rem] leading-[1.12] font-normal tracking-[-0.02em] text-foreground sm:text-[2.15rem]">
              Cómo trabajamos estas herramientas
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:justify-self-end">
              Son gratuitas porque son la forma más honesta que tenemos de mostrar cómo trabajamos.
              Si después necesitas algo a medida, ahí hablamos de un proyecto.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="rounded-[1.75rem] bg-[#f6f5fa] p-6">
                <h3 className="text-[0.98rem] font-medium tracking-tight text-foreground">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dst-container pb-16 md:pb-20">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#f6f5fa] text-foreground">
            <LockKeyhole className="size-5" strokeWidth={1.8} aria-hidden />
          </span>
          <h2 className="mt-5 max-w-xl text-[1.6rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground sm:text-[1.9rem]">
            Qué pasa con la información que entregas
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Varias herramientas trabajan solo en tu navegador: lo que escribes no sale de tu
            dispositivo. Cuando una necesita guardar información para generarte un resultado —por
            ejemplo, un reporte con enlace propio— se te indica dentro de la herramienta. Nunca se
            vende ni se comparte para publicidad.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/privacidad" className="dst-lime-cta">
              Leer la política de privacidad
              <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
            </Link>
            <Link
              href="/eliminacion-datos"
              className="inline-flex h-[2.6rem] items-center rounded-full border border-black/10 bg-white px-5 text-[0.8125rem] font-medium text-foreground"
            >
              Eliminar mis datos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
