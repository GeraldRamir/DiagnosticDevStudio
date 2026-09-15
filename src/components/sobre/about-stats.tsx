import { BarChart3, Boxes, Handshake } from "lucide-react";
import { BRAND_LINKS } from "@/lib/brand";

const STATS = [
  { value: "5+", label: "Marcas activas", icon: Handshake },
  { value: "360°", label: "Web, app y sistema", icon: Boxes },
  { value: "5", label: "Herramientas gratis", icon: BarChart3 },
] as const;

export function AboutStats() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="dst-container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h2 className="max-w-[18ch] text-[2rem] leading-[1.08] font-bold tracking-[-0.03em] text-[#16161c] sm:text-[2.35rem]">
            Nuestro éxito depende del tuyo
          </h2>
          <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-[#5c6358]">
            Medimos resultados en adopción real: menos pasos manuales, más contactos, operaciones
            que el dueño puede revisar desde el celular.
          </p>
          <a
            href={BRAND_LINKS.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-[#90BF53] px-7 text-sm font-semibold text-[#13200a] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Ver devstudioo.com
          </a>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {STATS.map(({ value, label, icon: Icon }) => (
              <li key={label}>
                <Icon className="size-5 text-[#90BF53]" strokeWidth={1.8} aria-hidden />
                <p className="mt-2 text-[1.75rem] font-bold tracking-[-0.03em] text-[#16161c]">
                  {value}
                </p>
                <p className="mt-1 text-[0.82rem] text-[#5c6358]">{label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="overflow-hidden rounded-[1.75rem] border-2 border-[#16161c] bg-[#f3f1f8] p-6 sm:p-8">
            <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-[#9aa0a6] uppercase">
              Dev Studio Tools
            </p>
            <p className="mt-2 text-lg font-bold text-[#16161c]">Kit gratuito para PYMEs</p>
            <ul className="mt-5 space-y-3">
              {[
                "Diagnóstico con dashboard",
                "Links de WhatsApp y QR",
                "Menú digital editable",
                "Análisis de Instagram",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-[#16161c]/8 bg-white px-3 py-2.5 text-sm font-medium text-[#16161c]"
                >
                  <span className="size-1.5 rounded-full bg-[#90BF53]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
