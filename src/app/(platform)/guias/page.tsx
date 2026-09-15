import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { GUIDES } from "@/lib/content/guides";
import { getToolById } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Guías para digitalizar tu negocio | Dev Studio Tools",
  description:
    "Guías cortas y prácticas para poner tu negocio en internet, vender por WhatsApp, mejorar tu Instagram y pasar tu menú a digital.",
  path: "/guias",
});

export default function GuidesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guías"
        title="Pasos concretos, no teoría"
        description="Cada guía resuelve una situación real de un negocio pequeño y termina en una lista de verificación. Se leen en menos de lo que dura un café."
      />

      <section className="dst-container pb-16 md:pb-20">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-4 md:grid-cols-2">
            {GUIDES.map((guide) => {
              const tool = getToolById(guide.toolId);
              return (
                <Link
                  key={guide.slug}
                  href={`/guias/${guide.slug}`}
                  className="group flex flex-col rounded-[1.75rem] bg-[#f6f5fa] p-6 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[0.7rem] font-medium text-foreground">
                      {guide.level}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
                      <Clock className="size-3.5" strokeWidth={1.8} aria-hidden />
                      {guide.minutes} min
                    </span>
                  </div>

                  <h2 className="mt-5 text-[1.3rem] leading-[1.18] font-normal tracking-[-0.02em] text-foreground">
                    {guide.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {guide.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-[0.72rem] text-muted-foreground">
                      Se apoya en {tool.shortName}
                    </span>
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#16161c] text-white transition-transform duration-200 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
