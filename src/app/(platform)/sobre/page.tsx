import { BRAND_LINKS } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Sobre Dev Studio | Dev Studio Tools",
  description:
    "Dev Studio desarrolla páginas web, aplicaciones, sistemas y automatizaciones para negocios.",
  path: "/sobre",
});

export default function AboutPage() {
  return (
    <section className="dst-section">
      <div className="dst-container max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Sobre Dev Studio
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Soluciones digitales para negocios
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Dev Studio Tools es el ecosistema gratuito de Dev Studio: herramientas independientes para
          diagnosticar, captar clientes y digitalizar la operación de un negocio.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Si necesitas algo a medida —web, app, sistema o automatización— el estudio puede diseñarlo
          e implementarlo contigo.
        </p>
        <a
          href={BRAND_LINKS.website}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants(),
            "mt-8 h-11 cursor-pointer rounded-full px-5 font-semibold",
          )}
        >
          Conocer Dev Studio
        </a>
      </div>
    </section>
  );
}
