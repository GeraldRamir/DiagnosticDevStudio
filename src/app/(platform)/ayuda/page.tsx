import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FAQ_GROUPS } from "@/lib/content/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ayuda y preguntas frecuentes | Dev Studio Tools",
  description:
    "Cómo empezar, qué pasa con tus datos y qué esperar de los resultados de cada herramienta.",
  path: "/ayuda",
});

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ayuda"
        title="Preguntas que nos hacen seguido"
        description="Si lo que buscas no está aquí, escríbenos y lo respondemos. Las dudas repetidas terminan en esta página."
      />

      <section className="dst-container pb-6">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="flex flex-col gap-10">
            {FAQ_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground">
                  {group.title}
                </h2>

                <div className="mt-5 flex flex-col gap-3">
                  {group.items.map((item) => (
                    <details
                      key={item.question}
                      className="group/item rounded-[1.5rem] bg-[#f6f5fa] px-6 py-5"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.98rem] font-medium tracking-tight text-foreground [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <ChevronDown
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open/item:rotate-180"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                      </summary>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dst-container pb-16 md:pb-20">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <h2 className="max-w-md text-[1.6rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground sm:text-[1.9rem]">
                ¿Tu duda no está en la lista?
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Cuéntanos qué herramienta estabas usando y qué esperabas que pasara. Es lo que más
                rápido nos permite ayudarte o corregirlo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/contacto" className="dst-lime-cta">
                Escríbenos
                <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href="/guias"
                className="inline-flex h-[2.6rem] items-center rounded-full border border-black/10 bg-white px-5 text-[0.8125rem] font-medium text-foreground"
              >
                Ver las guías
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
