import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Clock } from "lucide-react";
import { GUIDES, getGuide } from "@/lib/content/guides";
import { getToolById } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return pageMetadata({
      title: "Guía no encontrada | Dev Studio Tools",
      description: "Esta guía no existe o cambió de dirección.",
      path: "/guias",
    });
  }
  return pageMetadata({
    title: `${guide.title} | Dev Studio Tools`,
    description: guide.summary,
    path: `/guias/${guide.slug}`,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const tool = getToolById(guide.toolId);
  const others = GUIDES.filter((item) => item.slug !== guide.slug).slice(0, 2);

  return (
    <>
      <section className="dst-container pt-8 pb-6 md:pt-10">
        <Link
          href="/guias"
          className="inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.8} aria-hidden />
          Todas las guías
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[0.7rem] font-medium text-foreground">
            {guide.level}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
            <Clock className="size-3.5" strokeWidth={1.8} aria-hidden />
            {guide.minutes} min de lectura
          </span>
        </div>

        <h1 className="mt-5 max-w-[20ch] text-[2.25rem] leading-[1.1] font-normal tracking-[-0.02em] text-foreground sm:text-[2.85rem] lg:text-[3.25rem]">
          {guide.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-muted-foreground">
          {guide.summary}
        </p>
      </section>

      <section className="dst-container pb-6">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <ol className="flex flex-col gap-8">
            {guide.steps.map((step, index) => (
              <li key={step.title} className="grid gap-3 md:grid-cols-[3rem_1fr] md:gap-6">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#f6f5fa] text-[0.85rem] font-medium text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-[1.15rem] leading-[1.25] font-medium tracking-tight text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dst-container pb-6">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
            <div>
              <h2 className="text-[1.6rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground">
                Lista de verificación
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {guide.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-landing-lime text-[#16161c]">
                      <Check className="size-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] bg-[#f6f5fa] p-6">
              <p className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                Herramienta relacionada
              </p>
              <h3 className="mt-3 text-[1.1rem] font-medium tracking-tight text-foreground">
                {tool.shortName}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tool.cardDescription}
              </p>
              <Link href={tool.href} className="dst-lime-cta mt-5">
                {tool.cta}
                <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="dst-container pb-16 md:pb-20">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <h2 className="text-[1.6rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground">
            Sigue con estas
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/guias/${item.slug}`}
                className="group rounded-[1.75rem] bg-[#f6f5fa] p-6 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <h3 className="text-[1.1rem] leading-[1.2] font-normal tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Leer guía
                  <ArrowUpRight
                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
