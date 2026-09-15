import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOME_RECOMMENDATIONS, getToolById } from "@/lib/tools";

function ArtRings() {
  return (
    <svg viewBox="0 0 160 110" className="h-[7.5rem] w-full" aria-hidden>
      <circle cx="62" cy="58" r="34" fill="none" stroke="#d7d3e2" strokeWidth="1.5" />
      <circle cx="78" cy="50" r="30" fill="none" stroke="#cfcad9" strokeWidth="1.5" />
      <circle cx="94" cy="56" r="28" fill="none" stroke="#8b7cff" strokeWidth="1.6" />
    </svg>
  );
}

function ArtToggles() {
  return (
    <svg viewBox="0 0 160 110" className="h-[7.5rem] w-full" aria-hidden>
      <rect x="28" y="28" width="104" height="22" rx="11" fill="#eceaf3" />
      <circle cx="114" cy="39" r="8" fill="#8b7cff" />
      <rect x="28" y="62" width="104" height="22" rx="11" fill="#eceaf3" />
      <circle cx="48" cy="73" r="8" fill="#c8eb4a" />
    </svg>
  );
}

function ArtTarget() {
  return (
    <svg viewBox="0 0 160 110" className="h-[7.5rem] w-full" aria-hidden>
      <circle cx="80" cy="54" r="36" fill="none" stroke="#ddd9e6" strokeWidth="1.5" />
      <circle cx="80" cy="54" r="24" fill="none" stroke="#d0cbd9" strokeWidth="1.5" />
      <circle cx="80" cy="54" r="12" fill="none" stroke="#8b7cff" strokeWidth="1.6" />
      <circle cx="80" cy="54" r="5" fill="#8b7cff" />
    </svg>
  );
}

function ArtNetwork() {
  return (
    <svg viewBox="0 0 160 110" className="h-[7.5rem] w-full" aria-hidden>
      <circle cx="80" cy="28" r="8" fill="#16161c" />
      <line x1="80" y1="36" x2="80" y2="58" stroke="#cfcad9" strokeWidth="1.5" />
      <line x1="80" y1="58" x2="48" y2="86" stroke="#cfcad9" strokeWidth="1.5" />
      <line x1="80" y1="58" x2="80" y2="92" stroke="#cfcad9" strokeWidth="1.5" />
      <line x1="80" y1="58" x2="112" y2="86" stroke="#cfcad9" strokeWidth="1.5" />
      <circle cx="48" cy="86" r="6" fill="#8b7cff" />
      <circle cx="80" cy="92" r="6" fill="#c8eb4a" />
      <circle cx="112" cy="86" r="6" fill="#90BF53" />
    </svg>
  );
}

const ARTS = [ArtRings, ArtToggles, ArtTarget, ArtNetwork] as const;

const SHORT_TITLES = [
  "Diagnóstico rápido",
  "Más clientes en Instagram",
  "Contacto en un toque",
  "Operación digital",
] as const;

export function HomeRecommendations() {
  return (
    <section className="dst-container pb-8 pt-4 md:pb-10">
      <div className="dst-mega px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <h2 className="font-display max-w-md text-[1.85rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-foreground sm:text-[2.15rem]">
            Queremos darte todo lo que tu negocio necesita para digitalizarse
          </h2>
          <div className="max-w-md md:justify-self-end">
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
              Cada herramienta cubre un paso concreto: medir tu presencia, captar clientes y
              digitalizar la operación. Elige un objetivo y empieza en minutos.
            </p>
            <Link
              href="/tools"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-foreground"
            >
              Explorar más
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#16161c] text-white">
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {HOME_RECOMMENDATIONS.map((item, index) => {
            const tool = getToolById(item.toolId);
            const Art = ARTS[index] ?? ArtRings;
            return (
              <Link
                key={item.id}
                href={tool.href}
                className="group rounded-[1.75rem] bg-[#f6f5fa] px-5 pt-5 pb-6 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Art />
                <h3 className="mt-2 text-center text-[0.95rem] font-semibold tracking-tight text-foreground">
                  {SHORT_TITLES[index] ?? item.title}
                </h3>
                <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
