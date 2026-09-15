import { PageHeader } from "@/components/layout/page-header";
import { GLOSSARY, GLOSSARY_GROUPS } from "@/lib/content/glossary";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Glosario digital para negocios | Dev Studio Tools",
  description:
    "Los términos que aparecen cuando digitalizas un negocio, explicados en una línea y con el motivo por el que te importan.",
  path: "/glosario",
});

export default function GlossaryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Glosario"
        title="El vocabulario, sin tecnicismos"
        description="Cada término va con su definición y con la razón por la que le importa a un negocio pequeño. Si una palabra no cambia una decisión tuya, no está en esta lista."
      />

      <section className="dst-container pb-16 md:pb-20">
        <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="flex flex-col gap-12">
            {GLOSSARY_GROUPS.map((group) => {
              const terms = GLOSSARY.filter((item) => item.group === group);
              return (
                <div key={group}>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-[1.5rem] leading-[1.15] font-normal tracking-[-0.02em] text-foreground">
                      {group}
                    </h2>
                    <span className="text-[0.75rem] text-muted-foreground">
                      {terms.length} términos
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-4 md:grid-cols-2">
                    {terms.map((item) => (
                      <div key={item.term} className="rounded-[1.75rem] bg-[#f6f5fa] p-6">
                        <dt className="text-[1rem] font-medium tracking-tight text-foreground">
                          {item.term}
                        </dt>
                        <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.definition}
                        </dd>
                        <dd className="mt-3 border-t border-black/5 pt-3 text-[0.8rem] leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">Por qué importa: </span>
                          {item.why}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
